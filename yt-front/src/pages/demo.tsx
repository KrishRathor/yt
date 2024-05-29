import { db } from "@/server/db";
import { api } from "@/utils/api";
import { applyReferentialEqualityAnnotations } from "node_modules/superjson/dist/plainer";
import React from "react";

const Demo: React.FC = () => {

  const addVideo = api.playlist.addVideo.useMutation({
    onSuccess: data => {
      console.log(data);
    }
  })



  const handleClick = async () => {
    console.log('clicked!');
    addVideo.mutateAsync({
      videoId: 3,
      playlistId: 1
    })
  }

  return (
    <div className="bg-black text-white h-[100vh]" >
      <button onClick={handleClick} >Click me! to create create channel</button>
    </div>
  )
}

export default Demo;
