const express = require('express');
const {
    getBookings,
    getBooking,
    addBooking,
    updateBooking,
    deleteBooking
} = require('../controllers/bookings');

const { protect, authorize } = require('../middleware/auth');

// Enable mergeParams to access params from parent router (e.g., coworkingspaceId)
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(protect, getBookings)
    .post(protect, authorize('admin', 'user'), addBooking);

router.route('/:id')
    .get(protect, getBooking)
    .put(protect, authorize('admin', 'user'), updateBooking)
    .delete(protect, authorize('admin', 'user'), deleteBooking);

module.exports = router;