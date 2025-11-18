import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="animate-spin w-10 h-10 text-violet-500" />
      <span className="ml-3 text-violet-500 font-semibold">Loading...</span>
    </div>
  );
};

export default Loader;
