import React, { ChangeEvent, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "@/utils/api";

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
  const [thumbnail, setThumbnail] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [channel, setChannel] = useState<string>('');

  const uploadVideo = api.video.uploadVideo.useMutation({
    onSuccess: data => {
      console.log(data);
    }
  })

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    
    uploadVideo.mutateAsync({
      title,
      description,
      thumbnailUrl: thumbnail,
      category: 'Education',
      language: 'English',
      status: 'public',
      tags: [],
      video: [],
      duration: 10,
     channelId: channel
    })

  }

  return (
    <div>
      <form>
        <input onChange={(e: ChangeEvent<HTMLInputElement>): void => setTitle((_prev: string): string => e.target.value)} placeholder="title" className=" mx-auto flex h-10 w-[30vw] rounded-md border border-[black] bg-[#282828]  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" />
        <input onChange={(e: ChangeEvent<HTMLInputElement>): void => setDescription((_prev: string): string => e.target.value)} placeholder="description" className=" mx-auto flex h-10 w-[30vw] rounded-md border border-[black] bg-[#282828]  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" />
        <input onChange={(e: ChangeEvent<HTMLInputElement>): void => setThumbnail((_prev: string): string => e.target.value)} placeholder="thumbnail" className=" mx-auto flex h-10 w-[30vw] rounded-md border border-[black] bg-[#282828]  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" />
        <input onChange={(e: ChangeEvent<HTMLInputElement>): void => setChannel((_prev: string): string => e.target.value)} placeholder="channelid" className=" mx-auto flex h-10 w-[30vw] rounded-md border border-[black] bg-[#282828]  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" /> 
        <button type="submit" onClick={handleFormSubmit} className="bg-[#3ea6ff] h-10 px-4 py-2 rounded-md mx-[20vw] mt-8 text-primary-foreground hover:bg-primary/90" >Upload</button>
      </form>
    </div>
  )
}
