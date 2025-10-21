import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Redux/authSlice";
import WelcomePage from "../pages/WelcomePage"

const Protected = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  if (!user){
    return <WelcomePage />
  }

  return children
};

export default Protected;
