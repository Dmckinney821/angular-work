

const express = require('express')
const router = express.Router();
const Rental = require('../models/rental');
const UserContrl = require('../controllers/user')

router.get('/secret', UserContrl.authMiddleware, (req, res) => {
  res.json({"secret": true})
})


router.get('', (req,res) => {
  Rental.find({}, (err,foundRental) => {
    res.json(foundRental);
  });
});

router.get('/:id', (req, res) => {
    const rentalId = req.params.id;
    Rental.findById(rentalId, (err, foundRental) => {
        if(err) {
            res.status(422).send({errors: [{title: 'Rental Error!', detail: 'Could not find Rental'}]})
        }
        res.json(foundRental)
    })
})

module.exports = router