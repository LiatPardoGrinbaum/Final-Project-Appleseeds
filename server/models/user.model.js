import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Post } from "./post.model.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
  },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar: {
    type: Buffer,
  },
});

//hiding private data
//toJSON stringify user res
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject(); //toObeject is a method provided by mongoose
  delete userObject.confirmPass;
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

//connection between user and posts
//virtual means we're not really changing what we store in the user document
userSchema.virtual("userPosts", {
  ref: "posts", //exact name of Post model
  localField: "_id", //user's id
  foreignField: "owner",
});

//generate new token to new user \ logged in user
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismyfinalproject");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//verify on login if the user's inputs are correct
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("There is not such a user.");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("wrong password.");
  }

  return user;
};

//hash the password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//Delete user posts when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Post.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("users", userSchema);

export { User };
