const CoworkingSpace = require('../models/CoworkingSpace');

// @desc    Get all coworking spaces
// @route   GET /api/v1/coworkingspace
// @access  Public
exports.getCoworkingSpaces = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);
        
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Populate with associated bookings
        query = CoworkingSpace.find(JSON.parse(queryStr)).populate('bookings');

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await CoworkingSpace.countDocuments();

        query = query.skip(startIndex).limit(limit);
        const coworkingspaces = await query;

        const pagination = {};
        if (endIndex < total) { pagination.next = { page: page + 1, limit }; }
        if (startIndex > 0) { pagination.prev = { page: page - 1, limit }; }

        res.status(200).json({ success: true, count: coworkingspaces.length, pagination, data: coworkingspaces });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Get single coworking space
// @route   GET /api/v1/coworkingspace/:id
// @access  Public
exports.getCoworkingSpace = async (req, res, next) => {
    try {
        const coworkingspace = await CoworkingSpace.findById(req.params.id).populate('bookings');
        if (!coworkingspace) {
            return res.status(404).json({ success: false, message: 'Coworking space not found' });
        }
        res.status(200).json({ success: true, data: coworkingspace });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Create new coworking space
// @route   POST /api/v1/coworkingspace
// @access  Private/Admin
exports.createCoworkingSpace = async (req, res, next) => {
    try {
        const coworkingspace = await CoworkingSpace.create(req.body);
        res.status(201).json({ success: true, data: coworkingspace });
    } catch (err) {
        res.status(400).json({ success: false, message:err.message});
    }
};

// @desc    Update coworking space
// @route   PUT /api/v1/coworkingspace/:id
// @access  Private/Admin
exports.updateCoworkingSpace = async (req, res, next) => {
    try {
        const coworkingspace = await CoworkingSpace.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!coworkingspace) {
            return res.status(404).json({ success: false, message: 'Coworking space not found' });
        }
        res.status(200).json({ success: true, data: coworkingspace });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Delete coworking space (cascade deletes all bookings)
// @route   DELETE /api/v1/coworkingspace/:id
// @access  Private/Admin
exports.deleteCoworkingSpace = async (req, res, next) => {
    try {
        const coworkingspace = await CoworkingSpace.findById(req.params.id);
        if (!coworkingspace) {
            return res.status(404).json({ success: false, message: 'Coworking space not found' });
        }

        await coworkingspace.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};