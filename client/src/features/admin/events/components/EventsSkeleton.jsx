import React from "react";

const EventsSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-200 rounded-md"
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
        <div className="border-b p-4">
          <div className="h-4 w-1/3 bg-gray-200 rounded" />
        </div>

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-4 p-4 border-b"
          >
            <div className="h-4 bg-gray-200 rounded col-span-2" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsSkeleton;