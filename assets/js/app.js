/* Makani County incident console - shared session + helpers.  MOCK SITE FOR TRAINING.
 * The responder sign-in is simulated in the browser so the exercise runs from a folder.
 */

window.MC = window.MC || {};

(function () {
  'use strict';

  var KEY = 'mc_responder_session';

  // Responder account handed out by IT for incident IR-2026-014 (see README).
  var RESPONDER = { user: 'responder', pass: 'Respond-2026', name: 'Incident responder', role: 'read-only' };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function readSession() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }

  function requireSession(activeTab) {
    var s = readSession();
    if (!s) { location.replace('login.html'); return null; }
    var who = document.getElementById('who');
    if (who) { who.textContent = s.name + ' (' + s.role + ')'; }
    var logout = document.getElementById('logout');
    if (logout) {
      logout.addEventListener('click', function (ev) {
        ev.preventDefault();
        localStorage.removeItem(KEY);
        location.href = 'login.html';
      });
    }
    if (activeTab) {
      var links = document.querySelectorAll('.tabs a');
      for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute('href') === activeTab) { links[i].classList.add('is-active'); }
      }
    }
    return s;
  }

  function initLogin() {
    var form = document.getElementById('login-form');
    if (!form) { return; }
    var err = document.getElementById('login-error');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var u = document.getElementById('username').value.trim();
      var p = document.getElementById('password').value;
      if (u === RESPONDER.user && p === RESPONDER.pass) {
        localStorage.setItem(KEY, JSON.stringify({ user: u, name: RESPONDER.name, role: RESPONDER.role }));
        location.href = 'dashboard.html';
      } else {
        err.hidden = false;
        err.textContent = 'Sign-in failed. Use the responder account from your README.';
      }
    });
  }

  function isCountyIp(ip) {
    return ip === '127.0.0.1' || ip.indexOf(MC.DATA.countyNetwork) === 0;
  }

  MC.esc = esc;
  MC.requireSession = requireSession;
  MC.initLogin = initLogin;
  MC.isCountyIp = isCountyIp;
})();
