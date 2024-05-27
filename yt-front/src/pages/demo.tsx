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
      channelName: 'Backend Banter',
      profilePictureUrl: 'https://yt3.googleusercontent.com/rDbXKsxmY2H5JtCrHtVuqyIJFzo70eIuyummRSQ_k5kXgggCgZmKrlLsNWMLDW3kvBYFYMT2qg=s160-c-k-c0x00ffffff-no-rj',
      coverPhotoUrl: 'https://yt3.googleusercontent.com/YlN8EJdLEcGg42hhW9tyvCdpOUhnXRt1rTxQvOkyIzgvKihkzMO5_G86fQUhLfSgInEf8cFFDw=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj'
    })    
  }

  return (
    <div className="bg-black text-white h-[100vh]" >
      <button onClick={handleClick} >Click me! to create create channel</button>
    </div>
  )
}

export default Demo;
