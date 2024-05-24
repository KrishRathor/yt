import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/home/Hero";
import { Sidebar } from "@/components/home/Sidebar";

export default function Home() {  

  return (
    <div className="bg-[#0F0F0F] text-white h-[100vh] w-[100vw] m-0 p-0" >
      <Navbar />
      <div className="flex" >
        <Sidebar />
        <Hero />
      </div>
    </div>
  );
}
