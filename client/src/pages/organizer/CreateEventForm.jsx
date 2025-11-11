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

const CreateEventForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const currentValidationSchema = validationSchema[currentStep - 1];
  const method = useForm({
    shouldUnregister: true,
    resolver: yupResolver(currentValidationSchema),
    mode: "all",
  });

  const { register, handleSubmit, formState, setValue, watch, trigger } =
    method;
  const { errors, isSubmitting, isDirty } = formState;

  useNavigationGuard(isDirty)

  const handleNextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid) setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePreviousStep = async () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div>
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
      />
    </div>
  );
};

export default CreateEventForm;
