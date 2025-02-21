import rateLimit from 'express-rate-limit'

export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 minute (instead of 15)
  max: 10, // Increase to 10 requests
  message: 'Too many OTP requests, try again later'
});
