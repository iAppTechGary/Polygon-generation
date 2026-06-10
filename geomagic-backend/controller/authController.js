const bcrypt = require('bcryptjs');
const User   = require('../model/userModel');
const { signupValidation, signinValidation, socialSigninSchema,
        changePasswordValidation, verifyEmailValidation,
        resetPasswordValidation } = require('../validation/joi/authValidation');
const { setUser }       = require('../utils/jwt');
const { otpGenerator }  = require('../utils/helperFunction');
const { emailSender }   = require('../utils/sendMail');

// ─── Signup ───────────────────────────────────────────────────────────────────

exports.signup = async (req, res) => {
  try {
    const { error } = signupValidation.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, data: null, message: error.message });

    const { email, password, user_name } = req.body;

    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, data: null, message: 'Email already registered' });
    }

    // Pepper + hash — pepper value is kept server-side in env, never returned
    const hashed = await bcrypt.hash(password + process.env.SALT_KEY, 10);
    await User.create({ user_name, email, password: hashed });

    return res.status(201).json({ success: true, data: null, message: 'Signup successful' });
  } catch (err) {
    console.error('signup:', err);
    return res.status(500).json({ success: false, data: null, message: 'Something went wrong' });
  }
};

// ─── Signin ───────────────────────────────────────────────────────────────────

exports.signin = async (req, res) => {
  try {
    const { error } = signinValidation.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, data: null, message: error.message });

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password + process.env.SALT_KEY, user.password))) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid email or password' });
    }

    const token = setUser(user);
    return res.status(200).json({
      success: true,
      data:    { token, users: { id: user._id, email: user.email, user_name: user.user_name } },
      message: 'Signin successful',
    });
  } catch (err) {
    console.error('signin:', err);
    return res.status(500).json({ success: false, data: null, message: 'Something went wrong' });
  }
};

// ─── Social signin (Google / Apple token exchange) ───────────────────────────

exports.socialSignin = async (req, res) => {
  try {
    const { error } = socialSigninSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, data: null, message: error.message });

    const { token: socialToken, loginType } = req.body;

    /*
     * Proprietary: verify social token with the respective provider,
     * extract profile, upsert user record, issue app JWT.
     * Implementation details omitted from this sample.
     */
    const user = await verifySocialTokenAndUpsertUser(socialToken, loginType); // internal helper

    const appToken = setUser(user);
    return res.status(200).json({
      success: true,
      data:    { token: appToken, users: { id: user._id, email: user.email, user_name: user.user_name } },
      message: 'Social signin successful',
    });
  } catch (err) {
    console.error('socialSignin:', err);
    return res.status(500).json({ success: false, data: null, message: 'Something went wrong' });
  }
};

// ─── Forget password (send OTP) ───────────────────────────────────────────────

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, data: null, message: 'Email not found' });

    const otp = otpGenerator();
    await User.findByIdAndUpdate(user._id, { email_otp: otp });
    await emailSender({ to: email, subject: 'Password Reset OTP', otp });

    return res.status(200).json({ success: true, data: null, message: 'OTP sent to email' });
  } catch (err) {
    console.error('forgetPassword:', err);
    return res.status(500).json({ success: false, data: null, message: 'Something went wrong' });
  }
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────

exports.verifyOtp = async (req, res) => {
  try {
    const { email, email_otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });

    if (user.email_otp !== Number(email_otp)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid OTP' });
    }

    // Issue a short-lived reset token
    const resetToken = setUser(user);
    return res.status(200).json({ success: true, data: { token: resetToken }, message: 'OTP verified' });
  } catch (err) {
    console.error('verifyOtp:', err);
    return res.status(500).json({ success: false, data: null, message: 'Something went wrong' });
  }
};

// ─── Reset password ───────────────────────────────────────────────────────────

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const hashed = await bcrypt.hash(password + process.env.SALT_KEY, 10);
    await User.findByIdAndUpdate(req.user._id, { password: hashed, email_otp: null });

    return res.status(200).json({ success: true, data: null, message: 'Password reset successful' });
  } catch (err) {
    console.error('resetPassword:', err);
    return res.status(500).json({ success: false, data: null, message: 'Something went wrong' });
  }
};

// ─── Change password (authenticated) ─────────────────────────────────────────

exports.changePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await bcrypt.compare(password + process.env.SALT_KEY, user.password))) {
      return res.status(400).json({ success: false, data: null, message: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword + process.env.SALT_KEY, 10);
    await User.findByIdAndUpdate(user._id, { password: hashed });

    return res.status(200).json({ success: true, data: null, message: 'Password changed successfully' });
  } catch (err) {
    console.error('changePassword:', err);
    return res.status(500).json({ success: false, data: null, message: 'Something went wrong' });
  }
};
