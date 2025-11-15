import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CreateStadiumCanvas from "../../components/organization/createEvent/createStadium/CreateStadiumCanvas";
import { createStadiumValidationSchema } from "../../utils/validation";
import CreateStadiumInput from "../../components/organization/createEvent/createStadium/CreateStadiumForm";
import useNavigationGuard from "../../hooks/useNavigationGuard";
import { useNavigate } from "react-router-dom";
import { createStadium } from "../../services/organization";
import { generateUploadUrl, uploadFile } from "../../services/s3";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useEffect } from "react";

const CreateStadium = () => {
  const [currentPage, setCurrentPage] = useState("form");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const { organizer } = useSelector((store) => store.organizer);

  const method = useForm({
    resolver: yupResolver(createStadiumValidationSchema),
    mode: "all",
  });

  const { register, handleSubmit, formState, setValue, watch } = method;
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    const sub = watch(() => setIsModified(true));
    return () => sub.unsubscribe();
  }, [watch]);

  useNavigationGuard(isModified && !isSubmitted);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const stadiumDetails = {
      stadiumName: data.stadiumName,
      capacity: data.capacity,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      location: data.location,
    };

    const { shapes, layoutImage } = data.stadiumLayout;

    let layoutImageKey = null;

    try {
      const updatedShapes = await Promise.all(
        shapes.map(async (shape) => {
          if (shape.image instanceof File || shape.image instanceof Blob) {
            const data = await generateUploadUrl({
              fileName: `shape-${shape.id}.png`,
              contentType: shape.image.type,
              folderName: "stadium/shapes",
            });

            const { signedUrl, key } = data;

            await uploadFile({
              signedUrl,
              file: shape.image,
              contentType: shape.image.type,
            });

            return {
              ...shape,
              imageKey: key,
            };
          }

          return shape;
        })
      );

      if (layoutImage) {
        const data = await generateUploadUrl({
          fileName: `stadium-layout-${Date.now()}.png`,
          contentType: layoutImage.type || "image/png",
          folderName: "stadium/layouts",
        });

        const { signedUrl, key } = data;

        await uploadFile({
          signedUrl,
          file: layoutImage,
          contentType: layoutImage.type || "image/png",
        });

        layoutImageKey = key;
      }

      const payload = {
        organizerId: organizer._id,
        stadiumDetails,
        shapes: updatedShapes,
        layoutImageKey,
      };

      const stadium = await createStadium(payload);

      setIsSubmitted(true);

      toast.success("Stadium Created Successfully");

      navigate(-1);
    } catch (error) {
      toast.error(error.message);
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
