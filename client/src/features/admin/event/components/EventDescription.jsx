const EventDescription = ({ description, ageRestriction, terms }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div>
        <h3 className="font-semibold mb-1">Description</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {description}
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-1">Age Restriction</h3>
        <p className="text-sm text-gray-700">
          {ageRestriction}
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-1">
          Terms & Conditions
        </h3>
        <div className="text-sm text-gray-700 space-y-2 wrap-break-word">
          {terms?.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDescription;