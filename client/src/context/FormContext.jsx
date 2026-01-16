import { FromContext } from "../utils/constants";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

const AuthProvider = ({ children }) => {
  const { register, handleSubmit, reset, watch, formState } = useForm();
  const { errors, isSubmitting } = formState;

  return (
    <FromContext.Provider
      value={{
        register,
        handleSubmit,
        reset,
        watch,
        errors,
        isSubmitting,
      }}
    >
      {children}
    </FromContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
