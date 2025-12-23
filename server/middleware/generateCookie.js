const jwt = require("jsonwebtoken");

exports.generateCookie = (res, user) => {
  const token = jwt.sign(
    {
      id: user.emp_id,
      name: user.emp_name,
      email: user.emp_email,
      role: user.emp_role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 hour
  });
};
