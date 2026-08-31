#!/usr/bin/env bash
set -euo pipefail

apt_root=${SHARED_ELECTRON_ROOT:-/home/will/shared-electron}
output_root=/home/will/sharedpair.dev/public/images/applications/trilium-notes
mkdir -p "$output_root"

runtime_deb=$(find "$apt_root/dist" -maxdepth 1 -name 'electron-runtime-44_*_amd64.deb' -print | sort -V | tail -1)
app_deb="$apt_root/dist/trilium-notes_0.105.0~git20260831.d2df448d-1foundry1_amd64.deb"
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
install -d -o electron-test -g electron-test \
  /tmp/trilium-data /tmp/trilium-electron

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
  TRILIUM_DATA_DIR=/tmp/trilium-data \
  TRILIUM_ELECTRON_DATA_DIR=/tmp/trilium-electron \
  XDG_CONFIG_HOME=/tmp/trilium-electron \
  dbus-run-session -- /usr/bin/trilium-notes --disable-gpu \
  >/tmp/trilium.log 2>&1 &
app_pid=$!

window_id=
for _ in $(seq 1 160); do
  window_id=$(wmctrl -l | awk 'tolower($0) ~ /trilium/ { print $1; exit }')
  [[ -n "$window_id" ]] && break
  sleep .25
done
[[ -n "$window_id" ]] || { cat /tmp/trilium.log >&2; exit 1; }
wmctrl -ir "$window_id" -b add,maximized_vert,maximized_horz
sleep 8
xdotool mousemove --window "$window_id" 660 600 click 1
sleep 5
xdotool mousemove --window "$window_id" 360 285 click 1
sleep 5
xdotool mousemove --window "$window_id" 360 250 click 1
sleep 30
window_id=
for _ in $(seq 1 160); do
  window_id=$(wmctrl -l | awk 'tolower($0) ~ /trilium/ { print $1; exit }')
  [[ -n "$window_id" ]] && break
  sleep .25
done
[[ -n "$window_id" ]] || { cat /tmp/trilium.log >&2; exit 1; }
wmctrl -ir "$window_id" -b add,maximized_vert,maximized_horz
sleep 10
import -display :99 -window "$window_id" /tmp/trilium-interface.png
test -s /tmp/trilium-interface.png
identify /tmp/trilium-interface.png >&2
kill "$app_pid" 2>/dev/null || true
base64 -w0 /tmp/trilium-interface.png
CONTAINER
base64 -d > "$output_root/trilium-notes-0.105.0-electron-44.0.0.png"
test -s "$output_root/trilium-notes-0.105.0-electron-44.0.0.png"
