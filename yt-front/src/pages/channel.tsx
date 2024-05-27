import { Navbar } from "@/components/Navbar";
import { ChannelCover } from "@/components/channel/ChannelCover";
import { Sidebar } from "@/components/home/Sidebar";
import React, { useState } from "react";
import { ChannelVideo } from "@/components/channel/ChannelVideo";
import { ChannelHome } from "@/components/channel/ChannelHome";
import { ChannelPlaylists } from "@/components/channel/ChannelPlaylists";
import { ChannelCommunity } from "@/components/channel/ChannelCommunity";
import { GetServerSidePropsContext } from "next";
import { recordTraceEvents } from "next/dist/trace";

const Tabs = {
  Home: 'Home',
  Videos: 'Videos',
  Playlists: 'Playlists',
  Community: 'Community'
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { channel } = context.query; 

  return {
    props: {
      channel
    }
  }
}

interface reqParam {
  channel: string
}

const Channel: React.FC<reqParam> = (props) => {

  const { channel } = props;
  const [selectedTab, setSelectedTab] = useState<string>(Tabs.Home);
  console.log(channel);
  return (
    <div className="bg-[#0F0F0F] overflow-y-auto text-white h-[100vh] w-[100vw] m-0 p-0" >
      <Navbar />
      <div className="flex" >
        <div className="w-[22vw]" ><Sidebar /></div>
        <div>
          <ChannelCover />
          <div className="mt-4" >
            <div className="flex items-center" >
              <p onClick={() => setSelectedTab(_prev => Tabs.Home)} className={` ${selectedTab === Tabs.Home ? 'text-white' : 'text-[#AAAAAA]' } text-xl ml-4 cursor-pointer`} >Home</p>
              <p onClick={() => setSelectedTab(_prev => Tabs.Videos)} className={` ${selectedTab === Tabs.Videos ? 'text-white' : 'text-[#AAAAAA]'} text-xl ml-4 cursor-pointer `} >Videos</p>
              <p onClick={() => setSelectedTab(_prev => Tabs.Playlists)} className={`text-xl ml-4 cursor-pointer ${selectedTab === Tabs.Playlists ? 'text-white' : 'text-[#AAAAAA]' } `} >Playlists</p>
              <p onClick={() => setSelectedTab(_prev => Tabs.Community)} className={`text-xl ml-4 cursor-pointer ${selectedTab === Tabs.Community ? 'text-white' : 'text-[#AAAAAA]'} `} >Community</p>
            </div>
            <hr className="border border-[#AAAAAA] mt-2 " />
          </div>
          <div>

            {
              selectedTab === Tabs.Home ? <ChannelHome />
              : selectedTab === Tabs.Videos ? <ChannelVideo />
              : selectedTab === Tabs.Playlists ? <ChannelPlaylists />
              : selectedTab === Tabs.Community ? <ChannelCommunity /> : ''
            }

          </div>
        </div>
      </div>
    </div>
  )
}

export default Channel;
