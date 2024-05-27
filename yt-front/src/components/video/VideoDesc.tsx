import React from "react";
import Image from "next/image";

export const VideoDesc: React.FC = () => {
  return (
    <div className="ml-16" >
      <p className="text-xl" >Why I dont care about CSS | tailwind, shadcn, shoelace, radix, react aria</p>
      <div className="flex" >

        <div className="mt-2" >
          <img
            className="ml-2 rounded-full"
            src={'https://yt3.ggpht.com/1FEdfq3XpKE9UrkT4eOc5wLF2Bz-42sskTi0RkK4nPh4WqCbVmmrDZ5SVEV3WyvPdkfR8sw2=s48-c-k-c0x00ffffff-no-rj'}
            alt={`channel-icon`}
            width={40}
            height={35}
          />
        </div>

        <div className="ml-4 mt-2" >
          <p>Chai And Code</p>
          <span className="text-sm text-gray-400" >293k Subscribers</span>
        </div>

        <div className="mt-4 ml-4" >
          <button className="bg-white text-black rounded-md px-4 py-1 hover:bg-[#D9D9D9]" >Subscribe</button>
        </div>

        <div className="flex items-center rounded-xl ml-[20vw] bg-[#272727] cursor-pointer px-4 py-2 mt-3 h-[5vh] ">
          <div className="w-8 h-6" ><Image src="/like.png" alt="like-video" width={30} height={30} /> </div>
          <span className="ml-2" >4.3K</span>
          <div className="w-8 h-6 ml-4" ><Image src="/dislike.png" alt="like-video" width={30} height={30} /> </div>
        </div>


        <div className="flex items-center rounded-xl ml-8 bg-[#272727] cursor-pointer px-4 py-2 h-[5vh] mt-3">
          <div className="w-8 h-6" ><Image src="/share.png" alt="like-video" width={30} height={30} /> </div>
          <span className="ml-2" >Share</span>
        </div>


        <div className="flex items-center rounded-xl ml-8 bg-[#272727] cursor-pointer py-2 px-4 h-[5vh] mt-3">
          <div className="w-8 h-6" ><Image src="/download.png" alt="like-video" width={30} height={30} /> </div>
          <span className="ml-2" >Download</span>
        </div>

      </div>
    </div>
  )
}
