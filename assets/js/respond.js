/* Response plan builder.  MOCK SITE FOR TRAINING.
 * Students pick containment and recovery actions. The page checks the plan against
 * what the evidence supports and produces a summary for the incident report. */
(function () {
  'use strict';
  if (!MC.requireSession('respond.html')) { return; }

  // kind: 'essential' = required to stop the attack; 'good' = sound recovery step;
  //       'harmful' = would hurt residents, destroy evidence, or repeat the attacker's trick.
  var ACTIONS = [
    { id: 'a1',  kind: 'essential', text: 'Disable the svc_backup account.' },
    { id: 'a2',  kind: 'essential', text: "Reset Noelani Kahale's password and end all of her active sessions." },
    { id: 'a3',  kind: 'essential', text: 'Undo revisions 41, 42 and 43 so the home page banner, Emergency contacts and Pay your bill pages show their text from before 2:00 AM.' },
    { id: 'a4',  kind: 'essential', text: 'Remove the uploaded verify.html page from the public site.' },
    { id: 'a5',  kind: 'essential', text: 'Disable the "Nightly contact sync" scheduled task.' },
    { id: 'a6',  kind: 'good',      text: 'Block 203.0.113.57 at the county firewall.' },
    { id: 'a7',  kind: 'good',      text: 'Take a copy of the audit log, the mailbox and the web server logs before anything is changed.' },
    { id: 'a8',  kind: 'good',      text: 'Post a notice for residents: the red banner was false, the correct emergency number is 808-555-0150, and the county never asks for card details by phone.' },
    { id: 'a9',  kind: 'good',      text: 'Tell residents whose contact records were exported, following county policy and state law.' },
    { id: 'a10', kind: 'good',      text: 'Turn on multi-factor authentication for every editor and admin account.' },
    { id: 'a11', kind: 'good',      text: 'Ask Customer Service to call back the resident from ticket #4471 and check whether anyone entered details on the fake page.' },
    { id: 'a12', kind: 'harmful',   text: 'Delete the audit log so the attacker cannot read it.' },
    { id: 'a13', kind: 'harmful',   text: 'Wipe and reinstall every county server tonight.' },
    { id: 'a14', kind: 'harmful',   text: "Post the attacker's IP address and the svc_backup details on the public home page so residents know." },
    { id: 'a15', kind: 'harmful',   text: 'Email all staff a link to reset their passwords right now.' },
    { id: 'a16', kind: 'harmful',   text: 'Shut down the treatment plant control system as a precaution.' }
  ];

  // Present the options in a fixed shuffled order so the kinds are not grouped.
  var ORDER = ['a7', 'a12', 'a1', 'a8', 'a13', 'a2', 'a10', 'a14', 'a5', 'a3', 'a15', 'a6', 'a16', 'a4', 'a11', 'a9'];

  var list = document.getElementById('plan-list');
  list.innerHTML = ORDER.map(function (id) {
    var a = ACTIONS.filter(function (x) { return x.id === id; })[0];
    return '<label class="check"><input type="checkbox" value="' + a.id + '"> <span>' + MC.esc(a.text) + '</span></label>';
  }).join('');

  var form = document.getElementById('plan-form');
  var result = document.getElementById('plan-result');
  var summary = document.getElementById('plan-summary');

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var chosen = [].slice.call(list.querySelectorAll('input:checked')).map(function (i) { return i.value; });
    var byId = {};
    ACTIONS.forEach(function (a) { byId[a.id] = a; });
    var essentials = ACTIONS.filter(function (a) { return a.kind === 'essential'; });
    var missing = essentials.filter(function (a) { return chosen.indexOf(a.id) === -1; }).length;
    var harmful = chosen.filter(function (id) { return byId[id].kind === 'harmful'; }).length;
    var good = chosen.filter(function (id) { return byId[id].kind === 'good'; }).length;

    var msg, cls;
    if (missing === 0 && harmful === 0) {
      cls = 'alert--ok';
      msg = 'Solid plan. Every foothold the attacker created is closed and nothing in the plan would hurt residents or destroy evidence. ' +
            'FLAG{contain-then-recover}' + (good < 4 ? ' Consider whether recovery and communication steps are complete.' : '');
    } else {
      cls = 'alert--warn';
      msg = 'Not yet. ';
      if (missing) { msg += missing + ' thing(s) the attacker set up or took over would still be active. Walk the evidence again: accounts, content, uploads, tasks. '; }
      if (harmful) { msg += harmful + ' chosen action(s) would harm residents, destroy evidence, or repeat the trick that started this incident.'; }
    }
    result.hidden = false;
    result.className = 'alert ' + cls + ' plan-result';
    result.textContent = msg;

    var name = (document.getElementById('plan-name').value || 'Responder').trim();
    summary.hidden = false;
    summary.textContent = 'INCIDENT IR-2026-014 RESPONSE PLAN\nPrepared by: ' + name + '\n\n' +
      (chosen.length ? chosen.map(function (id, i) { return (i + 1) + '. ' + byId[id].text; }).join('\n') : '(no actions selected)') +
      '\n\nCopy this into section 5 of your incident report.';
  });
})();
