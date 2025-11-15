import Post from '../models/postModel.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private/Ngo
const createPost = async (req, res) => {
  const { title, description, amountRequired } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }
  try {
    const post = new Post({
      title,
      description,
      amountRequired,
      image: req.file.path,
      ngo: req.user._id,
    });
    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('ngo', 'ngoName email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get posts by the logged-in NGO
// @route   GET /api/posts/myposts
// @access  Private/Ngo
const getMyNgoPosts = async (req, res) => {
  try {
    const posts = await Post.find({ ngo: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (error) { // <-- Brackets were missing here
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('ngo', 'ngoName email')
      .populate('comments.user', 'name'); // Also populate comments
    
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.log('--- ERROR in getPostById ---:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid Post ID: ${req.params.id}` });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new comment
// @route   POST /api/posts/:id/comments
// @access  Private
const createComment = async (req, res) => {
  const { text } = req.body;
  const postId = req.params.id;
  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comment = {
      user: req.user._id,
      name: req.user.name || req.user.ngoName,
      text: text,
    };
    post.comments.push(comment);
    await post.save();
    await post.populate('comments.user', 'name');
    res.status(201).json(post.comments);
  } catch (error) {
    console.error('--- ERROR in createComment ---:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private/Ngo
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.ngo.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post removed', id: req.params.id });
  } catch (error) {
    console.error('--- ERROR in deletePost ---:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Post ID' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

export { createPost, getAllPosts, getMyNgoPosts, getPostById, createComment, deletePost };