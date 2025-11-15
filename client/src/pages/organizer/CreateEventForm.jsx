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
  editEventFinish,
  getEvent,
  updateEvent,
} from "../../services/organization";
import { uploadFile } from "../../services/s3";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const CreateEventForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { organizer } = useSelector((store) => store.organizer);
  const [isModified, setIsModified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { organizerId, eventId } = useParams();
  const isEditMode = !!eventId;
  const navigate = useNavigate();

  const { data, error, isError } = useQuery({
    queryKey: ["event", organizerId, eventId],
    queryFn: () => getEvent(organizerId, eventId),
    enabled: isEditMode,
    retry: 1,
  });

  const eventData = data?.event;

  if (isError) {
    if (
      error.response?.data?.error === "Event not found or organizerId not match"
    ) {
      navigate("/error");
    }
    toast.error("Somethig went wrong");
  }

  const currentValidationSchema = validationSchema[currentStep - 1];
  const method = useForm({
    resolver: yupResolver(currentValidationSchema),
    mode: "all",
  });

  const { register, handleSubmit, formState, setValue, watch, trigger, reset } =
    method;
  const { errors, isSubmitting, dirtyFields } = formState;

  useEffect(() => {
    const sub = watch(() => setIsModified(true));
    return () => sub.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (eventData) {
      reset({
        ...eventData,
        matchDate: eventData.matchDate ? eventData.matchDate.split("T")[0] : "",
      });
      setIsModified(false);
    }
  }, [eventData, reset]);

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
      if (isEditMode) {
        const extractChangedFields = (data, dirty) => {
          const result = {};
          for (const key in dirty) {
            if (dirty[key] === true) {
              result[key] = data[key];
            } else if (typeof dirty[key] === "object") {
              result[key] = extractChangedFields(data[key], dirty[key]);
            }
          }
          return result;
        };

        const dirtyPayload = extractChangedFields(data, dirtyFields);

        dirtyPayload.ticketSetup = data.ticketSetup;
        dirtyPayload.tags = data.tags;

        const { bannerImage, thumbnailImage, ...newData } = dirtyPayload;

        if (bannerImage) {
          newData.bannerImage = true;
        }

        if (thumbnailImage) {
          newData.thumbnailImage = true;
        }

        const updatedEvent = await updateEvent(eventId, newData);
        const uploadUrls = updatedEvent.data?.uploadUrls;

        if (uploadUrls) {
          const images = {};
          if (uploadUrls?.bannerImage?.bannerURL) {
            console.log(dirtyPayload.bannerImage);
            console.log(dirtyPayload.bannerImage.type);
            console.log(uploadUrls.bannerImage.bannerURL);
            await uploadFile({
              file: dirtyPayload.bannerImage,
              contentType: dirtyPayload.bannerImage.type,
              signedUrl: uploadUrls.bannerImage.bannerURL,
            });
            images.bannerImageKey = uploadUrls.bannerImage.key;
          }
          if (uploadUrls?.thumbnailImage?.thumbnailURL) {
            await uploadFile({
              file: dirtyPayload.thumbnailImage,
              contentType: dirtyPayload.thumbnailImage.type,
              signedUrl: uploadUrls.thumbnailImage.thumbnailURL,
            });
            images.thumbnailImageKey = uploadUrls.thumbnailImage.key;
          }

          const res = await editEventFinish({
            sessionId: updatedEvent.data?.sessionId,
            images,
          });
        }

        toast.success("Event updated successfully");
      } else {
        const resData = await createEventValidate(dataWithoutImage);

        const { sessionId, uploadUrls } = resData;

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
          bannerImageKey: uploadUrls.bannerImage.key,
          thumbnailImageKey: uploadUrls.thumbnailImage.key,
        });

        toast.success("Event created successfully");
      }

      reset();
      setIsModified(false);
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      navigate("/listmyshow");
    }
  }, [isSubmitted]);

  useNavigationGuard(isModified);

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
        dirtyFields={dirtyFields}
      />
    </form>
  );
};

export default CreateEventForm;
