#!/usr/bin/env bash
# Fetch every interfaceScreenshot referenced in src/data/project.ts that is
# missing from public/, converting GitHub blob URLs to raw URLs, and verify
# the downloaded bytes are an image whose type matches the file extension.
set -euo pipefail
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  echo "usage: $0            fetch missing upstream screenshots"
  echo "       $0 --check    only report missing files (exit 1 if any)"
  exit 0
fi
cd "$(dirname "$0")/.."
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
missing=0 failed=0
while IFS=$'\t' read -r src source; do
  dest="public$src"
  [[ -f "$dest" ]] && continue
  missing=$((missing+1))
  if [[ "${1:-}" == "--check" ]]; then echo "$(ts) MISSING $dest"; continue; fi
  raw="$source"
  if [[ "$raw" =~ ^https://github\.com/([^/]+)/([^/]+)/blob/(.+)$ ]]; then
    raw="https://raw.githubusercontent.com/${BASH_REMATCH[1]}/${BASH_REMATCH[2]}/${BASH_REMATCH[3]}"
  fi
  mkdir -p "$(dirname "$dest")"
  if ! curl -fsSL --max-time 60 -A 'sharedpair.dev screenshot sync' -o "$dest" "$raw"; then
    echo "$(ts) FAIL   $dest  <- $raw"; rm -f "$dest"; failed=$((failed+1)); continue
  fi
  mime=$(file -b --mime-type "$dest")
  ext="${dest##*.}"
  case "$ext:$mime" in
    png:image/png|jpg:image/jpeg|jpeg:image/jpeg|webp:image/webp) ;;
    *) echo "$(ts) BADTYPE $dest is $mime"; rm -f "$dest"; failed=$((failed+1)); continue ;;
  esac
  node -e '
    const fs=require("fs");const p="public/images/applications/provenance.json";const prov=JSON.parse(fs.readFileSync(p,"utf8"));
    const [src,source]=process.argv.slice(1);
    prov.images[src]={kind:"upstream-interface",origin:"Downloaded from the upstream project, not produced by our build",source,localCaptureStatus:"pending",fetched:new Date().toISOString().slice(0,10)};
    prov.pendingLocalCapture=[...new Set(Object.entries(prov.images).filter(([,v])=>v.localCaptureStatus==="pending").map(([k])=>k.split("/")[3]))].sort();
    fs.writeFileSync(p,JSON.stringify(prov,null,2)+"\n");' "$src" "$source"
  echo "$(ts) OK     $dest ($(du -h "$dest" | cut -f1)) <- $raw"
done < <(node -e '
const fs=require("fs");const s=fs.readFileSync("src/data/project.ts","utf8");
const re=/interfaceScreenshot: \{ src: \x27([^\x27]+)\x27, alt: (?:\x27(?:[^\x27\\]|\\.)*\x27|"(?:[^"\\]|\\.)*"), source: \x27([^\x27]+)\x27 \}/g;
let m;while((m=re.exec(s)))console.log(m[1]+"\t"+m[2]);')
echo "$(ts) missing=$missing failed=$failed"
[[ $failed -eq 0 ]] && { [[ "${1:-}" != "--check" || $missing -eq 0 ]]; }
