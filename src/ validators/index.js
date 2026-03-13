import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email")
      .trim()
      .isEmail()
      .notEmpty()
      .withMessage("Invalid email format"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .isEmail()
      .notEmpty()
      .withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

export { userRegisterValidator, userLoginValidator };
