import React, { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/utils/api";

interface VideoDescProps {
  title: string,
  channelId: number,
  like: number,
}

export const VideoDesc: React.FC<VideoDescProps> = (props) => {

  const { title, like, channelId } = props;
  const [channelName, setChannelName] = useState<string>('');
  const [channelProfile, setChannelProfile] = useState<string>('');
  const [subscribers, setSubscribers] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null); 

  console.log('i rendered', title, like, channelId);

  const getChannel = api.channel.getChannelById.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200 && data.channel) {
        data.channel.profilePictureUrl && setChannelProfile(data.channel?.profilePictureUrl);
        setChannelName(data.channel?.channelName);
        setSubscribers(data.channel.subscribersCount);
      }
    }
  })

  const isSubscribeMutation = api.subscriber.isSubscribed.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        setIsSubscribed(data.subscribe);
      }
    }
  })

  const subscribe = api.subscriber.subscribe.useMutation({
    onSuccess: data => {
      console.log(data);
      setIsSubscribed(true);
      setSubscribers(prev => prev + 1);
    }
  })

  const unsubscribe = api.subscriber.unsubscribe.useMutation({
    onSuccess: data => {
      console.log(data);
      setIsSubscribed(false);
      setSubscribers(prev => prev - 1);
    }
  })

  const handleSubscribe = () => {
    if (isSubscribed) return;
    subscribe.mutateAsync({
      channelId
    })
  }

  const handleUnsubscribe = () => {
    if (!isSubscribed) return;
    unsubscribe.mutateAsync({
      channelId
    })
  }

  useEffect(() => {
    isSubscribeMutation.mutateAsync({ channelId: channelId });
  }, []);

  useEffect(() => {
    getChannel.mutateAsync({ id: channelId });
  }, [channelId])

  return (
    <div className="ml-16" >
      <p className="text-xl" >{title}</p>
      <div className="flex" >

        <div className="mt-2" >
          <img
            className="ml-2 rounded-full"
            src={channelProfile}
            alt={`channel-icon`}
            width={40}
            height={35}
          />
        </div>

        <div className="ml-4 mt-2" >
          <p>{channelName}</p>
          <span className="text-sm text-gray-400" >{subscribers} Subscribers</span>
        </div>

        <div className="mt-4 ml-4" >
          {!isSubscribed && <button className="bg-white text-black rounded-md px-4 py-1 hover:bg-[#D9D9D9]" onClick={handleSubscribe} >Subscribe</button>}
          {isSubscribed && <button className="bg-black text-white rounded-md px-4 py-1 hover:bg-[#272727]" onClick={handleUnsubscribe} >Subscribed</button>}
        </div>

        <div className="flex items-center rounded-xl ml-[20vw] bg-[#272727] cursor-pointer px-4 py-2 mt-3 h-[5vh] ">
          <div className="w-8 h-6" ><Image src="/like.png" alt="like-video" width={30} height={30} /> </div>
          <span className="ml-2" >{like}</span>
          <div className="w-8 h-6 ml-4" ><Image src="/dislike.png" alt="like-video" width={30} height={30} /> </div>
        </div>


        <div className="flex items-center rounded-xl ml-8 bg-[#272727] cursor-pointer px-4 py-2 h-[5vh] mt-3">
          <div className="w-8 h-6" ><Image src="/share.png" alt="like-video" width={30} height={30} /> </div>
          <span className="ml-2" >Share</span>
        </div>


        <div className="flex items-center rounded-xl ml-8 bg-[#272727] cursor-pointer py-2 px-4 h-[5vh] mt-3">
          <div className="w-8 h-6" ><Image src="/download.png" alt="like-video" width={30} height={30} /> </div>
          <span className="ml-2" >Download</span>
        </div>

      </div>
    </div>
  )
}
