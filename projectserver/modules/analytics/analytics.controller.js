const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const { getDateFormat, checkIsBeforeDate } = require("../../common/utils");
const Order = require("../order/model.order");
const Product = require("../product/model.product");
const User = require("../user/model.user");
dayjs.extend(customParseFormat);

exports.getProductVariantsStats = async (req, res) => {
  let { begin, end, orderStatus } = req.query;

  let filter = {};
  begin = getDateFormat(begin);
  end = getDateFormat(end);
  if (!checkIsBeforeDate(begin, end)) end = null;

  if (orderStatus) {
    filter.orderStatus = { value: orderStatus };
  }

  if (begin && end) {
    filter.updatedAt = {
      $gte: begin,
      $lte: end,
    };
  } else if (end) {
    filter.updatedAt = { $lte: end };
  } else if (begin) {
    filter.updatedAt = { $gte: begin };
  } else {
    filter.updatedAt = { $gte: dayjs().subtract(1, "month").toDate() };
  }
  try {
    const data = await Order.aggregate([
      {
        $match: filter,
      },
      {
        $unwind: "$orderItems",
      },
      {
        $project: {
          saved_variant: "$orderItems.saved_variant",
          saved_quantity: "$orderItems.saved_quantity",
          saved_price: "$orderItems.saved_price",
          orderItemsPrice: "$itemsPrice",
          orderShippingPrice: "$shippingPrice",
          orderTotalPrice: "$totalPrice",
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
          },
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data,
      range: [filter.updatedAt["$gte"], filter.updatedAt["$lte"]],
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

exports.getIncomeStats = async (req, res) => {
  let { begin, end, orderStatus } = req.query;

  let filter = {};
  begin = getDateFormat(begin);
  end = getDateFormat(end);
  if (!checkIsBeforeDate(begin, end)) end = null;

  if (begin && end) {
    filter.updatedAt = {
      $gte: begin,
      $lte: end,
    };
  } else if (end) {
    filter.updatedAt = { $lte: end };
  } else if (begin) {
    filter.updatedAt = { $gte: begin };
  } else {
    filter.updatedAt = { $gte: dayjs().subtract(1, "month").toDate() };
  }

  if (orderStatus) {
    filter["orderStatus.value"] = { $in: orderStatus.split(",") };
  }

  try {
    let data = await Order.aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          orderItemsPrice: "$itemsPrice",
          orderShippingPrice: "$shippingPrice",
          orderTotalPrice: "$totalPrice",
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
          },
        },
      },
      {
        $group: {
          _id: "$date",
          orderItemsPrice: { $sum: "$orderItemsPrice" },
          orderShippingPrice: { $sum: "$orderShippingPrice" },
          orderTotalPrice: { $sum: "$orderTotalPrice" },
          total: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data,
      range: [filter.updatedAt["$gte"], filter.updatedAt["$lte"]],
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};
exports.getStatusStats = async (req, res) => {
  let { begin, end, orderStatus } = req.query;

  let filter = {};
  begin = getDateFormat(begin);
  end = getDateFormat(end);
  if (!checkIsBeforeDate(begin, end)) end = null;

  if (begin && end) {
    filter.updatedAt = {
      $gte: begin,
      $lte: end,
    };
  } else if (end) {
    filter.updatedAt = { $lte: end };
  } else if (begin) {
    filter.updatedAt = { $gte: begin };
  } else {
    filter.updatedAt = { $gte: dayjs().subtract(1, "month").toDate() };
  }
  if (orderStatus) {
    filter["orderStatus.value"] = { $in: orderStatus.split(",") };
  }

  try {
    let data = await Order.aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          orderStatus: "$orderStatus.value",
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
          },
        },
      },
      {
        $group: {
          _id: "$orderStatus",
          total: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data,
      range: [filter.updatedAt["$gte"], filter.updatedAt["$lte"]],
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

exports.getUsersStats = async (req, res) => {
  let { begin, end } = req.query;

  let filter = {};
  begin = getDateFormat(begin);
  end = getDateFormat(end);
  if (!checkIsBeforeDate(begin, end)) end = null;

  if (begin && end) {
    filter.createdAt = {
      $gte: begin,
      $lte: end,
    };
  } else if (end) {
    filter.createdAt = { $lte: end };
  } else if (begin) {
    filter.createdAt = { $gte: begin };
  } else {
    filter.createdAt = { $gte: dayjs().subtract(1, "month").toDate() };
  }

  try {
    const data = await User.aggregate([
      { $match: filter },
      {
        $project: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
      },
      {
        $group: {
          _id: "$date",
          total: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: data,
      range: [filter.createdAt["$gte"], filter.createdAt["$lte"]],
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};
