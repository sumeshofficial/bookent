import QRCode from "react-qr-code";

const TicketCard = ({ data }) => {
  const { event, bookingId, section, qty, totalAmount, qrData } = data;

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white flex flex-col justify-between rounded-2xl shadow-md w-full max-w-[420px] min-h-[520px] sm:min-h-[560px] overflow-hidden">
      <div>
        <div className="p-5 flex flex-col sm:flex-row gap-4 items-start">
          <img
            src={event.poster}
            alt={event.title}
            className="w-24 sm:w-25 aspect-9/16 rounded-lg object-cover mx-auto sm:mx-0"
          />
          <div className="text-center sm:text-left">
            <h2 className="font-semibold text-base leading-snug">
              {event.title}
            </h2>
            <p className="text-xs text-gray-500">{formattedDate}</p>
            <p className="text-xs text-gray-500">{event.venue}</p>
          </div>
        </div>

        <div className="relative">
          <div className="border-t-gray-300 border-t-3 border-dashed mx-4" />

          <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-200 rounded-full" />

          <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-200 rounded-full" />
        </div>
      </div>

      <div className="p-5">
        <div className="bg-gray-100 rounded-lg p-6 flex flex-col sm:flex-row gap-6 items-center justify-center">
          <div className="flex items-center justify-center bg-white p-3 rounded-lg w-[120px] h-[120px]">
            {qrData.data && <QRCode value={qrData?.data}  />}
          </div>

          <div className="flex-1 text-sm text-center flex flex-col items-center justify-center">
            <p className="text-sm">
              <span className="font-semibold">{qty}</span> tickets
            </p>
            <p className="font-semibold mt-2">{section}</p>

            <p className="text-[11px] text-gray-600 mt-3 tracking-wide">
              BOOKING ID: <span className="font-semibold">{bookingId}</span>
            </p>

            <p className="text-xs text-gray-400 mt-3">
              A confirmation is sent on e-mail
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 px-5 py-4 flex justify-between sm:justify-between font-bold text-sm">
        <span>Total</span>
        <span>$ {totalAmount}</span>
      </div>
    </div>
  );
};

export default TicketCard;
