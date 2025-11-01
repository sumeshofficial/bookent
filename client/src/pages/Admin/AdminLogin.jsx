import { useSelector } from "react-redux";
import logo from "../../assets/bookent-logo-black.png";
import AdminLoginInput from "../../componets/Admin/AdminLoginInput";

const AdminLogin = () => {
  const { error } = useSelector((store) => store.admin);
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Bookent" className="h-18 w-auto" />
        </div>
        <div className="bg-white rounded-3xl p-8 md:p-10 ">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
            Admin Login
          </h2>

          {error && <p className="mb-3 text-red-500 text-center">{error}</p>}

          <AdminLoginInput />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
