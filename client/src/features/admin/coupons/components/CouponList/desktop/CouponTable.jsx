import Pagination from "../../../../../../sharedComponents/Pagination";
import { useModal } from "../../../../../../utils/constants";
import { useCouponDelete } from "../../../hooks/useCouponDelete";
import { useCouponFilters } from "../../../hooks/useCouponFilters";
import { useCouponUpdate } from "../../../hooks/useCouponUpdate";
import CouponFilters from "../CouponFilters";
import CouponEmptyState from "./CouponEmptyState";
import CouponRow from "./CouponRow";
import CouponTableHeader from "./CouponTableHeader";
import CouponTableSkeleton from "./CouponTableSkeleton";
import PropTypes from "prop-types";

const CouponTable = ({ coupons, meta, isLoading }) => {
  const { filters, setFilters } = useCouponFilters(coupons);
  const { updateCoupon, isUpdating } = useCouponUpdate();
  const { deleteCoupon } = useCouponDelete();
  const { openModal, closeModal } = useModal();

  return (
    <div>
      <CouponFilters
        filters={filters}
        setFilters={setFilters}
        onClear={() => window.location.reload()}
      />

      <table className="w-full border-collapse">
        <CouponTableHeader />

        <tbody>
          {isLoading ? (
            <CouponTableSkeleton rows={5} />
          ) : coupons.length === 0 ? (
            <CouponEmptyState />
          ) : (
            coupons.map((c) => (
              <CouponRow
                key={c._id}
                coupon={c}
                updateCoupon={updateCoupon}
                deleteCoupon={deleteCoupon}
                openModal={openModal}
                closeModal={closeModal}
                isUpdating={isUpdating}
              />
            ))
          )}
        </tbody>
      </table>

      {meta?.totalPages > 1 && <Pagination meta={meta} />}
    </div>
  );
};

CouponTable.propTypes = {
  coupons: PropTypes.arrayOf(PropTypes.object).isRequired,
  meta: PropTypes.shape({
    totalPages: PropTypes.number,
  }),
  isLoading: PropTypes.bool.isRequired,
};

export default CouponTable;
