import Pagination from "../../../sharedComponents/Pagination";
import BannerFilters from "./components/BannerFilters";
import BannerSkeleton from "./components/BannerSkeleton";
import BannerTable from "./components/BannerTable";
import { useBanners } from "./hooks/useBanners";
import BannersNotFound from "./components/BannersNotFound";
import CreateBannerButton from "./components/CreateBannerButton";
import { useModal } from "../../../utils/constants";

const Banner = () => {
  const {
    data,
    isLoading,
    isCreating,
    isUpdating,
    createBanner,
    updateBanner,
    deleteBanner,
    updateParam,
  } = useBanners();
  const { closeModal } = useModal();

  const onSubmit = (formData) => {
    createBanner(formData);
    closeModal();
  };

  const onEdit = (formData) => {
    updateBanner(formData);
    closeModal();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Banner Management</h1>
        <CreateBannerButton onSubmit={onSubmit} isCreating={isCreating} />
      </div>

      <BannerFilters updateParam={updateParam} />

      {isLoading ? (
        <BannerSkeleton />
      ) : data?.data.length === 0 ? (
        <BannersNotFound />
      ) : (
        <BannerTable
          banners={data.data}
          onDelete={deleteBanner}
          onEdit={onEdit}
          isUpdating={isUpdating}
        />
      )}

      {!isLoading && <Pagination meta={data?.meta} />}
    </div>
  );
};

export default Banner;
