/* Audit log viewer.  MOCK SITE FOR TRAINING. */
(function () {
  'use strict';
  if (!MC.requireSession('audit.html')) { return; }

  var rows = MC.DATA.audit;
  var tbody = document.getElementById('audit-body');
  var q = document.getElementById('f-q');
  var userSel = document.getElementById('f-user');
  var failOnly = document.getElementById('f-fail');
  var outsideOnly = document.getElementById('f-outside');
  var count = document.getElementById('audit-count');

  // Populate the user filter.
  var users = {};
  rows.forEach(function (r) { users[r.user] = true; });
  Object.keys(users).sort().forEach(function (u) {
    var o = document.createElement('option');
    o.value = u; o.textContent = u;
    userSel.appendChild(o);
  });

  function render() {
    var needle = q.value.trim().toLowerCase();
    var html = '';
    var shown = 0;
    rows.forEach(function (r) {
      if (userSel.value && r.user !== userSel.value) { return; }
      if (failOnly.checked && r.ok) { return; }
      if (outsideOnly.checked && MC.isCountyIp(r.ip)) { return; }
      var hay = (r.t + ' ' + r.user + ' ' + r.ip + ' ' + r.action + ' ' + r.detail).toLowerCase();
      if (needle && hay.indexOf(needle) === -1) { return; }
      shown++;
      html += '<tr class="' + (r.ok ? '' : 'is-fail') + '">' +
        '<td class="mono">' + MC.esc(r.t) + '</td>' +
        '<td class="mono">' + MC.esc(r.user) + '</td>' +
        '<td class="mono">' + MC.esc(r.ip) + '</td>' +
        '<td>' + MC.esc(r.action) + '</td>' +
        '<td>' + MC.esc(r.detail) + '</td>' +
        '<td>' + (r.ok ? '<span class="badge badge--ok">ok</span>' : '<span class="badge badge--bad">failed / denied</span>') + '</td>' +
        '</tr>';
    });
    tbody.innerHTML = html || '<tr><td colspan="6" class="muted">No events match these filters.</td></tr>';
    count.textContent = shown + ' of ' + rows.length + ' events';
  }

  [q, userSel, failOnly, outsideOnly].forEach(function (el) {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  document.getElementById('f-clear').addEventListener('click', function () {
    q.value = ''; userSel.value = ''; failOnly.checked = false; outsideOnly.checked = false; render();
  });
  render();
})();
