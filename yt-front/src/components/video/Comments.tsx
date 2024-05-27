import React from "react";
import Image from "next/image";

export const Comments: React.FC = () => {
  return (
    <div className="ml-4" >
      <p className="text-2xl" > 876 Comments </p>
      <div className="mt-4" > <AddComment /> </div>
      <div className="mt-4" > 
        {
          Array(50).fill(1).map((_item, key) => (
            <div className="mt-4" key={key} > <CommentCard /> </div>
          ))
        }
      </div>
    </div>
  )
}

const CommentCard: React.FC = () => {
  return (
    <div className="flex" >
      <div className="w-20 h-20" >
        <img
          className="ml-2 rounded-full"
          src={'https://yt3.ggpht.com/MeY_fGNrjVLV0PVOBN7dRWzMBS0y41YGm55LOaJ02cXV82a7Np9pYxxhHFqdYdncEy1I2cYR=s176-c-k-c0x00ffffff-no-rj-mo'}
          alt={`channel-icon`}
          width={35}
          height={30} />
      </div>
      <div>
        <div className="flex" >
          <p className="ml-4" >@harkirat!</p>
          <p className="ml-2 mt-[1px] text-gray-400 text-sm ">1 month ago</p>
        </div>
        <p className="ml-4" >I was just thinking about it only , while just starting CSS as a beginner , that why you don't talk much about CSS I was just thinking about it only , while just starting CSS as a beginner , that why you don't talk much about CSS I was just think</p>
        <div className="flex" >
          <div className="w-6 mt-4 ml-4 h-6" > <Image src={"/like.png"} alt="like-icon" width={18} height={16} /> </div>
          <div className="w-6 mt-4 ml-4 h-6" > <Image src={"/dislike.png"} alt="like-icon" width={18} height={16} /> </div>
        </div>
      </div>
    </div>
  )
}

const AddComment: React.FC = () => {
  return (
    <div>
    </div>
  )
}
