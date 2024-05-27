import React from "react";

export const ChannelHome: React.FC = () => {
  return (
    <div>
      <p className="text-xl m-4" >For you</p>
      <div className="flex w-[75vw] overflow-x-auto" >
        {
          Array(4).fill(1).map((_item, key) => (
            <div key={key} > <VideoCard /> </div>
          ))
        }
      </div>
      <p className="text-xl m-4" >For you</p>
      <div className="flex w-[75vw] overflow-x-auto" >
        {
          Array(4).fill(1).map((_item, key) => (
            <div key={key} > <VideoCard /> </div>
          ))
        }
      </div>
    </div>
  )
}

const VideoCard: React.FC = () => {
  return (
    <div className="m-5 cursor-pointer w-[20vw] h-[29vh]" >
      <img src="https://i.ytimg.com/vi/xfPAX0HUXoU/maxresdefault.jpg" alt="video-icon" className="rounded-md w-full h-[23vh]" />
      <div className="flex items-center justify-evenly " >
        <div className="mt-2" >
          <img
            className="ml-2 rounded-full"
            src={'https://yt3.ggpht.com/MeY_fGNrjVLV0PVOBN7dRWzMBS0y41YGm55LOaJ02cXV82a7Np9pYxxhHFqdYdncEy1I2cYR=s176-c-k-c0x00ffffff-no-rj-mo'}
            alt={`channel-icon`}
            width={35}
            height={30} />
        </div>
        <div className="ml-6 mt-4" >
          <p>Code with me!! Coding a system like replit in less then 4hr!</p>
          <p className="text-sm text-gray-400" >Harkirat Singh</p>
          <p className="text-sm text-gray-400" >42k Views . 4 hours ago</p>
        </div>
      </div>
    </div>
  )
}


