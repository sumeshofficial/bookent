import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../sharedCompents/Navbar";
import { Edit, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../utils/constants";
import toast from "react-hot-toast";
import { updateUserProfile } from "../../Redux/userSlice";
import { isEqual } from "lodash";

const ProfilePage = () => {
  const { user } = useSelector((store) => store.user);
  const [location, setLocation] = useState({
    defaultLocation: null,
    formattedLocation: null,
  });
  const { openModal } = useModal();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      sport: "Football",
      venue: "Kochi",
      matchTime: "Afternoon",
      priceRange: "500 - 2000",
    },
  });

  useEffect(() => {
    const fullAddress = user.location?.address || "";
    const parts = fullAddress.split(",");
    const city = parts[parts.length - 2]?.trim() || "";
    const state = parts[parts.length - 1]?.trim() || "";
    const formatted = `${city}, ${state}`;
    
    if (fullAddress) {
      setLocation({
        formattedLocation: formatted,
        defaultLocation: city,
      });
    }
  }, [user]);

  const watchedValues = watch();

  const initialPreferences = useMemo(() => {
    return (
      user?.preferences || {
        sport: "Football",
        venue: "Kochi",
        matchTime: "Afternoon",
        priceRange: "500 - 2000",
      }
    );
  }, [user]);

  useEffect(() => {
    if (user?.preferences) {
      Object.entries(user.preferences).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [user, setValue]);

  const isChanged = useMemo(() => {
    return !isEqual(watchedValues, initialPreferences);
  }, [watchedValues, initialPreferences]);

  const sports = [
    "Football",
    "Cricket",
    "Basketball",
    "Tennis",
    "Badminton",
    "Volleyball",
  ];
  const venues = [
    "Kochi",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Hyderabad",
  ];
  const matchTimes = ["Morning", "Afternoon", "Evening", "Night"];
  const priceRanges = ["0 - 500", "500 - 2000", "2000 - 5000", "5000+"];

  const onSubmit = async (formData) => {
    const data = {
      preferences: {
        ...formData,
      },
    };
    dispatch(updateUserProfile({ id: user._id, data }));
    toast.success("Preferences updated successfully!");
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={64} className="text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.fullname}
                  </h2>
                  <button
                    onClick={() => openModal("edit-profile")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit size={18} />
                  </button>
                </div>

                <div className="text-left space-y-3">
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
                <div className="text-left space-y-3 mt-2">
                  <p className="text-gray-600 text-sm">
                    {location.formattedLocation}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Your Profile
                </h1>
                <p className="text-gray-600">
                  Your profile preferences help Bookent personalize sports event
                  recommendations for you.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Select Your Preferences
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your favorite Sport:
                    </label>
                    <select
                      {...register("sport", { required: "Sport is required" })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                 focus:border-indigo-500 appearance-none bg-white"
                    >
                      {sports.map((sport) => (
                        <option key={sport} value={sport}>
                          {sport}
                        </option>
                      ))}
                    </select>
                    {errors.sport && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.sport.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Locations / Venues:
                    </label>
                    <select
                      {...register("venue", { required: "Venue is required" })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                 focus:border-indigo-500 appearance-none bg-white"
                    >
                      {venues.map((venue) => (
                        <option key={venue} value={venue}>
                          {venue}
                        </option>
                      ))}
                    </select>
                    {errors.venue && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.venue.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Match Time:
                    </label>
                    <select
                      {...register("matchTime", {
                        required: "Match time is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                 focus:border-indigo-500 appearance-none bg-white"
                    >
                      {matchTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {errors.matchTime && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.matchTime.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price Range:
                    </label>
                    <select
                      {...register("priceRange", {
                        required: "Price range is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                 focus:border-indigo-500 appearance-none bg-white"
                    >
                      {priceRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                    {errors.priceRange && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.priceRange.message}
                      </p>
                    )}
                  </div>
                </div>

                {isChanged && (
                  <div className="mt-8 justify-end flex">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-8 py-3 bg-black hover:bg-gray-700
                               text-white font-semibold rounded-lg transition duration-200
                               disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
