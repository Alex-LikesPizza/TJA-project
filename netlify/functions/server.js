const serverless = require('serverless-http');
const express = require("express");
const session = require('express-session');
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

const app = express();

const  firebaseConfig = require("../../keys/firebaseConfig");

let firebaseApp = initializeApp(firebaseConfig);;
const database = getFirestore(firebaseApp);

const postData = async (data) => {
  
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
  try {
    const docRef = await addDoc(col, {...sendData});
    console.log("Document written with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
}

app.post("/server", async (req, res, next) => {
  let rawData = '';
  console.log("------New Request------");

  req.on('data', (chunk) => {
    rawData += chunk;
  });
  req.on('end', async () => { 
    try {
      const data = JSON.parse(rawData);
      const success = await postData(data);
      if (success) {
        res.json({ message: 'Data received and written successfully' });
      } else {
        res.status(500).json({ error: 'Failed to write data to Firebase' });
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
});

module.exports.handler = serverless(app);