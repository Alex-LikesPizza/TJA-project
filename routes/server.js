const express = require("express");
const route = express.Router();

const  firebaseConfig = require("../keys/firebaseConfig");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp, getDocs, getDoc, query, where, doc} = require("firebase/firestore");

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
const postProduct = async (data) => {
  
  let col = collection(database, "productRequests");
  const sendData = {}
  sendData.name = data.name;
  sendData.email = data.email;
  sendData.number = data.number;
  sendData.address = data.address;
  sendData.code = data.code;
  sendData.message = data.message;
  sendData.productIDs = [...data.productIDs];
  sendData.timestamp = serverTimestamp(); 
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
const getProduct = async (id) => {
  try{
    const location = doc(database, "products", id);
    const productData = await getDoc(location);
    const docData = {id: productData.id, ...productData.data()};
    return docData;
  }
  catch(err){
    console.error(err)
  }
}

route.get("/productData",  async (req, res, next) => {
  const productId = req.query.id;
  try{
    let jsonData = await getProduct(productId);
    res.end(JSON.stringify(jsonData));
  }
  catch(err){
    console.log(err);
  }
});

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

route.get("/searchData",  async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const data = req.query.data;
    
    if (!data) {
      res.status(200).send({ notFound: true });
      return;
    }
  
    const productsRef = collection(database, "products");
    
    function standardizeWord(str) {
      str.trim();
      const diacriticsMap = {
          'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ş': 's', 'ț': 't', 'ţ': 't',
          'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ş': 'S', 'Ț': 'T', 'Ţ': 'T'
      };
      return str.replace(/[ăâîșşțţĂÂÎȘŞȚŢ]/g, function(match) {
          return diacriticsMap[match];
      });
    }

    const searchTerm = data.trim().toLowerCase();
    const searchWords = searchTerm.split(" ").filter(word => word.length > 0).map(word => standardizeWord(word).trim());
    console.log("Search:", searchWords);

    const q = query(
      productsRef,
      where('keywords', 'array-contains-any', searchWords),
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      res.status(200).send({ notFound: true });
      return;
    }
  
    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    console.log(products);
    res.status(200).send(products);
  } catch (err) {
    console.error("Error:", err);
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
route.post("/productOrder", async (req, res) => {
  let rawData = '';
  req.on('data', (chunk) => {
    rawData += chunk;
  });
  req.on('end', async () => { 
    try{
      const data = JSON.parse(rawData);
      const success =
        await postProduct(data);
      if (success) {
        res.json({ message: 'Data received and written successfully' });
      } else {
        res.status(500).json({ error: 'Failed to write data.' });
      }
    }
    catch(error){
      console.error('Error:', error.message);
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
});



module.exports = route;
