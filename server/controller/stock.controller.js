const sql = require("../config/db");

// POST /api/stock/request
exports.createRequest = async (req, res) => {
  try {
    const { productId, employeeId, quantity } = req.body;

    await sql`
      INSERT INTO stock_requests (product_id, employee_id, quantity)
      VALUES (${productId}, ${employeeId}, ${quantity})
    `;

    res.json({ message: "Request sent successfully!" });
  } catch (err) {
    console.error("Error in stock controller:", err);
    res
      .status(500)
      .json({ message: "Internal server error while creating request" });
  }
};

// GET /api/stock/request
exports.getAllRequests = async (req, res) => {
  try {
    const rows = await sql`
      SELECT sr.id,
             sr.quantity,
             sr.status,
             p.name AS product_name,
             e.name AS employee_name
      FROM stock_requests sr
      LEFT JOIN products p ON sr.product_id = p.id
      LEFT JOIN employees e ON sr.employee_id = e.id
      ORDER BY sr.created_at DESC
    `;

    res.json({ rows });
  } catch (err) {
    console.error("Error in stock controller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/stock/approve/:id
exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const requestRows = await sql`
      SELECT id, product_id, quantity, status
      FROM stock_requests
      WHERE id = ${id}
    `;

    const request = requestRows[0];

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    await sql`
      UPDATE stock_requests
      SET status = 'approved'
      WHERE id = ${id}
    `;

    await sql`
      UPDATE products
      SET stock = stock + ${Number(request.quantity)}
      WHERE id = ${request.product_id}
    `;

    res.json({
      product_id: request.product_id,
      quantity: request.quantity,
      status: "approved",
      message: "Request approved and stock updated",
    });
  } catch (err) {
    console.error("Error in stock controller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/stock/reject/:id
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await sql`
      UPDATE stock_requests
      SET status = 'rejected'
      WHERE id = ${id}
    `;

    res.json({ status: "rejected", message: "Request rejected" });
  } catch (err) {
    console.error("Error in stock controller:", err);
    res
      .status(500)
      .json({ message: "Internal server error while rejecting request" });
  }
};

// PUT /api/stock/add/:id
exports.addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const rows = await sql`
      UPDATE products
      SET product_stock = product_stock + ${quantity}
      WHERE product_id = ${id}
      returning *
    `;

    res.json({ product: rows[0], message: "Stock added successfully" });
  } catch (err) {
    console.error("Error in stock controller:", err);
    res
      .status(500)
      .json({ message: "Internal server error while adding stock" });
  }
};
