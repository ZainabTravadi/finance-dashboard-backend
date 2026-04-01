import { Record } from '../models/Record.js';

// @desc    Get summary dashboard data (total income, expense, balance)
// @route   GET /dashboard/summary
// @access  Admin and Analyst
export const getSummary = async (req, res, next) => {
  try {
    // MongoDB aggregation pipeline to calculate income and expense totals
    const summary = await Record.aggregate([
      {
        $group: {
          _id: '$type', // Group by type (income/expense)
          total: { $sum: '$amount' }, // Sum amounts for each type
        },
      },
    ]);

    // Initialize totals
    let totalIncome = 0;
    let totalExpense = 0;

    // Extract income and expense from aggregation result
    summary.forEach((item) => {
      if (item._id === 'income') {
        totalIncome = item.total;
      } else if (item._id === 'expense') {
        totalExpense = item.total;
      }
    });

    // Calculate net balance
    const netBalance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category-wise breakdown
// @route   GET /dashboard/category
// @access  Admin and Analyst
export const getCategoryBreakdown = async (req, res, next) => {
  try {
    // MongoDB aggregation pipeline to group by category and sum amounts
    const categoryData = await Record.aggregate([
      {
        $group: {
          _id: '$category', // Group by category
          total: { $sum: '$amount' }, // Sum amounts for each category
          count: { $sum: 1 }, // Count records in each category
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from output
          category: '$_id', // Rename _id to category
          total: 1,
          count: 1,
        },
      },
      {
        $sort: { total: -1 }, // Sort by total amount descending (highest first)
      },
    ]);

    res.status(200).json({
      success: true,
      count: categoryData.length,
      data: categoryData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly trends (income vs expense by month)
// @route   GET /dashboard/trends
// @access  Admin and Analyst
export const getMonthlyTrends = async (req, res, next) => {
  try {
    // MongoDB aggregation pipeline for monthly trends
    const trends = await Record.aggregate([
      {
        $group: {
          _id: {
            // Extract year and month from date
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type', // Keep type to separate income/expense
          },
          total: { $sum: '$amount' }, // Sum amounts by month and type
        },
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month',
          },
          // Use conditional aggregation to separate income and expense
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude default _id
          month: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1,
                },
              },
            },
          },
          income: { $ifNull: ['$income', 0] }, // Default to 0 if null
          expense: { $ifNull: ['$expense', 0] }, // Default to 0 if null
        },
      },
      {
        $sort: { month: 1 }, // Sort by month ascending (oldest first)
      },
    ]);

    res.status(200).json({
      success: true,
      count: trends.length,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get advanced metrics (optional)
// @route   GET /dashboard/metrics
// @access  Admin and Analyst
export const getMetrics = async (req, res, next) => {
  try {
    // Get multiple metrics at once using facet
    const metrics = await Record.aggregate([
      {
        $facet: {
          // Calculate summary totals
          summary: [
            {
              $group: {
                _id: '$type',
                total: { $sum: '$amount' },
              },
            },
          ],
          // Get top 5 categories
          topCategories: [
            {
              $group: {
                _id: '$category',
                total: { $sum: '$amount' },
              },
            },
            { $sort: { total: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 0,
                category: '$_id',
                total: 1,
              },
            },
          ],
          // Count records by type
          recordCount: [
            {
              $group: {
                _id: '$type',
                count: { $sum: 1 },
              },
            },
          ],
          // Average transaction amount
          averageTransaction: [
            {
              $group: {
                _id: null,
                average: { $avg: '$amount' },
              },
            },
            {
              $project: {
                _id: 0,
                average: { $round: ['$average', 2] },
              },
            },
          ],
        },
      },
    ]);

    // Extract facet results
    const [facetResult] = metrics;

    // Process summary data
    let totalIncome = 0;
    let totalExpense = 0;

    facetResult.summary.forEach((item) => {
      if (item._id === 'income') {
        totalIncome = item.total;
      } else if (item._id === 'expense') {
        totalExpense = item.total;
      }
    });

    // Extract counts
    let incomeCount = 0;
    let expenseCount = 0;

    facetResult.recordCount.forEach((item) => {
      if (item._id === 'income') {
        incomeCount = item.count;
      } else if (item._id === 'expense') {
        expenseCount = item.count;
      }
    });

    const averageAmount = facetResult.averageTransaction[0]?.average || 0;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpense,
          netBalance: totalIncome - totalExpense,
        },
        recordCount: {
          income: incomeCount,
          expense: expenseCount,
          total: incomeCount + expenseCount,
        },
        topCategories: facetResult.topCategories,
        averageTransaction: averageAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};
