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

  function applyContentCorrections() {
    var btn = getChapterButton();
    if (!btn) return;
    var chId = getButtonChapterId(btn);

    if (chId === 'ch00') {
      var heroServices = document.querySelector('.chapter-hero-services');
      if (heroServices) heroServices.textContent = heroServices.textContent.replace('암호화/SSL', '암호화/TLS');
      document.querySelectorAll('#osi table tr').forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (cells.length === 3 && cells[0].textContent.trim() === '속도') {
          cells[1].textContent = '연결·재전송 등 제어 오버헤드가 상대적으로 큼';
          cells[2].textContent = '제어 오버헤드가 작아 지연에 유리할 수 있음';
        }
      });
    }

    if (chId === 'ch01') {
      document.querySelectorAll('#cloud p').forEach(function (p) {
        var text = p.textContent.trim();
        if (text.indexOf('AWS의 대부분 서비스는 IaaS입니다.') === 0) {
          p.innerHTML = 'AWS에는 <strong>IaaS·PaaS에 가까운 서비스와 완전관리형 서비스가 함께</strong> 있습니다. EC2는 사용자가 OS와 애플리케이션을 관리하는 IaaS의 대표 예이고, Lambda는 서버 운영 부담을 크게 줄인 서버리스 컴퓨팅 서비스입니다. 서비스마다 사용자가 책임지는 범위가 다르므로 IaaS/PaaS/SaaS 분류는 이해를 돕는 기준으로 사용합니다.';
        }
      });
      document.querySelectorAll('#cloud .callout-body').forEach(function (box) {
        if (box.textContent.indexOf('VMC(VMware Cloud) 환경에서 EC2로 마이그레이션') !== -1) {
          box.innerHTML = '<strong>VMC → EC2 전환을 예로 보면</strong><br>VMC(VMware Cloud)도 이미 클라우드 환경입니다. VMC에서 EC2로 옮기는 작업은 “온프레미스 → 클라우드”가 아니라 <strong>VMware 기반 클라우드 → AWS 네이티브 IaaS로 가상 서버 플랫폼을 전환</strong>하는 사례로 이해하는 것이 정확합니다.';
        }
      });
      document.querySelectorAll('#virtualization p').forEach(function (p) {
        if (p.textContent.indexOf('AWS는 자체 개발한 Nitro System을 하이퍼바이저로 사용합니다.') === 0) {
          p.innerHTML = '현대 EC2 인스턴스의 많은 유형은 <strong>AWS Nitro System</strong> 위에서 동작합니다. Nitro System은 전용 하드웨어와 경량 <strong>Nitro Hypervisor</strong> 등을 조합해 가상화 기능을 분담하고, 인스턴스 간 격리와 성능을 제공합니다.';
        }
      });
      document.querySelectorAll('#cloud table tbody tr').forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (cells.length >= 3 && cells[0].textContent.trim() === '초기 비용') cells[2].textContent = '서버 구매 선투자는 줄일 수 있으나 사용한 AWS 리소스 비용은 발생';
      });
    }

    if (chId === 'ch02') {
      document.querySelectorAll('#what p').forEach(function (p) {
        if (p.textContent.indexOf('AWS 데이터센터의 물리 서버를 Nitro System(하이퍼바이저)') !== -1) {
          p.innerHTML = '많은 현대 EC2 인스턴스는 <strong>AWS Nitro System</strong>의 전용 하드웨어와 경량 Nitro Hypervisor를 기반으로 가상화됩니다. 같은 물리 호스트를 공유할 수 있어도 AWS의 가상화·보안 경계로 고객 인스턴스는 서로 격리됩니다.';
        }
      });

      document.querySelectorAll('#type table').forEach(function (table) {
        var headers = table.querySelectorAll('th');
        var priceIndex = -1;
        headers.forEach(function (th, idx) { if (th.textContent.indexOf('서울 시간당') !== -1) priceIndex = idx; });
        if (priceIndex === -1) return;
        headers[priceIndex].textContent = '가격';
        table.querySelectorAll('tbody tr').forEach(function (row) {
          var cells = row.querySelectorAll('td');
          if (cells[priceIndex]) cells[priceIndex].textContent = '현재 AWS 가격표 확인';
          cells.forEach(function (cell) { if (cell.textContent.indexOf('프리 티어') !== -1) cell.textContent = cell.textContent.replace('프리 티어', '계정 혜택 확인'); });
        });
      });

      var creditFix = { 't3.micro': ['12', '288'], 't3.small': ['24', '576'], 't3.medium': ['24', '576'], 't3.large': ['36', '864'] };
      document.querySelectorAll('#tburst table tbody tr').forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (cells.length < 4) return;
        var type = cells[0].textContent.trim();
        if (!creditFix[type]) return;
        cells[2].textContent = creditFix[type][0];
        cells[3].textContent = creditFix[type][1];
      });

      document.querySelectorAll('#type .callout-body').forEach(function (box) {
        if (box.textContent.indexOf('t3.micro로 Spring Boot 실행하면?') !== -1) {
          box.innerHTML = '<strong>Spring Boot 인스턴스 크기는 고정 정답이 없습니다.</strong><br>1GB 메모리의 t3.micro는 JVM·OS·에이전트 구성을 함께 올리면 여유가 작을 수 있습니다. 하지만 “운영은 최소 t3.medium”처럼 고정하기보다 <strong>JVM 힙, 동시 요청, 커넥션 풀, 모니터링 지표와 부하 테스트</strong>를 기준으로 크기를 결정하고 필요하면 Auto Scaling과 함께 조정합니다.';
        }
      });

      document.querySelectorAll('#ebs table').forEach(function (table) {
        var headers = table.querySelectorAll('th');
        var priceIndex = -1;
        headers.forEach(function (th, idx) { if (th.textContent.indexOf('서울 요금') !== -1) priceIndex = idx; });
        if (priceIndex === -1) return;
        headers[priceIndex].textContent = '가격';
        table.querySelectorAll('tbody tr').forEach(function (row) {
          var cells = row.querySelectorAll('td');
          if (cells[priceIndex]) cells[priceIndex].textContent = '현재 AWS 가격표 확인';
        });
      });

      document.querySelectorAll('#ebs .callout-body').forEach(function (box) {
        if (box.textContent.indexOf('$0.08/GB') !== -1) {
          box.innerHTML = '<strong>EBS 볼륨은 인스턴스 종료 후에도 남을 수 있습니다.</strong><br>루트 볼륨은 일반적으로 “종료 시 삭제”가 기본이지만 추가 EBS 볼륨은 설정에 따라 남을 수 있습니다. EC2 → 볼륨에서 <code>available</code> 상태와 스냅샷을 확인하고, 비용은 현재 EBS 가격표를 기준으로 확인하세요.';
        }
      });

      document.querySelectorAll('#ebs table tbody tr').forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (cells.length && cells[0].textContent.indexOf('Amazon Linux 2') !== -1) {
          cells[1].textContent = '2026년 6월 30일 지원 종료(EOL)';
          cells[2].textContent = '신규 구축에는 사용하지 말고 AL2023으로 마이그레이션';
        }
      });

      document.querySelectorAll('#keypair .callout-body').forEach(function (box) {
        if (box.textContent.indexOf('.pem 파일은 생성 시 딱 한 번만 다운로드됩니다') !== -1) {
          box.innerHTML = '<strong>프라이빗 키는 다시 다운로드할 수 없습니다.</strong><br>AWS는 생성한 프라이빗 키 사본을 보관하지 않습니다. 다만 키를 잃었다고 항상 인스턴스를 새로 만들어야 하는 것은 아닙니다. Session Manager, EC2 Instance Connect, 새 공개키 추가 등 사전에 구성된 접속 경로가 있으면 복구할 수 있습니다. 키는 안전한 개인 보관소에 저장하고 공유 드라이브·소스 저장소에는 올리지 마세요.';
        }
      });

      document.querySelectorAll('#keypair table tbody tr').forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (cells.length < 4) return;
        var label = cells[0].textContent.trim();
        if (label.indexOf('퍼블릭 IP') !== -1) {
          cells[2].textContent = 'Reboot는 유지, Stop→Start 시 변경 가능';
          cells[3].textContent = 'Public IPv4 시간당 과금';
        }
        if (label.indexOf('프라이빗 IP') !== -1) {
          cells[2].textContent = 'Primary Private IP는 ENI 수명 동안 유지';
          cells[3].textContent = '주소 자체 별도 과금 없음';
        }
        if (label.indexOf('탄력적 IP') !== -1) {
          cells[3].textContent = 'Public IPv4 시간당 과금';
        }
      });

      document.querySelectorAll('#keypair .callout-warn .callout-body').forEach(function (box) {
        if (box.textContent.indexOf('탄력적 IP — 2024년부터 연결 중에도 과금') !== -1) {
          box.innerHTML = '<strong>Public IPv4는 사용 중·유휴 모두 과금 대상입니다.</strong><br>AWS는 EC2 자동 퍼블릭 IPv4와 Elastic IP를 포함한 Public IPv4 주소에 시간당 요금을 부과합니다. 사용 중과 유휴 주소의 단가는 현재 동일하며, 가격은 AWS VPC 가격표에서 확인합니다. 실습 후 불필요한 Elastic IP는 릴리스하세요.';
        }
      });

      document.querySelectorAll('#pricing table tbody tr').forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (cells.length >= 3 && cells[2].textContent.indexOf('최대') !== -1) cells[2].textContent = '현재 할인율 확인';
      });

      document.querySelectorAll('#launch .callout-body').forEach(function (box) {
        if (box.textContent.indexOf('t3.micro 서울 리전 기준 시간당') !== -1) {
          box.innerHTML = '<strong>생성 완료 후부터 비용을 확인하세요.</strong><br>EC2 컴퓨팅, EBS, Public IPv4 등은 선택한 구성과 계정 혜택에 따라 비용이 달라집니다. 신규 AWS 계정의 Free Tier도 가입 시점과 크레딧 상태에 따라 다르므로 생성 화면과 Billing에서 현재 적용 혜택을 확인하고, 실습 후 리소스를 종료·정리하세요.';
        }
      });

      document.querySelectorAll('#deploy pre code').forEach(function (code) {
        if (code.textContent.indexOf('Environment="DB_PASS=yourpassword"') !== -1) {
          code.innerHTML = code.innerHTML.replace('Environment="DB_PASS=yourpassword"', 'EnvironmentFile=/etc/myapp/myapp.env');
        }
      });

      document.querySelectorAll('#cleanup .summary-item').forEach(function (row) {
        var term = row.querySelector('.summary-term');
        var desc = row.querySelector('span:last-child');
        if (!term || !desc) return;
        if (term.textContent.trim() === '인스턴스 유형') desc.textContent = '패밀리·세대·크기를 읽고, 워크로드 지표와 부하 테스트를 기준으로 선택';
        if (term.textContent.trim() === 'EBS') desc.textContent = '가상 블록 스토리지. 인스턴스 종료 후 남는 볼륨·스냅샷과 현재 가격 확인';
        if (term.textContent.trim() === '탄력적 IP') desc.textContent = '고정 Public IPv4. 사용 중·유휴 모두 Public IPv4 요금 대상이므로 불필요하면 릴리스';
      });
    }
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
    applyContentCorrections();
    enhanceChapterQuality();
    renderProgress(getCompleted());
    initCompleteBtn();
    initToc();
    initBackToTop();
  });
})();
