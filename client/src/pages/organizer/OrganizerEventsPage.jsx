import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  MoreVertical,
} from "lucide-react";
import EventsCard from "../../components/organization/showEvents/EventsCard";
import { Link } from "react-router-dom";

const OrganizerEventsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showMenu, setShowMenu] = useState(null);
  const eventsPerPage = 8;

  const allEvents = [
    {
      id: 1,
      title: "India vs Pakistan - T20 World Cup Final",
      sport: "Cricket",
      stadium: "Jawaharlal Nehru Stadium",
      city: "Kochi",
      state: "Kerala",
      date: "2025-12-15",
      time: "19:00",
      totalSeats: 1250,
      bookedSeats: 890,
      price: 800,
      revenue: 712000,
      status: "Published",
      featured: true,
      createdOn: "2025-10-15",
      image:
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400",
    },
    {
      id: 2,
      title: "ISL 2025 - Kerala Blasters vs Bengaluru FC",
      sport: "Football",
      stadium: "Jawaharlal Nehru Stadium",
      city: "Kochi",
      state: "Kerala",
      date: "2025-11-20",
      time: "18:00",
      totalSeats: 2000,
      bookedSeats: 1200,
      price: 500,
      revenue: 600000,
      status: "Published",
      featured: true,
      createdOn: "2025-10-10",
      image:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400",
    },
    {
      id: 3,
      title: "PKL Season 11 - Patna Pirates vs U Mumba",
      sport: "Kabaddi",
      stadium: "Thyagaraj Sports Complex",
      city: "Delhi",
      state: "Delhi",
      date: "2025-11-25",
      time: "20:00",
      totalSeats: 800,
      bookedSeats: 450,
      price: 600,
      revenue: 270000,
      status: "Published",
      featured: false,
      createdOn: "2025-10-20",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400",
    },
    {
      id: 4,
      title: "NBA India Games - Pre-Season Match",
      sport: "Basketball",
      stadium: "Indira Gandhi Arena",
      city: "Delhi",
      state: "Delhi",
      date: "2025-12-01",
      time: "19:30",
      totalSeats: 1500,
      bookedSeats: 1100,
      price: 1200,
      revenue: 1320000,
      status: "Published",
      featured: false,
      createdOn: "2025-10-25",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
    },
    {
      id: 5,
      title: "Hockey India League - Mumbai vs Chennai",
      sport: "Hockey",
      stadium: "Shivaji Stadium",
      city: "Mumbai",
      state: "Maharashtra",
      date: "2025-11-28",
      time: "17:00",
      totalSeats: 1000,
      bookedSeats: 600,
      price: 400,
      revenue: 240000,
      status: "Published",
      featured: false,
      createdOn: "2025-10-18",
      image:
        "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=400",
    },
    {
      id: 6,
      title: "IPL 2026 - Mumbai Indians vs CSK",
      sport: "Cricket",
      stadium: "Wankhede Stadium",
      city: "Mumbai",
      state: "Maharashtra",
      date: "2026-04-10",
      time: "19:30",
      totalSeats: 2500,
      bookedSeats: 2300,
      price: 1500,
      revenue: 3450000,
      status: "Published",
      featured: true,
      createdOn: "2025-10-05",
      image:
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400",
    },
    {
      id: 7,
      title: "Pro Volleyball League - Chennai vs Kolkata",
      sport: "Volleyball",
      stadium: "Nehru Indoor Stadium",
      city: "Chennai",
      state: "Tamil Nadu",
      date: "2025-12-05",
      time: "18:30",
      totalSeats: 600,
      bookedSeats: 250,
      price: 350,
      revenue: 87500,
      status: "Draft",
      featured: false,
      createdOn: "2025-11-01",
      image:
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400",
    },
    {
      id: 8,
      title: "BWF India Open - Badminton Championship",
      sport: "Badminton",
      stadium: "KD Jadhav Indoor Hall",
      city: "Delhi",
      state: "Delhi",
      date: "2025-12-10",
      time: "10:00",
      totalSeats: 900,
      bookedSeats: 700,
      price: 700,
      revenue: 490000,
      status: "Published",
      featured: false,
      createdOn: "2025-10-12",
      image:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400",
    },
    {
      id: 9,
      title: "Ranji Trophy Final - Karnataka vs Mumbai",
      sport: "Cricket",
      stadium: "M Chinnaswamy Stadium",
      city: "Bangalore",
      state: "Karnataka",
      date: "2025-11-30",
      time: "09:30",
      totalSeats: 1800,
      bookedSeats: 800,
      price: 300,
      revenue: 240000,
      status: "Published",
      featured: false,
      createdOn: "2025-10-22",
      image:
        "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=400",
    },
    {
      id: 10,
      title: "Durand Cup - Mohun Bagan vs East Bengal",
      sport: "Football",
      stadium: "Salt Lake Stadium",
      city: "Kolkata",
      state: "West Bengal",
      date: "2025-12-08",
      time: "17:00",
      totalSeats: 3000,
      bookedSeats: 2800,
      price: 450,
      revenue: 1260000,
      status: "Published",
      featured: true,
      createdOn: "2025-10-08",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
    },
    {
      id: 11,
      title: "PKL - Bengal Warriors vs Tamil Thalaivas",
      sport: "Kabaddi",
      stadium: "Netaji Indoor Stadium",
      city: "Kolkata",
      state: "West Bengal",
      date: "2025-12-12",
      time: "20:00",
      totalSeats: 700,
      bookedSeats: 400,
      price: 550,
      revenue: 220000,
      status: "Draft",
      featured: false,
      createdOn: "2025-11-02",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400",
    },
    {
      id: 12,
      title: "India vs Australia - Test Match Day 1",
      sport: "Cricket",
      stadium: "Narendra Modi Stadium",
      city: "Ahmedabad",
      state: "Gujarat",
      date: "2026-02-20",
      time: "09:30",
      totalSeats: 5000,
      bookedSeats: 4200,
      price: 900,
      revenue: 3780000,
      status: "Published",
      featured: true,
      createdOn: "2025-10-01",
      image:
        "https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=400",
    },
  ];

  // Filter events
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.stadium.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getBookingPercentage = (booked, total) => {
    return ((booked / total) * 100).toFixed(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalStats = () => {
    const published = allEvents.filter((e) => e.status === "Published").length;
    const draft = allEvents.filter((e) => e.status === "Draft").length;
    const totalRevenue = allEvents.reduce((sum, e) => sum + e.revenue, 0);
    const totalBookings = allEvents.reduce((sum, e) => sum + e.bookedSeats, 0);
    return { published, draft, totalRevenue, totalBookings };
  };

  const stats = getTotalStats();

  const handleDelete = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      alert(`Event ${eventId} deleted!`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              My Events
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage all your sports events
            </p>
          </div>

          <Link to={'/listmyshow/event/createx'} className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold ">
            <Plus size={20} />
            Create New Event
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base w-full sm:w-auto"
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs sm:text-sm text-gray-600">
              Showing
              <span className="font-semibold">{currentEvents.length}</span> of
              <span className="font-semibold">{filteredEvents.length}</span>
              events
            </div>
          </div>
        </div>

        {/* Events List */}
        {currentEvents.length > 0 ? (
          <div className="space-y-4">
            {currentEvents.map((event, index) => (
              <EventsCard
                key={index}
                event={event}
                formatDate={formatDate}
                setShowMenu={setShowMenu}
                handleDelete={handleDelete}
                getBookingPercentage={getBookingPercentage}
                formatCurrency={formatCurrency}
                showMenu={showMenu}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12 text-center">
            <Calendar className="text-gray-400 mb-4 mx-auto" size={48} />
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              Try adjusting your search or create a new event
            </p>
            <button className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
              Create Your First Event
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-purple-600 hover:bg-purple-50"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold ${
                      currentPage === pageNumber
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700 hover:bg-purple-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className="text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-purple-600 hover:bg-purple-50"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {filteredEvents.length > 0 && (
          <div className="text-center mt-6 text-xs sm:text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerEventsPage;
