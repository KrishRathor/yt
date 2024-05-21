import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
import {v4 as uuidv4} from "uuid";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import FormData from "form-data";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express()
const port = 8080;
app.use(cors());

const createFileName = (filename: string): string => {
  return filename.replace(/ /g, '_') + uuidv4();
}



const s3 = new S3Client({
  region: process.env.AWS_REGION ?? '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
    secretAccessKey: process.env.AWS_SECRET_KEY ?? ''
  }
})

const storage = multerS3({
  s3: s3,
  bucket: 'ytvideoraw',
  key: function (req, file, cb) {
    cb(null, createFileName(file.originalname)); 
  }
}) 
 
const upload = multer({ storage: storage });

app.use(express.static('uploads'));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

app.get('/upload/getPresignedUrl', async (req, res) => {
  const {url, fields} = await createPresignedPost(s3, {
        Bucket: "ytvideoraw",
        Key: `user`,
        Conditions: [
            { bucket: "ytvideoraw" },
            ["starts-with", "$key", `user`],
            ["content-length-range", 0, 1000000],
        ],
        Fields: {
            key: `user`,
        },
        Expires: 600, // Expires in 10 minutes
    });
  res.json({fields, url});
})

app.post('/upload/video', upload.single('video'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      console.log('i cam here');
      return res.status(400).json({
        message: 'no file provided',
        url: null
      });
    }

    // from here send a video to queue
    // from there to an encoding service which makes segments of videos in multiple resolution
    // then store this to s3
    // encoding service can be a route here only, i don't think we need separate service for it
    
    console.log(process.env.AWS_SECRET_KEY); 

    console.log('i didnt came here', req.file);
    res.status(201).json({
      message: 'File uploaded successfully',
      url: null
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error uploading file.');
  }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

