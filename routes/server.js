const express = require("express");
const route = express.Router();

const  firebaseConfig = require("../keys/firebaseConfig");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp, getDocs } = require("firebase/firestore");

let app = initializeApp(firebaseConfig);;
const database = getFirestore(app);

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
const getGallery = async () => {
  const querySnapshot = await getDocs(collection(database, "products"));
  const products = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });
  return JSON.stringify(products);
};
route.get("/productsGallery",  async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  try{
    let jsonData = await getGallery();
    res.end(jsonData);
  }
  catch(err){
    console.log(err);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});
route.post("/server", async (req, res, next) => {
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
route.post("/productsOrder", async (req, res) => {
  let rawData = '';
  console.log("------New Request------");

  req.on('data', (chunk) => {
    rawData += chunk;
  });
  req.on('end', async () => { 
    try{
      const data = JSON.parse(rawData);
      // TODO: Add firebase upload
      
      res.json({message: " data uploaded successfully"});
    }
    catch(error){
      console.error('Error:', error.message);
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
});



module.exports = route;
