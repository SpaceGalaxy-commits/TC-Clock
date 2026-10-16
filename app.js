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


/* PWA */
if (
  "serviceWorker"
  in navigator
) {

  navigator.serviceWorker.register(
    "./service-worker.js"
  );
}
