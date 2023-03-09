import React from "react";

type AvatarProps = React.ImgHTMLAttributes<HTMLImageElement>;

const Avatar = (props: AvatarProps) => {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
      <img className="h-12 w-12 rounded-full" {...props} />
    </div>
  );
};

export default Avatar;
