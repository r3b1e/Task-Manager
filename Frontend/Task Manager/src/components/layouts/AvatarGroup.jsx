import React from "react";

const AvatarGroup = ({ avatars, maxVisible }) => {
  return (
    <div className="flex items-center cursor-pointer">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover object-top"
          key={index}
          src={avatar}
          alt={`Avatar ${index}`}
        />
      ))}
      {avatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
          +{avatars.length - maxVisible}
          </div>
      )}
    </div>
  );
};

export default AvatarGroup;
