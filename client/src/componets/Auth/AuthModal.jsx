import { useSelector } from "react-redux";
import EmailButton from "./EmailAuth/EmailButton";
import GoogleButton from "./GoogleAuth/GoogleButton";

const AuthModal = () => {

  const { error } = useSelector(store => store.user);

  return (
    <div className="w-full flex justify-center mt-3 mb-5 px-4">
      <div className="w-full max-w-md">
        <div>
          <h1 className="text-2xl font-medium text-center font-serif mb-8 mt-5">
            Get Started with Bookent
          </h1>
        </div>
        {error && <div className="text-center mb-5"><span className="text-red-500">{error}</span></div>}
        <div className="flex flex-col gap-4">
          <EmailButton />
          <GoogleButton />
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
