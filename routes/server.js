const express = require("express");
const route = express.Router();

const  firebaseConfig = require("../keys/firebaseConfig");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

const postData = (data) => {
  
  let col;
  const sendData = {}
  sendData.name = data.name;
  sendData.email = data.email;
  sendData.number = data.number;
  sendData.message = data.message;
  sendData.timestamp = serverTimestamp(); 
  if (data.category !== undefined) {
    col = collection(database, "messages");
    sendData.category = data.category;
  } else {
    col = collection(database, "serviceRequests");
    sendData.service = data.service;
  }
  console.log(sendData);
  addDoc(col, {...sendData});
}

route.post("/server", async (req, res, next) => {
  let rawData = '';

  req.on('data', (chunk) => {
    rawData += chunk;
  });
  req.on('end', async () => { 
    try {
      const data = JSON.parse(rawData);
      postData(data);

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
