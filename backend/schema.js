import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      lowercase: true,  // Ensures email is stored in lowercase
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],  // RegExp for email validation
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],  // Minimum length
      validate: {
        validator: function(v) {
          return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/.test(v);
        },
        message: 'Password must contain at least one letter, one number, and one special character',
      }
    }
  }, { timestamps: true });

const adminSchema = new mongoose.Schema({
    adminname: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      lowercase: true,  // Ensures email is stored in lowercase
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],  // RegExp for email validation
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],  // Minimum length
      validate: {
        validator: function(v) {
          return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/.test(v);
        },
        message: 'Password must contain at least one letter, one number, and one special character',
      }
    }
  },{
    timestamps: true
  });

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    imageUrl:{
        type: String,
        required: [true, "ImageUrl is required"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: [true, "Author is required"]
    },
    price:{
        type: Number,
        required: [true, "Price is required"]
    }
})

const purchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "UserId is required"]
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "CourseId is required"]
    }
    
})

export const User = mongoose.model("User", userSchema)
export const Course = mongoose.model("Course", courseSchema)
export const Purchase = mongoose.model("Purchase", purchaseSchema)
export const Admin = mongoose.model("Admin", adminSchema)
