import PropTypes from "prop-types";
import PaymentOptionCard from "./PaymentOptionCard";

const PaymentMethodList = ({ methods }) => {
  return (
    <div className="p-4 flex flex-col gap-3">
      {methods.map((method) => (
        <PaymentOptionCard
          key={method.id}
          logo={method.logo}
          title={method.title}
          onClick={method.onClick}
        />
      ))}
    </div>
  );
};

PaymentMethodList.propTypes = {
  methods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      logo: PropTypes.string,
      title: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    })
  ).isRequired,
};

export default PaymentMethodList;