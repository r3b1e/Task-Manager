const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
// const { getUserProfile } = require('../controllers/authControllers');
const {getUsers, getUserById, deleteUser} = require("../controllers/userControllers");
// const router = express.Router();

router = express.Router();
// User Management Routes
router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, getUserById);
router.get("/:id", protect, adminOnly, deleteUser);

module.exports = router;