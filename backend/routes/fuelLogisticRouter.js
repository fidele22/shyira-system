// routes/department.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const ApprovedLogisticOrder = require('../models/logisticFuelApproved')
const fuelOrder = require('../models/logisticfuelrequest'); 
const ApprovedfuelOrder = require('../models/logisticFuelApproved')
const RecievedFuelOrder = require('../models/logisticFuelReceived')

// fuel logistic requisition 



router.post('/fuel-order', async (req, res) => {
  try {
    const {
      supplierName,
      items,  // Now handling items
      date,
      hodName,
      hodSignature
    } = req.body;

    items.forEach(item => {
      item.totalPrice = item.quantityRequested * item.pricePerUnit;
    });
    
    const newRequisition = new fuelOrder({
      supplierName,
      items,  // Store items here
      date,
      hodName,
      hodSignature
    });

    console.log(req.body); // Logs incoming request data

    // Save to the database
    const savedRequisition = await newRequisition.save();

    res.status(201).json(savedRequisition);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error: Could not create requisition' });
  }
});


// Route to fetch all logistic requests
router.get('/', async (req, res) => {
    try {
      const fuellogisticrequests = await fuelOrder.find();
      res.json(fuellogisticrequests);
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // Route to fetch all logistic requests
router.get('/fuel-order', async (req, res) => {
  try {
    const fuellogisticorders = await ApprovedfuelOrder.find();
    res.json(fuellogisticorders);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

  // Route to fetch a single logistic request by ID
  router.get('/:id', async (req, res) => {
    try {
      const requestId = req.params.id;
      // Validate that requestId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      const request = await fuelOrder.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
      res.json(request);
    } catch (error) {
      console.error('Error fetching request:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Route to verify a request
router.post('/verified/:id', async (req, res) => {
    try {
      const requestId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
  
      const request = await fuelOrder.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
  
      // Save to the verified collection
      const verifiedRequest = new ApprovedLogisticOrder(request.toObject());
      await verifiedRequest.save();
  
      // Optionally, remove from the original collection
      await fuelOrder.findByIdAndDelete(requestId);
  
      res.json(verifiedRequest);
    } catch (error) {
      console.error('Error verifying request:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
// Route to mark  a fuel order as recieve
router.post('/recieved-fuel/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const request = await ApprovedLogisticOrder.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Save to the recieved fuel order  collection
    const recievedOrder = new RecievedFuelOrder(request.toObject());
    await recievedOrder.save();

    // Optionally, remove from the original collection
    await ApprovedLogisticOrder.findByIdAndDelete(requestId);

    res.json(recievedOrder);
  } catch (error) {
    console.error('Error verifying request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



  module.exports = router;