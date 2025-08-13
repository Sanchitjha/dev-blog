const Post = require('../models/Post');
const slugify = require('slugify'); // optional: npm i slugify

exports.createPost = async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const slug = slugify(title, { lower: true, strict: true });
    const post = await Post.create({
      title, slug, content,
      tags: tags || [],
      author: req.user._id,
      coverImage: req.body.coverImage || ''
    });
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search ? { $text: { $search: req.query.search } } : {};
  const tag = req.query.tag ? { tags: req.query.tag } : {};

  try {
    const posts = await Post.find({ ...search, ...tag })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit);
    res.json(posts);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

    const { title, content, tags } = req.body;
    if (title) { post.title = title; post.slug = slugify(title, { lower: true, strict: true }); }
    if (content) post.content = content;
    if (tags) post.tags = tags;

    const updated = await post.save();
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });
    if (!deletedPost) return res.status(404).json({ message: 'Post not found or forbidden' });

    res.json({ message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const idx = post.likes.findIndex(u => u.toString() === req.user._id.toString());
    if (idx === -1) post.likes.push(req.user._id); else post.likes.splice(idx, 1);
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ user: req.user._id, text });
    await post.save();
    res.status(201).json(post.comments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
