import { reportUnusedDisableDirectives } from ".eslintrc.cjs";
import React, { useState } from "react";

interface TagItemProps {
  title: string,
  selected: boolean
}

export const Hero: React.FC = () => {
  return (
    <div className="w-full ">
      <div className="mt-2" >
        <Tags />
      </div>
      <div className="mt-2" >
        <Videos />
      </div>
    </div>
  )
}

const Videos: React.FC = () => {

  const dummyVideos: number[] = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

  return (
    <div className="flex flex-wrap w-full mx-auto overflow-y-auto h-[85vh]" >
      {
        dummyVideos.map((video, key) => (
          <div key={key} className="mx-2 my-3 " >
            <VideoCard />
          </div>
        ))
      }
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

const TagItem: React.FC<TagItemProps> = (props) => {

  const { title, selected } = props;

  return (
    <div className={` py-1 px-3 rounded-md cursor-pointer ${selected && 'text-black'} ml-4  hover:bg-[#3F3F3F] ${selected ? 'bg-white' : 'bg-[#272727]'}`} >
      <span className="text-center" >{title}</span>
    </div>
  )
}

const Tags: React.FC = () => {

  const [selectedTag, setSelectedTag] = useState<string>('All');

  const items: string[] = [
    'All',
    'Computer Programming',
    'Live',
    'Computer Hardware',
    'Manga',
    'Chess',
    'Stadiums',
    'Seminars'
  ]

  return (
    <div className="w-full flex justify-start overflow-x-auto mt-2 " >
      {
        items.map((item, key) => (
          <div key={key} onClick={() => setSelectedTag(_prev => item)} >
            <TagItem title={item} selected={item === selectedTag ? true : false} />
          </div>
        ))
      }
    </div>
  )
}
