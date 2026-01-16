import PropTypes from "prop-types";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { validationSchema } from "../../../utils/validation";

const BasicInfo = ({ register, errors, setValue, watch }) => {
  const { organizer } = useSelector((store) => store.organizer);
  const { user } = useSelector((store) => store.user);
  const [tag, setTag] = useState("");
  const [tagError, setTagError] = useState("");
  const currentTags = watch("tags") || [];

  const organizationName = organizer.organizationDetails.name;
  const organizerName = user.fullname;

  const handleTags = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = tag.trim().toUpperCase();

      if (!newTag) return;

      const newTags = [...currentTags, newTag];
      try {
        await validationSchema[0].fields.tags.validate(newTags);
        setValue("tags", newTags, { shouldValidate: true, shouldDirty: true });
        setTag("");
        setTagError("");
      } catch (error) {
        setTagError(error.message);
      }
    }
  };

  const handleOnChnage = (e) => {
    const value = e.target.value;
    if (value.length > 10) {
      return;
    }
    setTag(value);
    setTagError("");
  };

  const removeTag = (index) => {
    const newTags = currentTags.filter((_, i) => i !== index);
    setValue("tags", newTags, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-md px-4 py-6 sm:px-8 sm:py-8">
      <span className="font-semibold text-sm sm:text-2xl">
        Basic Information
      </span>

      <div className="mt-2 sm:mt-5 flex flex-col gap-2">
        <label className="text-xs sm:text-sm">Event Title *</label>
        <input
          type="text"
          {...register("eventTitle")}
          className="border text-xs sm:text-base border-gray-200 rounded-md py-2 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="e.g., India vs Pakistan T20 Match"
        />
        {errors?.eventTitle && (
          <span className="text-red-500 text-[.6rem] sm:text-sm">
            {errors.eventTitle.message}
          </span>
        )}
      </div>

      <div className="mt-2 sm:mt-5 flex flex-col gap-2">
        <label className="text-xs sm:text-sm">Sport Type *</label>

        <div className="relative">
          <select
            className="border border-gray-200 rounded-md py-2 px-2 sm:py-3 sm:px-3 
                 text-xs sm:text-base focus:outline-none focus:ring-2 
                 focus:ring-violet-500 appearance-none w-full pr-8"
            {...register("sportType")}
          >
            <option value="">Select sport type</option>
            <option>Cricket</option>
            <option>Football</option>
            <option>Kabaddi</option>
            <option>Basketball</option>
            <option>Volleyball</option>
            <option>Hockey</option>
            <option>Badminton</option>
            <option>Running</option>
          </select>

          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
        </div>

        {errors?.sportType && (
          <span className="text-red-500 text-[.6rem] sm:text-sm">
            {errors.sportType.message}
          </span>
        )}
      </div>

      <div className="mt-2 sm:mt-5 flex flex-col gap-2">
        <label className="text-xs sm:text-sm">Description </label>
        <textarea
          {...register("eventDescription")}
          className="border text-xs sm:text-base border-gray-200 h-20 sm:h-30 rounded-md py-2 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.7rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          placeholder="Enter event description, highlights, etc"
        />
        {errors?.eventDescription && (
          <span className="text-red-500 text-[.6rem] sm:text-sm">
            {errors.eventDescription.message}
          </span>
        )}
      </div>

      <div className="mt-2 sm:mt-5 flex flex-col gap-2">
        <label className="text-xs sm:text-sm">Tags </label>
        <input
          type="text"
          value={tag}
          onKeyDown={handleTags}
          onChange={handleOnChnage}
          disabled={currentTags.length >= 5}
          className={`border border-gray-200 text-xs sm:text-base rounded-md py-2 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.7rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500 ${
            currentTags.length >= 5 ? "opacity-60 cursor-not-allowed" : ""
          }`}
          placeholder={
            currentTags.length >= 5
              ? "Maximum 5 tags added"
              : 'Type and press Enter (e.g., "T20", "Kochi", "World Cup")'
          }
        />
        {(errors?.tags || tagError) && (
          <span className="text-red-500 text-[.6rem] sm:text-sm">
            {errors?.tags?.message || tagError}
          </span>
        )}
        <div className="flex flex-wrap gap-3 mt-2">
          {currentTags.map((tag, i) => (
            <span
              key={i}
              className="bg-purple-100 text-purple-700 px-2 py-1 text-[.7rem] sm:text-sm sm:px-3 sm:py-1 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <X
                onClick={() => removeTag(i)}
                className="cursor-pointer hover:text-purple-900 w-3 h-3 sm:w-4 sm:h-4"
              />
            </span>
          ))}
        </div>
      </div>

      <div className="pt-5 border-t-2 border-t-gray-200 mt-5">
        <span className="font-semibold text-sm sm:text-lg">
          Organizer Details
        </span>

        <div className="grid grid-cols-2 gap-4">
          <div className="mt-2 sm:mt-5 flex flex-col gap-2">
            <label className="text-xs sm:text-sm">Organization Name</label>
            <input
              type="text"
              value={organizationName}
              disabled
              className="border text-xs sm:text-base border-gray-200 rounded-md py-2 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="mt-2 sm:mt-5 flex flex-col gap-2">
            <label className="text-xs sm:text-sm">Organizer Name</label>
            <input
              type="text"
              value={organizerName}
              disabled
              className="border text-xs sm:text-base border-gray-200 rounded-md py-2 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


BasicInfo.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
};

export default BasicInfo;
