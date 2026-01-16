import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { getUser } from "../../app/userSlice";
import WelcomePage from "../../pages/user/WelcomePage";

const Protected = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (!user) {
    return <WelcomePage />;
  }

  return children;
};

Protected.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Protected;