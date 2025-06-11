const Task = require("../models/Tasks");
const User = require('../models/User');
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
    try {
        console.log("running");

        // Find all users with 'member' role and exclude password
        const users = await User.find({ role: 'member' }).select("-password");

        // Process each user asynchronously
        const userWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
                
                const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
                const completeTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

                // Return updated user object with task counts
                return {
                    ...user._doc, // Spread the user data
                    pendingTasks,
                    inProgressTasks,
                    completeTasks,
                };
            })
        );

        // Send the response with users' task counts
        res.json(userWithTaskCounts);
    } catch (err) {
        console.error(err);  // Log the error for debugging
        res.status(500).json({ message: "Server error", error: err.message });
    }
};




const getUserById = async (req, res) => {
    try{
        console.log(req.params.id)
        const user = await User.findById(req.params.id).select('-password');
            if (!user) return res.status(404).json({message: "User not found"})
                res.json(user); 
    } catch(error){
        res.status(500).json({ message: "Server Error ", error: error.message });
    }
}




const deleteUser = async (req, res) => {}

module.exports = {getUsers, getUserById, deleteUser}