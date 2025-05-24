const redisClient = require('../config/redis');

const rateLimiter = async (req, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.body.userId || req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const key = `ratelimit:booking:${userId}`;
    const limit = 5; // Maximum 5 booking attempts per minute
    const window = 60; // 1 minute window

    const current = await redisClient.incr(key);
    
    if (current === 1) {
      await redisClient.expire(key, window);
    }

    if (current > limit) {
      return res.status(429).json({
        success: false,
        message: 'Too many booking attempts. Please try again in a minute.'
      });
    }

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    // If Redis fails, allow the request to proceed
    next();
  }
};

module.exports = rateLimiter; 