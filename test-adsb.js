import https from "https";
https.get("https://api.adsb.lol/v2/lat/40/lon/-73/dist/250", (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => console.log(data.slice(0, 500)));
});
