const asyncHandler = require('../utils/asyncHandler');
const ticketService = require('../services/ticket.service');

exports.create = asyncHandler(async (req, res) => {
  const ticket = await ticketService.createTicket(req.user.id, req.body);
  res.status(201).json({ success: true, data: ticket });
});

exports.list = asyncHandler(async (req, res) => {
  const result = await ticketService.listTickets({ user: req.user, query: req.query });
  res.status(200).json({ success: true, ...result });
});

exports.getOne = asyncHandler(async (req, res) => {
  const result = await ticketService.getTicketById(req.params.id, req.user);
  res.status(200).json({ success: true, data: result });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const ticket = await ticketService.updateStatus(req.params.id, req.body.status);
  res.status(200).json({ success: true, data: ticket });
});
