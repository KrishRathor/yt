import { api } from "@/utils/api";
import { useEffect, useState } from "react";

interface SideVideoCardProps {
  title: string,
  thumbnailUrl: string | null,
  channelId: number,
  views: number
}

export const SideVideoCard: React.FC<SideVideoCardProps> = (props) => {

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
