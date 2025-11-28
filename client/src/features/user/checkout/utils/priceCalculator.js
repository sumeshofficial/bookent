export const calculateGrandTotal = ({ orderAmount, bookingFee }) => {
  return +(orderAmount + bookingFee).toFixed(2);
};