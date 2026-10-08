/* Kapu Field Notebook - training flag tracker.  MOCK SITE FOR TRAINING.
 *
 * Flags are NOT stored in plain text anywhere. Each challenge ships an answer
 * hash and the flag XOR-encrypted under the correct answer. When a participant
 * completes a task - either by entering the value they found/decoded, or via an
 * in-page hook that fires on the action - the flag is decrypted and recorded in
 * this notebook with the lesson learned. Reading the source reveals neither the
 * flag nor the answer.
 *
 * The per-site catalog is provided as window.KAPU_CHALLENGES = { meta, items }.
 */
(function () {
  "use strict";
  if (window.__kapuNotebook) { return; }
  window.__kapuNotebook = true;

  var DATA = window.KAPU_CHALLENGES || { meta: {}, items: [] };
  var META = DATA.meta || {};
  var ITEMS = DATA.items || [];
  var STORE = "kapu_nb_" + (META.slug || "env");

  // ---- answer normalisation (must match the generator exactly) ----
  function norm(s) {
    return String(s == null ? "" : s)
      .toLowerCase().trim()
      .replace(/\s+/g, " ")
      .replace(/^["']|["']$/g, "")
      .replace(/\.$/, "");
  }
  // ---- FNV-1a 32-bit -> 8-hex (matches the generator) ----
  function fnv1a(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ("0000000" + h.toString(16)).slice(-8);
  }
  // ---- XOR-decrypt: hex ciphertext XOR repeating key -> string ----
  function xorDec(hex, key) {
    var out = "";
    for (var i = 0; i < hex.length; i += 2) {
      var b = parseInt(hex.substr(i, 2), 16);
      out += String.fromCharCode(b ^ key.charCodeAt((i / 2) % key.length));
    }
    return out;
  }

  // ---- persistence ----
  function readFound() {
    try { return JSON.parse(localStorage.getItem(STORE) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function writeFound(f) {
    try { localStorage.setItem(STORE, JSON.stringify(f)); } catch (e) {}
  }

  var byId = {};
  ITEMS.forEach(function (it) { byId[it.id] = it; });

  // ---- completion ----
  // Returns 'ok' | 'already' | 'wrong' | 'unknown'
  function complete(id, answer) {
    var it = byId[id];
    if (!it) { return "unknown"; }
    var found = readFound();
    if (found[id]) { return "already"; }
    var a = norm(answer);
    if (fnv1a(a) !== it.h) { return "wrong"; }
    var flag = xorDec(it.f, a);
    if (flag.indexOf("FLAG{") !== 0) { return "wrong"; }
    found[id] = flag;
    writeFound(found);
    render();
    toast("Flag captured - " + it.code + ": " + flag);
    return "ok";
  }

  // ---- UI ----
  var ACCENT = META.accent || "#2f7ea5";
  var PBG = META.panelBg || "#10151f";
  var PINK = META.panelInk || "#eef2f8";
  var PMUT = META.panelMuted || "#9aa6bb";
  var PCARD = META.panelCard || "#172031";
  var PLINE = META.panelLine || "#28344a";
  var DIFFC = { Easy: "#3bb273", Medium: "#e0a53b", Hard: "#e0574b" };

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) { for (var k in attrs) { e.setAttribute(k, attrs[k]); } }
    if (html != null) { e.innerHTML = html; }
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var panel, backdrop, fab, toastEl, toastTimer;

  function injectStyle() {
    if (document.getElementById("kapu-nb-style")) { return; }
    var css = "" +
      "#kapu-fab{position:fixed;right:18px;bottom:18px;z-index:2147483000;display:inline-flex;align-items:center;gap:9px;" +
      "padding:11px 16px;border-radius:999px;border:0;cursor:pointer;font:600 13px/1 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;" +
      "background:" + ACCENT + ";color:#fff;box-shadow:0 4px 18px rgba(0,0,0,.28);}" +
      "#kapu-fab:hover{filter:brightness(1.07);}" +
      "#kapu-fab .kapu-count{background:rgba(255,255,255,.22);border-radius:999px;padding:2px 8px;font-variant-numeric:tabular-nums;}" +
      "#kapu-backdrop{position:fixed;inset:0;z-index:2147483100;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .2s;}" +
      "#kapu-backdrop.open{opacity:1;pointer-events:auto;}" +
      "#kapu-panel{position:fixed;top:0;right:0;bottom:0;z-index:2147483200;width:min(440px,92vw);transform:translateX(102%);transition:transform .24s cubic-bezier(.2,.7,.2,1);" +
      "background:" + PBG + ";color:" + PINK + ";font:14px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;display:flex;flex-direction:column;box-shadow:-8px 0 30px rgba(0,0,0,.4);padding-top:env(safe-area-inset-top,0);}" +
      "#kapu-panel.open{transform:none;}" +
      "#kapu-panel .kapu-hd{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid " + PLINE + ";}" +
      "#kapu-panel .kapu-hd h2{margin:0;font:700 16px/1.2 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;}" +
      "#kapu-panel .kapu-hd small{display:block;color:" + PMUT + ";font-weight:400;font-size:12px;margin-top:3px;}" +
      "#kapu-panel .kapu-x{background:none;border:0;color:" + PMUT + ";font-size:22px;line-height:1;cursor:pointer;padding:4px 8px;}" +
      "#kapu-panel .kapu-x:hover{color:" + PINK + ";}" +
      "#kapu-prog{padding:12px 20px;border-bottom:1px solid " + PLINE + ";color:" + PMUT + ";font-size:12.5px;}" +
      "#kapu-prog b{color:" + PINK + ";}" +
      "#kapu-prog .kapu-bar{height:6px;border-radius:3px;background:" + PLINE + ";margin-top:8px;overflow:hidden;}" +
      "#kapu-prog .kapu-bar i{display:block;height:100%;background:" + ACCENT + ";transition:width .3s;}" +
      "#kapu-list{overflow:auto;padding:12px 16px 40px;flex:1;}" +
      ".kapu-item{border:1px solid " + PLINE + ";background:" + PCARD + ";border-radius:10px;padding:13px 14px;margin-bottom:11px;}" +
      ".kapu-item .kapu-top{display:flex;align-items:center;gap:9px;margin-bottom:6px;}" +
      ".kapu-item .kapu-code{font:700 12px/1 ui-monospace,Menlo,Consolas,monospace;color:" + ACCENT + ";}" +
      ".kapu-item .kapu-diff{font:600 10px/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:3px 7px;border-radius:999px;border:1px solid;}" +
      ".kapu-item .kapu-ttl{font-weight:600;margin:0 0 5px;}" +
      ".kapu-item .kapu-obj{color:" + PMUT + ";font-size:13px;margin:0 0 10px;}" +
      ".kapu-form{display:flex;gap:8px;}" +
      ".kapu-form input{flex:1;min-width:0;background:" + PBG + ";border:1px solid " + PLINE + ";border-radius:7px;color:" + PINK + ";padding:9px 10px;font:13px ui-monospace,Menlo,Consolas,monospace;}" +
      ".kapu-form input:focus{outline:2px solid " + ACCENT + ";outline-offset:1px;}" +
      ".kapu-form button{background:" + ACCENT + ";border:0;border-radius:7px;color:#fff;padding:9px 14px;font:600 13px system-ui,sans-serif;cursor:pointer;}" +
      ".kapu-msg{font-size:12px;margin-top:7px;min-height:14px;}" +
      ".kapu-msg.bad{color:#ff8a7a;}" +
      ".kapu-found .kapu-flag{font:600 13px/1.4 ui-monospace,Menlo,Consolas,monospace;color:" + PINK + ";background:" + PBG + ";border:1px solid " + ACCENT + ";border-radius:7px;padding:8px 10px;overflow-wrap:anywhere;}" +
      ".kapu-found .kapu-learned{color:" + PMUT + ";font-size:13px;margin:9px 0 0;}" +
      ".kapu-found .kapu-learned b{color:" + PINK + ";font-weight:600;}" +
      ".kapu-check{color:" + (DIFFC.Easy) + ";font-weight:700;margin-left:auto;font-size:12px;}" +
      "#kapu-toast{position:fixed;left:50%;bottom:78px;transform:translateX(-50%) translateY(14px);z-index:2147483300;opacity:0;transition:opacity .25s,transform .25s;" +
      "background:" + PCARD + ";color:" + PINK + ";border:1px solid " + ACCENT + ";border-radius:10px;padding:12px 16px;font:600 13px system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.35);max-width:90vw;text-align:center;}" +
      "#kapu-toast.show{opacity:1;transform:translateX(-50%);}" +
      "@media (prefers-reduced-motion:reduce){#kapu-panel,#kapu-backdrop,#kapu-toast{transition:none;}}";
    var st = el("style", { id: "kapu-nb-style" });
    st.textContent = css;
    document.head.appendChild(st);
  }

  function open() { backdrop.classList.add("open"); panel.classList.add("open"); render(); }
  function close() { backdrop.classList.remove("open"); panel.classList.remove("open"); }

  function toast(msg) {
    if (!toastEl) { return; }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    if (toastTimer) { clearTimeout(toastTimer); }
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 3800);
  }

  function render() {
    var found = readFound();
    var n = ITEMS.filter(function (it) { return found[it.id]; }).length;
    var total = ITEMS.length;
    if (fab) {
      fab.innerHTML = '<span>Field Notebook</span><span class="kapu-count">' + n + "/" + total + "</span>";
    }
    if (!panel || !panel.classList.contains("open")) { return; }
    var prog = document.getElementById("kapu-prog");
    if (prog) {
      prog.innerHTML = "<b>" + n + "</b> of <b>" + total + "</b> flags captured" +
        '<div class="kapu-bar"><i style="width:' + (total ? Math.round(n / total * 100) : 0) + '%"></i></div>';
    }
    var list = document.getElementById("kapu-list");
    list.innerHTML = "";
    ITEMS.forEach(function (it) {
      var dc = DIFFC[it.diff] || PMUT;
      var card = el("div", { "class": "kapu-item" + (found[it.id] ? " kapu-found" : "") });
      var top = '<div class="kapu-top"><span class="kapu-code">' + esc(it.code) + '</span>' +
        '<span class="kapu-diff" style="color:' + dc + ';border-color:' + dc + '">' + esc(it.diff) + "</span>" +
        (found[it.id] ? '<span class="kapu-check">\u2713 captured</span>' : "") + "</div>";
      var body = '<p class="kapu-ttl">' + esc(it.title) + "</p>";
      if (found[it.id]) {
        body += '<div class="kapu-flag">' + esc(found[it.id]) + "</div>" +
          '<p class="kapu-learned"><b>What you learned:</b> ' + esc(it.learned) + "</p>";
      } else {
        body += '<p class="kapu-obj">' + esc(it.objective) + "</p>" +
          '<div class="kapu-form"><input type="text" placeholder="Enter what you found" autocomplete="off" spellcheck="false" data-id="' + esc(it.id) + '">' +
          "<button type=\"button\" data-id=\"" + esc(it.id) + "\">Log</button></div>" +
          '<div class="kapu-msg" data-msg="' + esc(it.id) + '"></div>';
      }
      card.innerHTML = top + body;
      list.appendChild(card);
    });
    // wire inputs
    Array.prototype.forEach.call(list.querySelectorAll(".kapu-form button"), function (b) {
      b.addEventListener("click", function () { submit(b.getAttribute("data-id")); });
    });
    Array.prototype.forEach.call(list.querySelectorAll(".kapu-form input"), function (inp) {
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { submit(inp.getAttribute("data-id")); } });
    });
  }

  function submit(id) {
    var inp = document.querySelector('.kapu-form input[data-id="' + id + '"]');
    var msg = document.querySelector('[data-msg="' + id + '"]');
    if (!inp) { return; }
    var r = complete(id, inp.value);
    if (r === "wrong") {
      if (msg) { msg.textContent = "Not quite - recheck what the task asks for."; msg.className = "kapu-msg bad"; }
    } else if (r === "ok") {
      // render() already refreshed the card to the found state
    }
  }

  function mount() {
    injectStyle();
    fab = el("button", { id: "kapu-fab", type: "button", "aria-label": "Open Field Notebook" });
    fab.addEventListener("click", open);
    backdrop = el("div", { id: "kapu-backdrop" });
    backdrop.addEventListener("click", close);
    panel = el("aside", { id: "kapu-panel", role: "dialog", "aria-label": "Field Notebook" });
    panel.innerHTML =
      '<div class="kapu-hd"><div><h2>Field Notebook</h2><small>' +
      esc(META.title || "Challenges") + " \u00b7 flags you capture are saved here</small></div>" +
      '<button class="kapu-x" type="button" aria-label="Close">\u00d7</button></div>' +
      '<div id="kapu-prog"></div><div id="kapu-list"></div>';
    panel.querySelector(".kapu-x").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { close(); } });
    toastEl = el("div", { id: "kapu-toast", role: "status", "aria-live": "polite" });
    document.body.appendChild(fab);
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    document.body.appendChild(toastEl);
    render();
  }

  window.KAPU = {
    complete: complete,
    open: open,
    norm: norm,
    count: function () { var f = readFound(); return ITEMS.filter(function (it) { return f[it.id]; }).length; }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
