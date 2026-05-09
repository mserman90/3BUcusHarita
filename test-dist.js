import https from "https";
https.get("https://api.adsb.lol/v2/lat/40/lon/-73/dist/10", (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    try {
      console.log(JSON.parse(data).ac.length, "planes");
    } catch(e) { console.log(data) }
  });
});
