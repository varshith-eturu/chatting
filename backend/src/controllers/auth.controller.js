import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import{ generateToken} from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async(req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if(!email || !password || !fullName) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    if(password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const userExists = await User.findOne({ email });
    if(userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: hashedPassword,
      fullName
    });

    if(newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return  res.status(201).json({ 
        message: "User registered successfully", 
        user: {
          _id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          profilePic: newUser.profilePic
        }
      });
    }else{
      return res.status(400).json({ message: "Invalid user data" });
    }
    
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
}
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    generateToken (user._id, res);
    return res.status(200).json({ 
      message: "Login successful", 
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic
      }
    });
  }catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
}   
export const logout = (req, res) => {
  try {
    res.cookie("jwt","", {maxAge:0});
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
} 

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({ message: "Profile picture is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, { new: true });

        res.status(200).json({updatedUser});
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error during profile update" });
    }
}

export const checkAuth =  (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error checking authentication:", error);
        res.status(500).json({ message: "Server error during authentication check" });
    }
}