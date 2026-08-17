/* ─── AWS Guide Nav & Progress ───────────────────────────── */
(function () {
  var STORAGE_KEY = 'aws-guide-completed';
  var TOTAL = 12;

  function normalizeCompleted(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(function (id, idx, arr) {
      return /^ch(0\d|1[01])$/.test(id) && arr.indexOf(id) === idx;
    });
  }

  function getCompleted() {
    try {
      return normalizeCompleted(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch (e) {
      return [];
    }
  }

  function saveCompleted(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeCompleted(arr)));
  }

  function toggleChapter(id) {
    var list = getCompleted();
    var idx = list.indexOf(id);
    if (idx === -1) list.push(id);
    else list.splice(idx, 1);
    saveCompleted(list);
    return normalizeCompleted(list);
  }

  /* ── Update all progress UI ─────────────────────────── */
  function renderProgress(completed) {
    var unique = normalizeCompleted(completed);
    var done = Math.min(unique.length, TOTAL);
    var pct = Math.round((done / TOTAL) * 100);

    var fill = document.querySelector('.progress-fill');
    var label = document.querySelector('.progress-label');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = done + ' / ' + TOTAL + ' 챕터';

    var hFill = document.querySelector('.header-prog-fill');
    var hLabel = document.querySelector('.header-prog-label');
    if (hFill) hFill.style.width = pct + '%';
    if (hLabel) hLabel.textContent = pct + '%';

    document.querySelectorAll('.chapter-card[data-chapter-id]').forEach(function (card) {
      var chId = card.dataset.chapterId;
      var badge = card.querySelector('.chapter-check-badge');
      if (unique.indexOf(chId) !== -1) {
        card.classList.add('is-completed');
        if (badge) badge.style.display = 'flex';
      } else {
        card.classList.remove('is-completed');
        if (badge) badge.style.display = 'none';
      }
    });
  }

  /* ── Chapter complete button ────────────────────────── */
  function initCompleteBtn() {
    var btn = document.querySelector('.complete-btn[data-chapter-id]');
    if (!btn) return;
    var chId = btn.dataset.chapterId;
    var icon = btn.querySelector('.complete-icon');
    var text = btn.querySelector('.complete-text');

    function syncBtn(completed) {
      var isDone = normalizeCompleted(completed).indexOf(chId) !== -1;
      btn.classList.toggle('is-completed', isDone);
      if (icon) icon.textContent = isDone ? '✓' : '○';
      if (text) text.textContent = isDone ? '완료됨' : '완료로 표시';
    }

    syncBtn(getCompleted());

    btn.addEventListener('click', function () {
      var updated = toggleChapter(chId);
      syncBtn(updated);
      renderProgress(updated);
    });
  }

  /* ── TOC active highlight ────────────────────────────── */
  function initToc() {
    var sections = document.querySelectorAll('.content-section[id]');
    var tocLinks = document.querySelectorAll('.toc-link');
    if (!sections.length || !tocLinks.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        tocLinks.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + id;
          link.classList.toggle('is-active', active);
        });
      });
    }, { rootMargin: '-10% 0% -70% 0%' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ── Back-to-top ────────────────────────────────────── */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.style.opacity = window.scrollY > 400 ? '1' : '0';
      btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Init ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    renderProgress(getCompleted());
    initCompleteBtn();
    initToc();
    initBackToTop();
  });
})();