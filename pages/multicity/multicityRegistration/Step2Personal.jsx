// src/pages/register/Step2Personal.jsx
import React, { useState } from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import toast from "react-hot-toast";
import { User, Calendar, Phone, MapPin } from "lucide-react";

const Step2Personal = ({ onNext, formData, setFormData }) => {
  const { currentUser, updateUser } = useAuthUser();
  const [isDisabled, setDisabled] = useState(false);
  const [localData, setLocalData] = useState({
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    dob: formData.dob || "",
    gender: formData.gender || "",
    phone: formData.phone || "",
    address: formData.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // phone restriction: only numbers, max 10
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setLocalData({ ...localData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    if (!currentUser) return toast.error("Please login first");

    if (localData.phone.length !== 10) {
      return toast.error("Phone number must be 10 digits");
    }

    try {
      setFormData({ ...formData, ...localData });

      const newStatus =
        formData.status && parseInt(formData.status) > 2
          ? formData.status
          : "2";

      await updateUser(currentUser.uid, {
        personal: {
          firstName: localData.firstName,
          lastName: localData.lastName,
          dob: localData.dob,
          gender: localData.gender,
        },
        contact: {
          phone: localData.phone,
          address: localData.address,
        },
        status: newStatus,
      });

      localStorage.setItem("uid", currentUser.uid);
      toast.success("Personal details saved!");
      onNext();
    } catch (err) {
      toast.error("Error saving personal info: " + err.message);
    } finally {
      setDisabled(false); // re-enable form after error
    }
  };

  return (
    <div className="flex items-center justify-center mb-14 px-2">
      <div className="rounded-3xl shadow-2xl border p-10 w-full max-w-lg text-center animate-fade-in  bg-white/80 backdrop-blur-lg">

        {/* Heading */}
        <h3 className="text-3xl font-extrabold mb-8 bg-gradient-to-l from-[#095DB7] to-[#41D7B7] bg-clip-text text-transparent">
          Personal Information
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">

          {/* First + Last Name */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={localData.firstName}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 outline-none border-2 border-transparent 
                           focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-500"
                required
              />
            </div>
            <div className="relative flex-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={localData.lastName}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 outline-none border-2 border-transparent 
                           focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-500"
                required
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type={localData.dob ? "date" : "text"}
              name="dob"
              placeholder="Date of Birth"
              value={localData.dob}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!localData.dob) e.target.type = "text";
              }}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 outline-none border-2 border-transparent 
               focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-500"
              required
            />
          </div>


          {/* Gender */}
          <div className="relative">
            <select
              name="gender"
              value={localData.gender}
              onChange={handleChange}
              className="w-full pl-4 pr-4 py-3 rounded-xl text-gray-700 bg-white/60 outline-none border-2 border-transparent 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number (10 digits)"
              value={localData.phone}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 outline-none border-2 border-transparent 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-500"
              required
            />
          </div>

          {/* Address */}
          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-gray-600" size={20} />
            <textarea
              name="address"
              placeholder="Address"
              value={localData.address}
              onChange={handleChange}
              rows={3}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 outline-none border-2 border-transparent 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-500 resize-none"
              required
            />
          </div>

          {/* Submit */}
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
};

export default Step2Personal;
