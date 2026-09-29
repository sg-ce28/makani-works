/* Mailbox export viewer. Links are shown as text and never opened.  MOCK SITE FOR TRAINING. */
(function () {
  'use strict';
  if (!MC.requireSession('mailbox.html')) { return; }

  var emails = MC.DATA.emails.slice().reverse();  // newest first
  var list = document.getElementById('mail-list');
  var view = document.getElementById('mail-view');
  var empty = document.getElementById('mail-empty');

  list.innerHTML = emails.map(function (m) {
    return '<li data-id="' + m.id + '">' +
      '<div class="from">' + MC.esc(m.from.replace(/<.*$/, '').trim()) + '</div>' +
      '<div class="subj">' + MC.esc(m.subject) + '</div>' +
      '<div class="when">' + MC.esc(m.t) + '</div>' +
      '</li>';
  }).join('');

  function header(label, value) {
    return '<div><dt>' + label + '</dt><dd class="mono" style="margin:0">' + MC.esc(value || '(none)') + '</dd></div>';
  }

  function show(id) {
    var m = null;
    emails.forEach(function (x) { if (x.id === id) { m = x; } });
    if (!m) { return; }
    var items = list.querySelectorAll('li');
    for (var k = 0; k < items.length; k++) {
      items[k].classList.toggle('is-selected', Number(items[k].getAttribute('data-id')) === id);
    }
    var links = '';
    if (m.links.length) {
      links = '<h3 style="margin-top:1rem">Links in this message</h3>' +
        '<div class="table-wrap"><table class="linkrow"><thead><tr><th>Text shown</th><th>Actually goes to</th></tr></thead><tbody>' +
        m.links.map(function (l) {
          return '<tr><td class="mono">' + MC.esc(l.text) + '</td><td class="mono">' + MC.esc(l.href) + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<p class="hint">Links are listed for review only. This viewer never opens them.</p>';
    }
    view.innerHTML =
      '<dl class="mail__headers">' +
        header('From', m.from) + header('Reply-To', m.replyTo) + header('To', m.to) +
        header('Date', m.t + ' HST') + header('Subject', m.subject) +
      '</dl>' +
      '<div class="mail__body">' + MC.esc(m.body) + '</div>' + links;
    view.hidden = false;
    empty.hidden = true;
  }

  list.addEventListener('click', function (ev) {
    var li = ev.target.closest('li[data-id]');
    if (li) { show(Number(li.getAttribute('data-id'))); }
  });
})();
