const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Custom handler
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes',
      // retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
  // Uses formal IP-based key generation by default (handles IPv4 and IPv6 properly)
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication requests, please try again after 15 minutes'
  },
  // skipSuccessfulRequests: true, // Don't count successful requests
  // standardHeaders: true,
  // legacyHeaders: false,
  // handler: (req, res) => {
  //   res.status(429).json({
  //     success: false,
  //     message: 'Too many authentication attempts, please try again after 15 minutes',
  //     retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    // });
  // }
  // Uses formal IP-based key generation by default (handles IPv4 and IPv6 properly)
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again after 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts, please try again after 1 hour',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter
};
