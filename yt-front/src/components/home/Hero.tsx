import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface TagItemProps {
  title: string,
  selected: boolean
}

interface VideoObjectFromBackend {
  id: number;
  title: string;
  description: string;
  uploadDate: Date; // You could use Date if you convert the string to a Date object
  duration: number;
  thumbnailUrl: string | null;
  videoUrl: string[];
  views: number;
  likes: number;
  dislikes: number;
  status: string;
  tags: string[];
  category: string;
  language: string;
  channelId: number;
  userId: number;
  channelName: string;
  profile: string | null;
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

  const [videosFromBackend, setVideosFromBackend] = useState<(VideoObjectFromBackend | undefined | null)[]>([]);
  const router = useRouter();

  const videosArray = api.video.getAllVideos.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        data.video && setVideosFromBackend(data.video);
      }
    }
  })
  
  useEffect(() => {
    videosArray.mutateAsync();
  },[]);

  return (
    <div className="flex flex-wrap w-full mx-auto overflow-y-auto h-[85vh]" >
      {
        videosFromBackend.map(video => {
          if (video && video.thumbnailUrl && video.profile ) {
            return (
              <div key={video.id} onClick={() => router.push(`/video?id=${video.id}`)} className="m-4" >
                <VideoCard 
                  title={video.title} 
                  views={video.views} 
                  thumbnailUrl={video.thumbnailUrl} 
                  channelName={video.channelName}
                  channelProfile={video.profile}
                />
              </div>
            )
          }
        })
      }
    </div>
  )
}

interface VideoCardProps {
  thumbnailUrl: string,
  title: string,
  channelName: string,
  views: number,
  channelProfile: string
}

const VideoCard: React.FC<VideoCardProps> = (props) => {

  const { thumbnailUrl, title, channelName, views, channelProfile } = props;

  return (
    <div className="m-5 cursor-pointer w-[20vw] h-[29vh]" >
      <img src={thumbnailUrl} alt="video-icon" className="rounded-md w-full h-[23vh]" />
      <div className="flex items-center justify-evenly " >
        <div className="mt-2" >
          <img
            className="ml-2 rounded-full"
            src={channelProfile}
            alt={`channel-icon`}
            width={35}
            height={30} />
        </div>
        <div className="ml-6 mt-4" >
          <p>{title}</p>
          <p className="text-sm text-gray-400" >{channelName}</p>
          <p className="text-sm text-gray-400" >{views} Views . 4 hours ago</p>
        </div>
      </div>
    </div>
  )
}

const TagItem: React.FC<TagItemProps> = (props) => {

  const { title, selected } = props;

  return (
    <div className={` py-1 px-3 rounded-md cursor-pointer ${selected && 'text-black'} h-[3.5vh] ml-4 ${!selected && 'hover:bg-[#3F3F3F]'} ${selected ? 'bg-white' : 'bg-[#272727]'}`} >
      <div className="text-center w-fit" >{title}</div>
    </div>
  )
}

export const Tags: React.FC = () => {

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
          <div key={key} className="w-fit" onClick={() => setSelectedTag(_prev => item)} >
            <TagItem title={item} selected={item === selectedTag ? true : false} />
          </div>
        ))
      }
    </div>
  )
}
