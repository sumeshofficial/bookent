import { Loader2 } from "lucide-react";
import { Outlet, useNavigation } from "react-router-dom";

const GlobalLoader = () => {
  const navigation = useNavigation();
  return (
    <>
      {navigation.status === "loading" ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <Loader2 className="animate-spin w-10 h-10 text-violet-500" />
          <span className="ml-3 text-violet-500 font-semibold">Loading...</span>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default GlobalLoader;
