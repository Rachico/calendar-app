const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Availability, validateAvailability } = require('../models/availability');
const { Reservation } = require('../models/reservation');
require('dotenv').config();

router.post("/", async (req, res) => {
    const { error } = validateAvailability(req.body);

    if (error) {
        res.status(400).send(attributes.error.details[0].message);
        return;
    }
    
   // TODO Check if time slot already exists

    let availability = new Availability({
        start: req.body.start,
        end: req.body.end,
    });
    
    await availability.save();
    res.send(availability);

});

router.get("/", async (req, res) => {
    try {
        const availabilities = await Availability.find().populate("reservations");
        res.json(availabilities)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
});

router.get("/:id/reservations", async (req, res) => {
    let availability = await Availability.find({_id : req.params.id }).populate("reservations");
    res.send(availability);

});


router.delete('/:id',async (req, res) => {
    try {
        const availability = await Availability.findOneAndDelete({_id : req.params.id});
        if (!availability) {
            res.status(404).json({msg : "The availability with the given ID was not found."})
        }
        _ids = availability.reservations

        Reservation.deleteMany({_id: { $in: _ids}}, function(err) {
            console.log(err);
        }); 
        
        res.json({msg: `The availability with ID ${availability.id} was deleted successfully!`});
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
});



module.exports = router;