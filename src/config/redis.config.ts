import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379", 
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
  },
});

redisClient.on('error', (err) => console.error('Redis error:', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Redis connection failed:', err);
    }
})();

export default redisClient;