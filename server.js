const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());

const HTML_APP = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LEVEL ALERT SYSTEM v5</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
:root{--bg:#06090d;--surface:#0b1017;--card:#0f161e;--border:#182030;--border2:#1f2d3d;--accent:#38bdf8;--green:#22d3a4;--red:#f43f5e;--yellow:#fbbf24;--orange:#fb923c;--purple:#a78bfa;--text:#94a3b8;--text2:#64748b;--white:#e2eaf4;--gold:#f59e0b;--silver:#94a3b8;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;}
body::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px);pointer-events:none;z-index:999;}
.wrap{max-width:880px;margin:0 auto;padding:20px 14px 60px;}
header{display:flex;align-items:center;justify-content:space-between;padding-bottom:18px;border-bottom:1px solid var(--border);margin-bottom:20px;flex-wrap:wrap;gap:10px;}
.brand{font-family:'Space Mono',monospace;font-size:13px;letter-spacing:4px;color:var(--accent);}
.header-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.live{display:flex;align-items:center;gap:6px;font-family:'Space Mono',monospace;font-size:10px;color:var(--green);letter-spacing:2px;}
.live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:blink 1.4s infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.conn-pill{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1px;padding:3px 9px;border-radius:3px;border:1px solid;}
.cp-ok{color:var(--green);border-color:rgba(34,211,164,.35);background:rgba(34,211,164,.07);}
.cp-err{color:var(--red);border-color:rgba(244,63,94,.35);background:rgba(244,63,94,.07);}
.cp-wait{color:var(--yellow);border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.07);}
.setup-box{background:var(--card);border:1px solid rgba(56,189,248,.3);border-radius:6px;padding:16px 18px;margin-bottom:18px;}
.sb-title{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;color:var(--accent);margin-bottom:10px;}
.sb-row{display:flex;gap:8px;margin-bottom:12px;}
.sb-inp{flex:1;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:3px;padding:8px 12px;font-family:'Space Mono',monospace;font-size:12px;color:var(--white);outline:none;}
.sb-inp:focus{border-color:var(--accent);}
.sb-inp::placeholder{color:var(--text2);}
.sb-btn{background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.3);border-radius:3px;padding:8px 16px;color:var(--accent);font-family:'Space Mono',monospace;font-size:11px;cursor:pointer;}
.sb-steps{font-size:11px;line-height:2.1;color:var(--text2);}
.sb-steps b{color:var(--white);}
.sb-steps code{font-family:'Space Mono',monospace;font-size:10px;color:var(--accent);background:rgba(56,189,248,.07);padding:1px 5px;border-radius:2px;}
.wh-fmt{background:rgba(255,255,255,.02);border:1px solid var(--border2);border-radius:4px;padding:10px 14px;margin-top:10px;font-family:'Space Mono',monospace;font-size:10px;color:var(--text2);line-height:2;}
.wh-fmt .hl{color:var(--accent);}
.price-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;}
.pc{flex:1;min-width:150px;padding:10px 14px;background:var(--card);border:1px solid var(--border);border-radius:4px;}
.pc-pair{font-size:9px;letter-spacing:3px;color:var(--text2);margin-bottom:3px;}
.pc-price{font-family:'Space Mono',monospace;font-size:18px;color:var(--white);font-weight:700;}
.pc-chg{font-family:'Space Mono',monospace;font-size:10px;margin-top:2px;}
.up{color:var(--green);}.dn{color:var(--red);}.flat{color:var(--text2);}
.pc-near{font-size:9px;color:var(--yellow);margin-top:3px;}
.cfg-bar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px;}
.cfg{padding:5px 12px;background:var(--card);border:1px solid var(--border);border-radius:3px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1px;color:var(--text2);}
.cfg span{color:var(--accent);margin-left:4px;}
.gl{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;}
.gli{display:flex;align-items:flex-start;gap:7px;padding:8px 12px;border-radius:4px;border:1px solid;flex:1;min-width:130px;}
.gli-a{background:rgba(245,158,11,.07);border-color:rgba(245,158,11,.35);}
.gli-act{background:rgba(167,139,250,.07);border-color:rgba(167,139,250,.35);}
.gli-b{background:rgba(148,163,184,.05);border-color:rgba(148,163,184,.22);}
.gli-c{background:rgba(180,83,9,.05);border-color:rgba(180,83,9,.22);}
.gli-ico{font-size:15px;padding-top:1px;}
.gli-t{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;}
.gli-a .gli-t{color:var(--gold);}.gli-act .gli-t{color:var(--purple);}.gli-b .gli-t{color:var(--silver);}.gli-c .gli-t{color:#b45309;}
.gli-d{font-size:9px;color:var(--text2);margin-top:2px;line-height:1.4;}
.pair-card{background:var(--card);border:1px solid var(--border);border-radius:6px;margin-bottom:14px;overflow:hidden;transition:border-color .3s,box-shadow .3s;}
.pair-card.sc-watching{border-color:rgba(56,189,248,.35);}
.pair-card.sc-respected{border-color:rgba(251,191,36,.5);}
.pair-card.sc-manip{border-color:rgba(251,146,60,.7);animation:cpm .8s infinite;}
.pair-card.sc-entry-act{border-color:rgba(167,139,250,.9);animation:cpact .5s infinite;}
.pair-card.sc-entry-a{border-color:rgba(245,158,11,.9);animation:cpa .5s infinite;}
.pair-card.sc-entry{border-color:rgba(34,211,164,.8);animation:cpe .5s infinite;}
@keyframes cpm{0%,100%{box-shadow:0 0 16px rgba(251,146,60,.1)}50%{box-shadow:0 0 32px rgba(251,146,60,.22)}}
@keyframes cpe{0%,100%{box-shadow:0 0 16px rgba(34,211,164,.1)}50%{box-shadow:0 0 32px rgba(34,211,164,.22)}}
@keyframes cpa{0%,100%{box-shadow:0 0 28px rgba(245,158,11,.18)}50%{box-shadow:0 0 56px rgba(245,158,11,.35)}}
@keyframes cpact{0%,100%{box-shadow:0 0 28px rgba(167,139,250,.18)}50%{box-shadow:0 0 56px rgba(167,139,250,.35)}}
.ph{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:rgba(255,255,255,.018);border-bottom:1px solid var(--border);flex-wrap:wrap;gap:8px;}
.phl{display:flex;align-items:center;gap:12px;}
.psym{font-family:'Space Mono',monospace;font-size:15px;font-weight:700;color:var(--white);letter-spacing:2px;}
.plp{font-family:'Space Mono',monospace;font-size:13px;color:var(--accent);}
.phr{display:flex;align-items:center;gap:8px;}
.tb{padding:3px 9px;border-radius:3px;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;font-weight:700;}
.tb-bull{background:rgba(34,211,164,.12);color:var(--green);border:1px solid rgba(34,211,164,.3);}
.tb-bear{background:rgba(244,63,94,.12);color:var(--red);border:1px solid rgba(244,63,94,.3);}
.tb-range{background:rgba(251,191,36,.1);color:var(--yellow);border:1px solid rgba(251,191,36,.25);}
.tsel{background:var(--surface);border:1px solid var(--border);color:var(--text2);font-size:10px;padding:3px 7px;border-radius:3px;cursor:pointer;outline:none;font-family:'Space Mono',monospace;}
.pb{padding:14px 18px;}
.sl{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--text2);margin-bottom:10px;}
.ll{display:flex;flex-direction:column;gap:7px;margin-bottom:12px;}
.lr{display:flex;align-items:center;gap:8px;padding:9px 13px;background:rgba(255,255,255,.025);border:1px solid var(--border);border-radius:4px;flex-wrap:wrap;}
.lr.re-act{border-color:rgba(167,139,250,.6);background:rgba(167,139,250,.06);}
.lr.re-a{border-color:rgba(245,158,11,.6);background:rgba(245,158,11,.06);}
.lr.re-e{border-color:rgba(34,211,164,.5);background:rgba(34,211,164,.05);}
.lr.re-m{border-color:rgba(251,146,60,.5);background:rgba(251,146,60,.05);animation:rb .7s infinite;}
.lr.re-r{border-color:rgba(251,191,36,.4);background:rgba(251,191,36,.04);}
.lr.re-near{border-color:rgba(251,191,36,.25);}
@keyframes rb{0%,100%{opacity:1}50%{opacity:.75}}
.lp2{font-family:'Space Mono',monospace;font-size:13px;color:var(--white);min-width:82px;}
.dl{font-family:'Space Mono',monospace;font-size:9px;min-width:48px;}
.dl.near{color:var(--yellow);}.dl.far{color:var(--text2);}
.tbar{display:flex;gap:3px;align-items:center;}
.pip{width:20px;height:5px;border-radius:2px;background:var(--border2);}
.pip.f15{background:var(--yellow);}.pip.f1h{background:var(--accent);box-shadow:0 0 5px var(--accent);}
.tags{display:flex;gap:4px;flex-wrap:wrap;flex:1;}
.tag{font-family:'Space Mono',monospace;font-size:7px;letter-spacing:1px;padding:2px 5px;border-radius:2px;text-transform:uppercase;border:1px solid;}
.tpsych{color:var(--accent);border-color:rgba(56,189,248,.3);background:rgba(56,189,248,.07);}
.tnw{color:var(--yellow);border-color:rgba(251,191,36,.3);background:rgba(251,191,36,.07);}
.tpm{color:var(--green);border-color:rgba(34,211,164,.3);background:rgba(34,211,164,.07);}
.tct{color:var(--purple);border-color:rgba(167,139,250,.4);background:rgba(167,139,250,.08);}
.twt{color:var(--green);border-color:rgba(34,211,164,.4);background:rgba(34,211,164,.08);}
.thr{color:var(--red);border-color:rgba(244,63,94,.35);background:rgba(244,63,94,.07);}
.lst{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1px;min-width:62px;text-align:right;text-transform:uppercase;}
.stn{color:var(--text2);}.stw{color:var(--accent);}.str{color:var(--yellow);}.stm{color:var(--orange);animation:blink .6s infinite;}.ste{color:var(--green);animation:blink .4s infinite;}
.delbtn{background:none;border:none;cursor:pointer;color:var(--border2);font-size:15px;line-height:1;transition:color .2s;}
.delbtn:hover{color:var(--red);}
.gp{margin-top:10px;padding:13px 15px;border-radius:5px;border:1px solid;display:none;}
.gp.show{display:block;animation:fi .3s ease;}
@keyframes fi{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.gpact{background:rgba(167,139,250,.06);border-color:rgba(167,139,250,.35);}
.gpa{background:rgba(245,158,11,.06);border-color:rgba(245,158,11,.3);}
.gpb{background:rgba(148,163,184,.04);border-color:rgba(148,163,184,.2);}
.gpc{background:rgba(180,83,9,.05);border-color:rgba(180,83,9,.2);}
.gtop{display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap;}
.gbadge{display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border-radius:5px;font-family:'Space Mono',monospace;font-weight:700;font-size:15px;letter-spacing:2px;}
.gbact{background:rgba(167,139,250,.12);border:2px solid rgba(167,139,250,.55);color:var(--purple);animation:glact 1.5s infinite;}
.gba{background:rgba(245,158,11,.12);border:2px solid rgba(245,158,11,.55);color:var(--gold);animation:gla 1.5s infinite;}
.gbb{background:rgba(148,163,184,.08);border:2px solid rgba(148,163,184,.35);color:var(--silver);}
.gbc{background:rgba(180,83,9,.08);border:2px solid rgba(180,83,9,.3);color:#cd853f;}
@keyframes gla{0%,100%{box-shadow:0 0 16px rgba(245,158,11,.15)}50%{box-shadow:0 0 32px rgba(245,158,11,.32)}}
@keyframes glact{0%,100%{box-shadow:0 0 16px rgba(167,139,250,.15)}50%{box-shadow:0 0 32px rgba(167,139,250,.32)}}
.gscore{font-family:'Space Mono',monospace;font-size:11px;color:var(--text2);line-height:1.7;}
.ctb{display:none;margin-bottom:10px;padding:10px 13px;background:rgba(167,139,250,.08);border:1px solid rgba(167,139,250,.3);border-radius:4px;}
.ctb.show{display:flex;align-items:flex-start;gap:10px;}
.ctbt{font-size:11px;line-height:1.6;color:var(--text);}
.ctbt strong{color:var(--purple);}
.chkl{display:flex;flex-direction:column;gap:5px;margin-bottom:12px;}
.chkr{display:flex;align-items:center;gap:8px;font-size:11px;}
.chkb{width:14px;height:14px;border-radius:3px;border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;}
.chkb.done{background:rgba(34,211,164,.15);border-color:var(--green);color:var(--green);}
.chkb.info{background:rgba(167,139,250,.1);border-color:rgba(167,139,250,.4);color:var(--purple);}
.chkb.fail{background:rgba(244,63,94,.08);border-color:var(--red);color:var(--red);}
.chkl2{color:var(--text2);}.chkl2.done{color:var(--text);}.chkl2.info{color:var(--purple);}
.advbox{font-size:11px;color:var(--text2);margin-bottom:12px;padding:8px 10px;background:rgba(255,255,255,.02);border-radius:3px;border-left:3px solid var(--border2);line-height:1.6;}
.tgtlbl{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--green);margin-bottom:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.tgtgrid{display:flex;gap:8px;flex-wrap:wrap;}
.tgti{flex:1;min-width:100px;padding:9px 11px;background:rgba(255,255,255,.03);border:1px solid var(--border2);border-radius:3px;}
.tgtl{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:var(--text2);margin-bottom:4px;}
.tgtp{font-family:'Space Mono',monospace;font-size:13px;color:var(--white);}
.tgtpp{font-size:10px;color:var(--green);margin-top:2px;}
.tgtrr{font-size:9px;color:var(--text2);margin-top:1px;}
.ar{display:flex;gap:8px;}
.li{flex:1;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:3px;padding:8px 12px;font-family:'Space Mono',monospace;font-size:12px;color:var(--white);outline:none;}
.li:focus{border-color:var(--accent);}.li::placeholder{color:var(--text2);}
.ab{background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.25);border-radius:3px;padding:8px 14px;color:var(--accent);font-family:'Space Mono',monospace;font-size:11px;cursor:pointer;}
.ab:hover{background:rgba(56,189,248,.16);}
.div{height:1px;background:var(--border);margin:13px 0;}
.simrow{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;}
.sbtn{font-size:10px;padding:5px 10px;font-family:'Space Mono',monospace;border-radius:3px;cursor:pointer;transition:all .2s;border:1px solid;}
.s15{background:rgba(251,191,36,.07);border-color:rgba(251,191,36,.3);color:var(--yellow);}
.s1h{background:rgba(56,189,248,.07);border-color:rgba(56,189,248,.3);color:var(--accent);}
.snw{background:rgba(251,191,36,.05);border-color:rgba(251,191,36,.2);color:var(--yellow);font-size:9px;}
.spm{background:rgba(34,211,164,.05);border-color:rgba(34,211,164,.2);color:var(--green);font-size:9px;}
.smanip{background:rgba(251,146,60,.05);border-color:rgba(251,146,60,.2);color:var(--orange);font-size:9px;}
.sreset{background:rgba(244,63,94,.05);border-color:rgba(244,63,94,.2);color:var(--red);font-size:9px;}
.lc{background:var(--card);border:1px solid var(--border);border-radius:6px;overflow:hidden;margin-top:20px;}
.lh{display:flex;justify-content:space-between;align-items:center;padding:10px 18px;background:rgba(255,255,255,.018);border-bottom:1px solid var(--border);}
.lttl{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--text2);}
.clrbtn{font-size:10px;color:var(--text2);background:none;border:none;cursor:pointer;font-family:'Space Mono',monospace;}
.clrbtn:hover{color:var(--red);}
.lb{max-height:240px;overflow-y:auto;}
.le{padding:22px;text-align:center;font-family:'Space Mono',monospace;font-size:11px;color:var(--text2);}
.li2{display:flex;gap:12px;align-items:flex-start;padding:8px 18px;border-bottom:1px solid rgba(24,32,48,.7);animation:si .25s ease;}
@keyframes si{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
.lt{font-family:'Space Mono',monospace;font-size:10px;color:var(--text2);white-space:nowrap;padding-top:1px;}
.lm{font-size:12px;line-height:1.55;color:var(--text);}
.lm b{color:var(--white);}
.cg{color:var(--green)!important;}.cy{color:var(--yellow)!important;}.co{color:var(--orange)!important;}.cp{color:var(--purple)!important;}.cr{color:var(--red)!important;}.cgold{color:var(--gold)!important;}
.botrow{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;}
.bbt{flex:1;min-width:140px;padding:10px;border-radius:4px;font-family:'Space Mono',monospace;font-size:11px;cursor:pointer;transition:all .2s;letter-spacing:1px;border:1px solid;}
.bbt-set{background:rgba(56,189,248,.07);border-color:rgba(56,189,248,.25);color:var(--accent);}
.bbt-rst{background:rgba(244,63,94,.05);border-color:rgba(244,63,94,.2);color:var(--red);}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:var(--bg);}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}
</style>
</head>
<body>
<div class="wrap">
<header>
  <div class="brand">⬡ LEVEL ALERT SYSTEM v5</div>
  <div class="header-right">
    <div class="conn-pill cp-wait" id="connPill">⏳ NO SERVER</div>
    <div class="live"><div class="live-dot"></div>LIVE</div>
  </div>
</header>

<div class="setup-box" id="setupBox">
  <div class="sb-title">⚙️ SERVER CONNECTION — RAILWAY SETUP</div>
  <div class="sb-row">
    <input class="sb-inp" id="srvUrl" placeholder="https://your-app.up.railway.app"/>
    <button class="sb-btn" onclick="connectSrv()">CONNECT</button>
  </div>
  <div class="sb-steps">
    <b>Step 1:</b> Create a free account at <b>railway.app</b><br>
    <b>Step 2:</b> Create a new GitHub repo and upload <code>server.js</code> and <code>package.json</code><br>
    <b>Step 3:</b> In Railway → New Project → Deploy from GitHub → select your repo<br>
    <b>Step 4:</b> Railway gives you a URL like <code>https://yourapp.up.railway.app</code> — paste it above<br>
    <b>Step 5:</b> In TradingView → Alerts → set Webhook URL to <code>https://yourapp.up.railway.app/webhook</code><br>
    <b>Step 6:</b> Set alert message to JSON format below — TradingView fires it automatically when price hits your level
    <div class="wh-fmt">
      <b style="color:var(--white)">TradingView Alert Message (paste exactly, one per alert):</b><br>
      <b style="color:var(--white)">Each TradingView alert fires ONE of these:</b><br>
      <span class="hl">{"pair":"EURUSD","price":{{close}},"action":"touch"}</span> &larr; Use this for price alerts at your level (auto-logs 1H touch)<br>
      <span class="hl">{"pair":"USDCHF","price":{{close}},"action":"touch"}</span><br>
      <span class="hl">{"pair":"USDJPY","price":{{close}},"action":"touch"}</span><br>
      <span class="hl">{"pair":"EURUSD","price":{{close}},"action":"nowick"}</span> &larr; Optional: set a separate no-wick alert<br>
      <b style="color:var(--yellow)">Manipulation is auto-detected by the server — no alert needed for it.</b>
    </div>
  </div>
</div>

<div class="price-bar">
  <div class="pc" id="chip-eurusd"><div class="pc-pair">EUR/USD</div><div class="pc-price" id="pr-eurusd">—</div><div class="pc-chg flat" id="pch-eurusd">—</div></div>
  <div class="pc" id="chip-usdchf"><div class="pc-pair">USD/CHF</div><div class="pc-price" id="pr-usdchf">—</div><div class="pc-chg flat" id="pch-usdchf">—</div></div>
  <div class="pc" id="chip-usdjpy"><div class="pc-pair">USD/JPY</div><div class="pc-price" id="pr-usdjpy">—</div><div class="pc-chg flat" id="pch-usdjpy">—</div></div>
</div>

<div class="cfg-bar">
  <div class="cfg">Mode<span id="modeSpan">MANUAL</span></div>
  <div class="cfg">15m<span>3 touches</span></div>
  <div class="cfg">1H<span>2 touches</span></div>
  <div class="cfg">Prices<span>15s refresh</span></div>
  <div class="cfg">Memory<span>Auto-saved</span></div>
</div>

<div class="gl">
  <div class="gli gli-a"><div class="gli-ico">🏆</div><div><div class="gli-t">A — WITH TREND</div><div class="gli-d">All 6 · Full size · TP1-3</div></div></div>
  <div class="gli gli-act"><div class="gli-ico">⚡</div><div><div class="gli-t">A — COUNTER TREND</div><div class="gli-d">All 6 · 50% size · TP1</div></div></div>
  <div class="gli gli-b"><div class="gli-ico">🥈</div><div><div class="gli-t">B SETUP</div><div class="gli-d">4-5 criteria · 75%</div></div></div>
  <div class="gli gli-c"><div class="gli-ico">🥉</div><div><div class="gli-t">C SETUP</div><div class="gli-d">≤3 criteria · 50%</div></div></div>
</div>

<div id="pairsWrap"></div>
<div class="botrow">
  <button class="bbt bbt-set" onclick="toggleSetup()">⚙️ SERVER SETTINGS</button>
  <button class="bbt bbt-rst" onclick="resetAll()">↺ RESET ALL</button>
</div>
<div class="lc">
  <div class="lh"><div class="lttl">📡 Alert Log</div><button class="clrbtn" onclick="clearLog()">CLEAR</button></div>
  <div class="lb" id="logBody"><div class="le" id="logEmpty">— Waiting for alerts... —</div></div>
</div>
</div>

<script>
const PC=[
  {id:'eurusd',name:'EUR/USD',pip:0.0001,jpy:false,trend:'bull',ak:'EURUSD',def:[1.17000,1.17250,1.17500,1.17800]},
  {id:'usdchf',name:'USD/CHF',pip:0.0001,jpy:false,trend:'bear',ak:'USDCHF',def:[0.78500,0.78650,0.79000,0.78280]},
  {id:'usdjpy',name:'USD/JPY',pip:0.01,  jpy:true, trend:'bear',ak:'USDJPY',def:[142.000,142.500,143.000,143.500]},
  {id:'audusd',name:'AUD/USD',pip:0.0001,jpy:false,trend:'bull',ak:'AUDUSD',def:[0.71000,0.71500,0.72000,0.70500]},
];
const SLP=20,SK='fxv5',UK='fxv5url';
let SRV=localStorage.getItem(UK)||'__SERVER_URL__',LP={},PP={},LSU=0,SMODE=false;

function mkL(p){return{price:p,t15:0,t1h:0,noWick:false,prevMove:false,manip:false,entry:false,dir:null};}
function loadSt(){
  try{const s=localStorage.getItem(SK);if(s){const p=JSON.parse(s),o={};PC.forEach(c=>{o[c.id]=p[c.id]||{trend:c.trend,levels:c.def.map(mkL)};o[c.id].levels=o[c.id].levels.map(l=>({...mkL(l.price),...l}));});return o;}}catch(e){}
  const o={};PC.forEach(c=>{o[c.id]={trend:c.trend,levels:c.def.map(mkL)};});return o;
}
function saveSt(){try{localStorage.setItem(SK,JSON.stringify(ST));}catch(e){}}
const ST=loadSt();

function isP(price,jpy){if(jpy){const d=price%1;return d<0.002||Math.abs(d-.5)<0.002||Math.abs(d-.25)<0.002||Math.abs(d-.75)<0.002;}const d=(price.toFixed(5).split('.')[1]||'');return['.000','.250','.400','.500','.800'].some(s=>d.slice(2).startsWith(s.replace('.',''))||d.endsWith(s.replace('.','')));}
function gPip(id){return PC.find(p=>p.id===id).pip;}
function isJ(id){return PC.find(p=>p.id===id).jpy;}
function fP(v,id){return isJ(id)?v.toFixed(3):v.toFixed(5);}
function pdist(a,b,id){return Math.abs(a-b)/gPip(id);}
function isCT(id,dir){const t=ST[id].trend;return(t==='bull'&&dir==='short')||(t==='bear'&&dir==='long');}
function gDir(id){return ST[id].trend==='bull'?'long':'short';}
function grade(id,l){
  const ct=isCT(id,l.dir);
  const c={psych:isP(l.price,isJ(id)),noWick:l.noWick,prevMove:l.prevMove,t15:l.t15>=3,t1h:l.t1h>=2,manip:l.manip};
  const sc=Object.values(c).filter(Boolean).length;
  if(!l.entry)return{g:'none',sc,c,ct};
  return{g:sc===6?'A':sc>=4?'B':'C',sc,c,ct};
}
function calTgt(price,dir,pip,id){const sl=SLP*pip,s=dir==='long'?1:-1;return[{lbl:'TP1 — Scalp',price:price+s*sl*1.5,rr:'1.5R',note:'First psych / structure'},{lbl:'TP2 — Swing',price:price+s*sl*2.5,rr:'2.5R',note:'Next major psych zone'},{lbl:'TP3 — Runner',price:price+s*sl*4.0,rr:'4.0R',note:'Full trend continuation'}];}
function lvlSt(l){if(l.entry)return'e';if(l.manip)return'm';if(l.t1h>=2||l.t15>=3)return'r';if(l.t15>0||l.t1h>0)return'w';return'n';}
function crdSt(id){const ls=ST[id].levels;if(ls.some(l=>{if(!l.entry||!l.dir)return false;const g=grade(id,l);return g.g==='A'&&g.ct;}))return'sc-entry-act';if(ls.some(l=>{if(!l.entry||!l.dir)return false;const g=grade(id,l);return g.g==='A'&&!g.ct;}))return'sc-entry-a';if(ls.some(l=>l.entry))return'sc-entry';if(ls.some(l=>l.manip))return'sc-manip';if(ls.some(l=>l.t1h>=2||l.t15>=3))return'sc-respected';if(ls.some(l=>l.t15>0||l.t1h>0))return'sc-watching';return'';}

async function connectSrv(){
  const url=document.getElementById('srvUrl').value.trim().replace(/\\/$/,'');
  if(!url)return;SRV=url;localStorage.setItem(UK,url);setPill('wait');
  await pollSrv();
}
function toggleSetup(){document.getElementById('setupBox').style.display=document.getElementById('setupBox').style.display==='none'?'block':'none';}
function setPill(t){const el=document.getElementById('connPill');el.className='conn-pill '+(t==='ok'?'cp-ok':t==='err'?'cp-err':'cp-wait');el.textContent=t==='ok'?'● SERVER LIVE':t==='err'?'● OFFLINE':'⏳ CONNECTING...';document.getElementById('modeSpan').textContent=t==='ok'?'AUTO':'MANUAL';SMODE=t==='ok';}

async function pollSrv(){
  if(!SRV)return;
  try{
    const res=await fetch(SRV+'/state',{signal:AbortSignal.timeout(5000)});
    if(!res.ok)throw new Error();
    const data=await res.json();
    if(data.lastUpdated>LSU){
      LSU=data.lastUpdated;
      Object.keys(data.state).forEach(id=>{if(ST[id])ST[id]=data.state[id];});
      if(data.log)data.log.slice(0,3).forEach(e=>{
        const ico=e.type==='ENTRY'?'🟢':e.type.includes('MANIP')?'⚡':e.type.includes('RESPECTED')?'🔔':'👆';
        const cls=e.type==='ENTRY'?'cg':e.type.includes('MANIP')?'co':e.type.includes('RESPECTED')?'cy':'';
        const imp=['ENTRY','MANIPULATION','RESPECTED_15M','RESPECTED_1H'].includes(e.type);
        alog(cls,ico,e.pair,e.msg,imp);
        if(imp)snd(e.type==='ENTRY'?'entry':'manip');
      });
      saveSt();render();
    }
    setPill('ok');
  }catch(e){setPill('err');}
}
async function pushSt(){if(!SRV||!SMODE)return;try{await fetch(SRV+'/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({state:ST}),signal:AbortSignal.timeout(3000)});}catch(e){}}

async function fetchPx(){
  try{
    // Try server-side price endpoint first (most reliable)
    const baseUrl=SRV&&SMODE?SRV:window.location.origin;
    const r=await fetch(baseUrl+'/prices',{signal:AbortSignal.timeout(8000)});
    const d=await r.json();
    if(!d.ok||!d.prices)throw new Error('No prices');
    PP={...LP};
    Object.entries(d.prices).forEach(([k,v])=>{LP[k.toLowerCase()]=v;});
    PC.forEach(cfg=>{
      const pr=LP[cfg.ak.toLowerCase()];if(!pr)return;
      const pv=PP[cfg.ak.toLowerCase()];
      const pct=pv?((pr-pv)/pv*100).toFixed(4):null;
      const dir=!pct?'flat':parseFloat(pct)>0?'up':'dn';
      document.getElementById('pr-'+cfg.id).textContent=fP(pr,cfg.id);
      const ce=document.getElementById('pch-'+cfg.id);ce.textContent=(dir==='up'?'▲':dir==='dn'?'▼':'')+' '+(pct?Math.abs(pct)+'%':'—');ce.className='pc-chg '+dir;
      const chip=document.getElementById('chip-'+cfg.id);
      const ex=chip.querySelector('.pc-near');if(ex)ex.remove();
      ST[cfg.id].levels.forEach(l=>{const dist=pdist(pr,l.price,cfg.id);if(dist<=10)chip.insertAdjacentHTML('beforeend',\`<div class="pc-near">⚡ \${dist.toFixed(1)} pips from \${fP(l.price,cfg.id)}</div>\`);});
      const inl=document.getElementById('ilp-'+cfg.id);if(inl)inl.textContent=fP(pr,cfg.id);
    });
  }catch(e){}
}

function render(){
  const w=document.getElementById('pairsWrap');w.innerHTML='';
  PC.forEach(cfg=>w.appendChild(bldCard(cfg)));
}

function bldCard(cfg){
  const{id,name}=cfg,s=ST[id];
  const tc=s.trend==='bull'?'tb-bull':s.trend==='bear'?'tb-bear':'tb-range';
  const tl=s.trend==='bull'?'▲ BULLISH':s.trend==='bear'?'▼ BEARISH':'◆ RANGING';
  const lp=LP[cfg.ak.toLowerCase()];
  const card=document.createElement('div');card.className='pair-card '+crdSt(id);
  const lvH=s.levels.map((l,i)=>bldRow(id,l,i)).join('');
  const sims=s.levels.slice(0,2).map((l,i)=>\`
    <button class="sbtn s15" onclick="doT('\${id}',\${i},'15m')">15m·\${fP(l.price,id)}</button>
    <button class="sbtn s1h" onclick="doT('\${id}',\${i},'1h')">1H·\${fP(l.price,id)}</button>
    <button class="sbtn snw" onclick="doNW('\${id}',\${i})">NO WICK</button>
    <button class="sbtn spm" onclick="doPM('\${id}',\${i})">PREV MOVE</button>
    <button class="sbtn smanip" onclick="doM('\${id}',\${i})">MANIP</button>
    <button class="sbtn sreset" onclick="doRst('\${id}',\${i})">RESET</button>\`).join('');
  card.innerHTML=\`<div class="ph"><div class="phl"><div class="psym">\${name}</div><div class="plp" id="ilp-\${id}">\${lp?fP(lp,id):'—'}</div></div><div class="phr"><div class="tb \${tc}">\${tl}</div><select class="tsel" onchange="doTrend('\${id}',this.value)"><option value="bull" \${s.trend==='bull'?'selected':''}>Bullish</option><option value="bear" \${s.trend==='bear'?'selected':''}>Bearish</option><option value="range" \${s.trend==='range'?'selected':''}>Ranging</option></select></div></div>
  <div class="pb"><div class="sl">Key Levels</div><div class="ll" id="ll-\${id}">\${lvH}</div><div class="ar"><input class="li" id="inp-\${id}" type="number" step="\${isJ(id)?'0.001':'0.00001'}" placeholder="\${isJ(id)?'e.g. 142.500':'e.g. 1.17500'}"><button class="ab" onclick="doAdd('\${id}')">+ ADD</button></div><div class="div"></div><div class="sl">Manual Log</div><div class="simrow">\${sims}</div></div>\`;
  return card;
}

function bldRow(id,l,i){
  const st=lvlSt(l),{g,sc,c,ct}=grade(id,l);
  const isACT=g==='A'&&ct,isAWT=g==='A'&&!ct;
  const rc=isACT?'re-act':isAWT?'re-a':st==='e'?'re-e':st==='m'?'re-m':st==='r'?'re-r':'';
  const lp=LP[PC.find(p=>p.id===id).ak.toLowerCase()];
  const dist=lp?pdist(lp,l.price,id):null;
  const dStr=dist?(dist<=10?\`<span class="dl near">⚡\${dist.toFixed(1)}p</span>\`:\`<span class="dl far">\${dist.toFixed(1)}p</span>\`):'';
  const p15=[0,1,2].map(j=>\`<div class="pip \${j<l.t15?'f15':''}"></div>\`).join('');
  const p1h=[0,1].map(j=>\`<div class="pip \${j<l.t1h?'f1h':''}"></div>\`).join('');
  const tags=[];
  if(isP(l.price,isJ(id)))tags.push('<span class="tag tpsych">PSYCH</span>');
  if(l.noWick)tags.push('<span class="tag tnw">NO WICK ✦</span>');
  if(l.prevMove)tags.push('<span class="tag tpm">PREV MOVE ✦</span>');
  const stL={n:'–',w:'WATCH',r:'RESPECTED',m:'SWEEP!',e:'✦ ENTRY'}[st];
  let extra='';
  if(l.entry&&l.dir){
    if(ct){tags.push('<span class="tag tct">⚡ CT</span>');tags.push('<span class="tag thr">HIGH R/R</span>');}
    else{tags.push('<span class="tag twt">WITH TREND ✓</span>');}
    const gbC=isACT?'gbact':isAWT?'gba':g==='B'?'gbb':'gbc';
    const gpC=isACT?'gpact':isAWT?'gpa':g==='B'?'gpb':'gpc';
    const ico=g==='A'?(ct?'⚡':'🏆'):g==='B'?'🥈':'🥉';
    const lbl=g==='A'?(ct?'A SETUP — COUNTER TREND':'A SETUP — WITH TREND'):g+' SETUP';
    const sM=isACT?'50% size':isAWT?'Full size':g==='B'?'75% size':'50% or skip';
    const tM=isACT?'TP1 primarily. Partial to TP2 if CHoCH confirms.':isAWT?'Ride to TP2/TP3. Move SL to BE after TP1.':g==='B'?'TP1 & TP2. Trail stop.':'TP1 only.';
    const aC=isACT?'var(--purple)':isAWT?'var(--gold)':'var(--border2)';
    const CKS=[{k:'psych',l:'Psychological level'},{k:'noWick',l:'No-wick candle'},{k:'prevMove',l:'Previous big move'},{k:'t15',l:'3 touches on 15m'},{k:'t1h',l:'2 touches on 1H'},{k:'manip',l:'Manipulation detected'}];
    const ckH=CKS.map(ck=>\`<div class="chkr"><div class="chkb \${c[ck.k]?'done':'fail'}">\${c[ck.k]?'✓':'✗'}</div><div class="chkl2 \${c[ck.k]?'done':''}">\${ck.l}</div></div>\`).join('');
    const trH=\`<div class="chkr"><div class="chkb \${ct?'info':'done'}">\${ct?'⚡':'✓'}</div><div class="chkl2 \${ct?'info':'done'}">\${ct?'Counter trend — valid A if 6/6':'With trend'}</div></div>\`;
    const pip=gPip(id);const tgs=calTgt(l.price,l.dir,pip,id);const tc2=isACT?2:g==='A'?3:g==='B'?2:1;
    const tH=tgs.slice(0,tc2).map(t=>\`<div class="tgti"><div class="tgtl">\${t.lbl}</div><div class="tgtp">\${fP(t.price,id)}</div><div class="tgtpp">+\${Math.abs((t.price-l.price)/pip).toFixed(0)} pips</div><div class="tgtrr">\${t.rr} · \${t.note}</div></div>\`).join('');
    extra=\`<div class="gp \${gpC} show">\${isACT?\`<div class="ctb show"><div style="font-size:17px">⚡</div><div class="ctbt"><strong>A SETUP — COUNTER TREND</strong> — All 6 criteria. Against <strong>\${ST[id].trend.toUpperCase()}</strong> trend. High risk/reward.</div></div>\`:''}
    <div class="gtop"><div class="gbadge \${gbC}">\${ico} \${lbl}</div><div class="gscore">\${sc}/6 criteria<br>\${sM}</div></div>
    <div class="chkl">\${ckH}\${trH}</div>
    <div class="advbox" style="border-left-color:\${aC}">📌 \${tM}</div>
    <div class="tgtlbl">🎯 TARGETS — \${l.dir.toUpperCase()} @ \${fP(l.price,id)} <span style="font-size:9px;color:var(--text2)">(\${tc2} targets)</span></div>
    <div class="tgtgrid">\${tH}</div></div>\`;
  }
  return\`<div class="lr \${rc}\${dist&&dist<=10&&!l.entry?' re-near':''}"><div class="lp2">\${fP(l.price,id)}</div>\${dStr}<div class="tbar">\${p15}<div style="width:1px;background:var(--border2);margin:0 2px"></div>\${p1h}</div><div class="tags">\${tags.join('')}</div><div class="lst st\${st}">\${stL}</div><button class="delbtn" onclick="doRmv('\${id}',\${i})">×</button></div>\${extra}\`;
}

function doTrend(id,v){ST[id].trend=v;saveSt();pushSt();alog('','🔄',id.toUpperCase(),\`Trend → <b>\${v.toUpperCase()}</b>\`);render();}
function doAdd(id){const inp=document.getElementById('inp-'+id);const v=parseFloat(inp.value);if(isNaN(v)||v<=0)return;ST[id].levels.push(mkL(v));inp.value='';alog('','📍',id.toUpperCase(),\`Level <b>\${fP(v,id)}</b> added\`);saveSt();pushSt();render();}
function doRmv(id,i){const l=ST[id].levels[i];ST[id].levels.splice(i,1);alog('','🗑',id.toUpperCase(),\`<b>\${fP(l.price,id)}</b> removed\`);saveSt();pushSt();render();}
function doNW(id,i){ST[id].levels[i].noWick=true;alog('cy','🕯',id.toUpperCase(),\`No-wick at <b>\${fP(ST[id].levels[i].price,id)}</b>\`);saveSt();pushSt();render();}
function doPM(id,i){ST[id].levels[i].prevMove=true;alog('cg','📈',id.toUpperCase(),\`Prev move at <b>\${fP(ST[id].levels[i].price,id)}</b>\`);saveSt();pushSt();render();}
function doM(id,i){
  const l=ST[id].levels[i];if(l.manip)return;l.manip=true;
  alog('co','⚡',id.toUpperCase(),\`<b>SWEEP/MANIP</b> at \${fP(l.price,id)}\`,true);snd('manip');
  if(l.t15>=3&&l.t1h>=2&&!l.entry){setTimeout(()=>{l.entry=true;l.dir=gDir(id);fireE(id,i);saveSt();pushSt();render();},1200);}
  saveSt();pushSt();render();
}
function doRst(id,i){const p=ST[id].levels[i].price;ST[id].levels[i]=mkL(p);alog('','↺',id.toUpperCase(),\`<b>\${fP(p,id)}</b> reset\`);saveSt();pushSt();render();}
function resetAll(){PC.forEach(p=>{ST[p.id].levels=p.def.map(mkL);});saveSt();pushSt();render();alog('cr','↺','ALL','All levels reset');}
function doT(id,i,tf){
  const l=ST[id].levels[i],name=PC.find(p=>p.id===id).name;
  if(tf==='15m'){if(l.t15>=3)return;l.t15++;alog('cy','👆',name,\`<b>\${fP(l.price,id)}</b> 15m touch \${l.t15}/3\`);if(l.t15===3){alog('cy','🔔',name,\`<b>RESPECTED</b> 15m — \${fP(l.price,id)}\`,true);snd('respect');}}
  else{if(l.t1h>=2)return;l.t1h++;alog('','👆',name,\`<b>\${fP(l.price,id)}</b> 1H touch \${l.t1h}/2\`);if(l.t1h===2){alog('cy','🔔',name,\`<b>RESPECTED</b> 1H — \${fP(l.price,id)}\`,true);snd('respect');}}
  if(l.t15>=3&&l.t1h>=2&&l.manip&&!l.entry){l.entry=true;l.dir=gDir(id);setTimeout(()=>{fireE(id,i);saveSt();pushSt();render();},800);}
  saveSt();pushSt();render();
}
function fireE(id,i){
  const l=ST[id].levels[i],{g,sc,ct}=grade(id,l);
  const ico=g==='A'?(ct?'⚡':'🏆'):g==='B'?'🥈':'🥉';
  const gc=g==='A'?(ct?'cp':'cgold'):'';
  if(g==='A'&&ct){alog('cp','⚡',id.toUpperCase(),\`<b class="cp">⚡ A SETUP — COUNTER TREND</b> — \${fP(l.price,id)} | \${l.dir.toUpperCase()} | 6/6 | <span class="cr">HIGH RISK/REWARD</span> 🎯\`,true);snd('asetup_ct');}
  else if(g==='A'){alog('cgold','🏆',id.toUpperCase(),\`<b class="cgold">🏆 A SETUP — WITH TREND</b> — \${fP(l.price,id)} | \${l.dir.toUpperCase()} | 6/6 🎯\`,true);snd('asetup');}
  else{alog(gc,ico,id.toUpperCase(),\`<b class="\${gc}">\${ico} \${g} SETUP</b> — \${fP(l.price,id)} | \${l.dir.toUpperCase()} | \${sc}/6\${ct?' | <span class="cp">CT</span>':''} 🎯\`,true);snd('entry');}
}
function alog(cls,ico,pair,msg,imp=false){
  const body=document.getElementById('logBody');const empty=document.getElementById('logEmpty');if(empty)empty.remove();
  const t=new Date().toTimeString().slice(0,8);const el=document.createElement('div');el.className='li2';
  el.innerHTML=\`<div class="lt">\${t}</div><div style="font-size:13px">\${ico}</div><div class="lm \${imp?cls:''}"><b style="color:var(--text2);margin-right:6px">\${pair}</b>\${msg}</div>\`;
  body.insertBefore(el,body.firstChild);
}
function clearLog(){document.getElementById('logBody').innerHTML='<div class="le" id="logEmpty">— Cleared. —</div>';}
function snd(type){
  try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const s={respect:[[440,.08],[550,.12]],manip:[[330,.07],[440,.07],[550,.12]],entry:[[440,.06],[554,.06],[659,.06],[880,.18]],asetup:[[440,.06],[554,.06],[659,.06],[880,.1],[1100,.06],[880,.22]],asetup_ct:[[330,.08],[415,.08],[523,.08],[659,.08],[830,.22]]};
  let t=ctx.currentTime;(s[type]||s.entry).forEach(([f,d])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=f;o.type='sine';g.gain.setValueAtTime(.15,t);g.gain.exponentialRampToValueAtTime(.001,t+d+.05);o.start(t);o.stop(t+d+.08);t+=d+.03;});}catch(e){}
}
render();fetchPx();setInterval(fetchPx,15000);
if(SRV){document.getElementById('srvUrl').value=SRV;document.getElementById('setupBox').style.display='none';pollSrv();setInterval(pollSrv,5000);}else{setInterval(()=>{if(SRV)pollSrv();},5000);}
alog('','🚀','SYSTEM','v5 loaded — '+(SRV?'server connected':'manual mode. Add Railway URL to enable auto.'));
</script>
</body>
</html>
`;


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

// ── Server-side live price fetching ──────────────────────────────────────────
// Tries multiple free APIs with fallback so prices always populate
let cachedPrices = {};
let priceLastFetched = 0;

async function fetchServerPrices() {
  const now = Date.now();
  // Cache for 10 seconds to avoid hammering APIs
  if (now - priceLastFetched < 10000 && Object.keys(cachedPrices).length > 0) {
    return cachedPrices;
  }

  // Try multiple APIs in order — first success wins
  const apis = [
    // API 1: freeforexapi — works well server side with node-fetch
    async () => {
      const https = require('https');
      return new Promise((resolve, reject) => {
        const options = {
          hostname: 'www.freeforexapi.com',
          path: '/api/live?pairs=EURUSD,USDCHF,USDJPY,AUDUSD',
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ForexAlertBot/1.0)',
            'Accept': 'application/json'
          },
          timeout: 8000
        };
        const req = https.request(options, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              if (json.code === 200 && json.rates) {
                const prices = {};
                Object.entries(json.rates).forEach(([k, v]) => {
                  prices[k.toLowerCase()] = v.rate;
                });
                resolve(prices);
              } else {
                reject(new Error('Bad response'));
              }
            } catch(e) { reject(e); }
          });
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        req.end();
      });
    },

    // API 2: exchangerate-api open access (no key needed)
    // Gets USD base rates then calculates pairs
    async () => {
      const https = require('https');
      return new Promise((resolve, reject) => {
        const options = {
          hostname: 'open.er-api.com',
          path: '/v6/latest/USD',
          method: 'GET',
          headers: { 'User-Agent': 'ForexAlertBot/1.0' },
          timeout: 8000
        };
        const req = https.request(options, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              if (json.result === 'success' && json.rates) {
                const r = json.rates;
                const prices = {};
                // Calculate pairs from USD base
                if (r.CHF) prices['usdchf'] = r.CHF;
                if (r.JPY) prices['usdjpy'] = r.JPY;
                if (r.EUR) prices['eurusd'] = 1 / r.EUR;
                if (r.AUD) prices['audusd'] = 1 / r.AUD;
                resolve(prices);
              } else {
                reject(new Error('Bad response'));
              }
            } catch(e) { reject(e); }
          });
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        req.end();
      });
    },

    // API 3: frankfurter.dev — open source, no key, ECB data
    async () => {
      const https = require('https');
      return new Promise((resolve, reject) => {
        const options = {
          hostname: 'api.frankfurter.dev',
          path: '/v2/latest?base=USD&symbols=CHF,JPY,EUR,AUD',
          method: 'GET',
          headers: { 'User-Agent': 'ForexAlertBot/1.0' },
          timeout: 8000
        };
        const req = https.request(options, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              if (json.rates) {
                const r = json.rates;
                const prices = {};
                if (r.CHF) prices['usdchf'] = r.CHF;
                if (r.JPY) prices['usdjpy'] = r.JPY;
                if (r.EUR) prices['eurusd'] = 1 / r.EUR;
                if (r.AUD) prices['audusd'] = 1 / r.AUD;
                resolve(prices);
              } else {
                reject(new Error('Bad response'));
              }
            } catch(e) { reject(e); }
          });
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        req.end();
      });
    }
  ];

  // Try each API in order
  for (const api of apis) {
    try {
      const prices = await api();
      if (prices && Object.keys(prices).length >= 2) {
        cachedPrices = prices;
        priceLastFetched = Date.now();
        console.log(`Prices fetched: USDCHF=${prices.usdchf} EURUSD=${prices.eurusd} USDJPY=${prices.usdjpy}`);
        // Run auto-manipulation check with fresh prices
        PAIRS_CFG_IDS.forEach(pairId => {
          const price = parseFloat(prices[pairId]);
          if (isNaN(price) || !STATE[pairId]) return;
          STATE[pairId].levels.forEach((l, i) => checkAutoManip(pairId, price, i));
        });
        return prices;
      }
    } catch(e) {
      console.log(`Price API failed: ${e.message} — trying next...`);
    }
  }
  console.log('All price APIs failed — returning cached prices');
  return cachedPrices;
}

// Fetch prices on server startup and every 15 seconds
fetchServerPrices();
setInterval(fetchServerPrices, 15000);

// Expose prices to the frontend
app.get('/prices', async (req, res) => {
  try {
    const prices = await fetchServerPrices();
    res.json({ ok: true, prices, lastUpdated: priceLastFetched });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message, prices: cachedPrices });
  }
});


// ── Serve the trading tool UI ─────────────────────────────────────────────────
app.get('/app', (req, res) => {
  const BASE_URL = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : `http://localhost:${process.env.PORT || 3000}`;
  const page = HTML_APP.replace('__SERVER_URL__', BASE_URL);
  res.setHeader('Content-Type', 'text/html');
  res.send(page);
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Forex Alert Server running on port ${PORT}`);
  console.log(`Webhook endpoint: POST /webhook`);
  console.log(`State endpoint:   GET  /state`);
});
