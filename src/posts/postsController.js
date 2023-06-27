const postsService = require('./postsService');
const {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');
const { RESPONSE_MESSAGE } = require('../../constant');

const getPost = async (req, res) => {
  const postId = req.params.id;

  const post = await postsService.getPost(postId);

  if (!post) throw new NotFoundError('Not Found');

  new responseHandler(res, post, 200, RESPONSE_MESSAGE.SUCCESS);
};

const getAllPosts = async (req, res) => {
  const { data, meta } = await postsService.getPosts(req);
  new responseHandler(res, data, 200, RESPONSE_MESSAGE.SUCCESS, meta);
};

const createPost = async (req, res) => {
  const { content } = req.body;

  const newPost = await postsService.createPost({
    content,
    author: req.user._id,
  });

  new responseHandler(res, newPost, 201, RESPONSE_MESSAGE.SUCCESS);
};

const updatePost = async (req, res) => {
  const postId = req.params.id;

  const isAuthor = await postsService.isPostAuthor({
    userId: req.user._id,
    postId,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  const post = { ...req.body };

  const updatedPost = await postsService.updatePost({
    postId,
    post,
  });

  if (!updatedPost) throw new NotFoundError('Not Found');

  new responseHandler(res, updatedPost, 200, RESPONSE_MESSAGE.SUCCESS);
};

const deletePost = async (req, res) => {
  const postId = req.params.id;

  const isAuthor = await postsService.isPostAuthor({
    userId: req.user._id,
    postId,
  });

  if (!isAuthor) throw new UnAuthorizedError('Unauthorized');

  const deleted = await postsService.deletePost(postId);

  if (!deleted) throw new NotFoundError('Not Found');

  new responseHandler(res, deleted, 200, RESPONSE_MESSAGE.SUCCESS);
};

const upvotePost = async (req, res) => {
  const postId = req.params.id;

  const upvote = await postsService.upvotePost({
    userId: req.user._id,
    postId,
  });

  if (!upvote) throw new BadRequestError('Unable to upvote post');

  new responseHandler(res, upvote, 200, RESPONSE_MESSAGE.SUCCESS);
};

module.exports = {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
  upvotePost,
};