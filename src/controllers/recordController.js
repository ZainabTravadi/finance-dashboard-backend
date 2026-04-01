import { Record } from '../models/Record.js';
import {
  recordCreateSchema,
  recordUpdateSchema,
  validateBody,
} from '../utils/validationSchemas.js';

// @desc    Create a new financial record
// @route   POST /records
// @access  Admin only
export const createRecord = async (req, res, next) => {
  try {
    const { error, value } = validateBody(recordCreateSchema, req.body);
    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    const { amount, type, category, date, notes } = value;

    // Create record with createdBy from authenticated user
    const record = await Record.create({
      amount,
      type,
      category,
      date: date || new Date(),
      notes,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Record created successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get financial records with optional filtering
// @route   GET /records
// @access  Admin and Analyst
export const getRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (parsedPage - 1) * parsedLimit;

    // Build dynamic query object
    const query = {};

    // Filter by type if provided
    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    // Filter by category if provided
    if (category) {
      query.category = new RegExp(category, 'i'); // Case-insensitive search
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          query.date.$gte = start;
        }
      }

      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          // Set end to end of day
          end.setHours(23, 59, 59, 999);
          query.date.$lte = end;
        }
      }

      // Remove empty date object if no valid dates were provided
      if (Object.keys(query.date).length === 0) {
        delete query.date;
      }
    }

    const [total, records] = await Promise.all([
      Record.countDocuments(query),
      Record.find(query)
        .populate('createdBy', 'name email')
        .sort({ date: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .exec(),
    ]);

    const pages = Math.ceil(total / parsedLimit) || 1;

    res.status(200).json({
      success: true,
      total,
      page: parsedPage,
      pages,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single record by ID
// @route   GET /records/:id
// @access  Admin and Analyst
export const getRecordById = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!record) {
      const notFoundError = new Error('Record not found');
      notFoundError.statusCode = 404;
      return next(notFoundError);
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a financial record
// @route   PUT /records/:id
// @access  Admin only
export const updateRecord = async (req, res, next) => {
  try {
    const { error, value } = validateBody(recordUpdateSchema, req.body);
    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    // Build update object only with provided fields
    const updateData = {};
    if (value.amount !== undefined) updateData.amount = value.amount;
    if (value.type !== undefined) updateData.type = value.type;
    if (value.category !== undefined) updateData.category = value.category;
    if (value.date !== undefined) updateData.date = value.date;
    if (value.notes !== undefined) updateData.notes = value.notes;

    // Check if record exists first
    const recordExists = await Record.findById(req.params.id);
    if (!recordExists) {
      const notFoundError = new Error('Record not found');
      notFoundError.statusCode = 404;
      return next(notFoundError);
    }

    // Update record with validation
    const record = await Record.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Record updated successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a financial record
// @route   DELETE /records/:id
// @access  Admin only
export const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      const notFoundError = new Error('Record not found');
      notFoundError.statusCode = 404;
      return next(notFoundError);
    }

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};
