const asyncHandler = require('../utils/asyncHandler');
const commentService = require('../services/comment.service');

exports.create = asyncHandler(async (req, res) => {
  const comment = await commentService.addComment(
    req.params.id,
    req.user.id,
    req.user,
    req.body.message
  );
  res.status(201).json({ success: true, data: comment });
});
