import { db } from "@/server/db";
import { api } from "@/utils/api";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import React from "react";

const Demo: React.FC = () => {

  const signup = api.channel.createChannel.useMutation({
    onSuccess: data => {
      console.log(data);
    }
  })

  const login = api.user.login.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        data.token && localStorage.setItem('token', data.token);
      }
    }
  })

  

  const handleClick = () => {
    console.log('Clicked');
    signup.mutateAsync({
      channelName: 'Hitesh Chaudhary',
      channelId: '@hitesh',
      description: 'desc',
      profilePictureUrl: 'https://yt3.ggpht.com/1FEdfq3XpKE9UrkT4eOc5wLF2Bz-42sskTi0RkK4nPh4WqCbVmmrDZ5SVEV3WyvPdkfR8sw2=s176-c-k-c0x00ffffff-no-rj-mo',
      coverPhotoUrl: 'https://yt3.googleusercontent.com/zO8n2TfZoDXozQeKwq7APiVXn4BIZw7Q0-5SCVw4FXY_q2ysjtmVp5WYw1_M3bn9m3WiNarZGg=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj'
    }) 
  } 

  const handleClickLogin = () => {
    login.mutateAsync({
      email: 'Hitesh@gmail.com',
      password: 'hitesh'
    })
  }

  return (
    <div className="bg-black text-white h-[100vh]" >
      <button onClick={handleClick} >Click me! to create create channel</button>
    </div>
  )
}

export default Demo;
