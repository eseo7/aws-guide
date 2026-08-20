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

  function getChapterButton() {
    return document.querySelector('.complete-btn[data-chapter-id], .complete-btn[data-chapter]');
  }

  function getButtonChapterId(btn) {
    if (!btn) return '';
    return btn.dataset.chapterId || btn.dataset.chapter || '';
  }

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

  function normalizeHomeCardSummaries() {
    var summaries = {
      ch05: { subtitle: '객체 스토리지 — 파일 저장부터 정적 콘텐츠 배포까지', services: '버킷 · 객체 · 스토리지 클래스 · 버전 관리 · Lifecycle · 암호화 · Presigned URL · CloudFront · OAC' },
      ch06: { subtitle: '관리형 관계형 데이터베이스 — 백업·가용성·확장을 설계하기', services: 'RDS · Multi-AZ · Read Replica · 자동 백업 · 스냅샷 · Aurora · RDS Proxy · Secrets Manager' },
      ch07: { subtitle: 'DNS와 CDN — 도메인을 연결하고 전 세계에 빠르게 전달하기', services: 'Hosted Zone · Alias · TTL · Routing Policy · CloudFront · Cache · OAC · ACM · Invalidation' },
      ch08: { subtitle: '운영 가시성 — 장애 신호를 읽고 대응하기', services: 'Metrics · Logs · Alarms · Dashboards · CloudWatch Agent · Logs Insights · SNS · CloudTrail' },
      ch09: { subtitle: '소스 변경부터 검증·배포·롤백까지 반복 가능한 파이프라인', services: 'CodePipeline · CodeConnections · CodeBuild · CodeDeploy · buildspec.yml · appspec.yml · Systems Manager · Secrets Manager' },
      ch10: { subtitle: '배운 서비스를 하나의 운영 가능한 웹 아키텍처로 연결하기', services: 'VPC · ALB · Private EC2 · Private RDS · S3 · CloudFront · Route 53 · ACM · CloudWatch · CI/CD · Secrets Manager' },
      ch11: { subtitle: '예산·이상징후·태그·최적화로 AWS 비용 통제하기', services: 'AWS Budgets · Cost Explorer · Cost Anomaly Detection · Cost Allocation Tags · Compute Optimizer · Trusted Advisor · Savings Plans' }
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

  function enhanceChapterQuality() {
    var btn = getChapterButton();
    if (!btn) return;
    var chId = getButtonChapterId(btn);

    if (chId === 'ch08') {
      var summary = document.querySelector('.summary-card');
      if (summary) {
        var terms = Array.prototype.map.call(summary.querySelectorAll('.summary-term'), function (el) { return el.textContent.trim(); });
        var missing = [
          ['Dashboards', '여러 지표와 경보를 한 화면에 묶어 서비스 상태를 빠르게 판단하는 운영 화면'],
          ['Runbook', '경보 발생 시 영향 범위 → 사용자 지표 → 인프라 → 로그 → 변경 이력 → 복구 확인 순서로 대응']
        ];
        missing.forEach(function (item) {
          if (terms.indexOf(item[0]) !== -1) return;
          var row = document.createElement('div'); row.className = 'summary-item';
          var term = document.createElement('span'); term.className = 'summary-term'; term.textContent = item[0];
          var desc = document.createElement('span'); desc.textContent = item[1];
          row.appendChild(term); row.appendChild(desc); summary.appendChild(row);
        });
      }
    }

    var cleanup = {
      ch02: 'EC2 인스턴스 종료 여부와 남은 EBS 볼륨·스냅샷·Elastic IP를 확인하세요.',
      ch03: 'NAT Gateway와 Elastic IP 등 시간당 또는 사용량 과금 리소스를 우선 확인하고, 실습용 VPC 구성요소를 정리하세요.',
      ch04: 'ALB와 Auto Scaling이 만든 EC2 인스턴스가 남아 있지 않은지 확인하고 실습용 로드밸런서·대상 그룹을 정리하세요.',
      ch05: '실습 버킷의 객체·버전·불완전 멀티파트 업로드와 연결한 CloudFront 구성을 확인하세요.',
      ch06: 'RDS/Aurora 인스턴스와 클러스터를 종료하고, 보관할 필요가 없는 스냅샷·Secrets Manager 비밀정보 등 후속 리소스도 확인하세요.',
      ch07: '실습용 Route 53 Hosted Zone과 CloudFront 배포가 계속 필요한지 확인하세요. 사용하지 않는 구성은 정리하세요.',
      ch08: '불필요한 로그 장기 보존, 커스텀 지표, 경보·대시보드가 남아 있지 않은지 확인하고 Log Group 보존 기간을 점검하세요.',
      ch09: '실습용 빌드·배포 파이프라인, 아티팩트 저장소와 배포 대상으로 만든 인프라가 남아 있지 않은지 확인하세요.',
      ch10: '종합 실습에서 만든 ALB·EC2·RDS·NAT Gateway·CloudFront 등 유료 리소스를 의존성 순서에 맞춰 모두 정리했는지 마지막으로 확인하세요.'
    };
    if (cleanup[chId] && !document.querySelector('.lab-cleanup-check')) {
      var pagination = document.querySelector('.chapter-pagination');
      if (pagination && pagination.parentNode) {
        var box = document.createElement('div'); box.className = 'callout callout-danger lab-cleanup-check';
        var icon = document.createElement('span'); icon.className = 'callout-icon'; icon.textContent = '💰';
        var body = document.createElement('div'); body.className = 'callout-body';
        var strong = document.createElement('strong'); strong.textContent = '실습 종료 체크 — 비용이 계속 발생하지 않게 확인하세요.';
        body.appendChild(strong); body.appendChild(document.createElement('br')); body.appendChild(document.createTextNode(cleanup[chId])); body.appendChild(document.createElement('br'));
        var note = document.createElement('span'); note.className = 'text-muted'; note.textContent = 'AWS 요금과 Free Tier 조건은 계정·리전·시점에 따라 달라질 수 있으므로 콘솔의 Billing/Cost Management에서 실제 사용량도 함께 확인합니다.';
        body.appendChild(note); box.appendChild(icon); box.appendChild(body); pagination.parentNode.insertBefore(box, pagination);
      }
    }
  }

  function renderProgress(completed) {
    var unique = normalizeCompleted(completed);
    var done = Math.min(unique.length, TOTAL);
    var pct = Math.round((done / TOTAL) * 100);
    var fill = document.querySelector('.progress-fill'); var label = document.querySelector('.progress-label');
    if (fill) fill.style.width = pct + '%'; if (label) label.textContent = done + ' / ' + TOTAL + ' 챕터';
    var hFill = document.querySelector('.header-prog-fill'); var hLabel = document.querySelector('.header-prog-label');
    if (hFill) hFill.style.width = pct + '%'; if (hLabel) hLabel.textContent = pct + '%';
    document.querySelectorAll('.chapter-card[data-chapter-id]').forEach(function (card) {
      var chId = card.dataset.chapterId; var badge = card.querySelector('.chapter-check-badge');
      if (unique.indexOf(chId) !== -1) { card.classList.add('is-completed'); if (badge) badge.style.display = 'flex'; }
      else { card.classList.remove('is-completed'); if (badge) badge.style.display = 'none'; }
    });
  }

  function initCompleteBtn() {
    var btn = getChapterButton(); if (!btn) return;
    var chId = getButtonChapterId(btn); if (!chId) return;
    var icon = btn.querySelector('.complete-icon'); var text = btn.querySelector('.complete-text');
    function syncBtn(completed) {
      var isDone = normalizeCompleted(completed).indexOf(chId) !== -1;
      btn.classList.toggle('is-completed', isDone);
      if (icon) icon.textContent = isDone ? '✓' : '○';
      if (text) text.textContent = isDone ? '완료됨' : '완료로 표시';
      if (!icon && !text) btn.textContent = isDone ? '✓ 완료됨' : '완료로 표시';
    }
    syncBtn(getCompleted());
    btn.addEventListener('click', function () { var updated = toggleChapter(chId); syncBtn(updated); renderProgress(updated); });
  }

  function initToc() {
    var sections = document.querySelectorAll('.content-section[id]'); var tocLinks = document.querySelectorAll('.toc-link');
    if (!sections.length || !tocLinks.length || !('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        tocLinks.forEach(function (link) { link.classList.toggle('is-active', link.getAttribute('href') === '#' + id); });
      });
    }, { rootMargin: '-10% 0% -70% 0%' });
    sections.forEach(function (s) { observer.observe(s); });
  }

  function initBackToTop() {
    var btn = document.querySelector('.back-to-top'); if (!btn) return;
    window.addEventListener('scroll', function () { btn.style.opacity = window.scrollY > 400 ? '1' : '0'; btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none'; });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    normalizeHomePricingLabels();
    normalizeHomeCardSummaries();
    enhanceChapterQuality();
    renderProgress(getCompleted());
    initCompleteBtn();
    initToc();
    initBackToTop();
  });
})();
