/* Renders the Accounts, Tasks, Plant controls and Overview pages from the evidence data.
 * MOCK SITE FOR TRAINING. */
(function () {
  'use strict';
  var here = location.pathname.split('/').pop() || 'dashboard.html';
  if (!MC.requireSession(here)) { return; }
  var D = MC.DATA;

  function badgeRole(role) {
    var cls = role === 'admin' ? 'badge--bad' : role === 'operator' ? 'badge--warn' : role === 'read-only' ? 'badge--muted' : 'badge--blue';
    return '<span class="badge ' + cls + '">' + MC.esc(role) + '</span>';
  }

  var usersBody = document.getElementById('users-body');
  if (usersBody) {
    usersBody.innerHTML = D.users.map(function (u) {
      return '<tr>' +
        '<td class="mono">' + MC.esc(u.user) + '</td>' +
        '<td>' + MC.esc(u.name) + '<br><small class="muted">' + MC.esc(u.dept) + '</small></td>' +
        '<td>' + badgeRole(u.role) + '</td>' +
        '<td class="mono">' + MC.esc(u.created) + '<br><small class="muted">by ' + MC.esc(u.createdBy) + '</small></td>' +
        '<td class="mono">' + MC.esc(u.lastLogin) + '<br><small class="muted">' + MC.esc(u.lastIp) + '</small></td>' +
        '<td>' + (u.mfa ? '<span class="badge badge--ok">on</span>' : '<span class="badge badge--muted">off</span>') + '</td>' +
        '<td>' + MC.esc(u.note) + '</td>' +
        '</tr>';
    }).join('');
  }

  var tasksBody = document.getElementById('tasks-body');
  if (tasksBody) {
    tasksBody.innerHTML = D.tasks.map(function (t) {
      return '<tr>' +
        '<td><strong>' + MC.esc(t.name) + '</strong><br><small class="muted">' + MC.esc(t.desc) + '</small></td>' +
        '<td class="mono">' + MC.esc(t.created) + '<br><small class="muted">by ' + MC.esc(t.createdBy) + '</small></td>' +
        '<td>' + MC.esc(t.schedule) + '</td>' +
        '<td>' + MC.esc(t.action) + '</td>' +
        '<td class="mono">' + MC.esc(t.lastRun) + '<br><small>' + MC.esc(t.lastResult) + '</small></td>' +
        '</tr>';
    }).join('');
  }

  var uploadsBody = document.getElementById('uploads-body');
  if (uploadsBody) {
    uploadsBody.innerHTML = D.uploads.map(function (f) {
      return '<tr><td class="mono">' + MC.esc(f.file) + '</td><td class="mono">' + MC.esc(f.t) + '</td><td class="mono">' + MC.esc(f.user) + '</td><td>' + MC.esc(f.size) + '</td><td>' + MC.esc(f.where) + '</td></tr>';
    }).join('');
  }

  var ctlBody = document.getElementById('controls-body');
  if (ctlBody) {
    ctlBody.innerHTML = D.controlAttempts.map(function (a) {
      var ok = a.result.indexOf('Allowed') === 0;
      return '<tr class="' + (ok ? '' : 'is-fail') + '"><td class="mono">' + MC.esc(a.t) + '</td><td class="mono">' + MC.esc(a.user) + '</td><td class="mono">' + MC.esc(a.ip) + '</td><td>' + MC.esc(a.result) + '</td></tr>';
    }).join('');
  }

  // Overview counters (everything since 02:00 on Sep 20, when the odd activity starts).
  var since = '2026-09-20 02:00';
  function put(id, v) { var el = document.getElementById(id); if (el) { el.textContent = v; } }
  put('n-revisions', D.revisions.filter(function (r) { return r.t >= since; }).length);
  put('n-accounts', D.users.filter(function (u) { return u.created >= since; }).length);
  put('n-tasks', D.tasks.filter(function (t) { return t.created >= since; }).length);
  put('n-denied', D.audit.filter(function (e) { return !e.ok && e.t >= since; }).length);
  put('n-uploads', D.uploads.filter(function (f) { return f.t >= since; }).length);
  put('n-events', D.audit.length);
})();
