if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");
const { request } = require("https");
const stripe = require("stripe")(stripeSecretKey);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/store", function (req, res) {
  fs.readFile("items.json", function (err, data) {
    if (err) {
      res.status(500).end();
    } else {
      res.render("store.ejs", {
        stripePublicKey: stripePublicKey,
        items: JSON.parse(data),
      });
    }
  });
});

app.post("/purchase", function (req, res) {
  fs.readFile("items.json", function (err, data) {
    if (err) {
      res.status(500).end();
    } else {
      const itemsJson = JSON.parse(data);
      const itemsArray = itemsJson.music.concat(itemsJson.merch);
      let total = 0;
      req.body.items.forEach((item) => {
        const itemJson = itemsArray.find(function (i) {
          return i.id == item.id;
        });
        total = total + itemJson.price * item.quantity;
      });

      stripe.charges
        .create({
          amount: total,
          source: request.body.stripeTokenId,
          currency: "usd",
        })
        .then(function () {
          console.log("Charge Successful");
          res.json({ message: "Successfully purchased items " });
        })
        .catch(function () {
          console.log("Charge Fail");
          res.status(500).end();
        });
    }
  });
});

app.listen(4000);
