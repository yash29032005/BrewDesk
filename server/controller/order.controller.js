const Razorpay = require("razorpay");
const sql = require("../config/db");

exports.createOrder = async (req, res) => {
  const client = sql;
  try {
    const { userId, customerName, cart, paymentMethod } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const normalizedPaymentMethod = paymentMethod?.toUpperCase();

    const total = cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0
    );

    await client`BEGIN`;

    const orderResult = await client`
      INSERT INTO orders (user_id, customer_name, total, payment_method)
      VALUES (${userId}, ${customerName}, ${total}, ${normalizedPaymentMethod})
      RETURNING id
    `;

    const orderId = orderResult[0].id;

    for (const item of cart) {
      const productResult = await client`
        SELECT stock
        FROM products
        WHERE id = ${item.id}
        FOR UPDATE
      `;

      if (productResult.length === 0 || productResult[0].stock < item.qty) {
        await client`ROLLBACK`;
        return res.status(400).json({
          message: `Not enough stock for ${item.name}`,
        });
      }

      await client`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (${orderId}, ${item.id}, ${item.qty}, ${item.price})
      `;

      await client`
        UPDATE products
        SET stock = stock - ${item.qty}
        WHERE id = ${item.id}
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
    const userId = req.user.id;

    const rows = await sql`
      SELECT 
        o.id AS orderId,
        o.user_id,
        o.customer_name,
        o.total,
        o.created_at,
        oi.product_id,
        p.name AS productName,
        oi.quantity,
        oi.price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ${userId}
      ORDER BY o.created_at DESC, oi.id ASC
    `;

    const ordersMap = {};
    rows.forEach((row) => {
      if (!ordersMap[row.orderId]) {
        ordersMap[row.orderId] = {
          orderId: row.orderId,
          userId: row.user_id,
          customerName: row.customer_name,
          total: row.total,
          createdAt: row.created_at,
          items: [],
        };
      }
      ordersMap[row.orderId].items.push({
        productId: row.product_id,
        name: row.productName,
        quantity: row.quantity,
        price: row.price,
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
    const rows = await sql`
        SELECT 
  o.id AS orderId,
  o.user_id AS userId,
  u.name AS userName,
  o.customer_name AS customerName,
  o.total,
  o.payment_method AS paymentMethod,
  o.created_at AS createdAt,
  oi.product_id AS productId,
  p.name AS productName,
  oi.quantity,
  oi.price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
LEFT JOIN employees u ON o.user_id = u.id
ORDER BY o.created_at DESC, oi.id ASC

    `;

    const ordersMap = {};
    rows.forEach((row) => {
      if (!ordersMap[row.orderId]) {
        ordersMap[row.orderId] = {
          orderId: row.orderId,
          userId: row.userId,
          userName: row.userName,
          customerName: row.customerName,
          total: row.total,
          paymentMethod: row.paymentMethod,
          createdAt: row.createdAt,
          items: [],
        };
      }

      ordersMap[row.orderId].items.push({
        productId: row.productId,
        name: row.productName,
        quantity: row.quantity,
        price: row.price,
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
      SELECT user_id, COUNT(id) AS total
      FROM orders
      GROUP BY user_id
    `;

    const totalOrders = await sql`
      SELECT COUNT(id) AS total
      FROM orders
    `;

    const totalRevenue = await sql`
      SELECT SUM(total) AS total
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
