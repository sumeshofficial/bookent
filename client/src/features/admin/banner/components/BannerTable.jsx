import { useModal } from "../../../../utils/constants";
import BannerActions from "./BannerActions";
import PropTypes from "prop-types";

const BannerTable = ({ banners, onDelete, onEdit, isUpdating }) => {
  const { openModal, closeModal } = useModal();
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Banner</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {banners.map((b) => (
            <tr key={b._id} className="hover:bg-gray-50">
              <td className="p-2">
                {b.image && (
                  <img
                    src={b.image}
                    alt="Desktop banner"
                    className="h-12 w-[120px] rounded border object-cover"
                  />
                )}
              </td>

              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">
                  {b.title || "-"}
                </div>
                <div className="text-xs text-gray-500">
                  ID: {b._id.slice(-6)}
                </div>
              </td>

              <td className="px-4 py-3">
                {b.isActive ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    Inactive
                  </span>
                )}
              </td>

              <td className="px-4 py-3 text-right">
                <BannerActions
                  onDelete={() =>
                    openModal("delete-confirmation", {
                      title: "Delete Confirmation",
                      message: "Are you sure you want to delete this banner?",
                      handleDelete: onDelete,
                      closeModal,
                      id: b._id,
                    })
                  }
                  onEdit={() =>
                    openModal("create-banner", {
                      onClose: () => closeModal(),
                      onSubmit: onEdit,
                      isCreating: isUpdating,
                      initialData: {
                        _id: b._id,
                        title: b.title,
                        isActive: b.isActive,
                        image: b.image,
                        mobileImage: b.mobileImage,
                      },
                      isEdit: true,
                    })
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

BannerTable.propTypes = {
  banners: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      image: PropTypes.string,
      mobileImage: PropTypes.string,
      isActive: PropTypes.bool,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool,
};

export default BannerTable;
