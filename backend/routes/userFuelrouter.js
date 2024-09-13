// fetching for view requisition by it ID
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
const JWT_SECRET = 'your_jwt_secret';
const authMiddleware = require('../middlewares/userAthu')
const ApprovedFuelRequest = require ('../models/approvedfuelRequest')
const RecievedFuelRequest = require ('../models/fuelRequestRecieved')


  router.get('/', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId; // Ensure userId is an ObjectId
  
      // Query by userId and status
      const requestfuelApproved = await ApprovedFuelRequest.find({ userId: userId });
  
      if (!requestfuelApproved || requestfuelApproved.length === 0) {
        return res.status(404).json({ message: 'No approved requests found for this user.' });
      }
     
      res.json(requestfuelApproved);
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ message: error.message });
    }
  });  

router.get('/:id', async (req, res) => {
    try {
      const requestfuelApproved = await ApprovedFuelRequest.findById(req.params.id);
      res.json(requestfuelApproved);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/recievedfuel', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId; // Ensure userId is an ObjectId
  
      // Query by userId and status
      const recievedFuelRequest = await RecievedFuelRequest.find({ userId: userId });
  
      if (!recievedFuelRequest || recievedFuelRequest.length === 0) {
        return res.status(404).json({ message: 'No approved requests found for this user.' });
      }
     
      res.json(recievedFuelRequest);
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ message: error.message });
    }
  });  

router.get('/receivedfuel/:id', async (req, res) => {
    try {
      const recievedFuelRequest = await RecievedFuelRequest.findById(req.params.id);
      res.json(recievedFuelRequest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  module.exports = router;