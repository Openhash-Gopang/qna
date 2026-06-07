const KQNA_CONFIG = {
  svc:         'qna',
  name:        'Gopang QnA',
  version:     '1.0',
  gopangUrl:   'https://gopang.net',
  proxyUrl:    'https://gopang-proxy.tensor-city.workers.dev',
  model:       'deepseek-chat',
  maxTokens:   2000,
  temperature: 0.3,

  // 시스템 프롬프트 외부 로드
  systemPromptUrl: 'prompts/SP-QNA_v1_0.txt',

  // 지식베이스 카테고리
  categories: {
    strategy:   '확산전략·사업화',
    pilot:      '파일럿·지역 적용',
    subsystems: '서브시스템',
    ops:        '운영·조직',
  },

  // 문서 인덱스
  docIndex: 'docs/index.json',
};
