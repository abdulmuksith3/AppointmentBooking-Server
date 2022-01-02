const express = require('express');
// const cors = require('cors');
const dbo = require('./db');
const PORT = 3000;
const app = express();

// app.use(cors());
app.use(express.json());

const buyerRoute = require('./routes/buyer')
app.use('/buyer', buyerRoute);

const sellerRoute = require('./routes/seller')
app.use('/seller', sellerRoute);

// Global error handling
// app.use((_req, res) => {
//   console.error(err.stack);
//   res.send('Something broke!');
// });


// perform a database connection when the server starts
dbo.connectToServer((err) => {
  if (err) {
    console.error(err);
    process.exit();
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
