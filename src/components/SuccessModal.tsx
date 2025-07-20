export function SimpleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
        <h2 className="text-xl font-bold text-green-700 mb-2">
          Itinerary Saved!
        </h2>
        <p className="text-gray-700 mb-4">
          Your trip details have been saved successfully.
        </p>
        <button
          onClick={onClose}
          className="bg-lochinvar text-white px-4 py-2 rounded hover:bg-teal-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}
