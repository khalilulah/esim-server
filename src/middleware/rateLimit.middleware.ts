import rateLimit from "express-rate-limit";

// General API limit — applies to all routes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 100 requests per 15 minutes per IP
  message: {
    success: false,
    message: "Too many requests, please try again later.",
    data: null,
  },
  standardHeaders: true, // adds RateLimit headers to responses
  legacyHeaders: false,
});

// Strict limit for auth routes — prevent brute force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // only 10 login attempts per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limit for order creation — prevent spam orders
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 orders per hour per IP
  message: {
    success: false,
    message: "Too many orders placed, please try again later.",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
