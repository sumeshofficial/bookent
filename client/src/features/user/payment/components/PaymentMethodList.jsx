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

export default PaymentMethodList;
