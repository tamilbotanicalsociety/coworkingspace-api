const mongoose = require('mongoose');

const CoworkingSpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    tel: {
        type: String,
        required: [true, 'Please add a telephone number'],
    },
    OpenTime: {
    type: String,
    required: [true, 'Please add open time'],
    trim: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please use a valid HH:mm format (e.g., 08:00)']
    },
    CloseTime: {
    type: String,
    required: [true, 'Please add close time'],
    trim: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please use a valid HH:mm format (e.g., 18:00)']
    }
}, {

    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


CoworkingSpaceSchema.pre('deleteOne', { document: true, query: false }, async function() {
    await this.model('Booking').deleteMany({ coworkingspace: this._id });
});

CoworkingSpaceSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'coworkingspace',
    justOne: false
});

module.exports = mongoose.model('CoworkingSpace', CoworkingSpaceSchema);