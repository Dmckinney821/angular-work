const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/dev')
const FakeDb = require('./fake-db')

const rentalRoutes = require('./routes/rentals'),
	userRoutes = require('./routes/users')

    mongoose.connect(config.DB_URI).then(() => {
        // if (process.env.NODE_ENV !== 'production') {
          const fakeDb = new FakeDb();
          fakeDb.seedDb();
        // }
      });

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log('I am running')
})
