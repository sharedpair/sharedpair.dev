#!/usr/bin/env bash
set -euo pipefail

apt_root=${SHARED_ELECTRON_ROOT:-/home/will/shared-electron}
output_root=/home/will/sharedpair.dev/public/images/applications/marktext
mkdir -p "$output_root"

runtime_deb=$(find "$apt_root/dist" -maxdepth 1 -name 'electron-runtime-42_*_amd64.deb' -print | sort -V | tail -1)
app_deb="$apt_root/dist/marktext_0.19.1-1foundry2_amd64.deb"
test -f "$runtime_deb"
test -f "$app_deb"

docker run --rm -i \
  --security-opt seccomp=unconfined \
  -e DEBIAN_FRONTEND=noninteractive \
  -v "$apt_root/dist:/debs:ro" \
  ubuntu:26.04 bash -s -- \
  "$(basename "$runtime_deb")" "$(basename "$app_deb")" <<'CONTAINER' |
set -euo pipefail
apt-get update -qq
apt-get install -y --no-install-recommends \
  xvfb xauth x11-utils dbus-x11 openbox wmctrl imagemagick \
  "/debs/$1" "/debs/$2" >/dev/null
useradd --create-home --shell /bin/bash electron-test
printf '%s\n' \
  '# Shared Pair' \
  '' \
  '**One runtime. More room.**' \
  '' \
  'Shared Pair packages Linux desktop applications against versioned Electron runtimes.' \
  '' \
  '## What is shared' \
  '' \
  '- Electron and Chromium' \
  '- Common runtime resources' \
  '- Security updates for each runtime line' \
  '' \
  '## What stays with the app' \
  '' \
  '- Application code and identity' \
  '- Native modules and private helpers' \
  '- User data and configuration' \
  '' \
  '> A covalent bond shares an electron pair. Shared Pair applies the same idea to desktop runtimes.' \
  > /tmp/shared-pair.md
chown electron-test:electron-test /tmp/shared-pair.md
chmod 0644 /tmp/shared-pair.md

Xvfb :99 -screen 0 1440x960x24 -ac -nolisten tcp >/tmp/xvfb.log 2>&1 &
xvfb_pid=$!
trap 'kill "$xvfb_pid" 2>/dev/null || true' EXIT
export DISPLAY=:99
for _ in $(seq 1 50); do xdpyinfo >/dev/null 2>&1 && break; sleep .1; done

runuser -u electron-test -- env DISPLAY=:99 openbox >/tmp/openbox.log 2>&1 &
sleep 1
runuser -u electron-test -- env \
  DISPLAY=:99 \
  HOME=/home/electron-test \
  XDG_CONFIG_HOME=/home/electron-test/.config \
  XDG_CACHE_HOME=/home/electron-test/.cache \
  /usr/bin/marktext /tmp/shared-pair.md \
  >/tmp/marktext.log 2>&1 &
app_pid=$!

window_id=
for _ in $(seq 1 160); do
  window_id=$(wmctrl -l | awk 'tolower($0) ~ /mark ?text|shared-pair/ { print $1; exit }')
  [[ -n "$window_id" ]] && break
  sleep .25
done
[[ -n "$window_id" ]] || { cat /tmp/marktext.log >&2; exit 1; }
wmctrl -ir "$window_id" -b add,maximized_vert,maximized_horz
sleep 20
import -display :99 -window "$window_id" /tmp/marktext-interface.png
test -s /tmp/marktext-interface.png
identify /tmp/marktext-interface.png >&2
kill "$app_pid" 2>/dev/null || true
base64 -w0 /tmp/marktext-interface.png
CONTAINER
base64 -d > "$output_root/marktext-0.19.1-electron-42.9.3.png"
test -s "$output_root/marktext-0.19.1-electron-42.9.3.png"
