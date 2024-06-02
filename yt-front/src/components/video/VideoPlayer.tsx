import React, { useEffect, useRef } from "react";
import 'video.js/dist/video-js.css';
import VideoJS from "./VideoPlayerComponent";

interface VideoPlayerProps {
  url: string[]
}

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {

  const { url } = props;
  console.log('url', url);

  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: url ? url[0] : '',
      type: 'application/x-mpegURL'
    }]
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
    });

    player.on('dispose', () => {
    });
  };

  return (
    <div className="h-full w-full ml-16 max-w-[1100px] rounded-md " >
      {  //<video controls src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" ></video> 

      }
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  )
}

export default VideoPlayer;


