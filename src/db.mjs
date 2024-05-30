// db.mjs
import mongoose from 'mongoose';

// schema for contacts and their messages
const Contact = new mongoose.Schema({
    name: {required: true, type: String},
    email: {required: true, type: String},
    message: {required: true, type: String},
});

// schema for projects
const Projects = new mongoose.Schema({
  id: {type: Number, required: true},
  name: {type: String, required: true},
  description: {type: String, required: false},
  topics: {type: String, required: false},
  url: {type: String, required: false},
  created: {type: String, required: false},
  updated: {type: String, required: false},
});

// instantiate the model
mongoose.model('Contact', Contact);
mongoose.model('Projects', Projects);

// connect to mongoose
mongoose.connect(process.env.DSN)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

export {Contact, Projects};