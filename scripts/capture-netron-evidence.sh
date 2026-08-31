#!/usr/bin/env bash
set -euo pipefail

apt_root=${SHARED_ELECTRON_ROOT:-/home/will/shared-electron}
output_root=/home/will/sharedpair.dev/public/images/applications/netron
mkdir -p "$output_root"

runtime_deb=$(find "$apt_root/dist" -maxdepth 1 -name 'electron-runtime-44_*_amd64.deb' -print | sort -V | tail -1)
app_deb="$apt_root/dist/netron_9.2.4-1foundry1_amd64.deb"
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
apt-get install -y --no-install-recommends xvfb xauth dbus-x11 openbox imagemagick x11-utils xdotool \
  "/debs/$1" "/debs/$2" >/dev/null

useradd --create-home --shell /bin/bash electron-test
printf '%s\n' 'ir_version: 8' 'graph {' '  name: "shared-electron-smoke"' '}' > /tmp/model.pbtxt
chown electron-test:electron-test /tmp/model.pbtxt
install -d -o electron-test -g electron-test /tmp/netron-config /tmp/netron-cache /tmp/netron-data

runuser -u electron-test -- Xvfb :99 -screen 0 1440x900x24 -nolisten tcp >/tmp/xvfb.log 2>&1 &
sleep 2
runuser -u electron-test -- env DISPLAY=:99 openbox >/tmp/openbox.log 2>&1 &
sleep 2
runuser -u electron-test -- env \
  DISPLAY=:99 \
  XDG_CONFIG_HOME=/tmp/netron-config \
  XDG_CACHE_HOME=/tmp/netron-cache \
  XDG_DATA_HOME=/tmp/netron-data \
  dbus-run-session -- /usr/bin/netron /tmp/model.pbtxt --disable-gpu >/tmp/netron.log 2>&1 &
sleep 10
pgrep -u electron-test -x electron >/dev/null
import -display :99 -window root /tmp/netron-9.2.4-electron-44.0.0.png
test -s /tmp/netron-9.2.4-electron-44.0.0.png
pkill -u electron-test || true
base64 -w0 /tmp/netron-9.2.4-electron-44.0.0.png
CONTAINER
base64 -d > "$output_root/netron-9.2.4-electron-44.0.0.png"
test -s "$output_root/netron-9.2.4-electron-44.0.0.png"
