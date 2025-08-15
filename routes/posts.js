const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utils/authMiddleware");
const Post = require("../models/Post");
const User = require("../models/User");

// Get all posts with comments
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "author",
        select: "name _id",
      })
      .populate({
        path: "comments.author",
        select: "name _id",
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to load posts" });
  }
});

// Create new post
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const newPost = new Post({
      author: req.user.userId,
      content: content.trim(),
    });

    await newPost.save();
    const populatedPost = await Post.findById(newPost._id).populate(
      "author",
      "name _id"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Add comment to post
router.post("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      author: req.user.userId,
      content: content.trim(),
      createdAt: new Date(),
    };

    post.comments.unshift(newComment);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate({
        path: "author",
        select: "name _id",
      })
      .populate({
        path: "comments.author",
        select: "name _id",
      });

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

router.delete(
  "/:postId/comments/:commentId",
  authenticateToken,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const commentIndex = post.comments.findIndex(
        (c) => c._id.toString() === req.params.commentId
      );

      if (commentIndex === -1) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (post.comments[commentIndex].author.toString() !== req.user.userId) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this comment" });
      }

      post.comments.splice(commentIndex, 1);
      await post.save();

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  }
);

module.exports = router;
