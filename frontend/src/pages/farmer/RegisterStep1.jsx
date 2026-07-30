import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterForm } from '../../context/RegisterContext';

export default function RegisterStep1() {
  const navigate = useNavigate();
  const { form, updateForm } = useRegisterForm();
  const [errors, setErrors] = useState({});

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!/^\d{10,11}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = 'Enter a valid phone number';
    if (!form.gender) newErrors.gender = 'Please select your gender';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    navigate('/register/location');
  };

  return (
    <div className="min-h-screen bg-farmer-light/30 flex flex-col px-6 py-8">
      <div className="max-w-md w-full mx-auto flex-1">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/welcome" className="text-gray-500">&larr;</Link>
          <span className="text-sm text-gray-500">Step 1 of 3</span>
        </div>

        <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6">
          <div className="w-1/3 h-1.5 bg-farmer rounded-full" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">Please enter your details</p>

        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => updateForm({ fullName: e.target.value })}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farmer"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateForm({ phone: e.target.value })}
              placeholder="0803 123 4567"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farmer"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => updateForm({ gender: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farmer bg-white"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-farmer hover:bg-farmer-dark text-white font-semibold py-3 rounded-lg mt-4 transition"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
