import { useState } from "react";
import Navbar from "../../sharedCompents/Navbar";
import { Edit, User } from "lucide-react";
import { useSelector } from "react-redux";
import { useContextForm, useModal } from "../../utils/constants";
import { sendOTP } from "../../services/auth";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user } = useSelector((store) => store.user);
  const { openModal } = useModal();
  const { reset } = useContextForm();
  const [error, setError] = useState();

  const onSubmit = async (data) => {
    try {
      if (data.email === user.email) {
        return setError("same email");
      }
      const response = await sendOTP({ data, purpose: "email-edit" });
      toast.success("OTP sent successfully");
      reset();
      openModal("otp", {
        title: response,
        email: user.email,
        data,
        purpose: "email-edit",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = () => {
    openModal("email-verify", {
      title: "Edit Email Address",
      error,
      onSubmit,
    });
  };
  const [profile, setProfile] = useState({
    name: user.fullname,
    email: user.email,
    location: "Kerala, India",
    sport: "Football",
    venue: "Kochi",
    matchTime: "Afternoon",
    priceRange: "500 - 2000",
  });

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

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={64} className="text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile.name}
                  </h2>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Edit size={18} />
                  </button>
                </div>

                <div className="text-left space-y-3">
                  <p className="text-gray-600 text-sm">{profile.email}</p>
                  <p className="text-gray-600 text-sm">{profile.phone}</p>
                  <p className="text-gray-600 text-sm">{profile.location}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Details */}
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

              {/* Preferences */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Select Your Preferences
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your favorite Sport:
                    </label>
                    <select
                      value={profile.sport}
                      onChange={(e) =>
                        setProfile({ ...profile, sport: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                 focus:border-indigo-500 transition-all duration-200
                                 appearance-none bg-white cursor-pointer"
                    >
                      {sports.map((sport) => (
                        <option key={sport} value={sport}>
                          {sport}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Locations / Venues:
                    </label>
                    <select
                      value={profile.venue}
                      onChange={(e) =>
                        setProfile({ ...profile, venue: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                 focus:border-indigo-500 transition-all duration-200
                                 appearance-none bg-white cursor-pointer"
                    >
                      {venues.map((venue) => (
                        <option key={venue} value={venue}>
                          {venue}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Match Time:
                    </label>
                    <select
                      value={profile.matchTime}
                      onChange={(e) =>
                        setProfile({ ...profile, matchTime: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                 focus:border-indigo-500 transition-all duration-200
                                 appearance-none bg-white cursor-pointer"
                    >
                      {matchTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price Range:
                    </label>
                    <select
                      value={profile.priceRange}
                      onChange={(e) =>
                        setProfile({ ...profile, priceRange: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                 focus:border-indigo-500 transition-all duration-200
                                 appearance-none bg-white cursor-pointer"
                    >
                      {priceRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8 justify-end flex">
                  <button className="w-full md:w-auto px-8 py-3 bg-black hover:bg-gray-500 text-white font-semibold rounded-lg transition duration-200">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
