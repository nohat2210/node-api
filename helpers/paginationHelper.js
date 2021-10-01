const _ = require('lodash');

const paginatedResults = (model, populateItem) => {
  return async (req, res, next) => {
    const queryString = req.query;
    //filter
    let filter = {};
    if (!_.isEmpty(queryString.filter)) {
      const filterBy = JSON.parse(queryString.filter);
      if (!_.isEmpty(filterBy.categories)) {
        filter = { category: filterBy.categories };
      }
    }
    //sort
    const sort = {};
    const sortBy = queryString.sortBy;
    if (!_.isEmpty(sortBy)) {
      const sortField = sortBy.split(':');
      sort[sortField[0]] = sortField[1] === 'desc' ? -1 : 1;
    }
    //pagination
    const page = parseInt(queryString.page);
    const limit = parseInt(queryString.limit);
    const skip = (page - 1) * limit;
    const results = {};
    results.meta = {
      currentPage: page || 1,
      itemsPerPage: 10,
      totalItems: await model.countDocuments().exec(),
      next: page + 1,
      previous: page - 1,
    };

    try {
      results.items = await model
        .find(filter)
        .populate(populateItem)
        .limit(limit)
        .skip(skip)
        .sort(sort)
        .exec();
      res.paginatedResults = results;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { paginatedResults };
