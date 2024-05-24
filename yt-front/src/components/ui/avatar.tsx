import React from "react";

const Avatar: React.FC = () => {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full`}
    >
      <AvatarImage />
      <AvatarFallback />
    </div>
  );
};


const AvatarImage: React.FC = () => {
  return (
    <img
      className={`aspect-square h-full w-full`}
      src="https://github.com/shadcn.png"
    />
  );
};


const AvatarFallback: React.FC= () => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-muted`}
    />
  );
};

export { Avatar};

