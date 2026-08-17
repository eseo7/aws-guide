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

  /* ── Keep home pricing labels timeless ─────────────── */
  function normalizeHomePricingLabels() {
    var labels = {
      ch05: { text: '사용량 기반 과금', className: 'tag tag-billing' },
      ch07: { text: '사용량 기반 과금', className: 'tag tag-billing' },
      ch08: { text: '수집·보관 과금 주의', className: 'tag tag-billing' },
      ch11: { text: '비용 최적화', className: 'tag tag-free' }
    };

    Object.keys(labels).forEach(function (id) {
      var card = document.querySelector('.chapter-card[data-chapter-id="' + id + '"]');
      if (!card) return;
      var tags = card.querySelectorAll('.card-tags .tag');
      if (tags.length < 2) return;
      var billingTag = tags[tags.length - 1];
      billingTag.textContent = labels[id].text;
      billingTag.className = labels[id].className;
    });
  }

  /* ── Keep home card summaries aligned with chapter SSOT ─ */
  function normalizeHomeCardSummaries() {
    var summaries = {
      ch05: {
        subtitle: '객체 스토리지 — 파일 저장부터 정적 콘텐츠 배포까지',
        services: '버킷 · 객체 · 스토리지 클래스 · 버전 관리 · Lifecycle · 암호화 · Presigned URL · CloudFront · OAC'
      },
      ch06: {
        subtitle: '관리형 관계형 데이터베이스 — 백업·가용성·확장을 설계하기',
        services: 'RDS · Multi-AZ · Read Replica · 자동 백업 · 스냅샷 · Aurora · RDS Proxy · Secrets Manager'
      },
      ch07: {
        subtitle: 'DNS와 CDN — 도메인을 연결하고 전 세계에 빠르게 전달하기',
        services: 'Hosted Zone · Alias · TTL · Routing Policy · CloudFront · Cache · OAC · ACM · Invalidation'
      },
      ch08: {
        subtitle: '운영 가시성 — 장애 신호를 읽고 대응하기',
        services: 'Metrics · Logs · Alarms · Dashboards · CloudWatch Agent · Logs Insights · SNS · CloudTrail'
      },
      ch09: {
        subtitle: '소스 변경부터 검증·배포·롤백까지 반복 가능한 파이프라인',
        services: 'CodePipeline · CodeConnections · CodeBuild · CodeDeploy · buildspec.yml · appspec.yml · Systems Manager · Secrets Manager'
      },
      ch10: {
        subtitle: '배운 서비스를 하나의 운영 가능한 웹 아키텍처로 연결하기',
        services: 'VPC · ALB · Private EC2 · Private RDS · S3 · CloudFront · Route 53 · ACM · CloudWatch · CI/CD · Secrets Manager'
      },
      ch11: {
        subtitle: '예산·이상징후·태그·최적화로 AWS 비용 통제하기',
        services: 'AWS Budgets · Cost Explorer · Cost Anomaly Detection · Cost Allocation Tags · Compute Optimizer · Trusted Advisor · Savings Plans'
      }
    };

    Object.keys(summaries).forEach(function (id) {
      var card = document.querySelector('.chapter-card[data-chapter-id="' + id + '"]');
      if (!card) return;
      var subtitle = card.querySelector('.card-subtitle');
      var services = card.querySelector('.card-services');
      if (subtitle) subtitle.textContent = summaries[id].subtitle;
      if (services) services.textContent = summaries[id].services;
    });
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
    normalizeHomePricingLabels();
    normalizeHomeCardSummaries();
    renderProgress(getCompleted());
    initCompleteBtn();
    initToc();
    initBackToTop();
  });
})();