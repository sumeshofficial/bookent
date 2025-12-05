import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CreateStadiumCanvas from "../../components/organization/createEvent/createStadium/CreateStadiumCanvas";
import { createStadiumValidationSchema } from "../../utils/validation";
import CreateStadiumInput from "../../components/organization/createEvent/createStadium/CreateStadiumForm";
import useNavigationGuard from "../../hooks/useNavigationGuard";
import { useNavigate, useParams } from "react-router-dom";
import {
  createStadium,
  getStadium,
  updateStadium,
} from "../../services/organization";
import { generateUploadUrl, uploadFile } from "../../services/s3";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CreateStadium = () => {
  const [currentPage, setCurrentPage] = useState("form");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const navigate = useNavigate();

  const { stadiumSlug } = useParams();
  const isEditMode = !!stadiumSlug;
  const { organizer } = useSelector((store) => store.organizer);

  const queryClient = useQueryClient();

  const method = useForm({
    resolver: yupResolver(createStadiumValidationSchema),
    mode: "all",
  });

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    watch,
    reset,
    control,
    getValues,
  } = method;
  const { errors, isSubmitting, dirtyFields } = formState;

  const { data, error } = useQuery({
    queryKey: ["stadium", stadiumSlug],
    queryFn: () => getStadium(stadiumSlug),
    enabled: isEditMode,
    retry: 1,
  });

  const stadiumData = data?.stadium;

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error("Something went wrong");
      navigate("/error");
    }
  }, [error, navigate]);

  useEffect(() => {
    if (stadiumData) {
      reset({
        ...stadiumData,
        ...stadiumData.stadiumDetails,
        stadiumLayout: {
          shapes: stadiumData.shapes,
          layoutImage: stadiumData.layoutImage,
        },
      });
      setIsModified(false);
    }
  }, [stadiumData, reset]);

  useEffect(() => {
    const sub = watch(() => setIsModified(true));
    return () => sub.unsubscribe();
  }, [watch]);

  useNavigationGuard(isModified && !isSubmitted);

  const extractDirty = (dirty, values) => {
    const output = {};

    for (const key in dirty) {
      if (dirty[key] === true) {
        output[key] = values[key];
      } else if (typeof dirty[key] === "object" && dirty[key] !== null) {
        output[key] = extractDirty(dirty[key], values[key]);
      }
    }

    return output;
  };

  const handleShapeUpload = async (shapes) => {
    return Promise.all(
      shapes.map(async (shape) => {
        if (shape.image instanceof File || shape.image instanceof Blob) {
          const req = await generateUploadUrl({
            fileName: `shape-${shape.id}.png`,
            contentType: shape.image.type,
            folderName: "stadium/shapes",
          });

          await uploadFile({
            signedUrl: req.signedUrl,
            file: shape.image,
            contentType: shape.image.type,
          });

          return { ...shape, imageKey: req.key };
        }
        return shape;
      })
    );
  };

  const handleLayoutUpload = async (layoutImage) => {
    const req = await generateUploadUrl({
      fileName: `stadium-layout-${Date.now()}.png`,
      contentType: layoutImage.type || "image/png",
      folderName: "stadium/layouts",
    });

    await uploadFile({
      signedUrl: req.signedUrl,
      file: layoutImage,
      contentType: layoutImage.type || "image/png",
    });

    return req.key;
  };

  const handleStadiumCreateMutation = useMutation({
    mutationFn: createStadium,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Stadium Created");
      queryClient.invalidateQueries(["stadium"]);
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      toast.error("Something went wrong");
    },
  });

  const handleCreateStadium = async (values, organizer) => {
    const { shapes, layoutImage } = values.stadiumLayout;

    const uploadedShapes = await handleShapeUpload(shapes);
    const layoutImageKey = await handleLayoutUpload(layoutImage);

    const capacity = uploadedShapes
      .filter((shape) => shape.type !== "image")
      .reduce((sum, shape) => sum + shape.capacity, 0);

    const payload = {
      organizerId: organizer._id,
      stadiumDetails: {
        stadiumName: values.stadiumName,
        address: values.address,
        city: values.city,
        state: values.state,
        stateCode: values.stateCode,
        pincode: values.pincode,
        location: values.location,
        capacity,
      },
      shapes: uploadedShapes,
      layoutImageKey,
    };

    const stadium = await handleStadiumCreateMutation.mutateAsync({
      payload,
    });

    toast.success("Stadium Created Successfully");
    navigate(`/listmyshow/stadium/${stadium.slug}`);
  };

  const handleStadiumEditMutation = useMutation({
    mutationFn: updateStadium,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Stadium updated");
      queryClient.invalidateQueries(["stadium"]);
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      toast.error("Something went wrong");
    },
  });

  const onSubmit = async () => {
    try {
      const allValues = getValues();
      const dirty = extractDirty(dirtyFields, allValues);

      if (!isEditMode) {
        await handleCreateStadium(allValues, organizer);
        return;
      }

      if (Object.keys(dirty).length === 0) {
        toast("No changes to update");
        return;
      }

      const patchPayload = {};

      if (
        dirty.stadiumName ||
        dirty.address ||
        dirty.city ||
        dirty.state ||
        dirty.stateCode ||
        dirty.pincode ||
        dirty.location
      ) {
        const oldDetails = stadiumData.stadiumDetails;
        patchPayload.stadiumDetails = {
          stadiumName: dirty.stadiumName ?? oldDetails.stadiumName,
          address: dirty.address ?? oldDetails.address,
          city: dirty.city ?? oldDetails.city,
          state: dirty.state ?? oldDetails.state,
          stateCode: dirty.stateCode ?? oldDetails.stateCode,
          pincode: dirty.pincode ?? oldDetails.pincode,
          location: dirty.location ?? oldDetails.location,
          capacity: stadiumData.stadiumDetails.capacity,
        };
      }

      if (dirty.stadiumLayout) {
        patchPayload.stadiumLayout = {};

        if (dirty.stadiumLayout.shapes) {
          let updatedShapes = dirty.stadiumLayout.shapes;

          updatedShapes = await handleShapeUpload(updatedShapes);

          patchPayload.stadiumLayout.shapes = updatedShapes;

          const capacity = updatedShapes
            .filter((s) => s.type !== "image")
            .reduce((sum, s) => sum + s.capacity, 0);

          if (!patchPayload.stadiumDetails) {
            patchPayload.stadiumDetails = { ...stadiumData.stadiumDetails };
          }

          patchPayload.stadiumDetails.capacity = capacity;
        }

        if (dirty.stadiumLayout.layoutImage) {
          const layoutKey = await handleLayoutUpload(
            dirty.stadiumLayout.layoutImage
          );

          patchPayload.layoutImageKey = layoutKey;
        }
      }

      const res = await handleStadiumEditMutation.mutateAsync({
        stadiumId: stadiumData._id,
        payload: patchPayload,
      });

      setIsSubmitted(true);
      navigate(`/listmyshow/stadium/${res.stadium.slug}`);
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  return (
    <div>
      <div className="w-11/12 mx-auto my-2">
        {currentPage === "form" ? (
          <CreateStadiumInput
            register={register}
            errors={errors}
            setCurrentPage={setCurrentPage}
            watch={watch}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
            control={control}
            setValue={setValue}
            stadiumData={stadiumData}
            dirtyFields={dirtyFields}
          />
        ) : (
          <CreateStadiumCanvas
            setValue={setValue}
            setCurrentPage={setCurrentPage}
            watch={watch}
          />
        )}
      </div>
    </div>
  );
};

export default CreateStadium;
