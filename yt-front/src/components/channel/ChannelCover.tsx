import React from "react";

export const ChannelCover: React.FC = () => {
  return (

    <div>

      <div>
        <img src="https://yt3.googleusercontent.com/1TWORcscn-5ve4rzNv0Im3dvp_3vOKxqQnyLTrNEyptng53g-unzkLntxVNHWEnwWFQALSZo8g=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj" alt="channel cover"
          className="h-[25vh] w-[100%] rounded-lg" />
      </div>

      <div className="flex" >
        <img
          src="https://yt3.googleusercontent.com/MeY_fGNrjVLV0PVOBN7dRWzMBS0y41YGm55LOaJ02cXV82a7Np9pYxxhHFqdYdncEy1I2cYR=s160-c-k-c0x00ffffff-no-rj"
          className="rounded-full w-[10vw] h-[19vh] mt-8"
        />
        <div className="mt-12 ml-4" >
          <p className="text-4xl" >Harkirat Singh</p>
          <p className="text-[#AAAAAA] mt-3 ">@harkirat1 . 324K Subscribers . 262 videos</p>

          <div className="mt-4 ml-4" >
            <button className="bg-white text-black rounded-md px-4 py-1 hover:bg-[#D9D9D9]" >Subscribe</button>
          </div>
        </div>
      </div>

    </div>

  )
}
