import React from "react";

const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full h-6 bg-gray-700 rounded-md animate-pulse"
        ></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;