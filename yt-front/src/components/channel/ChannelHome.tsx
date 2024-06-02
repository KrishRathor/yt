import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface ChannelVideoProps {
  channelId: string,
  channelName: string
}

interface Video {
  id: number;
  title: string;
  description: string;
  uploadDate: Date; // or Date if you want to convert it to Date object
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
}

export const ChannelHome: React.FC<ChannelVideoProps> = (props) => {


  const { channelId, channelName } = props;
  const [videos, setVideos] = useState<Video[]>([]);

  const getVideos = api.video.getVideoByChannel.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        data.video && setVideos(data.video);
      }
    }
  })
const router = useRouter();
  const id = router.query.channel;

  const [channel, setChannel] = useState<string>(channelId);


  useEffect(() => {
    typeof id === "string" && setChannel(id);
  }, [id])

  useEffect(() => {
    getVideos.mutateAsync({
      channelId: channel 
    })
  }, [channel])

  
  return (
    <div>
      <p className="text-xl m-4" >For you</p>
      <div className="flex w-[75vw] overflow-x-auto" >
        {
          videos.map(video => {
            if (video.thumbnailUrl) return (
              <div key={video.id} onClick={() => router.push(`/video?id=${video.id}`)} >
                <VideoCard channelName={channelName} thumbnailUrl={video.thumbnailUrl} title={video.title} views={video.views} />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

interface VideoCardProps {
  thumbnailUrl: string,
  title: string,
  channelName: string,
  views: number
}

const VideoCard: React.FC<VideoCardProps> = (props) => {

  const { thumbnailUrl, title, channelName, views } = props;

  return (
    <div className="m-5 cursor-pointer w-[20vw] h-[29vh]" >
      <img src={thumbnailUrl} alt="video-icon" className="rounded-md w-full h-[23vh]" />
      <div className="flex items-center justify-evenly " >
        <div className="mt-2" >
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
