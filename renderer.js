const TIMEZONE = "Europe/Madrid";

const AUDIO_URLS = {
  1: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/Record_2026-01-17-13-00-37-_online-video-cutter.com_.opus",
  2: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/2026-01-06-14-01-48-_online-video-cutter.com_.opus",
  3: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/2026-01-01-15-04-57-_online-video-cutter.com_.opus",
  4: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/2026-01-01-16-09-58%20(mp3cut.net)%20(1).mp3",
  5: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/Record_2026-01-07-17-02-44-_online-video-cutter.com_%20(1).opus",
  6: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/Record_2026-01-10-18-00-13-_online-video-cutter.com_.opus",
  7: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/2026-01-05-19-02-06-_online-video-cutter.com_.opus",
  8: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/Record_2026-01-08-23-00-53-_online-video-cutter-_online-video-cutter.com_-_2_.opus",
  9: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/2026-01-05-21-02-08-_online-video-cutter.com_.opus",
  10: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/2026-01-05-22-06-37-_online-video-cutter.com_.opus",
  11: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/Record_2026-01-08-23-00-53-_online-video-cutter-_online-video-cutter.com_.opus",
  12: "https://github.com/angelmelo2909112/los40classic/raw/refs/heads/main/Record_2026-01-10-12-00-25-_online-video-cutter.com_-_online-video-cutter.com_-_1_.opus"
};

let ctx;
let dest;

async function devices() {
  const d = await navigator.mediaDevices.enumerateDevices();
  return d.filter(x => x.kind === "audiooutput");
}

function hour12() {
  const p = new Intl.DateTimeFormat("es-ES", {
    timeZone: TIMEZONE,
    hour: "numeric",
    hour12: true
  }).formatToParts(new Date());
  return parseInt(p.find(x => x.type === "hour").value);
}

async function nextHour() {
  const now = await window.clock.now();
  const m = new Date(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(now))
  );
  m.setMinutes(0, 0, 0);
  m.setHours(m.getHours() + 1);
  return m.getTime();
}

async function buffer(url) {
  const r = await fetch(url);
  const b = await r.arrayBuffer();
  return ctx.decodeAudioData(b);
}

async function schedule() {
  const h = hour12();
  const buf = await buffer(AUDIO_URLS[h]);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(dest);
  const t = await nextHour();
  const n = await window.clock.now();
  const lat = ctx.baseLatency + ctx.outputLatency;
  src.start(ctx.currentTime + (t - n) / 1000 - lat);
  setTimeout(schedule, (t - n) + 200);
}

(async () => {
  const sel = document.getElementById("out");
  (await devices()).forEach(d => {
    const o = document.createElement("option");
    o.value = d.deviceId;
    o.textContent = d.label || "output";
    sel.appendChild(o);
  });

  document.getElementById("start").onclick = async () => {
    ctx = new AudioContext();
    if (ctx.setSinkId) await ctx.setSinkId(sel.value);
    dest = ctx.destination;
    await ctx.resume();
    schedule();
  };
})();
