/* Public site: "Report a problem" form, the home-page household count-up, and the
 * "next update" countdown.  MOCK SITE FOR TRAINING. Everything here is cosmetic or a
 * training stand-in; nothing is sent anywhere. */
(function () {
  'use strict';

  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Report a problem (emergency.html)
  var form = document.getElementById('report-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var out = document.getElementById('report-result');
      out.hidden = false;
      out.className = 'notice notice--ok';
      out.textContent = 'Thank you. A Public Works dispatcher will follow up. (Training site: nothing was sent.)';
      form.reset();
    });
  }

  // Home page: the household number counts up to 14,000 over 1.4 s (quartic ease-out).
  var hh = document.getElementById('households');
  if (hh) {
    var target = 14000;
    if (reduced) {
      hh.textContent = target.toLocaleString('en-US');
    } else {
      var start = null, dur = 1400;
      hh.textContent = '0';
      var step = function (ts) {
        if (start === null) { start = ts; }
        var t = Math.min(1, (ts - start) / dur);
        var e = 1 - Math.pow(1 - t, 4);
        hh.textContent = Math.round(target * e).toLocaleString('en-US');
        if (t < 1) { requestAnimationFrame(step); }
      };
      requestAnimationFrame(step);
    }
  }

  // Home page: "Next mm:ss" until the plant's next 15-minute status push.
  var nx = document.getElementById('next-update');
  if (nx) {
    var t0 = Date.now();
    var tick = function () {
      var elapsed = Math.floor((Date.now() - t0) / 1000);
      var remain = 702 - (elapsed % 900);
      if (remain < 0) { remain += 900; }
      var mm = String(Math.floor(remain / 60)).padStart(2, '0');
      var ss = String(remain % 60).padStart(2, '0');
      nx.textContent = mm + ':' + ss;
    };
    tick();
    setInterval(tick, 1000);
  }
})();
