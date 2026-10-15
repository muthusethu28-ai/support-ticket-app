const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const ApiError = require('../utils/ApiError');

exports.addComment = async (ticketId, userId, user, message) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new ApiError(404, 'Ticket not found');
  }

  // Only the ticket owner (for users) or any agent may comment.
  if (user.role === 'user' && String(ticket.createdBy) !== String(userId)) {
    throw new ApiError(403, 'Forbidden: you can only comment on your own tickets');
  }

  if (ticket.status === 'closed') {
    throw new ApiError(400, 'Comments are not allowed on closed tickets');
  }

  const comment = await Comment.create({
    ticket: ticketId,
    author: userId,
    message,
  });

  await comment.populate('author', 'name role');
  return comment;
};
