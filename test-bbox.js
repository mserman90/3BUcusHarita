import https from "https";
https.get("https://api.adsb.lol/v2/lats/40/latn/41/lonl/-74/lonr/-73", (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => console.log(data));
});
