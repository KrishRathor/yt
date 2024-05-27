import React from "react";

const VideoPlayer: React.FC = () => {
  return (
    <div className="h-full w-full ml-16 max-w-[1100px] rounded-md " >
      <video controls src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" ></video>
    </div>
  )
}

export default VideoPlayer; 
