// Load Post model
const Post = require("../models/post");
// Load Comment model
const Comment = require("../models/comment");
// Load input validation
const PostValidation = require("../validator/PostValidation");
// Load cloudinary methods
const cloudinary = require("../utils/cloudinary");
// Load Datauri method
const { bufferToDataURI } = require("../utils/Datauri");
const post = require("../models/post");

module.exports = {
  //  ----------------------//addPost method //--------------------------- //

  addPost: async (req, res) => {
    const { errors, isValid } = PostValidation(req.body);
    const { file } = req;
    try {
      if (!isValid) {
        return res.status(404).json(errors);
      }
      if (file) {
        const fileFormat = file.mimetype.split("/")[1];
        const { base64 } = bufferToDataURI(fileFormat, file.buffer);
        const imageDetails = await cloudinary.uploadToCloudinary(
          base64,
          fileFormat
        );
        req.body.owner = req.user.id;
        req.body.image = imageDetails.url;
        req.body.cloudinary_id = imageDetails.public_id;
        const memo = await Post.create(req.body);
        return res
          .status(200)
          .json({ message: "post added successfully", memo });
      } else {
        req.body.owner = req.user.id;
        const memo = await Post.create(req.body);
        return res
          .status(200)
          .json({ message: "post added successfully", memo });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  //  ----------------------//updatePost method //--------------------------- //

  updatePost: async (req, res) => {
    const { errors, isValid } = PostValidation(req.body);
    const { file } = req;
    try {
      const data = await Post.findById({ _id: req.params.id });
      if (data.cloudinary_id) {
        await cloudinary.removeFromCloudinary(data.cloudinary_id);
      }
      if (!isValid) {
        return res.status(404).json(errors);
      }
      if (file) {
        const fileFormat = file.mimetype.split("/")[1];
        const { base64 } = bufferToDataURI(fileFormat, file.buffer);
        const imageDetails = await cloudinary.uploadToCloudinary(
          base64,
          fileFormat
        );
        const post = {
          text: req.body.text || data.text,
          image: imageDetails.url || data.image,
          cloudinary_id: imageDetails.public_id || data.cloudinary_id,
        };
        const memo = await Post.findByIdAndUpdate(
          { _id: req.params.id },
          post,
          {
            new: true,
          }
        );
        res.status(200).json({ message: "post updated successfully", memo });
      } else {
        const memo = await Post.findByIdAndUpdate(
          { _id: req.params.id },
          req.body,
          {
            new: true,
          }
        );
        res.status(200).json({ message: "post updated successfully", memo });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  //  ----------------------//deletePost method //--------------------------- //

  deletePost: async (req, res) => {
    try {
      const memo = await Post.findById({ _id: req.params.id });
      if (memo.cloudinary_id) {
        await cloudinary.removeFromCloudinary(memo.cloudinary_id);
      }
      await memo.remove();
      return res.status(200).json({ message: "post deleted successfully" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  //  -----------------------//getOnePost method //--------------------------- //

  getOnePost: async (req, res) => {
    try {
      const memo = await Post.findById({ _id: req.params.id });
      res.status(200).json(memo);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  //  -----------------------//getAllPost method //--------------------------- //

  getAllPost: async (req, res) => {
    try {
      const memo = await Post.find().populate("owner", ["name", "image"]);
      res.status(200).json(memo);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  //  -----------------------//getAllPost by userID method //--------------------------- //
  getAllPostbyUser: async (req, res) => {
    try {
      const memo = await Post.find({ owner: req.user.id });
      res.status(200).json(memo);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  //  ----------------------//likes method //--------------------------- //
  like: async (req, res) => {
    const { id } = req.params;

    try {
      const data = await Post.findById(id);
      const index = data.likes.findIndex((id) => id === String(req.user.id));
      if (index === -1) {
        data.likes.push(req.user.id);
      } else {
        data.likes = data.likes.filter((id) => id !== String(req.user.id));
      }
      const memo = await Post.findByIdAndUpdate(id, data, {
        new: true,
      });
      res.status(200).json(memo);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  //  ----------------------//Comments method //--------------------------- //
  Comment: async (req, res) => {
    console.log("🚀 ~ file: posts.js:160 ~ Comment: ~ req", req.body)
    const { id } = req.params;
    try {
      if (!id)
        return res
          .status(404)
          .json({ message: "Please provide comment data and post" });

      const checkPost = await Post.findById(id);
      if (!checkPost) return res.status(404).json({ message: "No post found" });

      const commendData = await Comment.create({
        owner: req.user.id,
        post: id,
        text: req.body.text,
      });

      res.status(200).json(commendData);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
    //  ----------------------//get all Comments //--------------------------- //
    getComments: async (req, res) => {
      try {
        const comments = await Comment.find().populate("owner", ["name", "image"]);
        res.status(200).json(comments);
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }

};
