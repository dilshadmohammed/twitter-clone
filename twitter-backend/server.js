const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./tweety.db', (err) => {
 if (err) {
    return console.error(err.message);
 }
 console.log('Connected to the SQLite database.');
});


const bodyParser = require('body-parser');
const db = require('./db');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

// Authenticate user middleware
const authenticateUser = (req, res, next) => {
 const token = req.headers['authorization'];

 if (!token) {
    return res.status(401).json({ error: 'Unauthorized access' });
 }

 jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    req.userId = decoded.id;
    next();
 });
};

// Register a new user
app.post('/users/register', (req, res) => {
 const { username, password } = req.body;

 db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    res.json({ message: 'User registered successfully' });
 });
});

// Authenticate a user
app.post('/users/login', (req, res) => {
 const { username, password } = req.body;})

 db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Unauthorized'})}})

// Create table
db.run('CREATE TABLE IF NOT EXISTS tweets (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, username TEXT, message TEXT, likes INTEGER)', (err) => {
 if (err) {
    return console.error(err.message);
 }
 console.log('Table created.');
});

// Create a tweet
app.post('/tweets', (req, res) => {
 const tweet = [req.body.username, req.body.content, new Date().toISOString()];

 const sql = 'INSERT INTO tweets (username, content, created_at) VALUES (?, ?, ?)';

 db.run(sql, tweet, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    db.get(`SELECT * FROM tweets WHERE id = ${this.lastID}`, (err, row) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      res.json({ message: 'Tweet created successfully', data: row });
    });
 });
});

// Get all tweets
app.get('/tweets', (req, res) )

// Updating a tweet

app.put('/tweets/:id', (req, res) => {
    const id = req.params.id;
    const { content } = req.body;
   
    db.run('UPDATE tweets SET content = ? WHERE id = ?', [content, id], (err) => {
       if (err) {
         return res.status(400).json({ error: err.message });
       }
   
       res.json({ message: 'Tweet updated successfully' });
    });
   });

   // Deleting a tweet

   app.delete('/tweets/:id', (req, res) => {
    const id = req.params.id;
   
    db.run('DELETE FROM tweets WHERE id = ?', [id], (err) => {
       if (err) {
         return res.status(400).json({ error: err.message });
       }
   
       res.json({ message: 'Tweet deleted successfully' });
    });
   });

