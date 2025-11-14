import { ChevronLeft, ChevronRight } from "lucide-react";

const NavigationButtons = ({
  currentStep = 1,
  handleNextStep,
  handlePreviousStep,
  isSubmitting,
}) => {
  return (
    <div className="border border-gray-100 py-4 px-5 sm:py-8 sm:px-6 rounded-sm sm:rounded-md bg-white">
      <div className="mx-auto max-width-6xl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePreviousStep}
            disabled={isSubmitting}
            className={`flex justify-center items-center disabled:bg-gray-500 text-xs sm:text-base px-2 py-2 sm:px-6 sm:py-3 sm:gap-2 rounded-sm sm:rounded-md ${
              currentStep === 1
                ? "bg-gray-200 text-gray-500 "
                : "bg-violet-500 text-white"
            }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Previous
          </button>
          <button
            type={currentStep === 5 ? "submit" : "button"}
            disabled={isSubmitting}
            onClick={handleNextStep}
            className="flex justify-center items-center text-xs sm:text-base px-2 py-2 sm:px-6 sm:py-3 rounded-sm sm:rounded-md bg-violet-500 text-white disabled:bg-gray-500"
          >
            {currentStep === 5 ? (
              isSubmitting ? (
                "Submitting..."
              ) : (
                "Submit"
              )
            ) : (
              <>
                Next <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationButtons;
