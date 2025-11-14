import { useState } from "react";
import ProgressSteps from "../../components/organization/CreateEvent/ProgressSteps";
import BasicInfo from "../../components/organization/createEvent/BasicInfo";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NavigationButtons from "../../components/organization/createEvent/NavigationButtons";
import VenueAndTicket from "../../components/organization/createEvent/VenueAndTicket";
import { validationSchema } from "../../utils/validation";
import useNavigationGuard from "../../hooks/useNavigationGuard";
import MatchTime from "../../components/organization/createEvent/MatchTime";
import UploadMedia from "../../components/organization/createEvent/UploadMedia";
import PublishAndPreview from "../../components/organization/createEvent/PublishAndPreview";
import {
  createEventFinish,
  createEventValidate,
} from "../../services/organization";
import { uploadFile } from "../../services/s3";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateEventForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { organizer } = useSelector((store) => store.organizer);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const navigate = useNavigate();

  const currentValidationSchema = validationSchema[currentStep - 1];
  const method = useForm({
    resolver: yupResolver(currentValidationSchema),
    mode: "all",
  });

  const { register, handleSubmit, formState, setValue, watch, trigger, reset } =
    method;
  const { errors, isSubmitting, isDirty } = formState;

  const onSubmit = async (data) => {
    try {
      const { bannerImage, thumbnailImage, ...dataWithoutImage } = data;

      const totalTickets = dataWithoutImage.ticketSetup.reduce(
        (sum, tier) => sum + tier.totalSeats,
        0
      );

      dataWithoutImage.totalTickets = totalTickets;
      dataWithoutImage.availableTickets = totalTickets;
      dataWithoutImage.soldTickets = 0;

      dataWithoutImage.organizer = organizer._id;
      const resData = await createEventValidate(dataWithoutImage);

      const { sessionId, uploadUrls } = resData;

      console.log(sessionId, uploadUrls);

      await uploadFile({
        file: bannerImage,
        contentType: bannerImage.type,
        signedUrl: uploadUrls.bannerImage.bannerURL,
      });
      await uploadFile({
        file: thumbnailImage,
        contentType: thumbnailImage.type,
        signedUrl: uploadUrls.thumbnailImage.thumbnailURL,
      });

      const res = await createEventFinish({
        sessionId,
        bannerImage: uploadUrls.bannerImage.key,
        thumbnailImage: uploadUrls.thumbnailImage.key,
      });

      reset();
      setIsSubmitSuccess(true);
      toast.success("Event created successfully");
      navigate("/listmyshow");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useNavigationGuard(!isSubmitSuccess && isDirty);

  const handleNextStep = async (e) => {
    const isStepValid = await trigger();
    if (isStepValid) setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePreviousStep = async () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProgressSteps currentStep={currentStep} />
      <div className="sm:w-11/12 mx-auto my-2">
        {currentStep === 1 && (
          <BasicInfo
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        )}
        {currentStep === 2 && (
          <VenueAndTicket
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            onLayoutCreated={() => setLayoutCreated(true)}
          />
        )}
        {currentStep === 3 && (
          <MatchTime
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        )}
        {currentStep === 4 && (
          <UploadMedia
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        )}
        {currentStep === 5 && (
          <PublishAndPreview
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        )}
      </div>
      <NavigationButtons
        currentStep={currentStep}
        handleNextStep={handleNextStep}
        handlePreviousStep={handlePreviousStep}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default CreateEventForm;
