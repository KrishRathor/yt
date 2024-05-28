import React, { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/utils/api";
import { comment } from "postcss";

interface CommentsProp {
  videoId: number
}

export interface Comment {
  id: number;
  videoId: number;
  userId: number;
  commentText: string;
  commentDate: Date; // or Date if you prefer to parse it as a Date object
  parentCommentId: number | null;
  likes: number;
  dislikes: number;
}

export const Comments: React.FC<CommentsProp> = (props) => {

  const { videoId } = props;
  const [comments, setComments] = useState<Comment[]>([]);

  const getComments = api.comment.getCommentByVideo.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        data.comments && setComments(data.comments.reverse());
      }
    }
  });

  useEffect(() => {
    getComments.mutateAsync({ videoId });
  }, [videoId])


  return (
    <div className="ml-4" >
      <p className="text-2xl" > {comments.length} Comments </p>
      <div className="mt-4" > <AddComment setComments={setComments} videoId={videoId} /> </div>
      <div className="mt-4" >
        {
          comments.map((comment) => (
            <div className="mt-4" key={comment.id} >
              <CommentCard commentId={comment.id} commentBody={comment.commentText} likes={comment.likes} imageUrl={'https://github.com/shadcn.png'} username={comment.userId} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

interface CommentCardProps {
  imageUrl: string | null,
  commentBody: string,
  username: number,
  likes: number,
  commentId: number
}

const CommentCard: React.FC<CommentCardProps> = (props) => {

  const { imageUrl, commentId, commentBody, username, likes } = props;

  const likeCommentMutation = api.comment.likeComment.useMutation({
    onSuccess: data => {
      console.log(data);
    }
  })

  const handleLike = async () => {
    likeCommentMutation.mutateAsync({
      commentId
    })
  }

  return (
    <div className="flex" >
      <div className="w-20 h-20" >
        {imageUrl && <img
          className="ml-2 rounded-full"
          src={imageUrl}
          alt={`channel-icon`}
          width={35}
          height={30} />}
      </div>
      <div>
        <div className="flex" >
          <p className="ml-4" >{username}</p>
          <p className="ml-2 mt-[1px] text-gray-400 text-sm ">1 month ago</p>
        </div>
        <p className="ml-4" >{commentBody}</p>
        <div className="flex items-center" >
          <div className="w-6 mt-4 ml-4 h-6 cursor-pointer" onClick={handleLike} > <Image src={"/like.png"} alt="like-icon" width={18} height={16} /> </div>
          <p>{likes}</p>
          <div className="w-6 mt-4 ml-4 h-6" > <Image src={"/dislike.png"} alt="like-icon" width={18} height={16} /> </div>
        </div>
      </div>
    </div>
  )
}

interface AddCommentProps {
  videoId: number,
  setComments: any
}

const AddComment: React.FC<AddCommentProps> = ({ videoId, setComments }) => {

  const [comment, setComment] = useState<string>('');

  const getComments = api.comment.getCommentByVideo.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        data.comments && setComments(data.comments.reverse());
      }
    }
  });

  const addCommentMutation = api.comment.addComment.useMutation({
    onSuccess: data => {
      console.log(data);
      getComments.mutateAsync({ videoId });
    }
  })

  const handleAddComment = async () => {
    setComment('');
    addCommentMutation.mutateAsync({
      videoId: videoId,
      commentText: comment
    })
  }

  return (
    <div className="flex" >
      <input
        type="text"
        className="peer w-[58vw] placeholder-transparent bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 text-white focus:outline-none"
        placeholder="Your text"
        id="customInput"
        value={comment}
        onChange={e => setComment(_prev => e.target.value)}
      />
      <div onClick={handleAddComment} ><Image src={'/send.png'} className="ml-4 cursor-pointer" alt={"send-icon"} width={40} height={30} /> </div>
    </div>
  )
}
