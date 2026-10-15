const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const ApiError = require('../utils/ApiError');

const ALLOWED_TRANSITIONS = {
  open: ['in-progress'],
  'in-progress': ['resolved'],
  resolved: ['closed'],
  closed: [],
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// TODO: replace with real notification delivery (email/webhook/etc).
function notifyStatusChange(ticket) {
  console.log(`[notification] Ticket ${ticket._id} status changed to "${ticket.status}"`);
}

exports.notifyStatusChange = notifyStatusChange;

exports.createTicket = async (userId, payload) => {
  const ticket = await Ticket.create({
    title: payload.title,
    description: payload.description,
    priority: payload.priority,
    createdBy: userId,
  });

  await ticket.populate('createdBy', 'name email');
  return ticket;
};

exports.listTickets = async ({ user, query }) => {
  const filter = {};

  // Users can only see their own tickets.
  if (user.role !== 'agent') {
    filter.createdBy = user.id;
  }

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.search) {
    filter.title = { $regex: escapeRegex(query.search), $options: 'i' };
  }

  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Ticket.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Ticket.countDocuments(filter),
  ]);

  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    },
  };
};

exports.getTicketById = async (id, user) => {
  const ticket = await Ticket.findById(id).populate('createdBy', 'name email');
  if (!ticket) {
    throw new ApiError(404, 'Ticket not found');
  }

  if (user.role !== 'agent' && String(ticket.createdBy._id) !== String(user.id)) {
    throw new ApiError(403, 'Forbidden: you can only access your own tickets');
  }

  const comments = await Comment
    .find({ ticket: id })
    .populate('author', 'name role')
    .sort({ createdAt: 1 });

  return { ticket, comments };
};

exports.updateStatus = async (id, status) => {
  const ticket = await Ticket.findById(id).populate('createdBy', 'name email');
  if (!ticket) {
    throw new ApiError(404, 'Ticket not found');
  }

  const allowed = ALLOWED_TRANSITIONS[ticket.status] || [];
  if (!allowed.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status transition: cannot move ticket from "${ticket.status}" to "${status}"`
    );
  }

  ticket.status = status;
  await ticket.save();
  await ticket.populate('createdBy', 'name email');

  notifyStatusChange(ticket);
  return ticket;
};
