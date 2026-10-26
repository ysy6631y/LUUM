#!/bin/zsh
# Finder does not inherit the same PATH as an interactive development terminal.
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
cd "$(dirname "$0")" || exit 1
site_url="http://127.0.0.1:5173/"
if ! command -v npm >/dev/null 2>&1; then
  print 'Node.js를 찾을 수 없습니다. Node.js 설치 후 다시 실행해 주세요.'
  read '?Enter를 누르면 종료합니다.'
  exit 1
fi
if [[ ! -d node_modules ]]; then
  npm ci || { read '?설치에 실패했습니다. Enter를 누르면 종료합니다.'; exit 1; }
fi
if curl --silent --fail "$site_url" >/dev/null 2>&1; then
  open "$site_url"
  exit 0
fi
(
  for attempt in {1..40}; do
    if curl --silent --fail "$site_url" >/dev/null 2>&1; then
      open "$site_url"
      exit 0
    fi
    sleep 0.25
  done
) &
print 'LUUM 서버를 실행합니다. 이 터미널 창을 열어 두세요. 종료: Ctrl+C'
npm run dev
server_status=$?
if [[ $server_status -ne 0 && $server_status -ne 130 ]]; then
  read '?실행에 실패했습니다. 위 오류를 확인하세요. Enter를 누르면 종료합니다.'
fi
exit $server_status
