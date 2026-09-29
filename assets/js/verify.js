/* The attacker's planted "verification" page. The form sends nothing anywhere.  MOCK SITE FOR TRAINING. */
(function () {
  'use strict';
  var form = document.getElementById('verify-form');
  if (!form) { return; }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var out = document.getElementById('verify-result');
    out.hidden = false;
    out.className = 'notice notice--bad';
    out.textContent = 'Training site: this page was planted by the attacker. Nothing you typed was sent anywhere. ' +
      'A real county page never asks for your password and payment card together, and this page was not linked from anywhere until 2:21 AM.';
  });
})();
