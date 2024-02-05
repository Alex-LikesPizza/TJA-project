const express = require("express");
const route = express.Router();

const  firebaseConfig = require("../keys/firebaseConfig");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

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

      let col;
      if (data.category) {
        col = collection(database, "messages");
      } else {
        col = collection(database, "serviceRequests");
      }

      await addDoc(col, { 
        timestamp: serverTimestamp(), 
        ...data 
      });

      res.json({ message: 'Data received and written successfully' });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
});
route.get("/server", (req, res, next) => {

  
});

module.exports = route;
