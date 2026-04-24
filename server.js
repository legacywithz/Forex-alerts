const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());

// ── In-memory state (persists while server is running) ────────────────────────
// Structure: { eurusd: { trend:'bull', levels:[{price,t15,t1h,noWick,prevMove,manip,entry,dir}] }, ... }
const DEFAULT_STATE = {
  eurusd: { trend:'bull', levels:[
    {price:1.17000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:1.17250,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:1.17500,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:1.17800,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
  ]},
  usdchf: { trend:'bear', levels:[
    {price:0.78500,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:0.78750,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:0.79000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:0.78250,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
  ]},
  usdjpy: { trend:'bear', levels:[
    {price:142.000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:142.500,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:143.000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:143.500,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
  ]},
};

let STATE = JSON.parse(JSON.stringify(DEFAULT_STATE));
let LOG   = []; // alert log entries
let lastUpdated = Date.now();

// Auto-manipulation detection tracker
// Tracks price sweeping 5-10 pips beyond a level then reversing back
// Structure: { 'eurusd_0': { spikedBeyond:true, spikePrice:1.17055, spikeDir:'above', spikeTime:123456 } }
const manipTracker = {};

function checkAutoManip(pairId, currentPrice, levelIndex) {
  const l = STATE[pairId] && STATE[pairId].levels[levelIndex];
  if (!l || l.manip || l.entry) return;
  const pip = getPip(pairId);
  const key = `${pairId}_${levelIndex}`;
  const dist = (currentPrice - l.price) / pip; // signed distance in pips
  const absDist = Math.abs(dist);
  const tracker = manipTracker[key] || {};

  // Step 1: Price sweeps 5-15 pips BEYOND the level — record the spike
  if (!tracker.spikedBeyond && absDist >= 5 && absDist <= 15) {
    manipTracker[key] = { spikedBeyond:true, spikePrice:currentPrice, spikeDir:dist>0?'above':'below', spikeTime:Date.now() };
    addLog('SWEEP_WATCH', pairId.toUpperCase(), `Price swept ${absDist.toFixed(1)} pips beyond ${l.price} — watching for reversal`);
    return;
  }

  // Step 2: If already spiked, watch for price reversing back through level
  if (tracker.spikedBeyond && !l.manip) {
    const elapsed = Date.now() - tracker.spikeTime;
    if (elapsed < 1800000 && absDist <= 3) {
      const reversed = (tracker.spikeDir==='above' && dist<=0) || (tracker.spikeDir==='below' && dist>=0);
      if (reversed) {
        l.manip = true;
        delete manipTracker[key];
        addLog('MANIPULATION', pairId.toUpperCase(), `AUTO MANIPULATION at ${l.price} — swept ${Math.abs((tracker.spikePrice-l.price)/pip).toFixed(1)} pips then reversed`);
        lastUpdated = Date.now();
        checkEntrySignal(pairId, levelIndex);
      }
    }
    if (elapsed >= 1800000) delete manipTracker[key]; // reset if too old
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function normPair(raw) {
  // Accept EURUSD, EUR/USD, eurusd, eur_usd etc.
  return raw.toLowerCase().replace(/[^a-z]/g,'');
}

function findLevel(pairId, price, pipSize) {
  const pip = pipSize || getPip(pairId);
  const levels = STATE[pairId]?.levels || [];
  let closest = null, closestDist = Infinity;
  levels.forEach((l, i) => {
    const dist = Math.abs(l.price - price) / pip;
    if (dist < closestDist) { closestDist = dist; closest = i; }
  });
  return closestDist <= 10 ? closest : null; // within 10 pips
}

function getPip(pairId) {
  if (pairId === 'usdjpy') return 0.01;
  return 0.0001;
}

function guessDir(pairId) {
  return STATE[pairId]?.trend === 'bull' ? 'long' : 'short';
}

function isCT(pairId, dir) {
  const t = STATE[pairId]?.trend;
  return (t==='bull'&&dir==='short') || (t==='bear'&&dir==='long');
}

function gradeLevel(pairId, l) {
  const ct = isCT(pairId, l.dir);
  const core = {
    psych:    isPsych(l.price, pairId==='usdjpy'),
    noWick:   l.noWick,
    prevMove: l.prevMove,
    t15:      l.t15 >= 3,
    t1h:      l.t1h >= 2,
    manip:    l.manip,
  };
  const score = Object.values(core).filter(Boolean).length;
  if (!l.entry) return { grade:'none', score, ct };
  const grade = score===6?'A':score>=4?'B':'C';
  return { grade, score, ct };
}

function isPsych(price, isJpy) {
  if (isJpy) {
    const dec = price % 1;
    return dec < 0.002 || Math.abs(dec-0.5)<0.002 || Math.abs(dec-0.25)<0.002 || Math.abs(dec-0.75)<0.002;
  }
  const d = (price.toFixed(5).split('.')[1]||'');
  return ['.000','.250','.400','.500','.800'].some(s =>
    d.slice(2).startsWith(s.replace('.','')) || d.endsWith(s.replace('.',''))
  );
}

function addLog(type, pair, msg) {
  LOG.unshift({ time: new Date().toISOString(), type, pair, msg });
  if (LOG.length > 100) LOG.pop();
  lastUpdated = Date.now();
  console.log(`[${type}] ${pair}: ${msg}`);
}

function checkEntrySignal(pairId, levelIndex) {
  const l = STATE[pairId].levels[levelIndex];
  if (l.t15 >= 3 && l.t1h >= 2 && l.manip && !l.entry) {
    l.entry = true;
    l.dir   = guessDir(pairId);
    const { grade, score, ct } = gradeLevel(pairId, l);
    const label = grade==='A' ? (ct?'A SETUP — COUNTER TREND':'A SETUP — WITH TREND') : grade+' SETUP';
    addLog('ENTRY', pairId.toUpperCase(), `${label} at ${l.price} | ${l.dir.toUpperCase()} | ${score}/6 criteria`);
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({ status:'ok', message:'Forex Alert Server running', lastUpdated });
});

// Get full state (polled by the frontend every 5 seconds)
app.get('/state', (req, res) => {
  res.json({ state: STATE, log: LOG.slice(0,50), lastUpdated });
});

// Push state update from frontend (manual actions)
app.post('/state', (req, res) => {
  const { state } = req.body;
  if (!state) return res.status(400).json({ error:'Missing state' });
  STATE = state;
  lastUpdated = Date.now();
  res.json({ ok:true });
});

// ── TradingView Webhook endpoint ──────────────────────────────────────────────
// TradingView alert message format (JSON):
// { "pair": "EURUSD", "price": 1.17000, "action": "touch", "tf": "15m" }
// { "pair": "EURUSD", "price": 1.17000, "action": "touch", "tf": "1h" }
// { "pair": "EURUSD", "price": 1.17000, "action": "nowick" }
// { "pair": "EURUSD", "price": 1.17000, "action": "prevmove" }
// { "pair": "EURUSD", "price": 1.17000, "action": "manipulation" }
// { "pair": "EURUSD", "price": 1.17000, "action": "entry", "dir": "long" }
// { "pair": "EURUSD", "action": "trend", "trend": "bull" }

app.post('/webhook', (req, res) => {
  try {
    let body = req.body;

    // TradingView sometimes sends plain text — try to parse it
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) {
        // Try to parse key:value format
        // e.g. "pair=EURUSD price=1.17000 action=touch tf=15m"
        const parsed = {};
        body.split(' ').forEach(part => {
          const [k,v] = part.split('=');
          if (k&&v) parsed[k.trim()] = v.trim();
        });
        body = parsed;
      }
    }

    const { pair, price, action, tf, dir, trend } = body;
    if (!pair || !action) return res.status(400).json({ error:'Missing pair or action' });

    const pairId = normPair(pair);
    if (!STATE[pairId]) return res.status(404).json({ error:`Unknown pair: ${pair}` });

    // Handle trend update (no price needed)
    if (action === 'trend') {
      if (!['bull','bear','range'].includes(trend)) return res.status(400).json({ error:'Invalid trend' });
      STATE[pairId].trend = trend;
      addLog('TREND', pairId.toUpperCase(), `Trend set to ${trend.toUpperCase()}`);
      return res.json({ ok:true });
    }

    // Find the closest level
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return res.status(400).json({ error:'Invalid price' });
    const li = findLevel(pairId, numPrice, getPip(pairId));
    if (li === null) {
      // No level found within 10 pips — auto-create if action is touch
      if (action === 'touch') {
        STATE[pairId].levels.push({
          price:numPrice, t15:0, t1h:0, noWick:false, prevMove:false, manip:false, entry:false, dir:null
        });
        addLog('LEVEL_ADDED', pairId.toUpperCase(), `New level added at ${numPrice} (auto from webhook)`);
        return res.json({ ok:true, note:'Level created' });
      }
      return res.status(404).json({ error:`No level within 10 pips of ${numPrice}` });
    }

    const l = STATE[pairId].levels[li];

    switch(action) {
      case 'touch': {
        // TradingView webhook always logs a 1H touch (per user config)
        // 15m touches are still available via manual buttons in the tool
        if (l.t1h < 2) {
          l.t1h++;
          addLog('TOUCH_1H', pairId.toUpperCase(), `AUTO 1H touch ${l.t1h}/2 at ${l.price} (TradingView)`);
          if (l.t1h === 2) addLog('RESPECTED_1H', pairId.toUpperCase(), `LEVEL RESPECTED on 1H — ${l.price}`);
        }
        checkEntrySignal(pairId, li);
        break;
      }
      case 'nowick': {
        l.noWick = true;
        addLog('NO_WICK', pairId.toUpperCase(), `No-wick candle at ${l.price}`);
        break;
      }
      case 'prevmove': {
        l.prevMove = true;
        addLog('PREV_MOVE', pairId.toUpperCase(), `Previous big move marked at ${l.price}`);
        break;
      }
      case 'manipulation': {
        if (!l.manip) {
          l.manip = true;
          addLog('MANIPULATION', pairId.toUpperCase(), `SWEEP/MANIPULATION at ${l.price} — watching for retest`);
          checkEntrySignal(pairId, li);
        }
        break;
      }
      case 'entry': {
        l.entry = true;
        l.dir   = dir || guessDir(pairId);
        const { grade, score, ct } = gradeLevel(pairId, l);
        const label = grade==='A' ? (ct?'A SETUP — COUNTER TREND':'A SETUP — WITH TREND') : grade+' SETUP';
        addLog('ENTRY', pairId.toUpperCase(), `${label} at ${l.price} | ${l.dir.toUpperCase()} | ${score}/6`);
        break;
      }
      case 'reset': {
        const savedPrice = l.price;
        STATE[pairId].levels[li] = {
          price:savedPrice, t15:0, t1h:0, noWick:false, prevMove:false, manip:false, entry:false, dir:null
        };
        addLog('RESET', pairId.toUpperCase(), `Level ${savedPrice} reset`);
        break;
      }
      default:
        return res.status(400).json({ error:`Unknown action: ${action}` });
    }

    lastUpdated = Date.now();
    res.json({ ok:true, level: STATE[pairId].levels[li] });

  } catch(err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add a new level manually
app.post('/level/:pairId', (req, res) => {
  const { pairId } = req.params;
  const { price } = req.body;
  if (!STATE[pairId]) return res.status(404).json({ error:'Unknown pair' });
  const p = parseFloat(price);
  if (isNaN(p)) return res.status(400).json({ error:'Invalid price' });
  STATE[pairId].levels.push({ price:p, t15:0, t1h:0, noWick:false, prevMove:false, manip:false, entry:false, dir:null });
  addLog('LEVEL_ADDED', pairId.toUpperCase(), `Level added at ${p}`);
  res.json({ ok:true });
});

// Delete a level
app.delete('/level/:pairId/:index', (req, res) => {
  const { pairId, index } = req.params;
  if (!STATE[pairId]) return res.status(404).json({ error:'Unknown pair' });
  STATE[pairId].levels.splice(parseInt(index), 1);
  res.json({ ok:true });
});

// Reset all levels
app.post('/reset', (req, res) => {
  STATE = JSON.parse(JSON.stringify(DEFAULT_STATE));
  LOG   = [];
  addLog('RESET','ALL','Full state reset to defaults');
  res.json({ ok:true });
});

// ── Live price ping endpoint ───────────────────────────────────────────────────
// The frontend sends live prices here every 15 seconds so the server
// can run auto-manipulation detection even when the tool is closed
// POST /price  body: { "eurusd": 1.17045, "usdchf": 0.78520, "usdjpy": 142.380 }
app.post('/price', (req, res) => {
  const prices = req.body;
  if (!prices) return res.status(400).json({ error:'Missing price data' });

  let manipFound = false;
  PAIRS_CFG_IDS.forEach(pairId => {
    const price = parseFloat(prices[pairId]);
    if (isNaN(price) || !STATE[pairId]) return;
    STATE[pairId].levels.forEach((l, i) => {
      checkAutoManip(pairId, price, i);
    });
  });

  res.json({ ok:true, lastUpdated });
});

const PAIRS_CFG_IDS = ['eurusd','usdchf','usdjpy'];

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Forex Alert Server running on port ${PORT}`);
  console.log(`Webhook endpoint: POST /webhook`);
  console.log(`State endpoint:   GET  /state`);
});
