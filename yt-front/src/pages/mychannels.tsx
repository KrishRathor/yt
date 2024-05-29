import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/home/Sidebar";
import { api } from "@/utils/api";
import { dataTagSymbol } from "@tanstack/react-query";
import { channel } from "diagnostics_channel";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface ChannelInterface {
    id: number;
    userId: number;
    channelName: string;
    channelId: string;
    description: string;
    creationDate: Date; // You might want to use Date type in a real scenario
    profilePictureUrl: string | null;
    coverPhotoUrl: string | null;
    subscribersCount: number;
    totalViews: number;
}

const MyChannels: React.FC = () => {

  const [channels, setChannels] = useState<ChannelInterface[]>([]);

  const getAllChannelsMutation = api.channel.getAllChannelsOfUser.useMutation({
    onSuccess: data => {
      console.log('i this', data);
      if (data.code === 200) {
        data.channel && setChannels(_prev => data.channel);
      }
    }
  })

  useEffect(() => {
    getAllChannelsMutation.mutateAsync();
  }, []);

  return (
    <div className="bg-[#0F0F0F] h-[100vh] text-white" >
      <Navbar />
      <div className="flex" >
        <Sidebar />
        <div className="flex flex-wrap justify-evenly ml-4" >
          {
            channels.map(chnl => (
              <div key={chnl.id} >
                <ChannelCard channelId={chnl.channelId} title={chnl.channelName} imageUrl={chnl.profilePictureUrl} />
              </div>
            )) 
          }
        </div>
      </div>
    </div>
  )
}

interface ChannelCardProps {
  imageUrl: string | null,
  title: string,
  channelId: string 
}

const ChannelCard: React.FC<ChannelCardProps> = ({imageUrl, title, channelId}) => {

  const router = useRouter();

  return (
    <div onClick={() => router.push(`/channel?channel=${channelId}`)} className="ml-8 cursor-pointer"  > 
      { imageUrl && <img 
        src={imageUrl}
        alt="channel logo"
        className="w-[160px] h-[160px] rounded-full"
      />}
      <p className="text-2xl mt-2 ml-6" >{title}</p>
    </div>
  )
};

export default MyChannels;
