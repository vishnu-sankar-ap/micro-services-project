const express = require('express');

const app = express();

const products = [

 {
   id:1,
   name:"Laptop",
   price:50000
 },

 {
   id:2,
   name:"Phone",
   price:20000
 }

];

app.get('/products',(req,res)=>{
   res.json(products);
});

app.get('/health', (req, res) => {
  res.status(200).send("OK");
});

app.listen(3002,()=>{
   console.log("Product service running");
});