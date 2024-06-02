import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { exec } from "child_process";
import fs from 'fs';
import path from "path";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? '',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY ?? '',
    secretAccessKey: process.env.SECRET_KEY ?? ''
  }
})

export async function getObjects(oldList: (string | undefined)[]) {
  const cmd = new ListObjectsV2Command({
    Bucket: 'ytvideoraw'
  })
  const response = await s3.send(cmd);
  const { Contents } = response;
  console.log(Contents);
  const newList = Contents?.map(content => content.Key);
  const newObjects = newList?.filter(object => !oldList.includes(object));

  newObjects?.map(async object => {

    if (object && object.split('-')[0] === 'video') {
      const bucket = 'ytvideoraw';
      const key = object;

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key
      })
      const response = await s3.send(command);

      const inputPath = `../files/input/${key}`;
      const outputDir = `../files/output/${key}`;
      const outputPath = `${outputDir}/${key}-output.m3u8`;

      console.log('key is ===>>>', key);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      if (response.Body) fs.writeFile(inputPath, await response.Body?.transformToByteArray(), (err) => {
        if (err) throw err;

        const ffmpegCommand = `ffmpeg -i ${inputPath} -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -hls_segment_filename "${outputDir}/${key}-segment_%03d.ts" -f hls ${outputPath}`;

        exec(ffmpegCommand, async (error, stdout, stderr) => {
          if (error) {
            console.log(`exec error: ${error}`)
          }
          console.log(`stdout: ${stdout}`)
          console.log(`stderr: ${stderr}`)

          const files = fs.readdirSync(outputDir);
          for (const file of files) {
            const filePath = path.join(outputDir, file);
            const fileContent = fs.readFileSync(filePath);
            const fileKey = `${path.basename(file)}`; // Append video key to filename
            try {
              const upload = await s3.send(new PutObjectCommand({
                Bucket: 'ytvideoprocessed',
                Key: fileKey,
                Body: fileContent
              }));
              console.log(`File ${file} uploaded successfully to S3 as ${fileKey}`);
            } catch (err) {
              console.error(`Error uploading file ${file} to S3:`, err);
            }
          }

        })
      });
    }
  })

  return {
    newList,
    newObjects
  }
}

