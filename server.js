const express = require('express');
const cors = require('cors');
const dbo = require('./db');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());
// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

const buyerRoute = require('./routes/buyer')
app.use('/buyer', buyerRoute);

const sellerRoute = require('./routes/seller')
app.use('/seller', sellerRoute);

app.get('/', async (req, res) => {
  console.log("HELLO WORLD")
});

// Global error handling
// app.use((_req, res) => {
//   console.error(err.stack);
//   res.send('Something broke!');
// });


dbo.connectToServer((err) => {
  if (err) {
    console.error(err);
    process.exit();
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
