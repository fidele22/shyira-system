
const express = require('express');
const router = express.Router();
const User = require('../models/user');
//const middleware= require('../middlewares/userAthu')
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


// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user._id; // Ensure you're using the correct user ID

    // Validate that the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's fields
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.phone = req.body.phone || user.phone;
    // Add more fields as needed...

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with updated user data
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

