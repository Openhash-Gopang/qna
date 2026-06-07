# Gopang QnA 저장소 초기화 & 배포 스크립트
# 실행 위치: C:\Users\주피터\Downloads\qna\

# 1. 로컬 git 초기화
git init
git branch -M main

# 2. GitHub 원격 연결 (저장소 생성은 GitHub 웹에서 먼저)
#    https://github.com/organizations/Openhash-Gopang/repositories/new
#    - Repository name: qna
#    - Visibility: Public
#    - Initialize: 체크 해제
git remote add origin https://github.com/Openhash-Gopang/qna.git

# 3. 전체 파일 커밋
git add .
git commit -m "feat: Gopang QnA v1.0 — AI 지식 도우미 초기 배포

- index.html: 디바이스 라우터 (mobile → webapp, desktop → desktop)
- webapp.html: 모바일 채팅 UI (DeepSeek V4 Flash)
- desktop.html: PC 사이드바 + 문서 패널 + 채팅
- js/config.js: 서비스 설정 (gopang-proxy 연결)
- docs/index.json: 문서 인덱스 (7건)
- docs/strategy/: 확산전략·사업화계획 (2건)
- docs/pilot/: 제주도·한림읍 파일럿 (2건)
- docs/subsystems/: K-Law 가상판결 출력형식 v13.2 (1건)
- docs/ops/: OFP 표준화계획서·TF 구성안 (2건)
- CNAME: qna.gopang.net"

# 4. 푸시
git push -u origin main

# 5. GitHub Pages 활성화 (Settings > Pages > Branch: main, Folder: /)
Write-Host ""
Write-Host "=== 다음 단계 ==="
Write-Host "1. https://github.com/Openhash-Gopang/qna/settings/pages"
Write-Host "   Branch: main / Folder: / (root) 선택 후 Save"
Write-Host "2. Cloudflare DNS: qna.gopang.net CNAME Openhash-Gopang.github.io"
Write-Host "3. 완료 후 https://qna.gopang.net 접속 확인"
