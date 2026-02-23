const AppError = require("../utils/appError");
const validate = require("../utils/validate");
const { createBlogValidator } = require("../validations/post.validator");
const Post = require("../models/post.model");
const mongoose = require("mongoose");

module.exports.createPost = async (data, user) => {
  if (!user) {
    throw new AppError(
      "Unauthorized access. Please login again.",
      "UNAUTHORIZED",
    );
  }

  const payload = validate(createBlogValidator, data);

  const { title, content, category, tags } = payload;

  if (!title || !content || !category || !tags) {
    throw new AppError(
      "Title, content, category and tags are required.",
      "BAD_REQUEST",
    );
  }

  try {
    const created = await Post.create({
      title,
      content,
      category,
      tags,
      userId: user.id,
    });

    return {
      success: true,
      message: "Post created successfully.",
      data: {
        title: created.title,
        content: created.content,
        category: created.category,
        tags: created.tags,
      },
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    console.log("err", err);
    throw new AppError(message, "BAD_REQUEST");
  }
};

module.exports.getAllPost = async (user) => {
  if (!user) {
    throw new AppError(
      "Unauthorized access. Please login again.",
      "UNAUTHORIZED",
    );
  }

  try {
    const posts = await Post.find()
      .populate("userId", "name email")
      .select("-__v -updatedAt")
      .lean();

    if (!posts || posts.length === 0) {
      throw new AppError("No posts found.", "NOT_FOUND");
    }

    const updatedPosts = posts.map((post) => {
      const isUserFound = post?.userId?._id?.toString();

      return {
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post?.tags ?? [],
        isAuthor: isUserFound ? isUserFound === user.id.toString() : false,
        author: {
          name: isUserFound ? post.userId.name : "Unknown",
          email: isUserFound ? post.userId.email : "unknown@unknown.com",
        },
      };
    });

    return updatedPosts;
  } catch (err) {
    console.log("err", err);

    const message = err.message || "Something went wrong";
    throw new AppError(message, "BAD_REQUEST");
  }
};

module.exports.deletePost = async (data, user) => {
  if (!user) {
    throw new AppError(
      "Unauthorized access. Please login again.",
      "UNAUTHORIZED",
    );
  }

  const { postId } = data;

  if (!postId) {
    throw new AppError("Post id is required.", "BAD_REQUEST");
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new AppError("Invalid post id.", "BAD_REQUEST");
  }

  const post = await Post.findById(postId).lean();

  if (!post || post.length === 0) {
    throw new AppError("Post not found.", "NOT_FOUND");
  }

  if (post.userId.toString() !== user.id.toString()) {
    throw new AppError("You are not allowed to delete this post.", "FORBIDDEN");
  }

  try {
    const deleted = await Post.findByIdAndDelete(postId);

    return {
      success: true,
      message: "Post deleted successfully.",
      data: {
        id: deleted._id.toString(),
        title: deleted.title,
        content: deleted.content,
        category: deleted.category,
        tags: deleted.tags,
      },
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "BAD_REQUEST");
  }
};
