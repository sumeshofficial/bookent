import { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  Users,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteStadium, getStadium } from "../../services/organization";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useModal } from "../../utils/constants";

const StadiumDetails = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { openModal, closeModal } = useModal();

  const { stadiumId } = useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["stadium", stadiumId],
    queryFn: () => getStadium(stadiumId),
    enabled: !!stadiumId,
    retry: 1,
  });

  if (error) {
    toast.error("Failed to load stadium");
    navigate("/error");
  }

  const stadium = data?.stadium;

  const handleStadiumDeleteMutation = useMutation({
    mutationFn: deleteStadium,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Stadium Deleted");
      queryClient.invalidateQueries(["stadium"]);
      navigate("/listmyshow/stadiums");
    },
    onError: (err) => {
      toast.dismiss();
      toast.error("Something went wrong");
    },
  });

  const handleDelete = (stadiumId) => {
    handleStadiumDeleteMutation.mutate(stadiumId);
    setMenuOpen(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="p-6 sm:px-5 sm:py-2 bg-gray-50 min-h-screen animate-pulse">
          <div className="flex items-center justify-between my-6">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              <div className="w-20 h-5 bg-gray-300 rounded"></div>
            </div>

            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>

          <div className="w-full bg-white rounded-xl shadow overflow-hidden mb-8">
            <div className="w-full h-[420px] bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white shadow rounded-xl p-6 space-y-4 h-[260px]"
              >
                <div className="w-40 h-5 bg-gray-300 rounded"></div>

                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="w-full h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-1 sm:px-5 sm:py-2 bg-gray-50 min-h-screen transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="flex gap-3"
          >
            <ChevronLeft />
            Back
          </button>
          <div className="flex items-center justify-between my-6">
            <h1 className="text-xl sm:text-4xl font-bold text-gray-800">
              {stadium?.stadiumDetails.stadiumName}
            </h1>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-200 transition"
              >
                <MoreVertical className="w-6 h-6 text-gray-700" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
                  <Link to={"edit"}>
                    <button className="flex items-center gap-2 px-4 py-2 w-full text-left text-sm hover:bg-gray-100">
                      <Pencil className="w-4 h-4 text-gray-700" />
                      Edit Stadium
                    </button>
                  </Link>

                  <button
                    onClick={() =>
                      openModal("delete-confirmation", {
                        message: "Are you sure you want to delete this stadium?",
                        handleDelete,
                        id: stadium._id,
                        closeModal,
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Stadium
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full bg-white rounded-xl shadow overflow-hidden mb-8">
            <img
              src={stadium.layoutImage}
              alt="Stadium Layout"
              className="w-full max-h-[420px] object-contain bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Stadium Details
              </h2>

              <div className="space-y-3 text-sm sm:text-base">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {stadium.stadiumDetails.stadiumName}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {stadium.stadiumDetails.address}
                </p>
                <p>
                  <span className="font-semibold">City:</span>{" "}
                  {stadium.stadiumDetails.city}
                </p>
                <p>
                  <span className="font-semibold">State:</span>{" "}
                  {stadium.stadiumDetails.state}
                </p>
                <p>
                  <span className="font-semibold">Pincode:</span>{" "}
                  {stadium.stadiumDetails.pincode}
                </p>
                <p>
                  <span className="font-semibold">Capacity:</span>{" "}
                  {stadium.stadiumDetails.capacity}
                </p>

                <a
                  href={stadium.stadiumDetails.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold underline flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4" /> View on Maps
                </a>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Organizer Info
              </h2>

              <p className="text-sm mb-4">
                <span className="font-semibold">Organizer ID:</span>{" "}
                {stadium.organizerId}
              </p>

              <h3 className="text-lg font-semibold mt-6 text-gray-700">
                Timestamps
              </h3>

              <div className="space-y-2 text-sm mt-3">
                <p className="flex items-center gap-2">
                  <Calendar size={16} className="text-purple-600" />
                  <span>
                    <span className="font-semibold">Created:</span>{" "}
                    {new Date(stadium.createdAt)?.toLocaleString()}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <Calendar size={16} className="text-purple-600" />
                  <span>
                    <span className="font-semibold">Updated:</span>{" "}
                    {new Date(stadium.updatedAt)?.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Seating Sections
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-scroll">
                {stadium.shapes
                  .filter((shape) => shape.type !== "image")
                  .map((shape) => (
                    <div
                      key={shape.id}
                      className="p-3 bg-gray-100 rounded-lg flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-800">
                        {shape.title}
                      </span>
                      <span className="text-gray-600 text-sm">
                        <Users className="inline w-4 h-4 mr-1" />
                        {shape.capacity?.toLocaleString()} seats
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StadiumDetails;
