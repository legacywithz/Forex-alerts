const express = require('express');
const cors    = require('cors');
const https   = require('https');
const path    = require('path');
const fs      = require('fs');
const app     = express();

app.use(cors());
app.use(express.json());

const PORT       = process.env.PORT || 3000;
const PUBLIC_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : `http://localhost:${PORT}`;

const PAIRS   = ['eurusd','usdchf','usdjpy','audusd'];
const SL_PIPS = 20;

// ── Default State ─────────────────────────────────────────────────────────────
const DEFAULT_STATE = {
  eurusd: { trend:'bull', levels:[
    {price:1.17000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:1.17300,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:1.17500,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:1.18000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
  ]},
  usdchf: { trend:'bear', levels:[
    {price:0.78460,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:0.78650,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:0.79000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:0.78000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
  ]},
  usdjpy: { trend:'bear', levels:[
    {price:142.000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:142.500,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:143.000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:141.500,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
  ]},
  audusd: { trend:'bull', levels:[
    {price:0.71000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:0.71500,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:0.72000,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
    {price:0.70500,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null},
  ]},
};

let STATE       = JSON.parse(JSON.stringify(DEFAULT_STATE));
let LOG         = [];
let lastUpdated = Date.now();
const manipTracker = {};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getPip(id) { return id === 'usdjpy' ? 0.01 : 0.0001; }
function normPair(raw) { return raw.toLowerCase().replace(/[^a-z]/g, ''); }
function guessDir(id) { return STATE[id] && STATE[id].trend === 'bull' ? 'long' : 'short'; }
function isCT(id, dir) {
  const t = STATE[id] && STATE[id].trend;
  return (t === 'bull' && dir === 'short') || (t === 'bear' && dir === 'long');
}
function isPsych(price, isJpy) {
  if (isJpy) {
    const d = price % 1;
    return d < 0.002 || Math.abs(d-0.5) < 0.002 || Math.abs(d-0.25) < 0.002 || Math.abs(d-0.75) < 0.002;
  }
  const d = (price.toFixed(5).split('.')[1] || '');
  return ['.000','.250','.400','.500','.800'].some(s =>
    d.slice(2).startsWith(s.replace('.','')) || d.endsWith(s.replace('.',''))
  );
}
function gradeLevel(id, l) {
  const ct = isCT(id, l.dir);
  const isJpy = id === 'usdjpy';
  const core = {
    psych:    isPsych(l.price, isJpy),
    noWick:   l.noWick,
    prevMove: l.prevMove,
    t15:      l.t15 >= 3,
    t1h:      l.t1h >= 2,
    manip:    l.manip,
  };
  const score = Object.values(core).filter(Boolean).length;
  if (!l.entry) return { grade:'none', score, ct };
  return { grade: score===6?'A':score>=4?'B':'C', score, ct };
}
function addLog(type, pair, msg) {
  LOG.unshift({ time: new Date().toISOString(), type, pair, msg });
  if (LOG.length > 100) LOG.pop();
  lastUpdated = Date.now();
  console.log(`[${type}] ${pair}: ${msg}`);
}
function checkEntrySignal(pairId, idx) {
  const l = STATE[pairId].levels[idx];
  if (l.t15 >= 3 && l.t1h >= 2 && l.manip && !l.entry) {
    l.entry = true;
    l.dir   = guessDir(pairId);
    const { grade, score, ct } = gradeLevel(pairId, l);
    const label = grade==='A' ? (ct?'A SETUP — COUNTER TREND':'A SETUP — WITH TREND') : grade+' SETUP';
    addLog('ENTRY', pairId.toUpperCase(), `${label} at ${l.price} | ${l.dir.toUpperCase()} | ${score}/6`);
  }
}
function findLevel(pairId, price) {
  const pip = getPip(pairId);
  const levels = (STATE[pairId] && STATE[pairId].levels) || [];
  let best = null, bestDist = Infinity;
  levels.forEach((l, i) => {
    const d = Math.abs(l.price - price) / pip;
    if (d < bestDist) { bestDist = d; best = i; }
  });
  return bestDist <= 10 ? best : null;
}
function checkAutoManip(pairId, price, idx) {
  const l = STATE[pairId] && STATE[pairId].levels[idx];
  if (!l || l.manip || l.entry) return;
  const pip = getPip(pairId);
  const key = `${pairId}_${idx}`;
  const dist = (price - l.price) / pip;
  const absDist = Math.abs(dist);
  const tr = manipTracker[key] || {};
  if (!tr.spikedBeyond && absDist >= 5 && absDist <= 15) {
    manipTracker[key] = { spikedBeyond:true, spikePrice:price, spikeDir:dist>0?'above':'below', spikeTime:Date.now() };
    addLog('SWEEP_WATCH', pairId.toUpperCase(), `Swept ${absDist.toFixed(1)} pips beyond ${l.price}`);
    return;
  }
  if (tr.spikedBeyond && !l.manip) {
    const elapsed = Date.now() - tr.spikeTime;
    if (elapsed < 1800000 && absDist <= 3) {
      const reversed = (tr.spikeDir==='above'&&dist<=0) || (tr.spikeDir==='below'&&dist>=0);
      if (reversed) {
        l.manip = true;
        delete manipTracker[key];
        addLog('MANIPULATION', pairId.toUpperCase(), `AUTO MANIP at ${l.price} — swept then reversed`);
        lastUpdated = Date.now();
        checkEntrySignal(pairId, idx);
      }
    }
    if (elapsed >= 1800000) delete manipTracker[key];
  }
}

// ── Price Fetching ────────────────────────────────────────────────────────────
let cachedPrices   = {};
let priceLastFetch = 0;

function httpsGet(host, path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: host, path, method: 'GET',
      headers: { 'User-Agent': 'ForexAlertBot/6.0', 'Accept': 'application/json' },
      timeout: 8000
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

async function fetchPrices() {
  const now = Date.now();
  if (now - priceLastFetch < 10000 && Object.keys(cachedPrices).length >= 3) return cachedPrices;
  const apis = [
    // API 1: Frankfurter - ECB data, completely free, no key, very reliable
    async () => {
      const d = await httpsGet('api.frankfurter.dev', '/v2/latest?base=USD&symbols=CHF,JPY,EUR,AUD');
      if (!d.rates) throw new Error('bad');
      const r = d.rates;
      return { usdchf:r.CHF, usdjpy:r.JPY, eurusd:r.EUR?1/r.EUR:null, audusd:r.AUD?1/r.AUD:null };
    },
    // API 2: open.er-api.com - free, no key required
    async () => {
      const d = await httpsGet('open.er-api.com', '/v6/latest/USD');
      if (d.result !== 'success' || !d.rates) throw new Error('bad');
      const r = d.rates;
      return { usdchf:r.CHF, usdjpy:r.JPY, eurusd:r.EUR?1/r.EUR:null, audusd:r.AUD?1/r.AUD:null };
    },
    // API 3: freeforexapi - supports all 4 pairs directly
    async () => {
      const d = await httpsGet('www.freeforexapi.com', '/api/live?pairs=EURUSD,USDCHF,USDJPY,AUDUSD');
      if (d.code !== 200 || !d.rates) throw new Error('bad');
      const p = {};
      Object.entries(d.rates).forEach(([k,v]) => { p[k.toLowerCase()] = v.rate; });
      return p;
    },
    // API 4: currency-exchang on Railway - no CORS issues, same platform
    async () => {
      const d = await httpsGet('currency-exchang.up.railway.app', '/rates?base=USD');
      if (!d.rates) throw new Error('bad');
      const r = d.rates;
      return { usdchf:r.CHF, usdjpy:r.JPY, eurusd:r.EUR?1/r.EUR:null, audusd:r.AUD?1/r.AUD:null };
    }
  ];
  for (let idx = 0; idx < apis.length; idx++) {
    try {
      console.log('Trying price API ' + (idx+1) + '...');
      const p = await apis[idx]();
      const valid = Object.values(p).filter(v => v && !isNaN(v)).length;
      if (valid >= 3) {
        Object.entries(p).forEach(([k,v]) => { if (v && !isNaN(v)) cachedPrices[k] = v; });
        priceLastFetch = Date.now();
        lastUpdated = Date.now();
        PAIRS.forEach(id => {
          const price = parseFloat(cachedPrices[id]);
          if (!isNaN(price) && STATE[id]) {
            STATE[id].levels.forEach((_, j) => checkAutoManip(id, price, j));
          }
        });
        console.log('Prices OK: USDCHF=' + cachedPrices.usdchf + ' EURUSD=' + cachedPrices.eurusd + ' USDJPY=' + cachedPrices.usdjpy + ' AUDUSD=' + cachedPrices.audusd);
        return cachedPrices;
      }
    } catch(e) { console.log('API ' + (idx+1) + ' failed: ' + e.message); }
  }
  console.log('All price APIs failed - using cached');
  return cachedPrices;
}

fetchPrices();
setInterval(fetchPrices, 15000);

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status:'ok', version:'6.0', url:PUBLIC_URL, lastUpdated }));

app.get('/prices', async (req, res) => {
  try {
    const prices = await fetchPrices();
    res.json({ ok:true, prices, lastUpdated: priceLastFetch });
  } catch(e) {
    res.status(500).json({ ok:false, prices:cachedPrices });
  }
});

app.get('/state', (req, res) => {
  res.json({ state:STATE, log:LOG.slice(0,50), lastUpdated, prices:cachedPrices });
});

app.post('/state', (req, res) => {
  if (!req.body || !req.body.state) return res.status(400).json({ error:'Missing state' });
  STATE = req.body.state;
  lastUpdated = Date.now();
  res.json({ ok:true });
});

app.post('/webhook', (req, res) => {
  try {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch(e) { body = {}; } }
    const { pair, price, action, dir, trend } = body;
    if (!pair || !action) return res.status(400).json({ error:'Missing pair or action' });
    const pairId = normPair(pair);
    if (!STATE[pairId]) return res.status(404).json({ error:`Unknown pair: ${pair}` });
    if (action === 'trend') {
      STATE[pairId].trend = trend;
      addLog('TREND', pairId.toUpperCase(), `Trend: ${trend}`);
      return res.json({ ok:true });
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return res.status(400).json({ error:'Invalid price' });
    let li = findLevel(pairId, numPrice);
    if (li === null) {
      if (action === 'touch') {
        STATE[pairId].levels.push({ price:numPrice, t15:0, t1h:0, noWick:false, prevMove:false, manip:false, entry:false, dir:null });
        addLog('LEVEL_ADDED', pairId.toUpperCase(), `Level auto-created at ${numPrice}`);
        return res.json({ ok:true });
      }
      return res.status(404).json({ error:'No level within 10 pips' });
    }
    const l = STATE[pairId].levels[li];
    switch(action) {
      case 'touch':
        if (l.t1h < 2) { l.t1h++; addLog('TOUCH_1H', pairId.toUpperCase(), `1H touch ${l.t1h}/2 at ${l.price}`); if(l.t1h===2) addLog('RESPECTED_1H',pairId.toUpperCase(),`RESPECTED on 1H — ${l.price}`); }
        checkEntrySignal(pairId, li); break;
      case 'nowick':  l.noWick=true; addLog('NO_WICK',pairId.toUpperCase(),`No-wick at ${l.price}`); break;
      case 'prevmove': l.prevMove=true; addLog('PREV_MOVE',pairId.toUpperCase(),`Prev move at ${l.price}`); break;
      case 'manipulation': if(!l.manip){l.manip=true;addLog('MANIPULATION',pairId.toUpperCase(),`MANIP at ${l.price}`);checkEntrySignal(pairId,li);} break;
      case 'reset': STATE[pairId].levels[li]={price:l.price,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null}; addLog('RESET',pairId.toUpperCase(),`Level ${l.price} reset`); break;
      default: return res.status(400).json({ error:`Unknown action: ${action}` });
    }
    lastUpdated = Date.now();
    res.json({ ok:true });
  } catch(err) {
    console.error('Webhook error:', err.message);
    res.status(500).json({ error:err.message });
  }
});

app.post('/price', (req, res) => {
  const prices = req.body || {};
  PAIRS.forEach(id => {
    const p = parseFloat(prices[id]);
    if (!isNaN(p) && STATE[id]) STATE[id].levels.forEach((_,i) => checkAutoManip(id, p, i));
  });
  res.json({ ok:true });
});

app.post('/reset', (req, res) => {
  STATE = JSON.parse(JSON.stringify(DEFAULT_STATE));
  LOG   = [];
  addLog('RESET','ALL','Full reset');
  res.json({ ok:true });
});

// ── Serve App ─────────────────────────────────────────────────────────────────
app.get('/app', (req, res) => {
  const htmlPath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    return res.status(404).send('index.html not found. Please upload index.html to your GitHub repo.');
  }
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace(/%%SERVER_URL%%/g, PUBLIC_URL);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Forex Alert Server v6 running on port ${PORT}`);
  console.log(`URL: ${PUBLIC_URL}`);
  console.log(`App: ${PUBLIC_URL}/app`);
});
