export const EMPTY_COUPON = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  maxDiscountAmount: "",
  minOrderAmount: "",
  startDate: "",
  expiryDate: "",
  usageLimit: "",
  isActive: true,
};

export const DUMMY_COUPONS = [
  {
    _id: "1",
    code: "WELCOME10",
    description: "Welcome offer",
    discountType: "PERCENTAGE",
    discountValue: 10,
    maxDiscountAmount: 200,
    minOrderAmount: 500,
    startDate: "2025-01-01",
    expiryDate: "2025-12-31",
    usageLimit: 100,
    usedCount: 12,
    isActive: true,
  },
  {
    _id: "2",
    code: "FLAT200",
    description: "Flat discount",
    discountType: "FLAT",
    discountValue: 200,
    minOrderAmount: 1000,
    expiryDate: "2025-09-30",
    usedCount: 4,
    usageLimit: 20,
    isActive: false,
  },
];

export const PAGE_SIZE = 10;

export const STATUS_FILTERS = [
  { label: "All Status", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

export const TYPE_FILTERS = [
  { label: "All Types", value: "ALL" },
  { label: "Percentage", value: "PERCENTAGE" },
  { label: "Flat", value: "FLAT" },
];

export const DATE_FILTERS = [
  { label: "All Dates", value: "ALL" },
  { label: "Active Now", value: "ACTIVE" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Expired", value: "EXPIRED" },
];

export const SORT_OPTIONS = [
  { label: "Newest", value: "NEWEST" },
  { label: "Expiry Date", value: "EXPIRY" },
  { label: "Most Used", value: "USAGE" },
];
