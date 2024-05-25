import React from "react";

export const SideVideo: React.FC = () => {
  return (
    <div className="mt-6" >
      {
        Array(20).fill(1).map((_item, key) => (
          <div key={key} className="mt-5" >
            <SideVideoCard />
          </div>
        ))
      }
    </div>
  )
}

const SideVideoCard: React.FC = () => {
  return (
    <div className="flex items-center ml-2 " >
      <div className="rounded-md" >
        <img  className="rounded-md" src="https://i.ytimg.com/vi/xfPAX0HUXoU/maxresdefault.jpg" width={250} alt="video-thumbnail" />
      </div>
      <div>
        <div className="ml-2 mb-2" >
          <p>Code with me!! Coding a system like replit in less then 4hr!</p>
          <p className="text-sm text-gray-400" >Harkirat Singh</p>
          <p className="text-sm text-gray-400" >42k Views . 4 hours ago</p>
        </div>
      </div>
    </div>
  )
}
