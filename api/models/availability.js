const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { bool, string } = require('joi');

const availabilitySchema = new mongoose.Schema({
    start: {
        type:Date,
        required:true,
    },
    end: {
        type:Date,
        required:true,
    },
    reservations : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Reservation"
    }]
});

const Availability = mongoose.model('Availability', availabilitySchema);

function validateAvailability(availability) {
    const schema = Joi.object({
        start: Joi.date().required(),
        end: Joi.date().required(),
        reservation_id : Joi.string().allow(),
    });
    return attributes = schema.validate(availability);
}

module.exports.Availability = Availability ;
module.exports.validateAvailability = validateAvailability ;