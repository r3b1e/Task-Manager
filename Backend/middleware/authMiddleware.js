const jwt = require('jsonwebtoken')
const User = require("../models/User");

//Middleware to protect routes

const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith('Bearer')) {
            token = token.split(" ")[1]; // extract token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } else {
            res.status(401).json({ message: "Token failed" });
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Server error", error: error.message });
    }
}

//middleware for admin-only access

const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        next();
    }else{
        res.status(403).json({message: "Access denied, admin only"});
    }
}

module.exports = {protect, adminOnly};