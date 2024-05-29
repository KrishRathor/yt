import { PlatformPath } from "path";
import React from "react";

interface PlaylistSideCardProps {
  imageUrl: string | null,
  playlistName: string,
  channelName: string,
  totalVideos: number,
  totalViews: number,
  description: string
}

export const PlaylistSideCard: React.FC<PlaylistSideCardProps> = (props) => {

  const { imageUrl, playlistName, channelName, totalVideos, totalViews, description} = props;

  const gradients = [
    'linear-gradient(180deg, #1CB5E0 0%, #000851 100%)',
    'linear-gradient(180deg, #00C9FF 0%, #92FE9D 100%)',
    'linear-gradient(180deg, #3F2B96 0%, #A8C0FF 100%)',
    'linear-gradient(180deg, #9ebd13 0%, #008552 100%)',
    'linear-gradient(180deg, #4b6cb7 0%, #182848 100%)',
    'linear-gradient(180deg, #efd5ff 0%, #515ada 100%)',
    'linear-gradient(180deg, #fcff9e 0%, #c67700 100%)'
  ]

  const getRandomGradient = () => {
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  }

  return (
    <div style={{ background: getRandomGradient() }} className={`w-[20vw] h-[90vh] rounded-lg text-white`}>
      { imageUrl && <img src={imageUrl} alt="image-url" className="w-[250px] h-[200px] rounded-lg mx-auto mt-2" /> }
      <p className="text-center text-3xl font-bold" > {playlistName} </p>
      <p className="ml-4 mt-3" > {channelName} </p>
      <div className="flex ml-4" >
        <p>{totalVideos} videos</p>
        <p className="ml-4" >{totalViews} views</p>
      </div>
      <div> <button className="bg-white text-black py-1 px-10 hover:bg-[#FFFFFF] ml-24 mt-2 rounded-lg" >Play</button></div>
      <p className="mx-4 mt-4" >{description}</p>
    </div>
  )
}
