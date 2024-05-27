import { Navbar } from "@/components/Navbar";
import { Tags } from "@/components/home/Hero";
import { SideVideo } from "@/components/video/SideVideo";
import React from "react";
import dynamic from "next/dynamic";
import { VideoDesc } from "@/components/video/VideoDesc";
import { Comments } from "@/components/video/Comments";

const ClientVideoPlayer = dynamic(() => import("@/components/video/VideoPlayer"), {
  ssr: false
})

const Video: React.FC = () => {
  return (
    <div className="bg-[#0F0F0F] m-0 p-0 h-[100vh] text-white " >
      <Navbar />

      <div className="flex overflow-y-auto h-[90vh]" >
          <div>
            <div className="w-[72vw] h-[72vh]" > <ClientVideoPlayer /> </div>
            <div className="w-[72vw] h-[25vh]" >
              <VideoDesc />
               <div className="mt-16 w-[66vw] mx-auto" > <Comments /> </div>
            </div>
          </div>
          <div className="max-w-[28vw]" >
            <div className="overflow-x-auto" > <Tags /> </div>
            <div> <SideVideo /> </div>
          </div>
      </div>

    </div>
  )
}

export default Video;
