# aws-guide — Claude Code 작업 규칙

## 브랜치 규칙

- **항상 `main` 브랜치에 직접 push한다.**
- 별도 feature 브랜치를 생성하지 않는다.
- PR 없이 `git push origin main`으로 바로 반영한다.

## 커밋 메시지 형식

```
<type>: <설명>
```

- `content:` — 챕터 콘텐츠 추가/수정
- `design:` — 디자인/스타일 변경
- `feat:` — 새 기능
- `fix:` — 버그 수정
