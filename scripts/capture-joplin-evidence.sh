#!/usr/bin/env bash
set -euo pipefail

apt_root=${SHARED_ELECTRON_ROOT:-/home/will/shared-electron}
output_root=/home/will/sharedpair.dev/public/images/applications/joplin
mkdir -p "$output_root"

runtime_deb=$(find "$apt_root/dist" -maxdepth 1 -name 'electron-runtime-42_*_amd64.deb' -print | sort -V | tail -1)
app_deb="$apt_root/dist/joplin_3.7.14-1foundry1_amd64.deb"
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
  xvfb xauth x11-utils dbus-x11 openbox wmctrl xdotool imagemagick \
  "/debs/$1" "/debs/$2" >/dev/null
useradd --create-home --shell /bin/bash electron-test
install -d -o electron-test -g electron-test /tmp/joplin-profile

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
  dbus-run-session -- /usr/bin/joplin \
  --profile /tmp/joplin-profile --no-welcome \
  >/tmp/joplin.log 2>&1 &
app_pid=$!

window_id=
for _ in $(seq 1 160); do
  window_id=$(wmctrl -l | awk 'tolower($0) ~ /joplin/ { print $1; exit }')
  [[ -n "$window_id" ]] && break
  sleep .25
done
[[ -n "$window_id" ]] || { cat /tmp/joplin.log >&2; exit 1; }
wmctrl -ir "$window_id" -b add,maximized_vert,maximized_horz
sleep 10
xdotool key --window "$window_id" ctrl+shift+n
sleep 2
xdotool type --window "$window_id" --delay 35 'Shared Pair'
xdotool mousemove 844 323 click 1
sleep 3
xdotool mousemove 900 743 click 1
sleep 2
xdotool key --window "$window_id" ctrl+n
sleep 2
xdotool type --window "$window_id" --delay 35 'Shared Electron 42'
xdotool key --window "$window_id" Tab
xdotool type --window "$window_id" --delay 20 'This Joplin profile was created in a clean Ubuntu 26.04 container and opened with the shared Electron 42 runtime.'
sleep 5
import -display :99 -window "$window_id" /tmp/joplin-interface.png
test -s /tmp/joplin-interface.png
identify /tmp/joplin-interface.png >&2
kill "$app_pid" 2>/dev/null || true
base64 -w0 /tmp/joplin-interface.png
CONTAINER
base64 -d > "$output_root/joplin-3.7.14-electron-42.9.3.png"
test -s "$output_root/joplin-3.7.14-electron-42.9.3.png"
