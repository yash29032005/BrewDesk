// controllers/userController.js
const sql = require("../config/db");

// GET /employee/all
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await sql`
      SELECT emp_id, emp_name, emp_email, emp_role, emp_salary FROM employees WHERE emp_role = 'employee'
    `;

    const employeesandmanagers = await sql`
      SELECT emp_id, emp_name, emp_email, emp_role, emp_salary FROM employees WHERE emp_role != 'admin'
    `;

    res.status(200).json({ employees, employeesandmanagers });
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};

// PUT /employee/:id
exports.editEmployee = async (req, res) => {
  try {
    const { name, salary, role } = req.body;
    const { id } = req.params;

    // Check if all fields are missing
    if (!name && !salary && !role) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    // Run the update
    const result = await sql`
      UPDATE employees
      SET emp_name = ${name}, emp_salary = ${salary}, emp_role = ${role}
      WHERE emp_id = ${id}
      returning *
    `;

    // If product doesn't exist
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // If values are the same → no changes
    if (result.changedRows === 0) {
      return res.status(400).json({
        message: "No changes made (values are the same)",
      });
    }

    res.status(200).json({
      employee: result[0],
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error("Error in employee controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error while editing employee" });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`
      DELETE FROM employees WHERE emp_id = ${id}
    `;

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee removed successfully" });
  } catch (error) {
    console.error("Error in employee controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error while deleting employee" });
  }
};

exports.getEmployeeSummary = async (req, res) => {
  try {
    const totalEmployees = await sql`
      SELECT COUNT(emp_id) AS total 
      FROM employees
      WHERE emp_role = ${"employee"}
    `;
    const totalManagers = await sql`
      SELECT COUNT(emp_id) AS total 
      FROM employees
      WHERE emp_role = ${"manager"}
    `;
    const totalAdmin = await sql`
      SELECT COUNT(emp_id) AS total 
      FROM employees
      WHERE emp_role = ${"admin"}
    `;
    res.status(200).json({
      totalEmployees: totalEmployees[0].total,
      totalManagers: totalManagers[0].total,
      totalAdmin: totalAdmin[0].total,
    });
  } catch (error) {
    console.error("Error in employee controller:", error);
    res.status(500);
  }
};
