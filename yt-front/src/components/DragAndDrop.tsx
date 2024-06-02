import React, { ChangeEvent, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "@/utils/api";
import { getUrl } from "node_modules/@trpc/client/dist/links/internals/httpUtils";

export const DragAndDrop: React.FC = () => {

  return (
    <div>
      <div className="w-[50vw] h-[90vh] bg-[#282828]  mt-4 mx-auto rounded-md " >
        <div className="flex justify-between" >
          <div className="m-2" > <p className="text-xl" >Upload Videos</p> </div>
          <div className="m-2 cursor-pointer" >
            <CloseIcon />
          </div>
        </div>

        <hr className="border-[#333333]" />

        <div className="mt-8" >
          <VideoForm />
        </div>

      </div>
    </div>
  )
}

const VideoForm: React.FC = () => {

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [channel, setChannel] = useState<string>('');
  const [video, setVideo] = useState<File | undefined>(undefined);

  const uploadVideo = api.video.uploadVideo.useMutation({
    onSuccess: data => {
      console.log(data);
    }
  })

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    try {

      console.log('title', title);

      const request = await fetch('http://localhost:8080/upload/getPresignedUrl', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          key: title,
          thumbnail: '1'
        })
      })
      const { url, fields } = await request.json();
      console.log(url, fields);

      const formData = new FormData();


      for (const key in fields) {
        if (fields.hasOwnProperty(key)) {
          formData.append(key, fields[key]);
        }
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      thumbnail && formData.append('file', thumbnail);

      const uploadThumbnail = await fetch(url, {
        method: 'POST',
        body: formData
      })

      console.log('thumbain', uploadThumbnail);

      // uploading video
      console.log('getting url for video');
      const getUrlForVideo = await fetch('http://localhost:8080/upload/getPresignedUrl', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          key: title.replace(/\s+/g, ''),
          thumbnail: '0'
        })
      })
      console.log('video', getUrlForVideo);

      const response = await getUrlForVideo.json();
      const videoUrl = response.url;
      const videoFields = response.fields;
      const videoForm = new FormData();
      console.log(videoUrl, videoFields);

      for (const key in videoFields) {
        if (videoFields.hasOwnProperty(key)) {
          videoForm.append(key, videoFields[key]);
        }
      }

      video && videoForm.append('file', video);

      const uploadVid = await fetch(videoUrl, {
        method: 'POST',
        body: videoForm
      })

      console.log(uploadVid);

      uploadVideo.mutateAsync({
        title,
        description,
        thumbnailUrl: `https://d1okbxed4nu0ml.cloudfront.net/thumbnail-${title}`,
        category: 'Education',
        language: 'English',
        status: 'public',
        tags: [],
        video: [`https://d3teh7ofklmaj3.cloudfront.net/video-${title.replace(/\s+/g, '')}-output.m3u8`],
        duration: 10,
        channelId: channel
      })

    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div>
      <form>
        <input onChange={(e: ChangeEvent<HTMLInputElement>): void => setTitle((_prev: string): string => e.target.value)} placeholder="title" className=" mx-auto text-white flex h-10 w-[30vw] rounded-md border border-[black] bg-[#282828]  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" />
        <input onChange={(e: ChangeEvent<HTMLInputElement>): void => setDescription((_prev: string): string => e.target.value)} placeholder="description" className=" mx-auto text-white flex h-10 w-[30vw] rounded-md border border-[black] bg-[#282828]  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" />
        <input onChange={(e: ChangeEvent<HTMLInputElement>): void => setThumbnail((_prev: (File | undefined)): (File | undefined) => { if (e.target.files) return e.target.files[0] })} type="file" placeholder="thumbnail" className=" mx-auto text-white flex h-10 w-[30vw] rounded-md border border-[black] bg-[#282828]  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" />
        <input onChange={(e: ChangeEvent<HTMLInputElement>): void => setVideo((_prev: (File | undefined)): (File | undefined) => { if (e.target.files) return e.target.files[0] })} type="file" placeholder="video" className=" mx-auto text-white flex h-10 w-[30vw] rounded-md border border-[black] bg-[#282828]  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" />
        <input onChange={(e: ChangeEvent<HTMLInputElement>): void => setChannel((_prev: string): string => e.target.value)} placeholder="channelid" className=" mx-auto flex h-10 w-[30vw] rounded-md border border-[black] bg-[#282828] text-white  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" />
        <button type="submit" onClick={handleFormSubmit} className="bg-[#3ea6ff] h-10 px-4 py-2 rounded-md mx-[20vw] mt-8 text-primary-foreground hover:bg-primary/90" >Upload</button>
      </form>
    </div>
  )
}
