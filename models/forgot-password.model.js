const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
          type: Date,
          expires: 180
        },
    }, {
      timestamps: true
    }
)

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "Forgot-password");

module.exports = ForgotPassword