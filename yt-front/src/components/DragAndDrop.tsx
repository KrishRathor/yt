import React, { ChangeEvent, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

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

const VideoForm: React.FC = () =>{ 

  const [name, setName] = useState<string>('');
  const [video, setVideo] = useState<File | undefined>(undefined);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    if (typeof video === "undefined") {
      alert("Please select  a video");
      return;
    }

    console.log(name, video);
 
    try {
      const req = await fetch('http://localhost:8080/upload/getPresignedUrl');
      const res = await req.json();
      console.log(res)

      const {url, fields} = res;

      const form = new FormData();

      Object.entries(fields).map(([field, value]) => {
        typeof value === "string" && form.append(field, value);
      })
      form.append('file', video);
      
      await fetch(url, {
        method: 'POST',
        body: form
      }); 

    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div>
      <form>
        <input onChange={(e: ChangeEvent<HTMLInputElement>): void => setName((_prev: string): string => e.target.value)} placeholder="Video Title" className=" mx-auto flex h-10 w-[30vw] rounded-md border border-[black] bg-[#282828]  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        <input onChange={
          (e: ChangeEvent<HTMLInputElement>) => {
            e.target.files && setVideo((_prev: File | undefined) => {
              if (e.target.files) {
                return e.target.files[0]
              }
            })
          }
        } placeholder="Video" type="file" className="mt-8 cursor-pointer mx-auto flex h-10 w-[30vw] rounded-md border border-[black] bg-[#282828]  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        <button type="submit" onClick={handleFormSubmit} className="bg-[#3ea6ff] h-10 px-4 py-2 rounded-md mx-[20vw] mt-8 text-primary-foreground hover:bg-primary/90" >Upload</button>
      </form>
    </div>
  )
}
