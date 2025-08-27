// src/pages/register/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import Step1EmailPassword from "./Step1Email";
import Step2Personal from "./Step2Personal";
import Step3College from "./Step3College";
import Step4Preview from "./Step4Preview";
import Step5Success from "./Step5Success";
import { useAuthUser } from "../../context/AuthUserContext.jsx";

const steps = ["Email", "Personal", "College", "Preview", "Success"];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [anweshaId, setAnweshaId] = useState(null);

  const { currentUser } = useAuthUser();

  const next = () => setStep((prev) => prev + 1);

  useEffect(() => {
    if (!currentUser) return;

    console.log(currentUser);

    switch (currentUser.status) {
      case "1":
        setStep(2);
        break;
      case "2":
        setStep(3);
        break;
      case "3":
        setStep(4);
        break;
      case "successful":
        setAnweshaId(currentUser.anweshaId);
        setStep(5);
        break;
      default:
        setStep(1);
    }
  }, [currentUser]);

  return (
    <div className="flex items-center justify-center min-h-[100vh] bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 sm:px-6">
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border  border-white/30 p-8 w-full max-w-2xl text-white animate-fade-in">
        
        {/* Stepper Heading */}
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#41D7B7] to-[#095DB7] bg-clip-text text-transparent">
          Registration
        </h2>

        {/* Stepper Progress */}
        <div className="flex justify-between items-center mb-10 relative">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = step >= stepNumber;

            return (
              <div key={label} className="flex flex-col items-center w-full">
                {/* Circle */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold z-99
                    ${isActive ? "bg-gradient-to-r from-[#41D7B7] to-[#095DB7] text-white" : "bg-gray-300 text-gray-600"}
                  `}
                >
                  {stepNumber}
                </div>
                {/* Label */}
                <span className="mt-2 text-xs text-center">{label}</span>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 ml-20 left-[calc(20%+${index * 20}%)]  w-1/5 h-1 
                    ${isActive && step > stepNumber ? "bg-gradient-to-r from-[#41D7B7] to-[#095DB7]" : "bg-gray-400"}`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Renderer */}
        {step === 1 && (
          <Step1EmailPassword
            formData={formData}
            setFormData={setFormData}
            next={next}
          />
        )}
        {step === 2 && (
          <Step2Personal
            formData={formData}
            setFormData={setFormData}
            onNext={next}
          />
        )}
        {step === 3 && (
          <Step3College
            formData={formData}
            setFormData={setFormData}
            next={next}
          />
        )}
        {step === 4 && (
          <Step4Preview
            formData={formData}
            next={(id) => {
              setAnweshaId(id);
              setStep(5);
            }}
          />
        )}
        {step === 5 && <Step5Success anweshaId={anweshaId} />}
      </div>
    </div>
  );
}
