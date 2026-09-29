/* Content revision history with a before/after comparison.  MOCK SITE FOR TRAINING. */
(function () {
  'use strict';
  if (!MC.requireSession('revisions.html')) { return; }

  var revs = MC.DATA.revisions.slice().reverse();   // newest first
  var tbody = document.getElementById('rev-body');
  var panel = document.getElementById('rev-diff');
  var title = document.getElementById('rev-title');
  var beforeEl = document.getElementById('rev-before');
  var afterEl = document.getElementById('rev-after');
  var metaEl = document.getElementById('rev-meta');

  tbody.innerHTML = revs.map(function (r) {
    return '<tr class="clickable" data-id="' + r.id + '">' +
      '<td class="mono">' + r.id + '</td>' +
      '<td class="mono">' + MC.esc(r.t) + '</td>' +
      '<td class="mono">' + MC.esc(r.user) + '</td>' +
      '<td>' + MC.esc(r.page) + '</td>' +
      '<td>' + MC.esc(r.note) + '</td>' +
      '<td><button class="btn btn--ghost btn--sm" type="button">Compare</button></td>' +
      '</tr>';
  }).join('');

  // Word-level diff (longest common subsequence). Texts are short, so this is fine.
  function diffWords(a, b) {
    var A = a.split(/(\s+)/).filter(function (w) { return w !== ''; });
    var B = b.split(/(\s+)/).filter(function (w) { return w !== ''; });
    var n = A.length, m = B.length, i, j;
    var L = [];
    for (i = 0; i <= n; i++) { L.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i--) {
      for (j = m - 1; j >= 0; j--) {
        L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
      }
    }
    var outA = '', outB = '';
    i = 0; j = 0;
    while (i < n && j < m) {
      if (A[i] === B[j]) { outA += MC.esc(A[i]); outB += MC.esc(B[j]); i++; j++; }
      else if (L[i + 1][j] >= L[i][j + 1]) { outA += '<span class="del">' + MC.esc(A[i]) + '</span>'; i++; }
      else { outB += '<span class="ins">' + MC.esc(B[j]) + '</span>'; j++; }
    }
    while (i < n) { outA += '<span class="del">' + MC.esc(A[i]) + '</span>'; i++; }
    while (j < m) { outB += '<span class="ins">' + MC.esc(B[j]) + '</span>'; j++; }
    return { a: outA, b: outB };
  }

  function show(id) {
    var r = null;
    revs.forEach(function (x) { if (x.id === id) { r = x; } });
    if (!r) { return; }
    var rows = tbody.querySelectorAll('tr');
    for (var k = 0; k < rows.length; k++) {
      rows[k].classList.toggle('is-selected', Number(rows[k].getAttribute('data-id')) === id);
    }
    var d = diffWords(r.before, r.after);
    title.textContent = 'Revision ' + r.id + ': ' + r.page;
    metaEl.textContent = r.t + ' by ' + r.user + (r.note ? ' (note: "' + r.note + '")' : '');
    beforeEl.innerHTML = d.a || '<span class="muted">(empty: this revision created the item)</span>';
    afterEl.innerHTML = d.b;
    panel.hidden = false;
    panel.scrollIntoView({ block: 'nearest' });
  }

  tbody.addEventListener('click', function (ev) {
    var tr = ev.target.closest('tr[data-id]');
    if (tr) { show(Number(tr.getAttribute('data-id'))); }
  });

  var hash = Number((location.hash || '').replace('#rev', ''));
  if (hash) { show(hash); }
})();
