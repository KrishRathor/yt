import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
import {v4 as uuidv4} from "uuid";
import multerS3 from "multer-s3";
import { BucketAlreadyOwnedByYou, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getObjects } from "./monitorS3";
import bodyParser from "body-parser";

dotenv.config();

const app = express()
const port = 8080;
app.use(cors());
app.use(bodyParser.json());

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

app.post('/upload/getPresignedUrl', async (req, res) => {

  const { key, thumbnail } = req.body;
  console.log(key, thumbnail, req.body);
  const name = thumbnail === "1" ? `thumbnail-${key}` : `video-${key}`;
  
  const {url, fields} = await createPresignedPost(s3, {
        Bucket: "ytvideoraw",
        Key: name,
        Conditions: [
            { bucket: "ytvideoraw" },
            ["content-length-range", 0, 100000000],
        ],
        Fields: {
            key: name,
        },
        Expires: 600, // Expires in 10 minutes
    });
  res.json({fields, url});
})


let oldList: (string | undefined)[] = [];

app.post('/transcodevideo', async (req, res) => {
  const { newList, newObjects } = await getObjects(oldList);
  if (newList) oldList = newList;
  return res.json({
    'message': 'successfully',
    'newObjects': newObjects
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

