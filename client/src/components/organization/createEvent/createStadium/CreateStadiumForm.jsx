import { useCallback, useEffect } from "react";
import StadiumLayout from "../selectStadium/StadiumLayout";
import { useState } from "react";
import { Pencil } from "lucide-react";
import debounce from "lodash.debounce";
import {
  checkStadiumExists,
    getCity,
    getState,
} from "../../../../services/organization";
import toast from "react-hot-toast";

const CreateStadiumInput = ({
  register,
  errors,
  setCurrentPage,
  watch,
  handleSubmit,
  onSubmit,
  isSubmitting,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAvailable, setIsAvailable] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const stadiumName = watch("stadiumName");
  const address = watch("address");
  const city = watch("city");
  const state = watch("state");
  const pincode = watch("pincode");
  const location = watch("location");
  const stadiumLayout = watch("stadiumLayout");

  const debouncedCheck = useCallback(
    debounce(async (name) => {
      if (!name.trim()) {
        setIsAvailable(null);
        return;
      }

      try {
        const { data } = await checkStadiumExists(name);
        setIsAvailable(!data.exists);
      } catch (error) {
        toast.error(error.message);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedCheck(stadiumName);
    return () => debouncedCheck.cancel();
  }, [stadiumName, debouncedCheck]);


  useEffect(() => {
    if (stadiumLayout?.layoutImage) {
      const url = URL.createObjectURL(stadiumLayout.layoutImage);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [stadiumLayout]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await getState();
        setStates(data.data[98].states);
      } catch (error) {
        console.error("Error fetching states:", error);
        toast.error("Failed to load states");
      }
    };
    fetchStates();
  }, []);

  const fetchCities = async (stateName) => {
    if (!stateName) {
      setCities([]);
      return;
    }
    try {
      const data = await getCity(stateName);
      setCities(data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to load cities");
    }
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setSelectedState(value);
    setSelectedCity("");
    fetchCities(value);
  };

  const isCreateFormValid =
    stadiumName && address && city && state && pincode && location;

  return (
    <div className="bg-white py-4 px-6 sm:py-6 sm:px-8 rounded-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3">
          <div className="mt-2 sm:mt-5 flex flex-col gap-2">
            <label className="text-[.7rem] sm:text-sm">Stadium name *</label>
            <input
              type="text"
              {...register("stadiumName")}
              className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.7rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="e.g., Jawaharlal Nehru Stadium"
            />
            <div className="sm:mt-1">
              {isAvailable === false && (
                <p className="text-red-500 text-[.5rem] sm:text-sm">
                  Stadium name already exists.
                </p>
              )}
              {isAvailable === true && (
                <p className="text-green-300 text-[.5rem] sm:text-sm">
                  Stadium name is available.
                </p>
              )}
            </div>
            {errors?.stadiumName && (
              <span className="text-red-500 text-[.5rem] sm:text-sm">
                {errors.stadiumName.message}
              </span>
            )}
          </div>
          <div className="mt-2 sm:mt-5 flex flex-col gap-2">
            <label className="text-[.7rem] sm:text-sm">Total Capacity *</label>
            <input
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.7rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="e.g., 35000"
            />
            {errors?.capacity && (
              <span className="text-red-500 text-[.5rem] sm:text-sm">
                {errors.capacity.message}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 sm:mt-5 flex flex-col gap-2">
          <label className="text-[.7rem] sm:text-sm">Address</label>
          <textarea
            {...register("address")}
            className="border text-[.7rem] sm:text-base border-gray-200 h-20 sm:h-30 rounded-md py-1 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.7rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            placeholder="Full Address of the venue"
          />
          {errors?.address && (
            <span className="text-red-500 text-[.5rem] sm:text-sm">
              {errors.address.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="mt-2 sm:mt-5 flex flex-col gap-2">
            <label className="text-[.7rem] sm:text-sm">State *</label>
            <select
              {...register("state")}
              value={selectedState}
              onChange={handleStateChange}
              className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors?.state && (
              <span className="text-red-500 text-[.5rem] sm:text-sm">
                {errors.state.message}
              </span>
            )}
          </div>
          <div className="mt-2 sm:mt-5 flex flex-col gap-2">
            <label className="text-[.7rem] sm:text-sm">City *</label>
            <select
              {...register("city")}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors?.city && (
              <span className="text-red-500 text-[.5rem] sm:text-sm">
                {errors.city.message}
              </span>
            )}
          </div>

          <div className="mt-2 sm:mt-5 flex flex-col gap-2">
            <label className="text-[.7rem] sm:text-sm">Pincode *</label>
            <input
              type="text"
              {...register("pincode")}
              className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.7rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="612211"
            />
            {errors?.pincode && (
              <span className="text-red-500 text-[.5rem] sm:text-sm">
                {errors.pincode.message}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 sm:mt-5 flex flex-col gap-2">
          <label className="text-[.7rem] sm:text-sm">
            Google Map Location URL *
          </label>
          <input
            type="text"
            {...register("location")}
            className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.7rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="https://maps.app.goo.gl/3s52sYD3f2mitXL9A"
          />
          {errors?.location && (
            <span className="text-red-500 text-[.5rem] sm:text-sm">
              {errors.location.message}
            </span>
          )}
        </div>

        {!Object.keys(errors).length &&
          isCreateFormValid &&
          !stadiumLayout &&
          isAvailable && <StadiumLayout setCurrentPage={setCurrentPage} />}

        {!isCreateFormValid && (
          <p className="text-[0.5rem] sm:text-xs text-yellow-500 italic mt-2">
            Fill all the required details to create your stadium layout.
          </p>
        )}

        {previewUrl && (
          <div className="mt-5 flex flex-col gap-1">
            <h4 className="text-[0.7rem] sm:text-xl font-semibold">
              Stadium Layout Preview
            </h4>

            <div className="relative w-full max-w-4xl">
              <div className="flex justify-end mb-1">
                <button
                  type="button"
                  className="flex items-center text-[0.8rem] sm:text-base gap-1 text-violet-500 hover:text-violet-800 cursor-pointer"
                  onClick={() => setCurrentPage("canvas")}
                >
                  <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                  Edit
                </button>
              </div>

              <div className="w-full overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Stadium Layout Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <div>
                <button
                  disabled={!isAvailable || isSubmitting}
                  type="submit"
                  className={`py-1 px-2 text-[.7rem] sm:text-base sm:py-2 sm:px-5 rounded-md text-white ${
                    !isAvailable
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-violet-600 hover:bg-violet-400"
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateStadiumInput;
