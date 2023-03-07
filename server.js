require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index", {
    location: "--",
    ip_address: "--",
    timezone: "--",
    isp: "--",
    latitude: 40.7128,
    longitude: -74.006,
  });
});
app.post("/", function (req, res) {
  const ip = req.body.ipaddress;
  const apiKey = process.env.API_KEY;
  const url =
    "https://geo.ipify.org/api/v2/country,city?apiKey=" +
    "at_yklQMidh5LeDKHoef6YuVdegaNi7N" +
    "&ipAddress=" +
    ip;
  https.get(url, function (response) {
    if (response.statusCode === 200) {
      response.on("data", function (data) {
        const json = JSON.parse(data);
        const city = json.location.city;
        const ip = json.ip;
        const isp = json.as.name;
        const timezone = json.location.timezone;
        const latitude = json.location.lat;
        const longitude = json.location.lng;
        res.render("index", {
          location: city,
          ip_address: ip,
          timezone: timezone,
          isp: isp,
          latitude: latitude,
          longitude: longitude,
        });
      });
    } else {
      res.send("<h1>Not able to Fetch the data of the given ip address</h1>");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started");
});
