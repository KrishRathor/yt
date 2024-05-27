import { reportUnusedDisableDirectives } from ".eslintrc.cjs";
import { api } from "@/utils/api";
import { dataTagSymbol } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";


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

interface ChannelCoverProps {
  channel: Channel
}

export const ChannelCover: React.FC<ChannelCoverProps> = (props) => {

  const { id, coverPhotoUrl, channelId, channelName, profilePictureUrl, subscribersCount } = props.channel;

  const [isSubscribed, setIsSubscirbed] = useState<boolean | null>(null);
  const [checkingSubscribed, setCheckingSubscribed] = useState<boolean>(true);
  const [numberOfSubscriptions, setNumberOfSubscriptions] = useState<number>(subscribersCount);

  const checkSubscriptionStatus = api.subscriber.isSubscribed.useMutation({
    onSuccess: data => {
      console.log(data);
      setCheckingSubscribed(false);
      if (data.code === 200) setIsSubscirbed(data.subscribe);
    }
  })

  const subscribe = api.subscriber.subscribe.useMutation({
    onSuccess: data => {
      console.log(data);
      setIsSubscirbed(true);
      setNumberOfSubscriptions(prev => prev+1);
    }
  })

  const unsubscribe = api.subscriber.unsubscribe.useMutation({
    onSuccess: data => {
      console.log(data);
      setIsSubscirbed(false);
      setNumberOfSubscriptions(prev => prev-1);
    }
  })

  useEffect(() => {
    checkSubscriptionStatus.mutateAsync({
      channelId: id
    })
  }, [])

  const handleSubscribe = () => {
    if (isSubscribed) return;
    subscribe.mutateAsync({
      channelId: id
    })
  }

  const handleUnsubscribe = () => {
    if (!isSubscribed) return;
    unsubscribe.mutateAsync({
      channelId: id
    })
  }

  if (checkingSubscribed) {
    return <div>Loading...</div>
  }

  return (
    <div>

      <div>
        {coverPhotoUrl && <img src={coverPhotoUrl} alt="channel cover"
          className="h-[25vh] w-[100%] rounded-lg" />}
      </div>

      <div className="flex" >
        {profilePictureUrl && <img
          src={profilePictureUrl}
          className="rounded-full w-[10vw] h-[19vh] mt-8"
        />}
        <div className="mt-12 ml-4" >
          <p className="text-4xl" >{channelName}</p>
          <p className="text-[#AAAAAA] mt-3 ">{channelId} . {numberOfSubscriptions} Subscribers . 0 videos</p>

          <div className="mt-4 ml-4" >
            {!isSubscribed && <button className="bg-white text-black rounded-md px-4 py-1 hover:bg-[#D9D9D9]" onClick={handleSubscribe} >Subscribe</button>}
            {isSubscribed && <button className="bg-black text-white rounded-md px-4 py-1 hover:bg-[#3F3F3F]" onClick={handleUnsubscribe} >Subscribed</button>}
          </div>
        </div>
      </div>

    </div>

  )
}
