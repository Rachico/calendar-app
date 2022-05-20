const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { bool, string } = require('joi');

const reservationSchema = new mongoose.Schema({
    start: {
        type:Date,
        required:true,
    },
    end: {
        type:Date,
        required:true,
    },
    slot: {
        type:String,
        required:true,
    },
    title: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique: true,
    },
    availability_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Availability"
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

function validateReservation(reservation) {
    const schema = Joi.object({
        start: Joi.date().required(),
        end: Joi.date().required(),
        slot : Joi.string().required(),
        title : Joi.string().required().min(3).max(255),
        email : Joi.string().required().email(),
        availability_id : Joi.string().allow(),
    });
    return attributes = schema.validate(reservation);
}

module.exports.Reservation = Reservation ;
module.exports.validateReservation = validateReservation ;