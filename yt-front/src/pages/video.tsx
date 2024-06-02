import { Navbar } from "@/components/Navbar";
import { Tags } from "@/components/home/Hero";
import { SideVideo } from "@/components/video/SideVideo";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { VideoDesc } from "@/components/video/VideoDesc";
import { Comments } from "@/components/video/Comments";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

const ClientVideoPlayer = dynamic(() => import("@/components/video/VideoPlayer"), {
  ssr: false
})

interface VideoI {
  id: number;
  title: string;
  description: string;
  uploadDate: Date,
  duration: number;
  thumbnailUrl: string | null;
  videoUrl: string[];
  views: number;
  likes: number;
  dislikes: number;
  status: string;
  tags: string[];
  category: string;
  language: string;
  channelId: number;
  userId: number;
}

export async function getServerSideProps (context: GetServerSidePropsContext) {
  const { id } = context.query;
  return {
    props: {
      videoId: id
    }
  }
}

interface VideoProps {
  videoId: string
}

const Video: React.FC<VideoProps> = (props) => {

  const { videoId } = props;
  const router = useRouter();
  const { id } = router.query;
  const [videoIdState, setVideoIdState] = useState<string>(videoId);
  const [videoFromBackend, setVideoFromBackend] = useState<VideoI | null>(null);

  const getVideo = api.video.getVideoById.useMutation({
    onSuccess: data => {
      console.log(data);
      if (data.code === 200) {
        setVideoFromBackend(data.video);
      }
    }
  })

  useEffect(() =>{
    const {id} = router.query;
    typeof id === "string" && setVideoIdState(id);
  }, [id])

  useEffect(() => {
    const numberedId = parseInt(videoIdState)
    getVideo.mutateAsync({id: numberedId});
  }, [videoIdState])

  return (
    <div className="bg-[#0F0F0F] m-0 p-0 h-[100vh] text-white " >
      <Navbar />

      <div className="flex overflow-y-auto h-[90vh]" >
          <div>
            <div className="w-[72vw] h-[72vh]" > <ClientVideoPlayer url={videoFromBackend?.videoUrl} /> </div>
            <div className="w-[72vw] h-[25vh]" >
              { videoFromBackend && <VideoDesc like={videoFromBackend.likes} title={videoFromBackend.title} channelId={videoFromBackend.channelId} /> }
               <div className="mt-16 w-[66vw] mx-auto" > { videoFromBackend && <Comments videoId={videoFromBackend?.id} /> } </div>
            </div>
          </div>
          <div className="max-w-[28vw]" >
            <div className="overflow-x-auto" > <Tags /> </div>
            <div> <SideVideo /> </div>
          </div>
      </div>

    </div>
  )
}

export default Video;
