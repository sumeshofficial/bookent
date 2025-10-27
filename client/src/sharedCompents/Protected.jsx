import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Redux/userSlice";
import WelcomePage from "../pages/user/WelcomePage"

const Protected = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  if (!user){
    return <WelcomePage />
  }

  return children
};

export default Protected;
