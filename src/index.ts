 
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

import router from './router'

// Load environment variables from .env file
dotenv.config()
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI){
  console.error(`MONGO_URI is not defined in the environment variables`);
  process.exit(1)
}

const PORT = 8080

const app = express ()
app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})

// set up DB
mongoose.Promise = Promise;
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Mongoose connected to DB');
  })
  .catch((error) => {
    console.log(`Mongoose connection error: ${error.message}`);
  });
  

app.use('/', router())




