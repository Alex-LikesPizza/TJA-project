const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const route = express.Router();

const  firebaseConfig = require("../keys/firebaseConfig");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);


route.post("/server", async (req, res, next) => {
  let rawData = '';
  
  req.on('data', (chunk) => {
    rawData += chunk;
  });

  req.on('end', async () => {
    try {
      const data = JSON.parse(rawData);

      let collection;
      if(data.category){
        collection //
      }


      res.json({ message: 'Data received successfully' });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
});
route.get("/server", (req, res, next) => {

  
});

module.exports = route;
