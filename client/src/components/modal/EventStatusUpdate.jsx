import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import useEventStatusUpdate from "../../hooks/useEventStatusUpdate";

const STATUS = ["Draft", "Published", "Postpone", "Cancelled"];

const EventStatusUpdate = ({
  closeModal: onClose,
  onSubmit,
  currentStatus,
  oldMatchDate,
}) => {
  const currentMatchDate = oldMatchDate.split("T")[0];
  const {
    status,
    setStatus,
    updatePostpone,
    updateCancel,
    buildPayload,
    isFormValid,
    error,
  } = useEventStatusUpdate(currentStatus, currentMatchDate);

  const { register, handleSubmit: handleFormSubmit } = useForm({
    defaultValues: {
      status: "",
      newMatchDate: "",
      reason: "",
    },
  });

  const onFormSubmit = async () => {
    const payload = buildPayload();
    if (!payload) return;

    try {
      await onSubmit(payload);
      toast.success("Event status updated successfully");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.error.message);
    }
  };

  return (
    <form onSubmit={handleFormSubmit(onFormSubmit)}>
      <div>
        <h2 className="text-lg font-semibold mb-4">Update Event Status</h2>

        <label className="block text-sm font-medium mb-1">Event Status</label>
        <select
          {...register("status")}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="">Select status</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {status === "Postpone" && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Old Match Date</label>
              <input
                type="date"
                value={currentMatchDate}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-sm font-medium">New Match Date</label>
              <input
                type="date"
                {...register("newMatchDate")}
                onChange={(e) => updatePostpone("newMatchDate", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Reason</label>
              <textarea
                {...register("reason")}
                onChange={(e) => updatePostpone("reason", e.target.value)}
                className="w-full border rounded px-3 py-2"
                maxLength={300}
              />
            </div>
          </div>
        )}

        {status === "Cancelled" && (
          <div className="mt-3">
            <label className="text-sm font-medium">Cancellation Reason</label>
            <textarea
              {...register("reason")}
              onChange={(e) => updateCancel(e.target.value)}
              className="w-full border rounded px-3 py-2"
              maxLength={300}
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
            type="button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-4 py-2 rounded text-white ${
              isFormValid ? "bg-black" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Update
          </button>
        </div>
      </div>
    </form>
  );
};

export default EventStatusUpdate;
