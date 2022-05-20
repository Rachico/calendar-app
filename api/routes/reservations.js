const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Reservation, validateReservation } = require('../models/reservation');
const { Availability } = require('../models/availability');
require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

router.post('/', async (req, res) => {
    const { error } = validateReservation(req.body);

    if (error) {
        res.status(400).send(attributes.error.details[0].message);
        return;
    }

    let reservation = await Reservation.findOne({email : req.body.email});

    if  (reservation) {
        res.status(400).send('Email already used.') 
    }
    
    // TODO Check if time slot already exists
    let availability = await Availability.findById(req.body.availability_id);
    console.log(req.body.availability_id);
    if(!availability) {
        res.status(404).send('The availability with the given ID was not found');
        return;
    }   
    reservation = new Reservation({
        start: req.body.start,
        end: req.body.end,
        title : req.body.title,
        slot : req.body.slot,
        email : req.body.email,
        availability_id : req.body.availability_id,
    });
    
    availability.reservations.push(reservation._id);
    await availability.save();
    

    await reservation.save();
    res.send(reservation);

    let mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: 'Meeting Invite from Mehdi Rachico',
        html : `<div><h3>Hi! Here's your meeting details:</h3><br><strong>Title : </strong>${req.body.title}<br><strong>Participants : </strong>${req.body.email}<br><strong>From: </strong>${new Date(req.body.start)}<br><strong>To : </strong>${new Date(req.body.end)}<br><strong>Meeting Link : </strong><a href="https://meet.jit.si/${req.body.title}">https://meet.jit.si/${req.body.title}</a></div>`, 
        
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent successfully!")
        }
    });

});


router.delete('/:email',async (req, res) => {
    try {
        const reservation = await Reservation.findOneAndDelete({email : req.params.email});
        if (!reservation) {
            res.status(404).json({msg : "The reservation with the given email was not found."})
        }
        const availability = await Availability.findById(reservation.availability_id);
        availability.reservations.pop(mongoose.Types.ObjectId(reservation._id));
        await availability.save();
        res.json({msg: `The reservation with email ${reservation.email} was deleted successfully!`});
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
});


module.exports = router;