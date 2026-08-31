#!/usr/bin/env bash
set -euo pipefail

apt_root=${SHARED_ELECTRON_ROOT:-/home/will/shared-electron}
output_root=/home/will/sharedpair.dev/public/images/applications/teams-for-linux
mkdir -p "$output_root"

runtime_deb=$(find "$apt_root/dist" -maxdepth 1 -name 'electron-runtime-42_42.9.3-1foundry1_amd64.deb' -print -quit)
app_deb="$apt_root/dist/teams-for-linux_2.18.1-1foundry1_amd64.deb"
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
apt-get install -y --no-install-recommends xvfb xauth dbus-x11 openbox imagemagick "/debs/$1" "/debs/$2" >/dev/null
useradd --create-home --shell /bin/bash electron-test
install -d -o electron-test -g electron-test /tmp/teams-config /tmp/teams-cache /tmp/teams-data
runuser -u electron-test -- Xvfb :99 -screen 0 1440x900x24 -nolisten tcp >/tmp/xvfb.log 2>&1 &
sleep 2
runuser -u electron-test -- env DISPLAY=:99 openbox >/tmp/openbox.log 2>&1 &
sleep 2
runuser -u electron-test -- env \
  DISPLAY=:99 \
  XDG_CONFIG_HOME=/tmp/teams-config \
  XDG_CACHE_HOME=/tmp/teams-cache \
  XDG_DATA_HOME=/tmp/teams-data \
  dbus-run-session -- /usr/bin/teams-for-linux --disable-gpu >/tmp/teams.log 2>&1 &
sleep 20
pgrep -u electron-test -x electron >/dev/null
import -display :99 -window root /tmp/teams-for-linux-2.18.1-electron-42.9.3.png
test -s /tmp/teams-for-linux-2.18.1-electron-42.9.3.png
pkill -u electron-test || true
base64 -w0 /tmp/teams-for-linux-2.18.1-electron-42.9.3.png
CONTAINER
base64 -d > "$output_root/teams-for-linux-2.18.1-electron-42.9.3.png"
test -s "$output_root/teams-for-linux-2.18.1-electron-42.9.3.png"
