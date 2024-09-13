
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const middleware= require('../middlewares/userAthu')
const upload = require('../middlewares/upload');

// Update user route with signature upload
router.put('/:id', upload.single('signature'), async (req, res) => {
  try {
    const { positionName, serviceName, departmentName, firstName, lastName, phone, email, role } = req.body;
    const userId = req.params.id;
    let updateData = {
      firstName,
      lastName,
      phone,
      email,
      role,
      positionName,
      departmentName,
      serviceName
    };
  
    // If a file is uploaded, add the path to updateData
    if (req.file) {
      updateData.signature = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// routes/profile.js

// Change password
// Change password
router.put('/change-password',middleware, async (req, res) => {
  try {
    const userId = req.user.id; // Ensure this is correctly set by your authentication middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});





module.exports = router;
