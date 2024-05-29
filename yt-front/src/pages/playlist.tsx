import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/home/Sidebar";
import { PlaylistSideCard } from "@/components/playlist/PlaylistSideCard";
import { GetServerSidePropsContext } from "next";
import { init } from "next/dist/compiled/webpack/webpack";
import React, { useState } from "react";

export async function getServerSideProps (context: GetServerSidePropsContext) {
  
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

const Playlist: React.FC<PlaylistProps> = (props) => {

  const { initialId } = props;
  const [playlistId, setPlaylistId] = useState<string>(initialId);
  console.log(initialId);

  return (
    <div className="text-white bg-[#0F0F0F] h-[100vh] " >
      <Navbar />
      <div className="flex">
        <Sidebar />
        <PlaylistSideCard imageUrl={'https://i.ytimg.com/vi/ypw5ZZ7BZDI/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC_RJ0rsDhmAfjY03mh3c-73kaUBQ'} totalViews={1232} totalVideos={21} channelName="Harkirat Singh" playlistName="Be a 100xDev" description="Elevate your skills and mindset to become 100xDev" />
      </div>
    </div>
  )
}

export default Playlist;
