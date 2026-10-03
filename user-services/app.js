const express = require('express');

const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Mike" }
];

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
    console.log("BODY RECEIVED:", req.body);
    users.push(req.body);
    res.status(201).json(req.body);
});

app.get('/health', (req, res) => {
  res.status(200).send("OK");
});

app.listen(3001, () => {
  console.log("User service running");
});