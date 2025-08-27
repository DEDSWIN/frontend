// src/pages/register/Step3CollegeDetails.jsx
import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthUser } from "../../context/AuthUserContext";
import toast from "react-hot-toast";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

export default function Step3CollegeDetails({ next }) {
  const { currentUser, updateUser } = useAuthUser();
  const [collegeName, setCollegeName] = useState(currentUser?.college?.name || "");
  const [passingYear, setPassingYear] = useState(currentUser?.college?.passingYear || "");
  const [city, setCity] = useState(currentUser?.college?.city || "");
  const [isDisabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    if (!currentUser?.uid) {
      toast.error("User not found. Please login again.");
      return;
    }

    try {
      const collegeDetails = { name: collegeName, passingYear, city };

      await updateDoc(doc(db, "users", currentUser.uid), {
        college: collegeDetails,
        status: "3",
      });

      updateUser(currentUser.uid, { college: collegeDetails, status: "3" });
      toast.success("College details saved!");
      next();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDisabled(false); // re-enable form after error
    }

  };

  return (
    <div className="flex items-center justify-center mb-14 px-2">
      <div className="rounded-3xl shadow-2xl border p-10 w-full max-w-lg backdrop-blur-lg text-center  bg-white/80 animate-fade-in">
        {/* Heading */}
        <h3 className="text-3xl font-extrabold mb-6 bg-gradient-to-l from-[#095DB7] to-[#41D7B7] bg-clip-text text-transparent">
          Step 3: College Details
        </h3>
        <p className="text-gray-800 mb-8">Please provide your college information to continue</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
          {/* College Name */}
          <div className="relative">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="text"
              placeholder="Enter your college name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 outline-none 
                         border-2 border-transparent focus:border-blue-400 
                         focus:ring-2 focus:ring-blue-200 placeholder-gray-500"
              required
            />
          </div>

          {/* Passing Year */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="number"
              placeholder="Passing Year e.g. 2028"
              value={passingYear}
              onChange={(e) => setPassingYear(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 outline-none 
                         border-2 border-transparent focus:border-green-400 
                         focus:ring-2 focus:ring-green-200 placeholder-gray-500"
              required
            />
          </div>

          {/* City */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="text"
              placeholder="Enter city of your college"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 outline-none 
                         border-2 border-transparent focus:border-purple-400 
                         focus:ring-2 focus:ring-purple-200 placeholder-gray-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#41D7B7] to-[#095DB7] hover:from-[#095DB7] hover:to-[#41D7B7] 
                       text-white font-bold py-3 rounded-xl w-full shadow-lg transition-all duration-300 
                       transform hover:scale-105 hover:shadow-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled}
          >
            {isDisabled ? "Processing..." : "Save & Next →"} 
          </button>
        </form>
      </div>
    </div>
  );
}
