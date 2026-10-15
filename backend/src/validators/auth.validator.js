const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});

module.exports = { registerSchema, loginSchema };
