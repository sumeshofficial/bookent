import { useQuery } from "@tanstack/react-query";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { eventById } from "../../services/user";

const SeatSelectPage = () => {
  const { eventId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventById(eventId),
    retry: 1,
  });

  const stadium = data?.event?.stadium;
  const shapes = stadium?.shapes || [];

  const [selectedShape, setSelectedShape] = useState(null);

  // ARC SVG PATH FUNCTION
  const getArcPath = (x, y, innerR, outerR, startAngle, endAngle) => {
    const toRad = (deg) => (Math.PI / 180) * deg;

    const startOuterX = x + outerR * Math.cos(toRad(startAngle));
    const startOuterY = y + outerR * Math.sin(toRad(startAngle));

    const endOuterX = x + outerR * Math.cos(toRad(endAngle));
    const endOuterY = y + outerR * Math.sin(toRad(endAngle));

    const startInnerX = x + innerR * Math.cos(toRad(endAngle));
    const startInnerY = y + innerR * Math.sin(toRad(endAngle));

    const endInnerX = x + innerR * Math.cos(toRad(startAngle));
    const endInnerY = y + innerR * Math.sin(toRad(startAngle));

    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

    return `
      M ${startOuterX} ${startOuterY}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY}
      L ${startInnerX} ${startInnerY}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${endInnerX} ${endInnerY}
      Z
    `;
  };

  return (
    <div className="min-h-screen px-4 pt-4 pb-10 w-full bg-gray-100">
      {!isLoading && (
        <>
          <h1 className="text-2xl font-bold mb-6">
            {stadium.stadiumDetails.stadiumName} – Seat Selection
          </h1>

          <div className="flex flex-col lg:flex-row items-start justify-center gap-4 w-full">

            {/* LEFT SIDE — MAP */}
            <div className="w-full flex justify-center">
              <TransformWrapper minScale={0.3} maxScale={3} doubleClick={{ disabled: true }}>
                <TransformComponent>
                  <svg
                    width={900}
                    height={600}
                    style={{
                      transform: `scale(${window.innerWidth / 900 < 1 ? window.innerWidth / 900 : 1})`,
                      transformOrigin: "top left",
                    }}
                  >
                    {shapes.map((shape, index) => {
                      const ticket = data?.event?.ticketSetup?.[index];

                      const isDisabled = ticket?.availableTickets <= 0;
                      const isSelected = selectedShape?.id === shape.id;

                      const strokeColor = isSelected ? "black" : "#333";

                      // 🟦 RECTANGLE
                      if (shape.type === "rect") {
                        return (
                          <rect
                            key={shape.id}
                            x={shape.x}
                            y={shape.y}
                            width={shape.width}
                            height={shape.height}
                            fill={isDisabled ? "#d1d5db" : shape.fillColor}
                            fillOpacity={0.7}
                            stroke={strokeColor}
                            strokeWidth={isSelected ? 3 : 1}
                            onClick={() => !isDisabled && setSelectedShape(shape)}
                            style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                          />
                        );
                      }

                      // 🟣 CIRCLE
                      if (shape.type === "circle") {
                        return (
                          <circle
                            key={shape.id}
                            cx={shape.x}
                            cy={shape.y}
                            r={shape.radius}
                            fill={isDisabled ? "#d1d5db" : shape.fillColor}
                            fillOpacity={0.7}
                            stroke={strokeColor}
                            strokeWidth={isSelected ? 3 : 1}
                            onClick={() => !isDisabled && setSelectedShape(shape)}
                            style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                          />
                        );
                      }

                      // 🌓 ARC
                      if (shape.type === "arc") {
                        const startAngle = shape.rotation;
                        const endAngle = shape.rotation + shape.angle;

                        const d = getArcPath(
                          shape.x,
                          shape.y,
                          shape.innerRadius,
                          shape.outerRadius,
                          startAngle,
                          endAngle
                        );

                        return (
                          <path
                            key={shape.id}
                            d={d}
                            fill={isDisabled ? "#d1d5db" : shape.fillColor}
                            fillOpacity={0.7}
                            stroke={strokeColor}
                            strokeWidth={isSelected ? 3 : 1}
                            onClick={() => !isDisabled && setSelectedShape(shape)}
                            style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                          />
                        );
                      }

                      // 🖼 IMAGE
                      if (shape.type === "image") {
                        return (
                          <image
                            key={shape.id}
                            href={shape.imageUrl}
                            x={shape.x - shape.offsetX}
                            y={shape.y - shape.offsetY}
                            width={shape.width}
                            height={shape.height}
                            transform={`rotate(${shape.rotation}, ${shape.x}, ${shape.y})`}
                          />
                        );
                      }

                      return null;
                    })}
                  </svg>
                </TransformComponent>
              </TransformWrapper>
            </div>

            {/* RIGHT SIDE — BOOKING BOX */}
            <div className="w-full lg:w-120 border rounded-xl shadow-md bg-white p-5 h-fit sticky top-5">
              {selectedShape ? (
                <>
                  <h2 className="font-bold text-lg mb-2">{selectedShape.title}</h2>

                  <p className="text-gray-600 mb-3">
                    Available Seats:{" "}
                    {
                      data?.event?.ticketSetup?.[
                        shapes.findIndex((s) => s.id === selectedShape.id)
                      ]?.availableTickets
                    }
                    {" / "}
                    {
                      data?.event?.ticketSetup?.[
                        shapes.findIndex((s) => s.id === selectedShape.id)
                      ]?.totalTickets
                    }
                  </p>

                  <p className="text-gray-800 mb-3 font-semibold">
                    Price: ₹
                    {
                      data?.event?.ticketSetup?.[
                        shapes.findIndex((s) => s.id === selectedShape.id)
                      ]?.seatPrice
                    }
                  </p>

                  <button className="w-full py-3 bg-red-500 text-white rounded-lg text-lg font-semibold">
                    Book Now
                  </button>
                </>
              ) : (
                <p className="text-gray-500 text-center py-2">Select a section</p>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default SeatSelectPage;