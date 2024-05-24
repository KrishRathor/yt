import React from "react";
import Image from "next/image";

interface CardProps {
  title: string,
  imageUrl: string,
}

export const Sidebar: React.FC = () => {

  const SidebarItems: CardProps[] = [
    { title: 'Your Channel', imageUrl: '/channel.png' },
    { title: 'History', imageUrl: '/history.png' },
    { title: 'Playlists', imageUrl: '/playlist.png' }
  ] 

  const Subscriptions: CardProps[] = [
    { title: 'Harkirat Singh', imageUrl: 'https://github.com/shadcn.png' },
    { title: 'ThePrimeTime', imageUrl: 'https://github.com/shadcn.png' },
    { title: 'Vikas Divyakirti', imageUrl: 'https://github.com/shadcn.png' },
    { title: 'Backend Banter', imageUrl: 'https://github.com/shadcn.png' },
    { title: 'ForrestKnight', imageUrl: 'https://github.com/shadcn.png' },
    { title: 'Fireship', imageUrl: 'https://github.com/shadcn.png' }
  ]

  const Settings: CardProps[] = [
    { title: 'Settings', imageUrl: '/settings.png' },
    { title: 'Send Feedback', imageUrl: '/feedback.png' }
  ]

  return (
    <div className="overflow-y-auto w-[20vw] h-[90vh] ml-2 " >
      <Card title="Home" imageUrl="/home.png" />
      <hr className="border border-[#272727] mt-4" />
      <span className="text-2xl ml-2 mt-8 " >You</span>
      {
        SidebarItems.map((sidebar, key) => (
          <div key={key} className="mt-2" >
            <Card title={sidebar.title} imageUrl={sidebar.imageUrl} />
          </div>
        ))
      }
      <hr className="border border-[#272727] mt-4" />
      <span className="text-2xl ml-2 py-2">Subscriptions</span>
      <div className="overflow-y-auto h-fit max-h-[45vh] " >
        {
          Subscriptions.map((chnl, key) => (
            <div key={key} >
            <ChannelCard title={chnl.title} imageUrl={chnl.imageUrl} /> 
            </div>
          ))
        }
      </div>
      <hr className="border border-[#272727] mt-4" />
      {
        Settings.map((set, key) => (
          <div key={key} >
            <Card title={set.title} imageUrl={set.imageUrl} />
          </div>
        ))
      }
      <hr className="border border-[#272727] mt-4" />
    </div>
  )
}

const Card: React.FC<CardProps> = (props) => {
  
  const { title, imageUrl } = props;
  
  return (
    <div className="flex mt-2 hover:bg-[#272727] h-[4vh] cursor-pointer py-1 rounded-md" >
      <Image className="ml-4 rounded-full" src={imageUrl} alt={`${title}-icon`} width={20} height={15} /> 
      <span className=" ml-4" >{title}</span>
    </div>
  )
}

const ChannelCard: React.FC<CardProps> = (props) => {
  
  const { title, imageUrl } = props;
  
  return (
    <div className="flex mt-2 hover:bg-[#272727] h-[4vh] cursor-pointer py-1 rounded-md" >
      <img className="ml-4 rounded-full" src={imageUrl} alt={`${title}-icon`} width={20} height={15} /> 
      <span className="ml-4" >{title}</span>
    </div>
  )
}
