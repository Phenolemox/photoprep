import { T } from './strings.js';
import { FaceDetector, FilesetResolver } from './vendor/vision_bundle.mjs';
const $ = id => document.getElementById(id);
// Пороги (откалиброваны на testset/, см. ARGUS_INSTRUCTIONS.md — риск подгонки)
export const TH = { blur: 60, dark: 70, over: 200, clipHi: 0.25, flat: 28, minFace: 90, multiRel: 0.35, conf: 0.5 };
const set = (id, txt) => { $(id).textContent = txt; };
set('t-title', T.title); set('t-lead', T.lead); set('t-pick', T.pick); set('t-frame', T.frame); set('t-sq', T.frameSquare);
set('t-pt', T.framePortrait); set('all', T.downloadAll); set('t-memo', T.memoTitle); set('t-privacy', T.privacy);
set('t-limits', T.limits); set('t-limits-title', T.limitsTitle); set('improve', T.improve);
T.memo.forEach(m => { const li = document.createElement('li'); li.textContent = m; $('memo').append(li); });
T.limitations.forEach(m => { const li = document.createElement('li'); li.textContent = m; $('limits-list').append(li); });

const MODEL = './models/blaze_face_full_range.tflite'; // full-range: short-range пропускал второе лицо на коллажах (3 из 5)
let detector = null; const results = [];
window.__photoprep = { results, TH, ready: false, loadMs: null };
(async () => {
  set('status', T.loading); const t0 = performance.now();
  try {
    const fs = await FilesetResolver.forVisionTasks(new URL('./vendor/wasm', location.href).href);
    detector = await FaceDetector.createFromOptions(fs, { baseOptions: { modelAssetPath: MODEL, delegate: 'CPU' },
      runningMode: 'IMAGE', minDetectionConfidence: TH.conf });
    const ms = Math.round(performance.now() - t0); window.__photoprep.loadMs = ms; window.__photoprep.ready = true;
    set('status', `${T.ready} (${(ms / 1000).toFixed(1)} ${T.sec})`);
  } catch (e) { console.warn(e); window.__photoprep.loadFailed = true; set('status', T.loadFail); }
})();

function loadImg(file) { return new Promise((ok, no) => { const u = URL.createObjectURL(file); const i = new Image();
  i.onload = () => { URL.revokeObjectURL(u); ok(i); }; i.onerror = () => { URL.revokeObjectURL(u); no(new Error('bad image')); }; i.src = u; }); }

function stats(img, b) { // метрики по области лица, приведённой к 200 px
  const S = 128, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(img, b.originX, b.originY, b.width, b.height, 0, 0, S, S);
  const d = x.getImageData(0, 0, S, S).data, g = new Float32Array(S * S);
  let sum = 0, hi = 0; for (let i = 0; i < S * S; i++) { const v = 0.299 * d[4 * i] + 0.587 * d[4 * i + 1] + 0.114 * d[4 * i + 2]; g[i] = v; sum += v; if (v > 245) hi++; }
  const mean = sum / (S * S); let vs = 0; for (const v of g) vs += (v - mean) ** 2; const std = Math.sqrt(vs / (S * S));
  let ls = 0, ls2 = 0, n = 0; for (let y = 1; y < S - 1; y++) for (let xx = 1; xx < S - 1; xx++) { const i = y * S + xx;
    const l = g[i - 1] + g[i + 1] + g[i - S] + g[i + S] - 4 * g[i]; ls += l; ls2 += l * l; n++; }
  const lap = ls2 / n - (ls / n) ** 2;
  return { mean: +mean.toFixed(1), std: +std.toFixed(1), clipHi: +(hi / (S * S)).toFixed(3), lap: +lap.toFixed(1) };
}

export function verdict(faces, st, faceW, img, fullSt) {
  if (!faces.length) {
    if (fullSt && (fullSt.mean > TH.over || fullSt.clipHi > TH.clipHi)) return ['noFaceOver'];
    return ['noFace'];
  }
  const big = Math.max(...faces.map(f => f.boundingBox.width));
  if (faces.filter(f => f.boundingBox.width >= TH.multiRel * big).length > 1) return ['multi'];
  const r = []; if (faceW < TH.minFace) r.push('small');
  const b = faces.slice().sort((p, q) => q.boundingBox.width - p.boundingBox.width)[0].boundingBox, m = 0.01;
  if (img && (b.originX < img.naturalWidth * -m || b.originY < img.naturalHeight * -m || b.originX + b.width > img.naturalWidth * (1 + m) || b.originY + b.height > img.naturalHeight * (1 + m))) r.push('cut');
  if (st.mean < TH.dark) r.push('dark'); else if (st.mean > TH.over || st.clipHi > TH.clipHi) r.push('over');
  else if (st.std < TH.flat) r.push('flat');
  if (st.lap < TH.blur && !r.includes('small')) r.push('blur');
  return r;
}

function crop(img, b, ratio) {
  const cx = b.originX + b.width / 2, cy = b.originY + b.height * 0.45;
  let w = b.width * 2.4, h = w / ratio; const k = Math.min(1, img.naturalWidth / w, img.naturalHeight / h); w *= k; h *= k;
  const x0 = Math.min(Math.max(0, cx - w / 2), img.naturalWidth - w), y0 = Math.min(Math.max(0, cy - h / 2), img.naturalHeight - h);
  const out = Math.min(1024, w), c = document.createElement('canvas'); c.width = Math.round(out); c.height = Math.round(out / ratio);
  c.getContext('2d').drawImage(img, x0, y0, w, h, 0, 0, c.width, c.height); return c;
}

async function analyze(file) {
  const img = await loadImg(file); const res = detector.detect(img); const faces = res.detections || [];
  const ratio = +$('frame').value; let st = null, canvas = null, faceW = 0;
  const main = faces.slice().sort((a, b) => b.boundingBox.width - a.boundingBox.width)[0];
  if (main) { faceW = main.boundingBox.width; st = stats(img, main.boundingBox); canvas = crop(img, main.boundingBox, ratio); }
  const fullSt = stats(img, { originX: 0, originY: 0, width: img.naturalWidth, height: img.naturalHeight });
  const reasons = verdict(faces, st, faceW, img, fullSt);
  const r = { name: file.name, ok: reasons.length === 0, reasons, faces: faces.length, scores: faces.map(f => +f.categories[0].score.toFixed(2)), widths: faces.map(f => Math.round(f.boundingBox.width)), faceW: Math.round(faceW), st, canvas };
  results.push(r); render(r, img);
}

function render(r, img) {
  const d = document.createElement('div'); d.className = 'card ' + (r.ok ? 'good' : 'replace'); d.dataset.file = r.name; d.dataset.verdict = r.ok ? 'годится' : 'заменить';
  d.dataset.reasons = r.reasons.join(',');
  const im = document.createElement('img'); im.alt = r.name;
  if (r.canvas) im.src = r.canvas.toDataURL('image/jpeg', 0.9); else { const c = document.createElement('canvas'); c.width = 300; c.height = Math.round(300 * img.naturalHeight / img.naturalWidth); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); im.src = c.toDataURL('image/jpeg', 0.8); }
  const v = document.createElement('div'); v.className = 'v'; v.textContent = r.ok ? T.good : T.replace;
  const rs = document.createElement('div'); rs.className = 'r'; rs.textContent = r.ok ? T.okReason : r.reasons.map(k => T.reasons[k]).join(' ');
  d.append(im, v, rs);
  if (r.canvas) { const b = document.createElement('button'); b.textContent = T.download; b.onclick = () => dl(r); d.append(b); }
  $('grid').append(d); const g = results.filter(x => x.ok).length; set('summary', T.summary(g, results.length)); $('all').disabled = !g;
}
function dl(r) { r.canvas.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b);
  a.download = r.name.replace(/\.[^.]+$/, '') + '_crop.jpg'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); }, 'image/jpeg', 0.92); }
$('all').onclick = () => results.filter(r => r.ok).forEach((r, i) => setTimeout(() => dl(r), i * 300));
async function handle(files) { if (!detector) { set('status', T.loading); while (!detector && !window.__photoprep.loadFailed) await new Promise(r => setTimeout(r, 200)); }
  for (const f of files) { try { await analyze(f); } catch (err) { console.warn(err); } }
  window.__photoprep.done = (window.__photoprep.done || 0) + files.length;
}
$('file').onchange = e => handle([...e.target.files]);
addEventListener('dragover', e => e.preventDefault());
addEventListener('drop', e => { e.preventDefault(); handle([...e.dataTransfer.files].filter(f => f.type.startsWith('image/'))); });
