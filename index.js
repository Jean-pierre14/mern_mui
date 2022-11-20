import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import {fileURLToPath} from 'url';

import authRoutes from './routes/auth.js';
import {register} from './controllers/auth.js';
import {createPost} from './controllers/posts.js';
import userRoutes from './routes/users.js';
import { verifyToken } from './middleware/auth.js';
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from './data/index.js';

// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: ".env"});
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true} ));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/** 
 * File storage
 */

const storage = multer.diskStorage({

    destination: function(req, res, cb){
        cb(null, "public/assets");
    },
    filename: function(req, res, cb){
        cb(null, file.originalname);
    }

});

const upload = multer({storage});

// Files Routes
app.post('/auth/register', upload.single("picture"), register);
app.post('/posts', verifyToken, upload.single("picture"), createPost);

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

/* Mongoose setup */

const PORT = process.env.PORT || 7000;
const DB = process.env.MONGO_URI

mongoose
    .connect(DB, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(_ => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    // To run it once
    User.insertMany(users);
    Post.insertMany(posts);
}).catch((err) => console.log(`${err} did not connect`));
