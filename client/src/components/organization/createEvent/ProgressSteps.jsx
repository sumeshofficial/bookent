import PropTypes from "prop-types";
import { Check } from "lucide-react";
import React from "react";

const ProgressSteps = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: "Basic Info" },
    { number: 2, label: "Venue & Map" },
    { number: 3, label: "Match Time" },
    { number: 4, label: "Upload Media" },
    { number: 5, label: "Publish / Preview" },
  ];

  return (
    <div className="border border-gray-100 py-4 px-5 sm:py-8 sm:px-6 rounded-md bg-white">
      <div className="mx-auto max-width-6xl">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center text-center">
                <div
                  className={`rounded-full w-5 h-5 text-[10px] sm:text-base sm:w-10 sm:h-10 flex justify-center items-center ${
                    currentStep === step.number
                      ? "bg-violet-600 text-white"
                      : step.number < currentStep
                        ? "bg-violet-600"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep <= step.number ? (
                    step.number
                  ) : (
                    <Check className="text-white w-3 h-3 sm:w-5 sm:h-5" />
                  )}
                </div>
                <span
                  className={`text-[7px] sm:text-sm mt-2 ${
                    currentStep === step.number
                      ? "text-violet-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 mb-6 rounded ${
                    currentStep > step.number ? "bg-violet-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

ProgressSteps.propTypes = {
  currentStep: PropTypes.number,
};

export default ProgressSteps;

