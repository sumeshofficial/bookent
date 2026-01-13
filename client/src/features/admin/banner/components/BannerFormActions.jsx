const BannerFormActions = ({ onClose, isCreating }) => (
  <div className="flex justify-end gap-2">
    <button
      type="button"
      className="px-3 py-1 border disabled:opacity-50"
      onClick={onClose}
      disabled={isCreating}
    >
      Cancel
    </button>

    <button
      type="submit"
      className="px-4 py-1 bg-black text-white disabled:opacity-50"
      disabled={isCreating}
    >
      {isCreating ? "Saving..." : "Save"}
    </button>
  </div>
);

export default BannerFormActions;
