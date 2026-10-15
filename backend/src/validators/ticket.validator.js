const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const priorityEnum = z.enum(['low', 'medium', 'high']);
const statusEnum = z.enum(['open', 'in-progress', 'resolved', 'closed']);

const createTicketSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).max(2000),
  priority: priorityEnum.optional(),
});

const updateStatusSchema = z.object({
  status: statusEnum,
});

const ticketQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  search: z.string().trim().optional(),
});

const addCommentSchema = z.object({
  message: z.string().trim().min(1).max(1000),
});

const idParamSchema = z.object({ id: objectId });

module.exports = {
  objectId,
  idParamSchema,
  createTicketSchema,
  updateStatusSchema,
  ticketQuerySchema,
  addCommentSchema,
};
