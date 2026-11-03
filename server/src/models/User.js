// User model - stores customer and admin accounts.
// Passwords are never stored as plain text: they are hashed with
// bcrypt before saving, and are excluded from query results by default.

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,      // no two accounts with the same email
      lowercase: true,   // stored as lowercase so "A@b.com" == "a@b.com"
      trim: true,
      // simple check that the value looks like an email address
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // not returned by queries unless explicitly asked for
    },
    role: {
      type: String,
      enum: ["user", "admin"], // regular customer or admin
      default: "user",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    toJSON: {
      // Never send the password hash to the frontend, even if it was selected.
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Runs automatically before a user document is saved.
// We hash the password here, but only when it was just set or changed
// (otherwise updating the user's name would re-hash the hash).
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // 10 salt rounds
  next();
});

// Instance method: check a plain-text password against the stored hash.
// Used by the login controller later: user.comparePassword("mypassword")
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
