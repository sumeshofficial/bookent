import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateOrganizerProfile } from "../../redux/organizerSlice";
import toast from "react-hot-toast";

const OrganizerProfilePage = () => {
  const { organizer } = useSelector((store) => store.organizer);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: organizer.organizationDetails.name,
      address: organizer.organizationDetails.address,
    },
  });

  const watchedValues = watch();

  const isModified =
    watchedValues.name !== organizer.organizationDetails.name ||
    watchedValues.address !== organizer.organizationDetails.address;

  const onSubmit = (formdata) => {
    const data = {
      organizationDetails: {
        ...formdata,
      },
    };
    dispatch(updateOrganizerProfile({ id: organizer._id, data }));
    toast.success("Preferences updated successfully!");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-3xl w-full text-center">
        <h2 className="text-gray-700 text-sm font-medium mb-4">
          WELCOME {organizer.organizationDetails.name}
        </h2>

        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="User"
              className="w-12 h-12"
            />
          </div>

          <p className="mt-3 text-gray-800 font-semibold">
            {organizer.organizationDetails.name}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-6">
            <div className="text-left">
              <label className="text-sm text-gray-600">Organization name</label>
              <input
                type="text"
                defaultValue={organizer.organizationDetails.name}
                {...register("name", {
                  required: "Name required",
                })}
                className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-700 focus:outline-none"
              />
            </div>

            <div className="text-left">
              <label className="text-sm text-gray-600">Address</label>
              <input
                type="text"
                defaultValue={organizer.organizationDetails.address}
                {...register("address", {
                  required: "address",
                })}
                className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <button
            disabled={!isModified}
            className={`mt-8 w-40 mx-auto py-3 font-semibold rounded-lg transition
    ${
      isModified
        ? "bg-black text-white hover:bg-gray-800"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
          >
            EDIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizerProfilePage;
