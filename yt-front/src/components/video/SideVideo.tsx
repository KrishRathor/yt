import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { number } from "zod";

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
  userId: number
}

export const SideVideo: React.FC = () => {

  const [videos, setVideos] = useState<(VideoObjectFromBackend | undefined)[]>([]);
  const router = useRouter();

  const getAllVideos = api.video.getAllVideos.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        data.video && setVideos(data.video);
      }
    }
  })

  useEffect(() => {
    getAllVideos.mutateAsync();
  }, [])

  return (
    <div className="mt-6" >
      {
        videos.map(video => {
          if (video) {
            return (
              <div className="mt-3 cursor-pointer" onClick={() => router.push(`/video?id=${video.id}`)} key={video.id}>
                <SideVideoCard title={video.title} thumbnailUrl={video.thumbnailUrl} channelId={video.channelId} views={video.views} />
              </div>
            )
          }
        })
      }
    </div>
  )
}

interface SideVideoCardProps {
  title: string,
  thumbnailUrl: string | null,
  channelId: number,
  views: number
}

const SideVideoCard: React.FC<SideVideoCardProps> = (props) => {

  const { title, thumbnailUrl, channelId, views } = props;
  const [channelName, setChannelName] = useState<string>('');

  const getChannel = api.channel.getChannelById.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        data.channel && setChannelName(data.channel?.channelName);
      }
    }
  })

  useEffect(() => {
    getChannel.mutateAsync({
      id: channelId
    })
  }, [])

  return (
    <div className="flex items-center ml-2 " >
      <div className="rounded-md min-w-[160px] max-w-[160px] max-h-[100px] overflow-hidden">
        {thumbnailUrl && (
          <img
            className="rounded-md w-full h-full object-cover max-w-full max-h-full"
            src={thumbnailUrl}
            alt="video-thumbnail"
          />
        )}
      </div>
      <div>
        <div className="ml-2 mb-2" >
          <p>{title}</p>
          <p className="text-sm text-gray-400" >{channelName}</p>
          <p className="text-sm text-gray-400" >{views} Views . 4 hours ago</p>
        </div>
      </div>
    </div>
  )
}
