import ntpClient from "ntp-client";

let offset = 0;

export function syncTime() {
  return new Promise((resolve, reject) => {
    ntpClient.getNetworkTime("pool.ntp.org", 123, (e, d) => {
      if (e) reject(e);
      offset = d.getTime() - Date.now();
      resolve();
    });
  });
}

export function now() {
  return Date.now() + offset;
}
