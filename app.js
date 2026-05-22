const mainTime = document.getElementById("mainTime");
const frame = document.getElementById("frame");
const dateEl = document.getElementById("date");
const statusEl = document.getElementById("status");

const btnRehearsal =
  document.getElementById("btnRehearsal");

const btnLive =
  document.getElementById("btnLive");

const customInput =
  document.getElementById("customInput");

const btnApply =
  document.getElementById("btnApply");

const fpsSelect =
  document.getElementById("fpsSelect");

const btnJam =
  document.getElementById("btnJam");

const ltcStatus =
  document.getElementById("ltcStatus");

/* FPS */
let FPS = 29.97;

/* LTC */
let ltcSource = null;
let ltcPlaying = false;

/* FPS変更 */
fpsSelect.addEventListener("change", () => {

  FPS = parseFloat(
    fpsSelect.value
  );
});

/* ステータス */
function setStatus(text) {

  statusEl.textContent = text;

  if (text === "本番") {

    statusEl.style.color =
      "#ff3b30";

  } else {

    statusEl.style.color =
      "#ffcc00";
  }
}

/* リハ */
btnRehearsal.addEventListener(
  "click",
  () => {

    setStatus("リハーサル");
  }
);

/* 本番 */
btnLive.addEventListener(
  "click",
  () => {

    setStatus("本番");
  }
);

/* カスタム */
btnApply.addEventListener(
  "click",
  () => {

    const text =
      customInput.value.trim();

    if (text !== "") {

      setStatus(text);
    }
  }
);

/* 時計 */
function updateClock() {

  const now = new Date();

  const h = String(
    now.getHours()
  ).padStart(2, "0");

  const m = String(
    now.getMinutes()
  ).padStart(2, "0");

  const s = String(
    now.getSeconds()
  ).padStart(2, "0");

  const f = String(
    Math.floor(
      (now.getMilliseconds() / 1000)
      * FPS
    )
  ).padStart(2, "0");

  mainTime.textContent =
    `${h}:${m}:${s}`;

  frame.textContent =
    `:${f}`;

  const yyyy =
    now.getFullYear();

  const mm = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const dd = String(
    now.getDate()
  ).padStart(2, "0");

  dateEl.textContent =
    `${yyyy}/${mm}/${dd}`;
}

setInterval(
  updateClock,
  1000 / 30
);

updateClock();

setStatus("リハーサル");

/* AUDIO */

const audioCtx = new (
  window.AudioContext ||
  window.webkitAudioContext
)();

/* LTC風波形 */
function createLTCBuffer(
  duration = 10
) {

  const sampleRate =
    audioCtx.sampleRate;

  const totalSamples =
    sampleRate * duration;

  const buffer =
    audioCtx.createBuffer(
      1,
      totalSamples,
      sampleRate
    );

  const data =
    buffer.getChannelData(0);

  let phase = 0;

  const bitRate =
    FPS * 80;

  for (
    let i = 0;
    i < totalSamples;
    i++
  ) {

    const t =
      i / sampleRate;

    const bitClock =
      Math.floor(
        t * bitRate
      );

    const bit =
      bitClock % 2;

    const freq =
      bit ? 2400 : 1200;

    phase +=
      (
        2 * Math.PI *
        freq
      ) / sampleRate;

    /* LTC風矩形 */
    data[i] =
      Math.sign(
        Math.sin(phase)
      ) * 0.25;
  }

  return buffer;
}

/* Push Jam */
btnJam.addEventListener(
  "click",
  async () => {

    await audioCtx.resume();

    /* 停止 */
    if (ltcPlaying) {

      if (ltcSource) {

        ltcSource.stop();
      }

      ltcPlaying = false;

      ltcStatus.textContent =
        "STOP";

      ltcStatus.style.color =
        "#00ff9f";

      return;
    }

    /* 再生 */
    const buffer =
      createLTCBuffer(10);

    ltcSource =
      audioCtx.createBufferSource();

    ltcSource.buffer =
      buffer;

    ltcSource.connect(
      audioCtx.destination
    );

    ltcSource.start();

    ltcPlaying = true;

    ltcStatus.textContent =
      "LTC OUT";

    ltcStatus.style.color =
      "#ff3b30";

    ltcSource.onended = () => {

      ltcPlaying = false;

      ltcStatus.textContent =
        "STOP";

      ltcStatus.style.color =
        "#00ff9f";
    };
  }
);

/* PWA */
if (
  "serviceWorker"
  in navigator
) {

  navigator.serviceWorker.register(
    "./service-worker.js"
  );
}