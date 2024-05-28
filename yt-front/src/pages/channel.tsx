import { Navbar } from "@/components/Navbar";
import { ChannelCover } from "@/components/channel/ChannelCover";
import { Sidebar } from "@/components/home/Sidebar";
import React, { useEffect, useState } from "react";
import { ChannelVideo } from "@/components/channel/ChannelVideo";
import { ChannelHome } from "@/components/channel/ChannelHome";
import { ChannelPlaylists } from "@/components/channel/ChannelPlaylists";
import { ChannelCommunity } from "@/components/channel/ChannelCommunity";
import { GetServerSidePropsContext } from "next";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { CardHeaderProps } from "@mui/material";

const Tabs = {
  Home: 'Home',
  Videos: 'Videos',
  Playlists: 'Playlists',
  Community: 'Community'
}

export async function GetServerSideProps(context: GetServerSidePropsContext) {
  const { channel } = context.query;

  return {
    props: {
      channelIdProp: channel
    }
  }
}

interface Channel {
  id: number;
  userId: number;
  channelName: string;
  channelId: string;
  description: string;
  creationDate: Date; // Alternatively, you can use Date if you plan to parse it into a Date object
  profilePictureUrl: string | null;
  coverPhotoUrl: string | null;
  subscribersCount: number;
  totalViews: number;
}

interface ChannelProps {
  channelIdProp: string
}

const Channel: React.FC<ChannelProps> = (props) => {

  const { channelIdProp } = props;
  const [selectedTab, setSelectedTab] = useState<string>(Tabs.Home);
  const [loading, setLoading] = useState<boolean>(true);
  const [channelFound, setChannelFound] = useState<boolean>(true);
  const [channelFromBackend, setChannelFromBackend] = useState<Channel | null>(null);
  const router = useRouter();
  
  const channel = router.query.channel;

  useEffect(() => {
     typeof channel === "string" && getChannel.mutateAsync({
      channelId: channel
    })
    setSelectedTab(Tabs.Home);
  }, [channel]);

  const getChannel = api.channel.getChannel.useMutation({
    onSuccess: data => {
      console.log(data);
      setLoading(false);
      if (data?.code === 404) {
        setChannelFound(false);
      } else if (data?.code === 200) {
        setChannelFromBackend(data.channel);
      }
    }
  })

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    const chan = async () => {
      typeof channelIdProp === "string" && getChannel.mutateAsync({
        channelId: channelIdProp
      })
    }
    channelIdProp && chan();
  }, []);

  return (
    <div className="bg-[#0F0F0F] overflow-y-auto text-white h-[100vh] w-[100vw] m-0 p-0" >
      <Navbar />
      <div className="flex" >
        <div className="w-[22vw]" ><Sidebar /></div>

        {!loading && channelFound && channelFromBackend && <div>
          <ChannelCover channel={channelFromBackend} />
          <div className="mt-4" >
            <div className="flex items-center" >
              <p onClick={() => setSelectedTab(_prev => Tabs.Home)} className={` ${selectedTab === Tabs.Home ? 'text-white' : 'text-[#AAAAAA]'} text-xl ml-4 cursor-pointer`} >Home</p>
              <p onClick={() => setSelectedTab(_prev => Tabs.Videos)} className={` ${selectedTab === Tabs.Videos ? 'text-white' : 'text-[#AAAAAA]'} text-xl ml-4 cursor-pointer `} >Videos</p>
              <p onClick={() => setSelectedTab(_prev => Tabs.Playlists)} className={`text-xl ml-4 cursor-pointer ${selectedTab === Tabs.Playlists ? 'text-white' : 'text-[#AAAAAA]'} `} >Playlists</p>
              <p onClick={() => setSelectedTab(_prev => Tabs.Community)} className={`text-xl ml-4 cursor-pointer ${selectedTab === Tabs.Community ? 'text-white' : 'text-[#AAAAAA]'} `} >Community</p>
            </div>
            <hr className="border border-[#AAAAAA] mt-2 " />
          </div>
          <div>

            {
              selectedTab === Tabs.Home ? <ChannelHome />
                : selectedTab === Tabs.Videos ? <ChannelVideo channelId={channelFromBackend.channelId} channelName={channelFromBackend.channelName} />
                  : selectedTab === Tabs.Playlists ? <ChannelPlaylists />
                    : selectedTab === Tabs.Community ? <ChannelCommunity /> : ''
            }

          </div>
        </div>}
      </div>
    </div>
  )
}

export default Channel;
