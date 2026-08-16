/* ================================================
   AWS Guide — 공통 네비게이션
   ================================================ */

const CHAPTERS = [
  { num: '00', title: '사전 지식 — 네트워크·보안 기초', path: '/chapters/ch00/' },
  { num: '01', title: 'AWS 기초 개념',                  path: '/chapters/ch01/' },
  { num: '02', title: 'Amazon EC2',                      path: '/chapters/ch02/' },
  { num: '03', title: 'Amazon VPC',                      path: '/chapters/ch03/' },
  { num: '04', title: 'ELB · Auto Scaling',              path: '/chapters/ch04/' },
  { num: '05', title: 'Amazon S3',                       path: '/chapters/ch05/' },
  { num: '06', title: 'Amazon RDS',                      path: '/chapters/ch06/' },
  { num: '07', title: 'Route 53 · CloudFront',           path: '/chapters/ch07/' },
  { num: '08', title: 'CloudWatch · 모니터링',           path: '/chapters/ch08/' },
  { num: '09', title: 'CI/CD 자동화',                    path: '/chapters/ch09/' },
  { num: '10', title: '종합 실습 — 실전 아키텍처',       path: '/chapters/ch10/' },
  { num: '11', title: '비용 관리',                       path: '/chapters/ch11/' },
];

/* 현재 챕터 번호를 URL에서 감지 */
function currentChapterIndex() {
  const path = window.location.pathname;
  return CHAPTERS.findIndex(ch => path.includes(ch.path.replace(/\/$/, '')));
}

/* 이전/다음 버튼 렌더링 */
function renderChapterNav() {
  const container = document.getElementById('ch-nav');
  if (!container) return;

  const idx = currentChapterIndex();
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;

  container.innerHTML = `
    ${prev
      ? `<a href="${prev.path}" class="ch-nav-btn prev">
           <span class="dir">← 이전 챕터</span>
           <span class="title">CH${prev.num} ${prev.title}</span>
         </a>`
      : `<span class="ch-nav-btn disabled prev">
           <span class="dir">← 이전 챕터</span>
           <span class="title">처음입니다</span>
         </span>`
    }
    <a href="/" class="ch-nav-btn" style="align-items:center">
      <span class="dir" style="text-align:center">목차</span>
      <span class="title" style="font-family:var(--mono);font-size:12px">aws-guide</span>
    </a>
    ${next
      ? `<a href="${next.path}" class="ch-nav-btn next">
           <span class="dir">다음 챕터 →</span>
           <span class="title">CH${next.num} ${next.title}</span>
         </a>`
      : `<span class="ch-nav-btn disabled next">
           <span class="dir">다음 챕터 →</span>
           <span class="title">마지막입니다</span>
         </span>`
    }
  `;
}

/* 스크롤 진행 표시줄 */
function initProgressBar() {
  const fill = document.getElementById('progress-fill');
  if (!fill) return;
  function update() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    fill.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* 체크리스트 상태 — sessionStorage (탭 닫으면 초기화) */
function initChecklists() {
  const key = 'checklist_' + window.location.pathname;
  const saved = JSON.parse(sessionStorage.getItem(key) || '{}');

  document.querySelectorAll('.checklist input[type=checkbox]').forEach((el, i) => {
    if (saved[i]) el.checked = true;
    el.addEventListener('change', () => {
      saved[i] = el.checked;
      sessionStorage.setItem(key, JSON.stringify(saved));
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderChapterNav();
  initProgressBar();
  initChecklists();
});
