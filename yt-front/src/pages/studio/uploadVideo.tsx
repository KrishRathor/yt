import { DragAndDrop } from "@/components/DragAndDrop";
import React from "react";

const UploadVideo: React.FC = () => {

  return (
    <div className="bg-[#0F0F0F] m-0 py-2 h-[100vh] text-white" >
      <p className="text-center text-3xl" >Upload Your videos</p>
      <DragAndDrop />
    </div>
  )
};

export default UploadVideo;
