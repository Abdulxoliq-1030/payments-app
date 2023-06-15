if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

console.log("Hll");

const express = require("express");
const app = express();
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/store", function (req, res) {
  fs.readFile("items.json", function (err, data) {
    if (err) {
      res.status(500).end();
    } else {
      res.render("store.ejs", {
        items: JSON.parse(data),
      });
    }
  });
});

app.listen(4000);
