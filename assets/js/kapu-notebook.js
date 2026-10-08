/* Kapu Field Notebook - training flag tracker.  MOCK SITE FOR TRAINING.
 *
 * Flags, answers, and bonus keywords are never stored in plain text. Everything
 * is protected with a salted, iterated SHA-256 (slow on purpose), so a value can
 * only be recovered by actually completing the task, and guessing in bulk costs a
 * slow hash per guess.
 *
 *   exact : the flag is encrypted under a slow hash of the answer. Enter the value
 *           you found and the flag decrypts.
 *   open  : a bonus question. Each keyword is stored only as a slow hash; the flag
 *           is split so it reconstructs only when enough real keywords appear in
 *           the answer. A short answer, or one missing too many points, can retry.
 *
 * Catalog: window.KAPU_CHALLENGES = { meta, items }.
 */
(function () {
  "use strict";
  if (window.__kapuNotebook) { return; }
  window.__kapuNotebook = true;

  /* ---------------- SHA-256 (sync, bytes -> 32 bytes) ---------------- */
  var SHA = (function () {
    var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
    var w = new Int32Array(64);
    return function (bytes) {
      var h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
      var l = bytes.length, withOne = l + 1, k = (56 - (withOne % 64) + 64) % 64, total = withOne + k + 8;
      var m = new Uint8Array(total); m.set(bytes, 0); m[l] = 0x80;
      var hi = Math.floor(l / 0x20000000), lo = (l * 8) >>> 0;
      m[total-4]=(lo>>>24)&0xff;m[total-3]=(lo>>>16)&0xff;m[total-2]=(lo>>>8)&0xff;m[total-1]=lo&0xff;
      m[total-8]=(hi>>>24)&0xff;m[total-7]=(hi>>>16)&0xff;m[total-6]=(hi>>>8)&0xff;m[total-5]=hi&0xff;
      for (var off = 0; off < total; off += 64) {
        for (var i = 0; i < 16; i++) w[i]=(m[off+i*4]<<24)|(m[off+i*4+1]<<16)|(m[off+i*4+2]<<8)|(m[off+i*4+3]);
        for (i = 16; i < 64; i++) {
          var s0=rotr(w[i-15],7)^rotr(w[i-15],18)^(w[i-15]>>>3);
          var s1=rotr(w[i-2],17)^rotr(w[i-2],19)^(w[i-2]>>>10);
          w[i]=(w[i-16]+s0+w[i-7]+s1)|0;
        }
        var a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,hh=h7;
        for (i = 0; i < 64; i++) {
          var S1=rotr(e,6)^rotr(e,11)^rotr(e,25), ch=(e&f)^(~e&g), t1=(hh+S1+ch+K[i]+w[i])|0;
          var S0=rotr(a,2)^rotr(a,13)^rotr(a,22), maj=(a&b)^(a&c)^(b&c), t2=(S0+maj)|0;
          hh=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;
        }
        h0=(h0+a)|0;h1=(h1+b)|0;h2=(h2+c)|0;h3=(h3+d)|0;h4=(h4+e)|0;h5=(h5+f)|0;h6=(h6+g)|0;h7=(h7+hh)|0;
      }
      var out = new Uint8Array(32), hs = [h0,h1,h2,h3,h4,h5,h6,h7];
      for (i = 0; i < 8; i++){out[i*4]=(hs[i]>>>24)&0xff;out[i*4+1]=(hs[i]>>>16)&0xff;out[i*4+2]=(hs[i]>>>8)&0xff;out[i*4+3]=hs[i]&0xff;}
      return out;
    };
  })();

  function utf8(s){ return new Uint8Array(unescape(encodeURIComponent(s)).split("").map(function(c){return c.charCodeAt(0);})); }
  function concat(a,b){ var o=new Uint8Array(a.length+b.length); o.set(a,0); o.set(b,a.length); return o; }
  function toHex(u){ var s=""; for(var i=0;i<u.length;i++){s+=("0"+u[i].toString(16)).slice(-2);} return s; }
  function fromHex(h){ var u=new Uint8Array(h.length/2); for(var i=0;i<u.length;i++){u[i]=parseInt(h.substr(i*2,2),16);} return u; }
  function bytesEq(a,b){ if(a.length!==b.length) return false; for(var i=0;i<a.length;i++) if(a[i]!==b[i]) return false; return true; }

  function kdf(inp, salt, iters){
    var sb = utf8(salt);
    var h = SHA(concat(concat(sb, utf8("|")), utf8(inp)));
    for (var i = 0; i < iters; i++){ h = SHA(concat(h, sb)); }
    return h;
  }
  function keystream(key, n){
    var out = new Uint8Array(n), ctr = 0, pos = 0;
    while (pos < n){
      var blk = SHA(concat(key, new Uint8Array([ctr & 0xff, (ctr >> 8) & 0xff])));
      for (var i = 0; i < blk.length && pos < n; i++){ out[pos++] = blk[i]; }
      ctr++;
    }
    return out;
  }
  function xorBytes(msg, key){ var o=new Uint8Array(msg.length); for(var i=0;i<msg.length;i++){o[i]=msg[i]^key[i];} return o; }
  function dec(hexCt, key){ var ct=fromHex(hexCt); return xorBytes(ct, keystream(key, ct.length)); }
  function chk(tag, key, data){ return toHex(SHA(concat(concat(utf8(tag), key), data)).subarray(0,4)); }
  function toStr(bytes){ var s=""; for(var i=0;i<bytes.length;i++){ s+=String.fromCharCode(bytes[i]); } return s; }

  /* ---------------- catalog ---------------- */
  var DATA = window.KAPU_CHALLENGES || { meta: {}, items: [] };
  var META = DATA.meta || {};
  var ITEMS = DATA.items || [];
  var IE = META.ie || 60000, IO = META.io || 3000;
  var STORE = "kapu_nb_" + (META.slug || "env");
  var DRAFT = "kapu_nb_draft_" + (META.slug || "env");

  function norm(s){
    return String(s==null?"":s).toLowerCase().trim().replace(/\s+/g," ").replace(/^["']|["']$/g,"").replace(/\.$/,"");
  }
  function tokenize(answer, ng){
    var words = norm(answer).split(" ").map(function(w){ return w.replace(/^[.,;:!?()"']+|[.,;:!?()"']+$/g,""); }).filter(Boolean);
    var set = {}, out = [];
    for (var n = 1; n <= ng; n++){
      for (var i = 0; i + n <= words.length; i++){
        var g = words.slice(i, i + n).join(" ");
        if (!set[g]){ set[g] = 1; out.push(g); if (out.length >= 320) return out; }
      }
    }
    return out;
  }

  function readFound(){ try{ return JSON.parse(localStorage.getItem(STORE)||"{}")||{}; }catch(e){ return {}; } }
  function writeFound(f){ try{ localStorage.setItem(STORE, JSON.stringify(f)); }catch(e){} }
  function readDrafts(){ try{ return JSON.parse(localStorage.getItem(DRAFT)||"{}")||{}; }catch(e){ return {}; } }
  function writeDrafts(d){ try{ localStorage.setItem(DRAFT, JSON.stringify(d)); }catch(e){} }

  var byId = {};
  ITEMS.forEach(function(it){ byId[it.id] = it; });

  function complete(id, answer){
    var it = byId[id];
    if (!it || it.type === "open") return "unknown";
    var found = readFound();
    if (found[id]) return "already";
    var key = kdf(norm(answer), it.salt, IE);
    var flag = toStr(dec(it.f, key));
    if (flag.indexOf("FLAG{") !== 0) return "wrong";
    found[id] = flag; writeFound(found); render();
    toast("Flag captured - " + it.code + ": " + flag);
    return "ok";
  }

  function completeOpen(id, answer){
    var it = byId[id];
    if (!it || it.type !== "open") return { state:"unknown" };
    var found = readFound();
    if (found[id]) return { state:"already" };
    if (norm(answer).length < (it.minlen || 150)) return { state:"short" };
    var cands = tokenize(answer, it.ng || 3);
    var matched = {};              // group index -> G bytes
    for (var t = 0; t < cands.length; t++){
      var ck = kdf(cands[t], it.salt, IO);
      for (var gi = 0; gi < it.groups.length; gi++){
        if (matched[gi]) continue;
        var entries = it.groups[gi];
        for (var ei = 0; ei < entries.length; ei++){
          var G = dec(entries[ei].e, ck);
          if (chk("grp", ck, G) === entries[ei].c){ matched[gi] = G; break; }
        }
      }
    }
    var mk = Object.keys(matched);
    if (mk.length < it.need) return { state:"insufficient", count: mk.length, need: it.need };
    for (var si = 0; si < it.subsets.length; si++){
      var sub = it.subsets[si];
      var ok = true;
      for (var j = 0; j < sub.g.length; j++){ if (!matched[sub.g[j]]){ ok = false; break; } }
      if (!ok) continue;
      var parts = sub.g.map(function(i){ return toHex(matched[i]); }).join("|");
      var sk = kdf(parts, it.salt, 1);
      var fk = dec(sub.e, sk);
      if (chk("sub", sk, fk) !== sub.c) continue;
      var flag = toStr(dec(it.ef, fk));
      if (flag.indexOf("FLAG{") !== 0) continue;
      found[id] = flag; writeFound(found); render();
      toast("Bonus flag captured - " + it.code + ": " + flag);
      return { state:"ok" };
    }
    return { state:"insufficient", count: mk.length, need: it.need };
  }

  /* ---------------- UI ---------------- */
  var ACCENT=META.accent||"#2f7ea5",PBG=META.panelBg||"#10151f",PINK=META.panelInk||"#eef2f8",
      PMUT=META.panelMuted||"#9aa6bb",PCARD=META.panelCard||"#172031",PLINE=META.panelLine||"#28344a";
  var DIFFC={Easy:"#3bb273",Medium:"#e0a53b",Hard:"#e0574b"}, BONUS="#c98bdb";
  function el(tag,attrs,html){var e=document.createElement(tag);if(attrs){for(var k in attrs){e.setAttribute(k,attrs[k]);}}if(html!=null){e.innerHTML=html;}return e;}
  function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  var panel,backdrop,fab,toastEl,toastTimer;

  function injectStyle(){
    if (document.getElementById("kapu-nb-style")) return;
    var css=""+
      "#kapu-fab{position:fixed;right:18px;bottom:18px;z-index:2147483000;display:inline-flex;align-items:center;gap:9px;padding:11px 16px;border-radius:999px;border:0;cursor:pointer;font:600 13px/1 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:"+ACCENT+";color:#fff;box-shadow:0 4px 18px rgba(0,0,0,.28);}"+
      "#kapu-fab:hover{filter:brightness(1.07);}#kapu-fab .kapu-count{background:rgba(255,255,255,.22);border-radius:999px;padding:2px 8px;font-variant-numeric:tabular-nums;}"+
      "#kapu-backdrop{position:fixed;inset:0;z-index:2147483100;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .2s;}#kapu-backdrop.open{opacity:1;pointer-events:auto;}"+
      "#kapu-panel{position:fixed;top:0;right:0;bottom:0;z-index:2147483200;width:min(460px,94vw);transform:translateX(102%);transition:transform .24s cubic-bezier(.2,.7,.2,1);background:"+PBG+";color:"+PINK+";font:14px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;display:flex;flex-direction:column;box-shadow:-8px 0 30px rgba(0,0,0,.4);padding-top:env(safe-area-inset-top,0);}#kapu-panel.open{transform:none;}"+
      "#kapu-panel .kapu-hd{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid "+PLINE+";}#kapu-panel .kapu-hd h2{margin:0;font:700 16px/1.2 system-ui,sans-serif;}#kapu-panel .kapu-hd small{display:block;color:"+PMUT+";font-weight:400;font-size:12px;margin-top:3px;}"+
      "#kapu-panel .kapu-x{background:none;border:0;color:"+PMUT+";font-size:22px;line-height:1;cursor:pointer;padding:4px 8px;}#kapu-panel .kapu-x:hover{color:"+PINK+";}"+
      "#kapu-prog{padding:12px 20px;border-bottom:1px solid "+PLINE+";color:"+PMUT+";font-size:12.5px;}#kapu-prog b{color:"+PINK+";}#kapu-prog .kapu-bar{height:6px;border-radius:3px;background:"+PLINE+";margin-top:8px;overflow:hidden;}#kapu-prog .kapu-bar i{display:block;height:100%;background:"+ACCENT+";transition:width .3s;}"+
      "#kapu-list{overflow:auto;padding:12px 16px 24px;flex:1;}"+
      ".kapu-item{border:1px solid "+PLINE+";background:"+PCARD+";border-radius:10px;padding:13px 14px;margin-bottom:11px;}.kapu-item.kapu-bonus{border-color:"+BONUS+";}"+
      ".kapu-item .kapu-top{display:flex;align-items:center;gap:9px;margin-bottom:6px;flex-wrap:wrap;}.kapu-item .kapu-code{font:700 12px/1 ui-monospace,Menlo,Consolas,monospace;color:"+ACCENT+";}"+
      ".kapu-item .kapu-diff{font:600 10px/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:3px 7px;border-radius:999px;border:1px solid;}"+
      ".kapu-item .kapu-tag{font:600 10px/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:3px 7px;border-radius:999px;border:1px solid "+BONUS+";color:"+BONUS+";}"+
      ".kapu-item .kapu-ttl{font-weight:600;margin:0 0 5px;}.kapu-item .kapu-obj{color:"+PMUT+";font-size:13px;margin:0 0 10px;}"+
      ".kapu-form{display:flex;gap:8px;}.kapu-form input{flex:1;min-width:0;background:"+PBG+";border:1px solid "+PLINE+";border-radius:7px;color:"+PINK+";padding:9px 10px;font:13px ui-monospace,Menlo,Consolas,monospace;}"+
      ".kapu-open{width:100%;box-sizing:border-box;min-height:118px;resize:vertical;background:"+PBG+";border:1px solid "+PLINE+";border-radius:7px;color:"+PINK+";padding:10px;font:13px/1.5 system-ui,sans-serif;}"+
      ".kapu-form input:focus,.kapu-open:focus{outline:2px solid "+ACCENT+";outline-offset:1px;}"+
      ".kapu-open-row{display:flex;align-items:center;gap:10px;margin-top:8px;}.kapu-btn{background:"+ACCENT+";border:0;border-radius:7px;color:#fff;padding:9px 14px;font:600 13px system-ui,sans-serif;cursor:pointer;}.kapu-btn[disabled]{opacity:.55;cursor:default;}.kapu-form button{background:"+ACCENT+";border:0;border-radius:7px;color:#fff;padding:9px 14px;font:600 13px system-ui,sans-serif;cursor:pointer;}.kapu-form button[disabled]{opacity:.55;cursor:default;}"+
      ".kapu-disc{color:"+PMUT+";font-size:11.5px;line-height:1.5;margin:9px 0 0;padding:9px 11px;border-left:2px solid "+BONUS+";background:rgba(201,139,219,.08);border-radius:0 6px 6px 0;}"+
      ".kapu-msg{font-size:12px;margin-top:7px;min-height:14px;}.kapu-msg.bad{color:#ff8a7a;}.kapu-msg.work{color:"+PMUT+";}"+
      ".kapu-found .kapu-flag{font:600 13px/1.4 ui-monospace,Menlo,Consolas,monospace;color:"+PINK+";background:"+PBG+";border:1px solid "+ACCENT+";border-radius:7px;padding:8px 10px;overflow-wrap:anywhere;}"+
      ".kapu-found .kapu-learned{color:"+PMUT+";font-size:13px;margin:9px 0 0;}.kapu-found .kapu-learned b{color:"+PINK+";font-weight:600;}"+
      ".kapu-check{color:"+DIFFC.Easy+";font-weight:700;margin-left:auto;font-size:12px;}"+
      "#kapu-foot{padding:10px 16px calc(14px + env(safe-area-inset-bottom,0));border-top:1px solid "+PLINE+";}#kapu-export{width:100%;background:transparent;border:1px solid "+PLINE+";color:"+PINK+";border-radius:7px;padding:9px;font:600 12.5px system-ui,sans-serif;cursor:pointer;}#kapu-export:hover{border-color:"+ACCENT+";}"+
      "#kapu-toast{position:fixed;left:50%;bottom:78px;transform:translateX(-50%) translateY(14px);z-index:2147483300;opacity:0;transition:opacity .25s,transform .25s;background:"+PCARD+";color:"+PINK+";border:1px solid "+ACCENT+";border-radius:10px;padding:12px 16px;font:600 13px system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.35);max-width:90vw;text-align:center;}#kapu-toast.show{opacity:1;transform:translateX(-50%);}"+
      "@media (prefers-reduced-motion:reduce){#kapu-panel,#kapu-backdrop,#kapu-toast{transition:none;}}";
    var st=el("style",{id:"kapu-nb-style"}); st.textContent=css; document.head.appendChild(st);
  }
  function open(){ backdrop.classList.add("open"); panel.classList.add("open"); render(); }
  function close(){ backdrop.classList.remove("open"); panel.classList.remove("open"); }
  function toast(msg){ if(!toastEl)return; toastEl.textContent=msg; toastEl.classList.add("show"); if(toastTimer)clearTimeout(toastTimer); toastTimer=setTimeout(function(){toastEl.classList.remove("show");},4200); }

  function render(){
    var found=readFound(), drafts=readDrafts();
    var n=ITEMS.filter(function(it){return found[it.id];}).length, total=ITEMS.length;
    if(fab) fab.innerHTML='<span>Field Notebook</span><span class="kapu-count">'+n+"/"+total+"</span>";
    if(!panel||!panel.classList.contains("open")) return;
    var prog=document.getElementById("kapu-prog");
    if(prog) prog.innerHTML="<b>"+n+"</b> of <b>"+total+"</b> flags captured"+'<div class="kapu-bar"><i style="width:'+(total?Math.round(n/total*100):0)+'%"></i></div>';
    var list=document.getElementById("kapu-list"); list.innerHTML="";
    ITEMS.forEach(function(it){
      var isOpen=it.type==="open", dc=DIFFC[it.diff]||PMUT;
      var card=el("div",{"class":"kapu-item"+(found[it.id]?" kapu-found":"")+(isOpen?" kapu-bonus":"")});
      var top='<div class="kapu-top"><span class="kapu-code">'+esc(it.code)+'</span><span class="kapu-diff" style="color:'+dc+';border-color:'+dc+'">'+esc(it.diff)+"</span>"+(isOpen?'<span class="kapu-tag">Bonus</span>':"")+(found[it.id]?'<span class="kapu-check">\u2713 captured</span>':"")+"</div>";
      var body='<p class="kapu-ttl">'+esc(it.title)+"</p>";
      if(found[it.id]){
        body+='<div class="kapu-flag">'+esc(found[it.id])+"</div>"+'<p class="kapu-learned"><b>What you learned:</b> '+esc(it.learned)+"</p>";
      } else if(isOpen){
        body+='<p class="kapu-obj">'+esc(it.objective)+"</p>"+'<textarea class="kapu-open" data-open="'+esc(it.id)+'" placeholder="Write your answer here. Address the question in full; a brief answer will not pass.">'+esc(drafts[it.id]||"")+"</textarea>"+'<div class="kapu-open-row"><button class="kapu-btn" type="button" data-submit="'+esc(it.id)+'">Submit answer</button></div>'+'<div class="kapu-msg" data-msg="'+esc(it.id)+'"></div>'+'<p class="kapu-disc">'+esc(it.disclaimer||"")+"</p>";
      } else {
        body+='<p class="kapu-obj">'+esc(it.objective)+"</p>"+'<div class="kapu-form"><input type="text" placeholder="Enter what you found" autocomplete="off" spellcheck="false" data-id="'+esc(it.id)+'"><button type="button" data-id="'+esc(it.id)+'">Log</button></div>'+'<div class="kapu-msg" data-msg="'+esc(it.id)+'"></div>';
      }
      card.innerHTML=top+body; list.appendChild(card);
    });
    Array.prototype.forEach.call(list.querySelectorAll(".kapu-form button"),function(b){b.addEventListener("click",function(){submitExact(b.getAttribute("data-id"));});});
    Array.prototype.forEach.call(list.querySelectorAll(".kapu-form input"),function(inp){inp.addEventListener("keydown",function(e){if(e.key==="Enter")submitExact(inp.getAttribute("data-id"));});});
    Array.prototype.forEach.call(list.querySelectorAll(".kapu-open"),function(ta){ta.addEventListener("input",function(){var d=readDrafts();d[ta.getAttribute("data-open")]=ta.value;writeDrafts(d);});});
    Array.prototype.forEach.call(list.querySelectorAll("[data-submit]"),function(b){b.addEventListener("click",function(){submitOpen(b.getAttribute("data-submit"));});});
  }

  function setMsg(id, text, cls){ var m=document.querySelector('[data-msg="'+id+'"]'); if(m){ m.textContent=text; m.className="kapu-msg "+(cls||""); } }

  function submitExact(id){
    var inp=document.querySelector('.kapu-form input[data-id="'+id+'"]'); if(!inp) return;
    var val=inp.value, btn=document.querySelector('.kapu-form button[data-id="'+id+'"]');
    if(btn) btn.disabled=true; setMsg(id,"Checking...","work");
    setTimeout(function(){
      var r=complete(id,val);
      if(r==="wrong"){ setMsg(id,"Not quite - recheck what the task asks for.","bad"); if(btn) btn.disabled=false; }
    },20);
  }
  function submitOpen(id){
    var ta=document.querySelector('.kapu-open[data-open="'+id+'"]'); if(!ta) return;
    var val=ta.value, btn=document.querySelector('[data-submit="'+id+'"]');
    if(btn) btn.disabled=true; setMsg(id,"Checking your answer...","work");
    setTimeout(function(){
      var r=completeOpen(id,val);
      if(r.state==="short"){ setMsg(id,"Your answer is too brief. Address the question in depth, then submit again.","bad"); if(btn) btn.disabled=false; }
      else if(r.state==="insufficient"){ setMsg(id,"Your answer reached "+r.count+" of the "+r.need+" key points this question needs. Add more detail and submit again, or send it to staff (see note below).","bad"); if(btn) btn.disabled=false; }
    },20);
  }

  function exportAnswers(){
    var found=readFound(), drafts=readDrafts();
    var lines=["BONUS ANSWERS - "+(META.title||""),"Environment: "+(META.slug||""),new Array(61).join("=")];
    ITEMS.forEach(function(it){ if(it.type!=="open")return;
      lines.push(""); lines.push(it.code+"  "+it.title);
      lines.push("Status: "+(found[it.id]?("captured "+found[it.id]):"not yet accepted"));
      lines.push("Answer:"); lines.push(drafts[it.id]||"(no answer saved)"); lines.push(new Array(61).join("-"));
    });
    var blob=new Blob([lines.join("\n")],{type:"text/plain"}), a=document.createElement("a");
    a.href=URL.createObjectURL(blob); a.download="bonus-answers-"+(META.slug||"env")+".txt";
    document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1000);
  }

  function mount(){
    injectStyle();
    fab=el("button",{id:"kapu-fab",type:"button","aria-label":"Open Field Notebook"}); fab.addEventListener("click",open);
    backdrop=el("div",{id:"kapu-backdrop"}); backdrop.addEventListener("click",close);
    panel=el("aside",{id:"kapu-panel",role:"dialog","aria-label":"Field Notebook"});
    var hasOpen=ITEMS.some(function(it){return it.type==="open";});
    panel.innerHTML='<div class="kapu-hd"><div><h2>Field Notebook</h2><small>'+esc(META.title||"Challenges")+" \u00b7 flags you capture are saved here</small></div><button class=\"kapu-x\" type=\"button\" aria-label=\"Close\">\u00d7</button></div><div id=\"kapu-prog\"></div><div id=\"kapu-list\"></div>"+(hasOpen?'<div id="kapu-foot"><button id="kapu-export" type="button">Export my bonus answers (for staff review)</button></div>':"");
    panel.querySelector(".kapu-x").addEventListener("click",close);
    if(hasOpen) panel.querySelector("#kapu-export").addEventListener("click",exportAnswers);
    document.addEventListener("keydown",function(e){if(e.key==="Escape")close();});
    toastEl=el("div",{id:"kapu-toast",role:"status","aria-live":"polite"});
    document.body.appendChild(fab);document.body.appendChild(backdrop);document.body.appendChild(panel);document.body.appendChild(toastEl);
    render();
  }

  window.KAPU={ complete:complete, completeOpen:completeOpen, open:open, norm:norm, count:function(){var f=readFound();return ITEMS.filter(function(it){return f[it.id];}).length;} };
  if(document.readyState==="loading"){ document.addEventListener("DOMContentLoaded",mount); } else { mount(); }
})();
