import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import RectShape from "./Shapes/RectShape";
import CircleShape from "./Shapes/CircleShape";
import ArcShape from "./Shapes/ArcShape";
import ImageShape from "./Shapes/ImageShape";

const SeatMap = ({
  shapes = [],
  ticketSetup = [],
  selectedShape,
  setSelectedShape,
}) => {
  const SVG_WIDTH = 900;
  const SVG_HEIGHT = 600;
  const scaleToFit = () =>
    window.innerWidth / SVG_WIDTH < 1 ? window.innerWidth / SVG_WIDTH : 1;

  return (
    <div className="w-full flex justify-center">
      <TransformWrapper
        minScale={0.3}
        maxScale={3}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent>
          <svg
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedShape(null);
            }}
            style={{
              transform: `scale(${scaleToFit()})`,
              transformOrigin: "top left",
            }}
          >
            {shapes.map((shape, index) => {
              const ticket = ticketSetup?.[index];
              const isDisabled = ticket?.availableTickets <= 0;
              const isSelected = selectedShape?.id === shape.id;

              const commonProps = {
                shape,
                ticket,
                isDisabled,
                isSelected,
                selectedShape,
                setSelectedShape,
              };

              switch (shape.type) {
                case "rect":
                  return <RectShape key={shape.id} {...commonProps} />;
                case "circle":
                  return <CircleShape key={shape.id} {...commonProps} />;
                case "arc":
                  return <ArcShape key={shape.id} {...commonProps} />;
                case "image":
                  return <ImageShape key={shape.id} {...commonProps} />;
                default:
                  return null;
              }
            })}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default SeatMap;
