// import { FromContext } from "../utils/constants";
// import { useForm } from "react-hook-form";

// const AuthProvider = ({ children }) => {
//   const { register, handleSubmit, reset, watch, formState } = useForm({
//     mode: "onChange",
//   });
//   const { errors, isSubmitting } = formState;

//   return (
//     <FromContext.Provider
//       value={{
//         register, handleSubmit, reset, watch, errors, isSubmitting
//       }}
//     >
//       {children}
//     </FromContext.Provider>
//   );
// };

// export default AuthProvider;

import { FromContext } from "../utils/constants";
import { useForm } from "react-hook-form";

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
        isSubmitting
      }}
    >
      {children}
    </FromContext.Provider>
  );
};

export default AuthProvider;