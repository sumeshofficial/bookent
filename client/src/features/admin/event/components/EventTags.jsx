const EventTags = ({ tags = [] }) => {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default EventTags;
