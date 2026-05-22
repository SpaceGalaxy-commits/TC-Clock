const mainTime = document.getElementById("mainTime");
const frame = document.getElementById("frame");
const dateEl = document.getElementById("date");
const statusEl = document.getElementById("status");

const btnRehearsal = document.getElementById("btnRehearsal");
const btnLive = document.getElementById("btnLive");

const customInput = document.getElementById("customInput");
const btnApply = document.getElementById("btnApply");

const btnJam = document.getElementById("btnJam");

const fpsSelect = document.getElementById("fpsSelect");

/* FPS */
let FPS = 29.97;

/* FPS変更 */
fpsSelect.addEventListener("change", () => {
  FPS = parseFloat(fpsSelect.value);
});

/* ステータス変更 */
function setStatus(text) {

  statusEl.textContent = text;

  if (text === "本番") {
    statusEl.style.color = "#ff3b30";
  } else {
    statusEl.style.color = "#ffcc00";
  }
}

/* リハ */
btnRehearsal.addEventListener("click", () => {
  setStatus("リハーサル");
});

/* 本番 */
btnLive.addEventListener("click", () => {
  setStatus("本番");
});

/* カスタム */
btnApply.addEventListener("click", () => {

  const text = customInput.value.trim();

  if (text !== "") {
    setStatus(text);
  }
});

/* Enter */
customInput.addEventListener("keydown", (e) => {

  if (e.key === "Enter") {
    btnApply.click();
  }
});

/* 時計更新 */
function updateClock() {

  const now = new Date();

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  const f = String(
    Math.floor((now.getMilliseconds() / 1000) * FPS)
  ).padStart(2, "0");

  const yyyy = now.getFullYear();

  const mm = String(now.getMonth() + 1).padStart(2, "0");

  const dd = String(now.getDate()).padStart(2, "0");

  mainTime.textContent = `${h}:${m}:${s}`;

  frame.textContent = `:${f}`;

  dateEl.textContent = `${yyyy}/${mm}/${dd}`;
}

updateClock();

setInterval(updateClock, 1000 / 30);

/* 初期 */
setStatus("リハーサル");

/* =========================
   LTC GENERATOR
========================= */

const audioCtx = new (
  window.AudioContext ||
  window.webkitAudioContext
)();

/* LTC生成 */
function generateLTCTone(duration = 10) {

  const sampleRate = audioCtx.sampleRate;

  const totalSamples = sampleRate * duration;

  const buffer = audioCtx.createBuffer(
    1,
    totalSamples,
    sampleRate
  );

  const data = buffer.getChannelData(0);

  let phase = 0;

  const freq0 = 1200;
  const freq1 = 2400;

  for (let i = 0; i < totalSamples; i++) {

    const t = i / sampleRate;

    const bit = Math.floor(
      t * FPS * 80
    ) % 2;

    const freq = bit ? freq1 : freq0;

    phase += (
      2 * Math.PI * freq
    ) / sampleRate;

    data[i] = Math.sin(phase) * 0.25;
  }

  const source = audioCtx.createBufferSource();

  source.buffer = buffer;

  source.connect(audioCtx.destination);

  source.start();
}

/* Push Jam */
btnJam.addEventListener("click", async () => {

  await audioCtx.resume();

  generateLTCTone(10);

  console.log(
    `LTC JAM START (${FPS})`
  );
});

/* PWA */
if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register(
    "./service-worker.js"
  );
}