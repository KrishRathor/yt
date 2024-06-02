import React, { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

interface CardProps {
  title: string,
  imageUrl: string,
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

export const Sidebar: React.FC = () => {

  const SidebarItems: CardProps[] = [
    { title: 'Your Channel', imageUrl: '/channel.png' },
  ]

  const Settings: CardProps[] = [
  ]

  const router = useRouter();
  const [subscribedChannels, setSubscribedChannels] = useState<(Channel | null)[]>([]);

  const getSubscribedChannels = api.subscriber.getAllSubscribedChannels.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        data.channels && setSubscribedChannels(data.channels);
      }
    }
  })

  useEffect(() => {
    getSubscribedChannels.mutateAsync();
  }, []);

  return (
    <div className="overflow-y-auto w-[20vw] h-[90vh] ml-2 " >
      <div onClick={() => router.push('/')} ><Card title="Home" imageUrl="/home.png" /></div>
      <hr className="border border-[#272727] mt-4" />
      <span className="text-2xl ml-2 mt-8 " >You</span>
      {
        SidebarItems.map((sidebar, key) => (
          <div key={key} onClick={() => {
            if (sidebar.title === "Your Channel") {
              router.push('/mychannels');
            }
          }}
            className="mt-2" >
            <Card title={sidebar.title} imageUrl={sidebar.imageUrl} />
          </div>
        ))
      }
      <hr className="border border-[#272727] mt-4" />
      <span className="text-2xl ml-2 py-2">Subscriptions</span>
      <div className="overflow-y-auto h-fit max-h-[45vh] " >
        {
          subscribedChannels.map((chnl) => {
            if (chnl) {
              return (
                <div key={chnl.id} onClick={() => {
                  router.push(`/channel?channel=${chnl.channelId}`)
                }} >
                  <ChannelCard imageUrl={chnl.profilePictureUrl ?? 'https://github.com/shadcn.png'} title={chnl.channelName} />
                </div>
              )
            }
          })
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
