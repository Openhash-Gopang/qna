const KQNA_CONFIG = {
  svc:         'qna',
  name:        'Gopang QnA',
  version:     '1.0',
  gopangUrl:   'https://hondi.net',
  proxyUrl:    'https://hondi-proxy.tensor-city.workers.dev',
  model:       'deepseek-chat',
  maxTokens:   2000,
  temperature: 0.3,

  // 시스템 프롬프트 외부 로드
  // 2026-09-13 — 이 필드는 죽은 설정값이다. 실제로는 desktop.html이
  // SP-CORE.txt를 하드코딩해서 로드하고(_loadSP('SP-CORE.txt')),
  // _selectDomainSP()가 고른 도메인 SP를 덧붙이는 방식으로 바뀐 지
  // 오래됐다(2026-06-09, SP-QNA v1.0 → SP-CORE+도메인 분리). 이 필드를
  // 읽는 코드가 없다 — 참고용으로만 남겨두되, 혼동을 막기 위해 표시해둔다.
  systemPromptUrl: 'prompts/SP-QNA_v1_0.txt',  // ⚠ 미사용 — 아래 설명 참고

  // 지식베이스 카테고리
  categories: {
    strategy:   '확산전략·사업화',
    pilot:      '파일럿·지역 적용',
    subsystems: '서브시스템',
    ops:        '운영·조직',
    research:   '학술 논문',
    patent:     '특허 출원',
  },

  // 문서 인덱스
  docIndex: 'docs/index.json',
};
