const EventCard = () => {
  return (
    <div className="group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Card Image */}
        <img 
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" 
          alt="Match"
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/60 via-blue-600/80 to-blue-900/90"></div>

        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Super League Badge */}
          <div className="flex justify-center">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <div>
                  <div className="text-white text-[10px] font-bold leading-tight">SUPER LEAGUE</div>
                  <div className="text-white/90 text-[8px] leading-tight">NEPAL</div>
                </div>
              </div>
            </div>
          </div>

          {/* Teams */}
          <div className="flex justify-center items-center gap-4 my-4">
            {/* Team 1 */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800 flex items-center justify-center shadow-xl border-3 border-white">
                <span className="text-white text-xl font-black">K</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
            </div>

            {/* VS */}
            <span className="text-white text-xl font-black px-2">VS</span>

            {/* Team 2 */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 flex items-center justify-center shadow-xl border-3 border-white">
                <span className="text-white text-xl font-black">M</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
            </div>
          </div>

          {/* Match Info */}
          <div className="text-center space-y-2">
            <div className="text-white/90 text-xs font-medium">SEP 7, 2024 | TIME: 3:30 PM</div>
            <div>
              <h3 className="text-white text-xl font-black tracking-wide">LET'S KICK OFF</h3>
              <p className="text-white/80 text-xs font-medium">— AN EXCITING SEASON —</p>
            </div>
            <div className="text-white/70 text-[10px] mt-2">Dashrath Rangashala Stadium</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;