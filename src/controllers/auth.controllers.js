import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { emailVerificationMailContent, sendEmail } from "../utils/mail.js";

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;

  //  check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    username,
    email,
    fullName,
    password,
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Verify your email",
    mailgenContent: emailVerificationMailContent(
      user?.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  // remove sensitive data from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationExpiry -emailVerificationToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User registered successfully",
      ),
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Please provide email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationExpiry -emailVerificationToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export { registerUser, login, logoutUser };
