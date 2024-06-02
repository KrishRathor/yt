import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/home/Sidebar";
import { PlaylistSideCard } from "@/components/playlist/PlaylistSideCard";
import { PlaylistVideoCard } from "@/components/playlist/VideoCard";
import { api } from "@/utils/api";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const id = context.query.id;

  return {
    props: {
      initialId: id
    }
  }
}

interface PlaylistProps {
  initialId: string
}

interface PlaylistInterface {
    id: number;
    userId: number;
    channelId: number;
    title: string;
    description: string | null;
    creationDate: Date; // Or you could use Date if you plan to work with Date objects
    privacyStatus: string;
}

interface VideoInterface {
  id: number;
  title: string;
  description: string;
  uploadDate: Date; // ISO date string
  duration: number; // in minutes
  thumbnailUrl: string | null;
  videoUrl: string[];
  views: number;
  likes: number;
  dislikes: number;
  status: string,
  tags: string[];
  category: string;
  language: string;
  channelId: number;
  userId: number;
}

const Playlist: React.FC<PlaylistProps> = (props) => {

  const { initialId } = props;
  const [playlistId, setPlaylistId] = useState<string>(initialId);
  const [playlist, setPlaylist] = useState<PlaylistInterface | undefined | null>(null);
  const [videos, setVideos] = useState<(VideoInterface | undefined)[]>([]);
  const router = useRouter();
  const { id } = router.query;

  const getPlaylist = api.playlist.getAllVideosOfPlaylist.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        data.videos && data.videos.videos && setVideos(data.videos.videos);
        data.videos && data.videos.playlist && setPlaylist(data.videos.playlist);
      }
    }
  })

  useEffect(() => {
    typeof id === "string" && setPlaylistId(id);
  }, [id])

  useEffect(() => {
     getPlaylist.mutateAsync({
      playlistId: parseInt(playlistId)
    })
  }, [playlistId])

  return (
    <div className="text-white bg-[#0F0F0F] h-[100vh] " >
      <Navbar />
      <div className="flex">
        <Sidebar />
        <PlaylistSideCard 
          imageUrl={'https://i.ytimg.com/vi/ypw5ZZ7BZDI/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC_RJ0rsDhmAfjY03mh3c-73kaUBQ'} 
          totalViews={1232} 
          totalVideos={21} 
          channelName="Harkirat Singh" 
          playlistName="Be a 100xDev" 
          description="Elevate your skills and mindset to become 100xDev"
        />
        <div>
          {
            videos.map((video, index) => {
              if (video) {
                return (
                  <div key={video.id} className="mt-3 flex">
                    <p className="my-auto ml-2 text-[#AAAAAA] text-sm" > {index} </p>
                    <PlaylistVideoCard
                      title={video.title}
                      thumbnailUrl={video.thumbnailUrl}
                      channelId={video.channelId}
                      views={video.views}
                    />
                  </div>
                )
              }
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Playlist;
