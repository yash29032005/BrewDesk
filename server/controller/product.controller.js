const sql = require("../config/db");

exports.getProducts = async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM products`;

    if (rows.length === 0) {
      return res.status(400).json({ message: "There are no products" });
    }
    res.status(200).json({ product: rows });
  } catch (error) {
    console.error("Error in product controller:", error);
    res.status(500);
  }
};

exports.editProducts = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    const { id } = req.params;

    // Check if all fields are missing
    if (!name && !category && !price) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    // Run the update
    const result = await sql`
      UPDATE products SET product_name=${name}, product_category=${category}, product_price=${price} WHERE product_id=${id}
      returning *
    `;

    // If product doesn't exist
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If values are the same → no changes
    if (result.changedRows === 0) {
      return res
        .status(400)
        .json({ message: "No changes made (values are the same)" });
    }

    res
      .status(200)
      .json({ product: result[0], message: "Product updated successfully" });
  } catch (error) {
    console.error("Error in product controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error while editing product" });
  }
};

exports.insertProducts = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    const rows = await sql`
      INSERT INTO products (product_name, product_category, product_price, product_stock)
      VALUES (${name}, ${category}, ${price}, ${stock})
      RETURNING *
    `;

    res.status(200).json({
      message: "Product inserted successfully",
      product: rows[0],
    });
  } catch (error) {
    console.error("Error in product controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error while inserting product" });
  }
};

exports.getProductSummary = async (req, res) => {
  try {
    const totalProducts = await sql`
      SELECT COUNT(product_id) AS total
      FROM products
    `;

    res.status(200).json({
      total: totalProducts[0].total,
    });
  } catch (error) {
    console.error("Error in employee controller:", error);
    res.status(500);
  }
};

exports.togicLogic = async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    await sql`UPDATE products SET product_enabled = ${enabled} WHERE product_id = ${id}`;

    res.status(200).json({ enabled });
  } catch (error) {
    console.error("Error in product controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error while toggling product" });
  }
};
