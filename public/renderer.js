const speakersSelect = document.getElementById("speakers");
let ctx, dest;

async function loadSpeakers() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  devices.filter(d => d.kind === "audiooutput").forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.deviceId;
    opt.textContent = d.label || "Altavoz";
    speakersSelect.appendChild(opt);
  });
}

async function getNextHourTime() {
  const res = await fetch("/current-audio");
  const data = await res.json();
  return data.url;
}

async function scheduleChime() {
  const url = await getNextHourTime();
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = await ctx.decodeAudioData(arrayBuffer);

  const now = new Date();
  const next = new Date();
  next.setMinutes(0,0,0);
  next.setHours(next.getHours()+1);
  const delay = (next - now)/1000;

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(dest);
  src.start(ctx.currentTime + delay);

  setTimeout(scheduleChime, (delay+0.1)*1000);
}

document.getElementById("start").onclick = async () => {
  ctx = new AudioContext();
  dest = ctx.destination;
  if (ctx.setSinkId) await ctx.setSinkId(speakersSelect.value);
  await ctx.resume();
  scheduleChime();
};

loadSpeakers();
