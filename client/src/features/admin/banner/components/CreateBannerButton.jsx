import { useModal } from "../../../../utils/constants";

const CreateBannerButton = ({ onSubmit, isCreating }) => {
  const { openModal, closeModal } = useModal();
  return (
    <button
      onClick={() =>
        openModal("create-banner", {
          onClose: () => closeModal(),
          onSubmit,
          isCreating
        })
      }
      className="bg-black text-white px-4 py-2 rounded"
    >
      Create Banner
    </button>
  );
};

export default CreateBannerButton;
