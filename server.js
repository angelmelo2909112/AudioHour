import express from "express";

const app = express();
const PORT = 3000;

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

function getHour12() {
  const date = new Date();
  const parts = new Intl.DateTimeFormat("es-ES", { timeZone: TIMEZONE, hour: "numeric", hour12: true }).formatToParts(date);
  return parseInt(parts.find(p => p.type === "hour").value);
}

app.get("/current-audio", (req, res) => {
  const hour = getHour12();
  res.json({ hour, url: AUDIO_URLS[hour] });
});

app.use(express.static("public"));

app.listen(PORT, () => console.log(`Servidor web corriendo en http://localhost:${PORT}`));
