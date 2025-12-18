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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const CreateEventForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { organizer } = useSelector((store) => store.organizer);
  const [isModified, setIsModified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [updatedEventSlug, setUpdatedEventSlug] = useState(null);

  const queryClient = useQueryClient();

  const { organizerId, eventSlug } = useParams();
  const isEditMode = !!eventSlug;
  const navigate = useNavigate();

  useEffect(() => {
    if (organizer && organizerId && organizerId !== organizer._id) {
      navigate("/error");
    }
  }, [navigate, organizer, organizerId]);

  const { data, error } = useQuery({
    queryKey: ["event", eventSlug],
    queryFn: () => getEvent(eventSlug),
    enabled: isEditMode,
    retry: 1,
  });

  const eventData = data?.event;

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error("Something went wrong");
      navigate("/error");
    }
  }, [error, navigate]);

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

  const handleEventCreateMutation = useMutation({
    mutationFn: createEventFinish,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Event Created");
      queryClient.invalidateQueries(["event"]);
    },
    onError: (err) => {
      toast.dismiss();
      toast.error(err.response.data.error.message || "Something went wrong");
    },
  });

  const handleEventEditMutation = useMutation({
    mutationFn: editEventFinish,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Event updated");
      queryClient.invalidateQueries(["event"]);
    },
    onError: (err) => {
      toast.dismiss();
      toast.error(err.response.data.error.message || "Something went wrong");
    },
  });

  const onSubmit = async (data) => {
    try {
      const { bannerImage, thumbnailImage, ...dataWithoutImage } = data;

      const totalTickets = dataWithoutImage.ticketSetup.reduce(
        (sum, tier) => sum + tier.totalTickets,
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

        dirtyPayload.tags = data.tags;
        dirtyPayload.ticketSetup = dataWithoutImage.ticketSetup;

        const { bannerImage, thumbnailImage, ...newData } = dirtyPayload;

        if (bannerImage) {
          newData.bannerImage = true;
        }

        if (thumbnailImage) {
          newData.thumbnailImage = true;
        }

        const updatedEvent = await updateEvent(eventData.slug, newData);

        const uploadUrls = updatedEvent?.uploadUrls;

        if (!uploadUrls) {
          setIsModified(false);
          setIsSubmitted(true);
          return setUpdatedEventSlug(updatedEvent.event.slug);
        }

        if (uploadUrls) {
          const images = {};
          if (uploadUrls?.bannerImage?.bannerURL) {
            await uploadFile({
              file: dirtyPayload.bannerImage,
              contentType: dirtyPayload.bannerImage.type,
              signedUrl: uploadUrls.bannerImage.bannerURL,
            });
            images.bannerImageKey = uploadUrls.bannerImage.key;
          }
          if (uploadUrls?.thumbnailImage?.thumbnailURL) {
              uploadFile({
              file: dirtyPayload.thumbnailImage,
              contentType: dirtyPayload.thumbnailImage.type,
              signedUrl: uploadUrls.thumbnailImage.thumbnailURL,
            });
            images.thumbnailImageKey = uploadUrls.thumbnailImage.key;
          }

          const res = await handleEventEditMutation.mutateAsync({
            sessionId: updatedEvent?.sessionId,
            images,
          });

          setUpdatedEventSlug(res.event.slug);
        }
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

        const event = await handleEventCreateMutation.mutateAsync({
          sessionId,
          bannerImageKey: uploadUrls.bannerImage.key,
          thumbnailImageKey: uploadUrls.thumbnailImage.key,
        });

        setUpdatedEventSlug(event.slug);
      }

      setIsModified(false);
      setIsSubmitted(true);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (isSubmitted && updatedEventSlug) {
      navigate(
        `/listmyshow/organizer/${organizer._id}/event/${updatedEventSlug}`
      );
    }
  }, [isSubmitted, navigate, organizer._id, updatedEventSlug]);

  useNavigationGuard(isModified);

  const handleNextStep = async () => {
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
