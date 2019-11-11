

const express = require('express')
const router = express.Router();
const Rental = require('../models/rental');
const UserContrl = require('../controllers/user')

router.get('/secret', UserContrl.authMiddleware, (req, res) => {
  res.json({"secret": true})
})


router.get('', (req,res) => {
  Rental.find()
    .select('-bookings')
    .exec((err, foundRentals) => {
      res.json(foundRentals)
    })
});

router.get('/:id', (req, res) => {
    const rentalId = req.params.id;
    
    Rental.findById(rentalId)
      .populate('user', 'username -_id')
      .populate('bookings', 'startAt endAt -_id')
      .exec((err, foundRentals) => {
        if(err) {
          return res.status(422).send({errors: [{title: 'Rental Error!', detail: 'Could not find Rental'}]})
          }
          return res.json(foundRentals)
      })
})

module.exports = router