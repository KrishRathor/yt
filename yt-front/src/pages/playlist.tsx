import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/home/Sidebar";
import React from "react";

const Playlist: React.FC = () => {
  return (
    <div className="text-white bg-[#0F0F0F] h-[100vh] " >
      <Navbar />
      <div className="flex">
        <Sidebar />
      </div>
    </div>
  )
}

export default Playlist;
