import { useEffect, useMemo, useCallback } from "react";
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
import { Controller, useWatch } from "react-hook-form";

const CreateStadiumInput = ({
  register,
  errors,
  setCurrentPage,
  handleSubmit,
  onSubmit,
  isSubmitting,
  isEditMode,
  control,
  setValue,
  stadiumData,
  dirtyFields,
}) => {
  const [isAvailable, setIsAvailable] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const values = useWatch({
    control,
    name: [
      "stadiumName",
      "address",
      "city",
      "state",
      "stateCode",
      "pincode",
      "location",
      "stadiumLayout",
    ],
  });

  const [
    stadiumName,
    address,
    city,
    state,
    stateCode,
    pincode,
    location,
    stadiumLayout,
  ] = values;

  const previewUrl = useMemo(() => {
    if (
      stadiumLayout?.layoutImage &&
      typeof stadiumLayout.layoutImage === "string" &&
      stadiumLayout.layoutImage.includes("https")
    ) {
      return stadiumLayout.layoutImage;
    }

    if (stadiumLayout?.layoutImage instanceof File) {
      console.log(stadiumLayout.layoutImage)
      return URL.createObjectURL(stadiumLayout.layoutImage);
    }

    return null;
  }, [stadiumLayout]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const isValid = Boolean(
    stadiumName && address && city && state && pincode && location
  );

  const fetchCities = useCallback(async (stateCode) => {
    if (!stateCode) return [];

    try {
      return await getCity(stateCode);
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ||
          error.message ||
          "Something went wrong"
      );
      return [];
    }
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    if (!stateCode) return;
    if (cities.length > 0) return;

    let active = true;

    fetchCities(stateCode).then((data) => {
      if (active) {
        setCities(data);
      }
    });

    return () => {
      active = false;
    };
  }, [isEditMode, stateCode, cities.length, fetchCities]);

  const debouncedCheck = useMemo(() => {
    return debounce(async (name) => {
      if (!name?.trim()) {
        setIsAvailable(null);
        return;
      }

      try {
        const { data } = await checkStadiumExists(name, stadiumData?._id);
        setIsAvailable(!data.exists);
      } catch (error) {
        toast.error(error.message);
      }
    }, 500);
  }, [stadiumData]);

  useEffect(() => {
    debouncedCheck(stadiumName);
    return () => debouncedCheck.cancel();
  }, [stadiumName, debouncedCheck]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await getState();
        setStates(data);
      } catch (error) {
        toast.error(
          error?.response?.data?.error.message ||
            error.message ||
            "Something went wrong"
        );
      }
    };
    fetchStates();
  }, []);

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
            <Controller
              control={control}
              name="state"
              render={() => (
                <select
                  value={
                    state && stateCode
                      ? JSON.stringify({ name: state, code: stateCode })
                      : ""
                  }
                  onChange={(e) => {
                    const selected = JSON.parse(e.target.value);

                    setValue("state", selected.name, { shouldDirty: true });
                    setValue("stateCode", selected.code, { shouldDirty: true });

                    fetchCities(selected.code).then(setCities);
                  }}
                  className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option
                      key={s.isoCode}
                      value={JSON.stringify({
                        name: s.name,
                        code: s.isoCode,
                      })}
                    >
                      {s.name}
                    </option>
                  ))}
                </select>
              )}
            />
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
              value={city || ""}
              onChange={(e) => {
                setValue("city", e.target.value, { shouldDirty: true });
              }}
              className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
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

         <StadiumLayout setCurrentPage={setCurrentPage} />

        {!isValid && (
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
                  disabled={
                    isSubmitting ||
                    !isAvailable ||
                    (!isEditMode && !isValid) ||
                    (isEditMode && Object.keys(dirtyFields).length === 0)
                  }
                  type="submit"
                  className="py-1 px-2 text-[.7rem] sm:text-base sm:py-2 sm:px-5 rounded-md text-white 
                      disabled:bg-gray-400 disabled:cursor-not-allowed
                      bg-violet-600 hover:bg-violet-400"
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
