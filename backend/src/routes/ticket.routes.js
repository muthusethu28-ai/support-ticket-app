const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const ticketController = require('../controllers/ticket.controller');
const commentController = require('../controllers/comment.controller');
const {
  idParamSchema,
  createTicketSchema,
  updateStatusSchema,
  ticketQuerySchema,
  addCommentSchema,
} = require('../validators/ticket.validator');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('user', 'agent'), validate({ body: createTicketSchema }), ticketController.create);
router.get('/', authorize('user', 'agent'), validate({ query: ticketQuerySchema }), ticketController.list);
router.get('/:id', authorize('user', 'agent'), validate({ params: idParamSchema }), ticketController.getOne);
router.patch(
  '/:id/status',
  authorize('agent'),
  validate({ params: idParamSchema, body: updateStatusSchema }),
  ticketController.updateStatus
);
router.post(
  '/:id/comments',
  authorize('user', 'agent'),
  validate({ params: idParamSchema, body: addCommentSchema }),
  commentController.create
);

module.exports = router;
