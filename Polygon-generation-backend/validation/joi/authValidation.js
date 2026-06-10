const Joi = require('joi');

const password = Joi.string().min(8).max(64).required();

exports.signupValidation = Joi.object({
  user_name: Joi.string().min(2).max(50).required(),
  email:     Joi.string().email().required(),
  password,
});

exports.signinValidation = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.socialSigninSchema = Joi.object({
  token:     Joi.string().required(),
  loginType: Joi.string().valid('google', 'apple').required(),
});

exports.changePasswordValidation = Joi.object({
  password:    Joi.string().required(),
  newPassword: password,
});

exports.verifyEmailValidation = Joi.object({
  email:     Joi.string().email().required(),
  email_otp: Joi.number().integer().min(100000).max(999999).required(),
});

exports.resetPasswordValidation = Joi.object({
  password:         password,
  confirm_password: Joi.any().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match' }),
});
