import Pagination from "../../../sharedComponents/Pagination";
import BannerFilters from "./components/BannerFilters";
import BannerSkeleton from "./components/BannerSkeleton";
import BannerTable from "./components/BannerTable";
import { useBanners } from "./hooks/useBanners";
import BannersNotFound from "./components/BannersNotFound";
import CreateBannerButton from "./components/CreateBannerButton";
import { generateUploadUrl } from "../../../services/s3";
import axios from "axios";
import toast from "react-hot-toast";
import { useModal } from "../../../utils/constants";

const Banner = () => {
  const {
    data,
    isLoading,
    isMutating,
    createBanner,
    deleteBanner,
    updateParam,
  } = useBanners();
  const { closeModal } = useModal();

  const onSubmit = async (formData) => {
    try {
      const payload = { ...formData };

      if (formData.image) {
        const file = formData.image;
        const { key, signedUrl } = await generateUploadUrl({
          fileName: file.name,
          contentType: file.type,
          folderName: "banners",
        });

        console.log(key, signedUrl)

        await axios.put(signedUrl, file);
        payload.image = key;
      }

      if (formData.mobileImage) {
        const file = formData.mobileImage;
        const { key, signedUrl } = await generateUploadUrl({
          fileName: file.name,
          contentType: file.type,
          folderName: "banners",
        });

        await axios.put(signedUrl, file);
        payload.mobileImage = key;
      }

      createBanner(payload);
      closeModal();
    } catch (error) {
      toast.error(`Banner create failed ${error.message}`);
    }
  };

  if (isLoading) return <BannerSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Banner Management</h1>
        <CreateBannerButton onSubmit={onSubmit} isMutating={isMutating} />
      </div>

      <BannerFilters updateParam={updateParam} />

      {data?.data.length === 0 ? (
        <BannersNotFound />
      ) : (
        <BannerTable banners={data.data} onDelete={deleteBanner} />
      )}

      <Pagination meta={data.meta} />
    </div>
  );
};

export default Banner;
