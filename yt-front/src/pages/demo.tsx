import { api } from "@/utils/api";
import { applyReferentialEqualityAnnotations } from "node_modules/superjson/dist/plainer";
import React from "react";

const Demo: React.FC = () => {

  const createChannel = api.channel.createChannel.useMutation({
    onSuccess: data => console.log(data)
  }) 

  const handleClick = async () => {
    console.log('clicked!');
    createChannel.mutateAsync({
      description: 'this is a channel',
      channelId: '@samdish',
      channelName: 'Unfiltred by Samdish',
      profilePictureUrl: 'https://yt3.googleusercontent.com/p2CTX0RN7xfMzwkQg21tJeMuR08NBhigUy0r0T6Vr-36b4_ufSUo1o3g3HDKLAaNkx-0qGDeN3s=s160-c-k-c0x00ffffff-no-rj',
      coverPhotoUrl: 'https://yt3.googleusercontent.com/Zu4JUmuIacLsT5BJZDEm3u1AsJY2VcLxbyFQm66dM6260gP161ULDaHif1ZNCXqs7EZYspKWEQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj'
    })    
  }

  return (
    <div className="bg-black text-white h-[100vh]" >
      <button onClick={handleClick} >Click me! to create create channel</button>
    </div>
  )
}

export default Demo;
