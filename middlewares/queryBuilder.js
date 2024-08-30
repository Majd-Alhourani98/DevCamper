const queryBuilder = (model, populate) => async (req, res, next) => {
  // 1) Filtering
  // Create a copy of the query parameters
  let queryObject = { ...req.query };

  // Define fields to exclude from query parameters
  const excludedFields = ['select', 'page', 'sort', 'limit'];
  excludedFields.forEach(field => delete queryObject[field]);

  // Convert query operators to MongoDB format
  let queryStr = JSON.stringify(queryObject);
  queryStr = queryStr.replace(/\b(lte|lt|gte|gt|in)\b/g, match => `$${match}`);
  const filter = JSON.parse(queryStr);

  // Build the query with filters
  let query = model.find(filter);

  // 2) Selecting specific fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // 3) Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // Default sorting by creation date in descending order
    query = query.sort('-createdAt');
  }

  // 4) Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Calculate total documents in the collection
  const totalDocs = await model.countDocuments();
  const pagination = {};

  // Add next page information if applicable
  if (endIndex < totalDocs) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  // Add previous page information if applicable
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
    };
  }

  // Apply pagination to the query
  query = query.skip(startIndex).limit(limit);

  // Handling populate
  if (populate) query = query.populate(populate);

  // Execute query and get models
  const docs = await query;

  res.response = {
    success: true,
    result: docs.length,
    pagination,
    data: { docs },
  };

  next();
};

module.exports = queryBuilder;
