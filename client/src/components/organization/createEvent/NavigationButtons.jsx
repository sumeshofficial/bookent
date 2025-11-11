import { ChevronLeft, ChevronRight } from "lucide-react";

const NavigationButtons = ({
  currentStep = 1,
  handleNextStep,
  handlePreviousStep,
}) => {
  return (
    <div className="border border-gray-100 py-4 px-5 sm:py-8 sm:px-6 rounded-sm sm:rounded-md bg-white">
      <div className="mx-auto max-width-6xl">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousStep}
            className={`flex justify-center items-center text-[.5rem] sm:text-base px-2 py-1.5 sm:px-6 sm:py-3 sm:gap-2 rounded-sm sm:rounded-md ${
              currentStep === 1
                ? "bg-gray-200 text-gray-500 "
                : "bg-violet-500 text-white"
            }`}
          >
            <ChevronLeft className="w-3 h-3 sm:w-5 sm:h-5" />
            Previous
          </button>
          <button
            type={currentStep === 5 ? "button" : "submit"}
            onClick={handleNextStep}
            className="flex justify-center items-center text-[.5rem] sm:text-base px-2 py-1.5 sm:px-6 sm:py-3 rounded-sm sm:rounded-md bg-violet-500 text-white"
          >
            {currentStep === 5 ? (
              "Submit"
            ) : (
              <>
                Next <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationButtons;
