const Razorpay = require("razorpay");
const sql = require("../config/db");

exports.createOrder = async (req, res) => {
  const client = sql;
  try {
    const { userId, customerName, cart, paymentMethod } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = cart.reduce(
      (sum, item) =>
        sum + Number(item.product_price) * Number(item.product_qty),
      0
    );

    await client`BEGIN`;

    const orderResult = await client`
      INSERT INTO orders (user_id, customer_name, order_total, order_payment_method)
      VALUES (${userId}, ${customerName}, ${total}, ${paymentMethod})
      RETURNING order_id
    `;

    const orderId = orderResult[0].order_id;

    for (const item of cart) {
      const productResult = await client`
        SELECT product_stock
        FROM products
        WHERE product_id = ${item.product_id}
        FOR UPDATE
      `;

      if (
        productResult.length === 0 ||
        productResult[0].product_stock < item.product_qty
      ) {
        await client`ROLLBACK`;
        return res.status(400).json({
          message: `Not enough stock for ${item.product_name}`,
        });
      }

      await client`
        INSERT INTO order_items (order_id, product_id, order_items_quantity, order_items_price)
        VALUES (${orderId}, ${item.product_id}, ${item.product_qty}, ${item.product_price})
      `;

      await client`
        UPDATE products
        SET product_stock = product_stock - ${item.product_qty}
        WHERE product_id = ${item.product_id}
      `;
    }

    await client`COMMIT`;

    res.status(201).json({
      orderId,
      message: "Order placed successfully",
    });
  } catch (error) {
    await sql`ROLLBACK`;
    console.error("Error in orders controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error while creating order" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const userId = req.user.emp_id;

    const rows = await sql`
      SELECT
        o.order_id,
        o.user_id,
        o.customer_name,
        o.order_total,
        o.created_at,
        oi.product_id,
        p.product_name ,
        oi.order_items_quantity,
        oi.order_items_price
      FROM orders AS o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.user_id = ${userId}
      ORDER BY o.created_at DESC, oi.order_items_id ASC
    `;

    const ordersMap = {};
    rows.forEach((row) => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          orderId: row.order_id,
          userId: row.user_id,
          customerName: row.customer_name,
          total: row.order_total,
          createdAt: row.created_at,
          items: [],
        };
      }
      ordersMap[row.order_id].items.push({
        productId: row.product_id,
        name: row.product_name,
        quantity: row.order_items_quantity,
        price: row.order_items_price,
      });
    });

    const orders = Object.values(ordersMap).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in orders controller:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.user.emp_id;

    const rows = await sql`
      SELECT
        o.order_id,
        o.user_id,
        o.customer_name,
        o.order_total,
        o.created_at,
        oi.product_id,
        p.product_name ,
        oi.order_items_quantity,
        oi.order_items_price
      FROM orders AS o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      ORDER BY o.created_at DESC, oi.order_items_id ASC
    `;

    const ordersMap = {};
    rows.forEach((row) => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          orderId: row.order_id,
          userId: row.user_id,
          customerName: row.customer_name,
          total: row.order_total,
          createdAt: row.created_at,
          items: [],
        };
      }
      ordersMap[row.order_id].items.push({
        productId: row.product_id,
        name: row.product_name,
        quantity: row.order_items_quantity,
        price: row.order_items_price,
      });
    });

    const orders = Object.values(ordersMap).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

exports.getOrdersSummary = async (req, res) => {
  try {
    const ordersByUser = await sql`
      SELECT user_id, COUNT(order_id) AS total
      FROM orders
      GROUP BY user_id
    `;

    const totalOrders = await sql`
      SELECT COUNT(order_id) AS total
      FROM orders
    `;

    const totalRevenue = await sql`
      SELECT SUM(order_total) AS total
      FROM orders
    `;

    res.status(200).json({
      orders: ordersByUser,
      total: totalOrders[0].total,
      totalRevenue: totalRevenue[0].total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders summary" });
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.makePayment = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount) * 100,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};
