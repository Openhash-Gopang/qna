# Gopang QnA

Gopang 시스템 AI 지식 도우미 — qna.gopang.net

## 구조

```
qna/
├── index.html          # 디바이스 라우터
├── desktop.html        # PC 인터페이스 (사이드바 + 문서 패널 + 채팅)
├── webapp.html         # 모바일 인터페이스
├── js/
│   └── config.js       # 서비스 설정
├── docs/
│   ├── index.json      # 문서 인덱스
│   ├── strategy/       # 확산전략·사업화
│   ├── pilot/          # 파일럿·지역 적용
│   ├── subsystems/     # 서브시스템 문서
│   └── ops/            # 운영·조직
└── prompts/            # 시스템 프롬프트
```

## 기술 스택
- LLM: DeepSeek V4 Flash (gopang-proxy 경유)
- 인프라: GitHub Pages + Cloudflare Workers
- 인증: Gopang SSO (subsystem-auth.js 패턴)

## DAWN: Democracy is All We Need
