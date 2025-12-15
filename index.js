import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';  // <-- Import CORS
import userRoutes from './routes/users.js';
import contactsRoutes from './routes/contacts.js';
import eventsRoutes from './routes/events.js';
import membersRoutes from './routes/members.js';
import blogRoutes from './routes/blogs.js';
import commentRoutes from './routes/comments.js';



const app = express();
const port = 3000;

// Enable CORS for your frontend
const allowedOrigins = ['http://localhost:8080', 'http://localhost:8082'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));


// Middleware
app.use(express.json());  // For parsing application/json

// Routes
app.use('/api/contacts', contactsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);



app.use('/api/users', userRoutes);

// Simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// POST route example
app.post('/data', (req, res) => {
  const data = req.body;
  res.json({ message: 'Data received', data });
});

// Bind to all network interfaces
const host = '0.0.0.0';
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
