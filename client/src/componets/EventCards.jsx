import cardImg1 from "../assets/KBFS.jpg";

const EventCard = () => {
  return (
    <div className="group cursor-pointer w-full sm:w-64 h-60 sm:h-80">
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-md bg-white 
                  transition-all duration-500 ease-out transform 
                  hover:scale-105 hover:shadow-2xl"
      >
        <img
          src={cardImg1}
          alt="show"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500"
        ></div>

        <div
          className="absolute bottom-0 left-0 w-full p-3 sm:p-4 text-white opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500"
        >
          <h3 className="text-base sm:text-lg font-semibold">Card Title</h3>
          <p className="text-xs sm:text-sm text-gray-200">
            Short description goes here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
