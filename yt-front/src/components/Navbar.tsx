import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar"
import { useRouter } from "next/router";
import ProgressBar from "./progressbar/ProgressBar";
import useProgressBar from "./progressbar/useProgressBar";

export const Navbar: React.FC = () => {

  const router = useRouter();
  const { progress, startProgress, updateProgress } = useProgressBar();


  return (
    <div>
      <ProgressBar progress={progress} />
      <div className="flex justify-between" >

        <div className="flex items-center cursor-pointer p-4" >
          <Image src={'/youtube.png'} alt="youtube-logo" width={50} height={50} />
          <span className="ml-1 text-2xl" onClick={() => {
            console.log('clicked');
            startProgress();
            updateProgress(70);
            router.push('/');
            setTimeout(() => {
              updateProgress(100);
            }, 500);
          }} >Youtube</span>
        </div>

        <div>

        </div>

        <div className="flex p-4 justify-between w-[12vw] items-center " >
          <div className="p-2 hover:bg-[#272727] rounded-full" > <Image className="cursor-pointer " src={'/image.png'} alt="create-icon" width={30} height={20} /> </div>
          <div className="p-2 hover:bg-[#272727] rounded-full"  > <Image className="cursor-pointer" src={'/image2.png'} alt="create-icon" width={30} height={10} /> </div>
          <div className="cursor-pointer" >
            <Avatar />
          </div>

        </div>
      </div>
    </div>
  )
}
