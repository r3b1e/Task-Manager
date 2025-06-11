const User = require("../models/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    // return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '7d'});
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

};

// @desc Register a new user
// @route POST /api/auth/register
// @access public

const registerUser = async (req, res) => {
    try{
        const { name, email, password, profileImageUrl, adminInviteToken} = req.body;
        // console.log(User.getIndexes())
        console.log(name, email, password, profileImageUrl, adminInviteToken);
        const userExists = await User.findOne({ email });
        if (userExists){
            return res.status(400).json({message: "User already exists"});

        }
        let role = 'member';
        if (adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN){
            role = 'admin'
        }
        
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });
        console.log("working");

        //Return user data with JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),


        });
        
    } catch(error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc Login an existing user
// @route POST /api/auth/login
// @access public

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({
            email
        });
        if(!user){
            return res.status(500).json({message: "Invalid email or password, User not Exist"})
        }
        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status.json({message: "Invalid email or password"})
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        })
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private (Requires JWT)

const getUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        res.json(user);
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
};


// @desc Update an existing user
// @route PUT /api/auth/profile
// @access Private (Requires JWT)

const updateUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);

        if(!user) {
            return res.status(404).json({message: "User not found"});

        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);

        }

        const updateduser = await user.save();

        res.json({
            _id: updateduser._id,
            name: updateduser.name,
            email: updateduser.email,
            role: updateduser.role,
            token: generateToken(updateduser._id),
        })
    }catch(error){
        res.status(500).json({message: "Serer error", error: error.message})
    }
};

module.exports = {registerUser, loginUser, getUserProfile, updateUserProfile}
