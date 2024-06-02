import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface ChannelPlaylistsProps {
  channelId: number
}

interface PlaylistProps {
  id: number;
  userId: number;
  channelId: number;
  title: string;
  description: string | null;
  creationDate: Date,
  privacyStatus: string
}

interface PlaylistWithImage {
  playlist: PlaylistProps,
  image: string | null
}

export const ChannelPlaylists: React.FC<ChannelPlaylistsProps> = (props) => {

  const { channelId } = props;

  const [playlists, setPlaylists] = useState<(PlaylistWithImage | undefined)[]>([]);
  const router = useRouter();
  const getPlaylists = api.playlist.getAllPlaylistsOfChannel.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        data.playlist && setPlaylists(data.playlist);
      }
    }
  })

  useEffect(() => {
    getPlaylists.mutateAsync({
      channelId
    })
  }, [])

  return (
    <div> 
      {
        playlists.length == 0 ? <div> this channel has no playlists </div> :
          playlists.map(item => {
            return (
              <div key={item?.playlist.id} onClick={() => router.push(`playlist?id=${item?.playlist.id}`)} >
                <VideoCard views={0} thumbnailUrl={item?.image} title={item?.playlist.title} channelName={item?.playlist.channelId} />
              </div>
            )
          })
      }
    </div>
  )
}



interface VideoCardProps {
  thumbnailUrl: string | undefined | null,
  title: string | undefined | null,
  channelName: number | null | undefined,
  views: number
}

const VideoCard: React.FC<VideoCardProps> = (props) => {

  const { thumbnailUrl, title, channelName, views } = props;

  return (
    <div className="m-5 cursor-pointer w-[20vw] h-[29vh]" >
      { thumbnailUrl && <img src={thumbnailUrl} alt="video-icon" className="rounded-md w-full h-[23vh]" /> }
      <div className="flex items-center justify-start " >
        <div className=" mt-4" >
          <p>{title}</p>
          <p className="text-sm text-gray-400" >{views} Views . 4 hours ago</p>
        </div>
      </div>
    </div>
  )
}

