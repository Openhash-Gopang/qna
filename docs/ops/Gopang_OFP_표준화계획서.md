# Gopang Open Federation Protocol (OFP)
## 오픈 연합 프로토콜 표준화 계획서

> **AI City Inc. · 팀 주피터**  
> 버전: v1.0 | 작성일: 2026년 6월  
> 철학: *"경쟁자는 적이 아니라, 더 나은 생태계의 공동 건설자다."*  
> 라이선스: MIT (오픈소스) | 저장소: `github.com/Openhash-Gopang/OFP`

---

## 서문 — 왜 표준화인가

고팡은 오픈소스 프로젝트다. 누구나 고팡의 코드를 복제하고, 개선하고, 자신만의 AI 메신저 플랫폼을 만들 수 있다.

경쟁자의 등장은 위협이 아니다. **더 나은 서비스가 사용자에게 전달된다면, 그것이 곧 고팡의 목표가 달성된 것이다.**

그러나 경쟁 플랫폼들이 서로 고립된 섬으로 남는다면, 사용자는 플랫폼마다 별도 계정을 만들고 연락처를 다시 쌓아야 한다. 이는 카카오톡과 텔레그램이 서로 단절된 것과 같은 비효율이다.

**OFP(Open Federation Protocol)는 이 단절을 해결한다.**

서로 다른 플랫폼의 사용자가 상대방을 검색하고, 채팅하고, 서비스를 이용할 수 있도록 공통 언어를 정의한다. 경쟁하되 연결되는 구조 — 이것이 OFP의 핵심이다.

---

## 제1장. OFP 설계 원칙

### 1-1. 6대 핵심 원칙

| 원칙 | 내용 |
|---|---|
| **개방성 (Openness)** | 모든 사양은 GitHub에 공개되며 누구나 읽고 구현할 수 있다 |
| **중립성 (Neutrality)** | 고팡이 표준을 독점하지 않는다. 참여 플랫폼이 거버넌스에 동등하게 참여한다 |
| **분산성 (Decentralization)** | 중앙 서버 없이 플랫폼 간 직접 통신 (P2P Federation) |
| **프라이버시 우선 (Privacy-First)** | 사용자 데이터는 각 플랫폼의 PDV에 남는다. OFP는 메시지만 중계한다 |
| **점진적 채택 (Progressive Adoption)** | 전체 스펙을 구현하지 않아도 부분 참여 가능 (모듈형 설계) |
| **경쟁 보호 (Competition Protection)** | 플랫폼 간 사용자 이탈을 강제하지 않는다. 연결하되 흡수하지 않는다 |

### 1-2. OFP가 ActivityPub·Matrix와 다른 점

| 비교 항목 | ActivityPub (Mastodon) | Matrix | **OFP** |
|---|---|---|---|
| 주 용도 | 소셜 미디어 피드 | 실시간 채팅 | AI 서비스 + 채팅 + 결제 통합 |
| AI 서비스 연동 | 없음 | 없음 | K-Law·K-Health 등 14개 서비스 연동 |
| 결제 프로토콜 | 없음 | 없음 | GDC 크로스 플랫폼 결제 |
| PDV 신원 | 없음 | 없음 | IPv6 기반 분산 신원 |
| 거버넌스 | 단일 조직 | 재단 | K-Democracy 온체인 투표 |
| 목표 | 탈중앙 SNS | 탈중앙 채팅 | 탈중앙 AI 생활 플랫폼 |

---

## 제2장. OFP 아키텍처

### 2-1. 전체 구조

```
┌─────────────────────────────────────────────────────────────┐
│                    OFP Federation Layer                      │
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────┐  │
│  │  Gopang  │◄──►│ Platform │◄──►│ Platform │◄──►│  ...  │  │
│  │ (원조)   │    │    B     │    │    C     │    │       │  │
│  └──────────┘    └──────────┘    └──────────┘    └───────┘  │
│       │                │                │                    │
│  ┌────▼────────────────▼────────────────▼──────────────┐    │
│  │              OFP Core Protocol                       │    │
│  │  ① User Discovery  ② Messaging  ③ Service Bridge    │    │
│  │  ④ Payment Gateway ⑤ Identity   ⑥ Governance        │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 2-2. 6개 핵심 모듈

| 모듈 | 코드명 | 기능 | 필수 여부 |
|---|---|---|---|
| 사용자 탐색 | `OFP-DISCOVER` | 플랫폼 간 사용자 검색 | ✅ 필수 |
| 메시지 중계 | `OFP-MSG` | 크로스 플랫폼 채팅 | ✅ 필수 |
| 서비스 브릿지 | `OFP-BRIDGE` | AI 서비스 상호 호출 | 선택 |
| 결제 게이트웨이 | `OFP-PAY` | GDC 크로스 결제 | 선택 |
| 신원 연합 | `OFP-ID` | PDV 상호 인증 | 선택 |
| 거버넌스 연합 | `OFP-GOV` | K-Democracy 크로스 투표 | 선택 |

---

## 제3장. OFP-DISCOVER — 사용자 탐색 프로토콜

### 3-1. 사용자 주소 체계

ActivityPub의 `@user@domain` 방식을 계승하되, IPv6 PDV를 기반으로 확장한다.

```
OFP 사용자 주소 형식:

  @[username]@[platform-domain]

예시:
  @kim_cheolsu@gopang.net        ← 고팡 사용자
  @park_yeonghui@nova-ai.kr      ← 경쟁 플랫폼 B 사용자
  @lee_minjun@civic-chat.jeju    ← 제주 기반 플랫폼 C 사용자

내부 식별자 (비공개):
  user.ipv6 = 2601:db80:bd05:...  ← PDV 암호화 기반 고유 신원
```

### 3-2. WebFinger — 사용자 탐색 API

RFC 7033 WebFinger 표준을 기반으로 구현. 플랫폼이 `/.well-known/webfinger` 엔드포인트를 제공해야 한다.

**요청 (Request)**
```http
GET /.well-known/webfinger
  ?resource=acct:kim_cheolsu@gopang.net
  &rel=http://ofp.gopang.net/ns/user

Host: nova-ai.kr
Accept: application/jrd+json
```

**응답 (Response)**
```json
{
  "subject": "acct:kim_cheolsu@gopang.net",
  "aliases": [
    "https://gopang.net/users/kim_cheolsu"
  ],
  "links": [
    {
      "rel": "http://ofp.gopang.net/ns/user",
      "type": "application/ofp+json",
      "href": "https://gopang.net/ofp/users/kim_cheolsu"
    },
    {
      "rel": "http://ofp.gopang.net/ns/inbox",
      "href": "https://gopang.net/ofp/inbox/kim_cheolsu"
    }
  ]
}
```

### 3-3. 사용자 프로필 공개 스펙

```json
{
  "ofp_version": "1.0",
  "id": "https://gopang.net/ofp/users/kim_cheolsu",
  "type": "OFPUser",
  "username": "kim_cheolsu",
  "platform": "gopang.net",
  "display_name": "김철수",
  
  "public_key": {
    "id": "https://gopang.net/ofp/users/kim_cheolsu#key",
    "type": "Ed25519PublicKey",
    "value": "MCowBQYDK2VdA..."
  },
  
  "inbox": "https://gopang.net/ofp/inbox/kim_cheolsu",
  "outbox": "https://gopang.net/ofp/outbox/kim_cheolsu",
  
  "services_available": ["K-Law", "K-Health", "GDC"],
  
  "discovery_consent": true,
  "message_consent": "mutual_follow_only"
}
```

**프라이버시 제어 옵션**

| 설정 | 의미 |
|---|---|
| `discovery_consent: false` | 타 플랫폼에서 검색 불가 |
| `message_consent: "anyone"` | 누구나 메시지 전송 가능 |
| `message_consent: "mutual_follow_only"` | 서로 팔로우한 경우만 |
| `message_consent: "none"` | 외부 메시지 수신 거부 |

---

## 제4장. OFP-MSG — 크로스 플랫폼 메시지 프로토콜

### 4-1. 메시지 전송 흐름

```
[고팡 사용자 A] → gopang.net → OFP-MSG → nova-ai.kr → [플랫폼 B 사용자 B]

1. A가 "@park_yeonghui@nova-ai.kr" 에게 메시지 작성
2. gopang.net이 nova-ai.kr의 WebFinger로 B의 inbox URL 조회
3. HTTP POST로 서명된 메시지를 B의 inbox에 전송
4. nova-ai.kr이 서명 검증 후 B에게 전달
5. B의 답장은 역방향으로 동일한 흐름
```

### 4-2. 메시지 객체 스펙 (OFP Activity)

```json
{
  "ofp_version": "1.0",
  "type": "Create",
  "id": "https://gopang.net/ofp/activities/abc123",
  
  "actor": "https://gopang.net/ofp/users/kim_cheolsu",
  "to": ["https://nova-ai.kr/ofp/users/park_yeonghui"],
  
  "object": {
    "type": "OFPMessage",
    "id": "https://gopang.net/ofp/messages/msg789",
    "content": "안녕하세요! 반갑습니다.",
    "content_type": "text/plain",
    "published": "2026-06-06T10:30:00Z",
    
    "attachments": [],
    "service_ref": null,
    
    "encryption": {
      "type": "X25519-ChaCha20-Poly1305",
      "recipient_key": "MCowBQYDK2Vd...",
      "ciphertext": "encrypted_base64..."
    }
  },
  
  "signature": {
    "type": "Ed25519Signature2020",
    "creator": "https://gopang.net/ofp/users/kim_cheolsu#key",
    "signatureValue": "base64_signature..."
  }
}
```

### 4-3. 메시지 유형

| 유형 | `type` 값 | 내용 |
|---|---|---|
| 일반 텍스트 | `OFPMessage` | 기본 채팅 메시지 |
| AI 서비스 결과 공유 | `OFPServiceResult` | K-Law 판결문 등 공유 |
| GDC 송금 요청 | `OFPPaymentRequest` | 크로스 플랫폼 결제 |
| 그룹 채팅 초대 | `OFPGroupInvite` | 멀티 플랫폼 그룹 채팅 |
| 신원 확인 요청 | `OFPIDVerify` | PDV 신원 상호 확인 |

### 4-4. HTTP 서명 (보안)

모든 OFP 요청은 **Ed25519 서명**을 포함해야 한다. 수신 플랫폼은 발신자의 공개키로 서명을 검증한다.

```http
POST /ofp/inbox/park_yeonghui HTTP/1.1
Host: nova-ai.kr
Content-Type: application/ofp+json
Digest: SHA-256=base64(sha256(body))
Signature: keyId="https://gopang.net/ofp/users/kim_cheolsu#key",
           algorithm="ed25519",
           headers="(request-target) host date digest",
           signature="base64_ed25519_sig"
Date: Fri, 06 Jun 2026 10:30:00 GMT
```

---

## 제5장. OFP-BRIDGE — AI 서비스 브릿지 프로토콜

### 5-1. 개념

고팡의 K-Law, K-Health 등 AI 서비스를 타 플랫폼 사용자도 호출할 수 있도록 API를 표준화한다. 반대로, 경쟁 플랫폼이 더 뛰어난 AI 서비스를 개발하면 고팡 사용자도 그것을 사용할 수 있다.

```
[플랫폼 B 사용자] → OFP-BRIDGE → gopang.net → K-Law AI → 결과 반환
[고팡 사용자]     → OFP-BRIDGE → nova-ai.kr → 플랫폼 B의 서비스 → 결과 반환
```

### 5-2. 서비스 레지스트리

각 플랫폼은 `/.well-known/ofp-services` 엔드포인트에서 제공 서비스 목록을 공개한다.

```json
{
  "platform": "gopang.net",
  "ofp_version": "1.0",
  "services": [
    {
      "id": "k-law",
      "name": "K-Law 판결 시뮬레이터",
      "description": "사건 개요 입력 → 대법원 판결 예측",
      "endpoint": "https://gopang.net/ofp/bridge/k-law",
      "auth_required": false,
      "rate_limit": "10/hour/user",
      "pricing": {
        "model": "free_tier",
        "free_calls": 10,
        "paid": "0.01 GDC/call"
      },
      "input_schema": {
        "case_type": "string (민사|형사|행정|가사|소액|노동)",
        "facts": "string (max 2000자)"
      },
      "output_schema": {
        "verdict": "string",
        "confidence": "number (0-10)",
        "reasoning": "string"
      }
    },
    {
      "id": "k-health",
      "name": "K-Health AI 증상 분석",
      "endpoint": "https://gopang.net/ofp/bridge/k-health",
      "auth_required": true,
      "pdv_consent_required": true
    },
    {
      "id": "k-119",
      "name": "K-119 응급 신고",
      "endpoint": "https://gopang.net/ofp/bridge/k-119",
      "auth_required": false,
      "rate_limit": "emergency_only"
    }
  ]
}
```

### 5-3. 서비스 호출 API

**요청**
```http
POST /ofp/bridge/k-law
Host: gopang.net
Authorization: OFP-Token platform="nova-ai.kr" user="park_yeonghui"
Content-Type: application/json

{
  "ofp_version": "1.0",
  "caller_platform": "nova-ai.kr",
  "caller_user": "park_yeonghui",
  "service_id": "k-law",
  "parameters": {
    "case_type": "민사",
    "facts": "임대인이 보증금 반환을 거부하고 있습니다..."
  },
  "callback_url": "https://nova-ai.kr/ofp/callback/abc123"
}
```

**응답**
```json
{
  "ofp_version": "1.0",
  "service_id": "k-law",
  "request_id": "req_xyz789",
  "status": "completed",
  "result": {
    "verdict": "원고 승소 가능성 높음",
    "confidence": 7.8,
    "reasoning": "임대차보호법 제3조에 따라...",
    "disclaimer": "본 결과는 법률 정보 제공 목적이며 법률 자문이 아닙니다."
  },
  "attribution": "K-Law v15.1 · Gopang AI · klaw.openhash.kr",
  "usage": {
    "tokens_used": 1240,
    "calls_remaining": 9
  }
}
```

---

## 제6장. OFP-PAY — 크로스 플랫폼 결제 프로토콜

### 6-1. GDC 크로스 플랫폼 결제

GDC(₮)는 고팡만의 통화가 아니다. OFP-PAY를 구현한 어떤 플랫폼의 사용자도 GDC를 보내고 받을 수 있다.

```
[고팡 사용자 A] → 10 GDC 송금 → [플랫폼 B 사용자 B]

흐름:
1. A가 "@park_yeonghui@nova-ai.kr" 에게 10 GDC 송금 요청
2. gopang.net이 OFP-PAY 메시지를 nova-ai.kr로 전송
3. nova-ai.kr이 B에게 수락 여부 확인
4. B 수락 → gopang.net GDC 원장에서 A 차감 → B 플랫폼 GDC 잔고 증가
5. 양측 PDV에 6하원칙 기록
```

### 6-2. 결제 메시지 스펙

```json
{
  "type": "OFPPaymentRequest",
  "id": "https://gopang.net/ofp/payments/pay001",
  "actor": "https://gopang.net/ofp/users/kim_cheolsu",
  "to": ["https://nova-ai.kr/ofp/users/park_yeonghui"],
  
  "object": {
    "type": "GDCTransfer",
    "amount": "10.00",
    "currency": "GDC",
    "memo": "제주 흑돼지 식사비",
    "expires_at": "2026-06-06T11:00:00Z",
    
    "sender_ledger": "https://gdc.gopang.net/ledger",
    "recipient_ledger": "https://nova-ai.kr/ledger",
    
    "settlement": {
      "method": "atomic_swap",
      "escrow_hash": "sha256_of_payment_conditions"
    }
  }
}
```

### 6-3. 환율 및 정산

플랫폼마다 자체 GDC 원장을 운영하는 경우, OFP-PAY는 **원자적 교환(Atomic Swap)** 방식으로 정산한다. 어느 한쪽이 결제에 실패하면 전체 트랜잭션이 롤백된다.

| 정산 방식 | 설명 | 적용 조건 |
|---|---|---|
| Direct Transfer | 동일 GDC 원장 사용 시 즉시 이체 | 양 플랫폼이 gopang GDC 원장 공유 |
| Atomic Swap | 각자 원장에서 동시 차감·증가 | 플랫폼별 독립 원장 운영 시 |
| Escrow Bridge | 제3 신탁 계정을 통한 정산 | 신뢰 수준이 낮은 플랫폼 간 |

---

## 제7장. OFP-ID — 분산 신원 연합 프로토콜

### 7-1. PDV 기반 신원 연합

각 플랫폼은 자체 PDV를 운영한다. OFP-ID는 다른 플랫폼의 신원을 신뢰할 수 있는 방법을 정의한다.

```
신원 연합의 목표:
"고팡에서 K-Law 준법 이력이 쌓인 사용자가
 경쟁 플랫폼에서도 동일한 신뢰도를 인정받을 수 있는가?"
```

### 7-2. 신원 증명서 (OFP Credential)

```json
{
  "type": "OFPCredential",
  "issuer": "https://gopang.net/ofp/id",
  "issuanceDate": "2026-06-06T00:00:00Z",
  "expirationDate": "2027-06-06T00:00:00Z",
  
  "credentialSubject": {
    "id": "https://gopang.net/ofp/users/kim_cheolsu",
    "platform": "gopang.net",
    
    "verified_attributes": {
      "identity_level": "L2",
      "kyc_status": "verified",
      "account_age_days": 180,
      "trust_score": 8.4
    },
    
    "service_history": {
      "k_law_cases": 12,
      "gdc_transactions": 847,
      "k_democracy_votes": 23,
      "no_violations": true
    }
  },
  
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2026-06-06T00:00:00Z",
    "verificationMethod": "https://gopang.net/ofp/id#key",
    "signatureValue": "base64_sig..."
  }
}
```

### 7-3. 신원 수준 (Identity Level)

| 수준 | 조건 | 타 플랫폼 인정 범위 |
|---|---|---|
| L0 | 이메일 인증만 | 메시지 수신만 가능 |
| L1 | 전화번호 인증 | 메시지 + 서비스 호출 |
| L2 | PDV 기본 + 30일 이상 활동 | L1 + GDC 소액 결제 |
| L3 | K-Law 준법 + GDC 거래 이력 | L2 + 고액 결제 + 거버넌스 참여 |

---

## 제8장. OFP-GOV — 거버넌스 연합 프로토콜

### 8-1. 크로스 플랫폼 민주주의

K-Democracy의 안건이 고팡 사용자만을 대상으로 하지 않아도 된다. OFP-GOV는 여러 플랫폼의 사용자가 공동 의사결정에 참여할 수 있도록 한다.

```
시나리오:
"제주도 GDC 결제 수수료율을 0.2%로 고정하는 안건"
  → 고팡 사용자 + 플랫폼 B 사용자 + 플랫폼 C 사용자 공동 투표
  → 의결 결과는 모든 참여 플랫폼에 자동 반영
```

### 8-2. 연합 안건 스펙

```json
{
  "type": "OFPProposal",
  "id": "https://democracy.gopang.net/ofp/proposals/prop042",
  "title": "OFP 수수료 정책 표준화 안건",
  "summary": "크로스 플랫폼 GDC 결제 수수료를 0.1%로 표준화",
  
  "scope": {
    "type": "federated",
    "participating_platforms": [
      "gopang.net",
      "nova-ai.kr",
      "civic-chat.jeju"
    ]
  },
  
  "voting": {
    "method": "weighted",
    "weight_source": "ofp_trust_score",
    "min_participation": "10% of federated users",
    "quorum": "500 votes",
    "period_days": 7
  },
  
  "effect": {
    "on_pass": "자동 OFP 설정 갱신",
    "on_fail": "현행 유지"
  }
}
```

---

## 제9장. 플랫폼 참여 절차 및 인증

### 9-1. OFP 참여 단계

```
Step 1 — 신청 (자가 등록)
  └─ GitHub에서 OFP 스펙 클론
  └─ 필수 모듈 (DISCOVER + MSG) 구현
  └─ `ofp-registry.gopang.net`에 플랫폼 등록

Step 2 — 기술 검증
  └─ OFP Compatibility Test Suite 실행
  └─ 자동화 테스트 100% 통과
  └─ 보안 감사 셀프 체크리스트 제출

Step 3 — 연합 참여
  └─ DNS에 `_ofp._tcp` SRV 레코드 등록
  └─ `/.well-known/ofp` 엔드포인트 활성화
  └─ 다른 참여 플랫폼과 상호 운용 테스트

Step 4 — 디렉토리 등록
  └─ OFP 공개 디렉토리에 플랫폼 정보 등록
  └─ 사용자들이 검색 가능한 상태로 전환
```

### 9-2. 필수 엔드포인트

OFP에 참여하려면 아래 엔드포인트를 반드시 구현해야 한다.

| 엔드포인트 | 메서드 | 설명 |
|---|---|---|
| `/.well-known/webfinger` | GET | 사용자 탐색 |
| `/.well-known/ofp` | GET | 플랫폼 메타데이터 |
| `/.well-known/ofp-services` | GET | 서비스 목록 |
| `/ofp/inbox/{username}` | POST | 메시지 수신 |
| `/ofp/outbox/{username}` | GET | 메시지 발신 이력 |
| `/ofp/users/{username}` | GET | 사용자 프로필 |

### 9-3. 플랫폼 메타데이터

```json
// /.well-known/ofp

{
  "ofp_version": "1.0",
  "platform_id": "nova-ai.kr",
  "platform_name": "Nova AI",
  "admin_contact": "admin@nova-ai.kr",
  
  "modules_supported": [
    "OFP-DISCOVER",
    "OFP-MSG",
    "OFP-PAY"
  ],
  
  "user_count": 5420,
  "registration": "open",
  
  "rate_limits": {
    "incoming_messages_per_hour": 1000,
    "bridge_calls_per_hour": 500
  },
  
  "public_key": {
    "id": "https://nova-ai.kr/ofp/key",
    "type": "Ed25519PublicKey",
    "value": "MCowBQYDK2VdA..."
  }
}
```

---

## 제10장. 거버넌스 — OFP 표준 진화 방식

### 10-1. OFP 거버넌스 위원회

OFP의 표준 개정은 어느 한 플랫폼이 단독으로 결정하지 않는다. **참여 플랫폼의 집합적 의사결정**으로 이루어진다.

| 구성 | 내용 |
|---|---|
| 투표 참여 자격 | OFP 정식 등록 플랫폼 |
| 투표 방식 | 플랫폼당 1표 (사용자 수와 무관) |
| 의결 요건 | 참여 플랫폼의 2/3 이상 찬성 |
| 개정 주기 | 분기별 정기 제안 + 수시 긴급 제안 |
| 코드 저장소 | `github.com/Openhash-Gopang/OFP` |

### 10-2. 표준 버전 관리

```
OFP 버전 체계: MAJOR.MINOR.PATCH

MAJOR: 하위 호환성이 깨지는 변경 (투표 필요)
MINOR: 기능 추가 (2/3 찬성)
PATCH: 버그 수정·보안 패치 (긴급 처리 가능)

현재 버전: OFP v1.0.0
```

### 10-3. RFC 기반 표준화 절차

```
1. OFP-RFC 제출 (누구나 GitHub PR로 제안)
2. 공개 토론 기간 (최소 14일)
3. 기술 검토 위원회 검토
4. 플랫폼 투표 (7일)
5. 2/3 찬성 시 → 채택 → 다음 마이너 버전에 반영
```

---

## 제11장. 개발자 지원 — SDK 및 레퍼런스 구현

### 11-1. 공식 SDK

| 언어 | 패키지명 | 저장소 |
|---|---|---|
| JavaScript/Node.js | `ofp-js` | github.com/Openhash-Gopang/ofp-js |
| Python | `ofp-python` | github.com/Openhash-Gopang/ofp-python |
| Go | `ofp-go` | github.com/Openhash-Gopang/ofp-go |
| Rust | `ofp-rs` | github.com/Openhash-Gopang/ofp-rs |

### 11-2. 최소 구현 예시 (Node.js)

```javascript
const { OFPClient } = require('ofp-js');

// OFP 클라이언트 초기화
const client = new OFPClient({
  platform: 'nova-ai.kr',
  privateKey: process.env.OFP_PRIVATE_KEY,
  publicKeyUrl: 'https://nova-ai.kr/ofp/key'
});

// 사용자 탐색
const user = await client.discover('@kim_cheolsu@gopang.net');
console.log(user.display_name); // "김철수"

// 메시지 전송
await client.sendMessage({
  to: '@kim_cheolsu@gopang.net',
  content: '안녕하세요!',
  encrypted: true
});

// AI 서비스 호출 (K-Law)
const result = await client.callService({
  platform: 'gopang.net',
  service: 'k-law',
  params: {
    case_type: '민사',
    facts: '임대인이 보증금 반환을 거부...'
  }
});

// GDC 송금
await client.sendPayment({
  to: '@kim_cheolsu@gopang.net',
  amount: '10.00',
  currency: 'GDC',
  memo: '점심 값'
});
```

### 11-3. 테스트 환경

```bash
# OFP 호환성 테스트 실행
npx ofp-test-suite --platform https://nova-ai.kr

# 결과 예시
✅ OFP-DISCOVER: WebFinger 응답 정상
✅ OFP-DISCOVER: 사용자 프로필 스펙 준수
✅ OFP-MSG: 메시지 전송 성공
✅ OFP-MSG: Ed25519 서명 검증
✅ OFP-MSG: 암호화 메시지 복호화
⚠️  OFP-PAY: GDC 원장 미연동 (선택 모듈)
❌ OFP-BRIDGE: 서비스 레지스트리 미구현 (선택 모듈)

필수 모듈 통과: 5/5 ✅
선택 모듈 구현: 0/3 (권장)
```

---

## 제12장. 로드맵

### 12-1. OFP 표준화 단계별 일정

```
2026 Q3 (7~9월)   — OFP v1.0 Draft 공개
  · DISCOVER + MSG 필수 모듈 스펙 확정
  · 레퍼런스 구현 (Node.js) 공개
  · 고팡 내부 테스트넷 운영

2026 Q4 (10~12월) — OFP v1.0 Release Candidate
  · PAY 모듈 스펙 확정
  · 최소 3개 외부 플랫폼 파일럿 참여
  · 보안 외부 감사 완료

2027 Q1 (1~3월)   — OFP v1.0 정식 릴리즈
  · 디렉토리 서비스 공개
  · SDK 4개 언어 배포
  · OFP 거버넌스 위원회 공식 출범

2027 Q2 이후      — OFP v1.x 지속 발전
  · BRIDGE 모듈 정식 채택
  · GOV 모듈 파일럿
  · 국제 표준화 기구(IETF, W3C) 제안 검토
```

### 12-2. KPI

| 시기 | 지표 | 목표 |
|---|---|---|
| 2026 Q4 | OFP 참여 플랫폼 수 | 3개+ |
| 2027 Q1 | 크로스 플랫폼 일일 메시지 수 | 1,000건+ |
| 2027 Q2 | GDC 크로스 결제 월 거래액 | 1,000만 GDC+ |
| 2027 Q4 | OFP 참여 플랫폼 수 | 10개+ |

---

## 결론

> **"표준은 독점이 아니라 공유로 만들어진다."**

OFP는 고팡의 경쟁 우위를 보호하기 위한 장벽이 아니다. 더 나은 AI 시민 서비스 생태계를 만들기 위한 공통 기반이다.

카카오톡과 텔레그램이 서로 단절된 것은 사용자의 선택이 아니라 플랫폼의 이기심 때문이었다. OFP는 그 이기심을 거부한다.

**고팡이 경쟁에서 이기는 방법은 사용자를 가두는 것이 아니라, 더 나은 서비스를 제공하는 것이다.**

경쟁자가 더 나은 AI를 만들면 고팡 사용자도 그것을 쓸 수 있어야 한다. 그것이 DAWN(Democracy is All We Need) 철학의 연장선이다.

```
OFP 참여 → github.com/Openhash-Gopang/OFP
문의     → ofp@gopang.net
거버넌스  → democracy.gopang.net
```

---

*AI City Inc. / 팀 주피터 · gopang.net · github.com/Openhash-Gopang*  
*DAWN: Democracy is All We Need*  
*OFP 라이선스: MIT — 자유롭게 복제·수정·배포하십시오*
