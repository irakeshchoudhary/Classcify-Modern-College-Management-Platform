import Post from '../models/post.model.js';
import Student from '../models/student.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const createPost = async (req, res) => {
  try {
    console.log("🟢 Incoming file:", req.file); // Debugging

    const { caption, tags } = req.body;
    const file = req.file;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Empty file" });
    }
    
    

    if (!file) {
      console.log("🔴 No file received!");
      return res.status(400).json({ error: "Media file is required" });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      file.buffer,
      "classcify/posts",
      file.mimetype.startsWith("video/") ? "video" : "image"
    );

    console.log("🟢 Cloudinary Upload Successful:", result);

    const post = new Post({
      caption,
      tags: tags.split(",").map((tag) => tag.trim()),
      media: {
        public_id: result.public_id,
        url: result.secure_url,
        resource_type: result.resource_type,
      },
      author: req.user.id,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("🔴 Error creating post:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'personal.firstName personal.lastName academic.course');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.user.id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = {
      text: req.body.text,
      author: req.user.id
    };

    post.comments.push(comment);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { 
        _id: req.params.postId,
        'comments._id': req.params.commentId,
        'comments.author': req.user.id
      },
      { $set: { 'comments.$.text': req.body.text } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $pull: { comments: { _id: req.params.commentId, author: req.user.id } } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Search query required' });

    const posts = await Post.find({
      $or: [
        { tags: { $regex: query, $options: 'i' } },
        { caption: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('author', 'personal.firstName personal.lastName academic.course')
    .limit(50)
    .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getExplorePosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'personal.firstName personal.lastName academic.course')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(posts);
  } catch (error) {
    console.error('Get explore posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};