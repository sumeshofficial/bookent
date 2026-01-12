const EventImages = ({ bannerImage }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mx-auto max-w-3xl">
      <div className="relative w-full aspect-video">
        <img
          src={bannerImage}
          alt="Event banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default EventImages;
