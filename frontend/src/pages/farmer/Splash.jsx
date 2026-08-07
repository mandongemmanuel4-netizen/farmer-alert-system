import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/welcome'), 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-farmer-light/40 flex flex-col items-center justify-between overflow-hidden relative">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="mb-6">
          <Logo size={112} />
        </div>

        <h1 className="text-3xl font-extrabold text-farmer-dark tracking-tight">FSDAMS</h1>
        <p className="text-gray-500 text-sm mt-1 text-center">
          Farm Safety &amp; Distress<br />Alert Management System
        </p>

        {/* Loading spinner */}
        <div className="mt-10 w-8 h-8 border-4 border-farmer-light border-t-farmer rounded-full animate-spin" />
        <p className="text-gray-400 text-xs mt-3">Loading...</p>
      </div>

      {/* Decorative rolling hills, layered light -> dark green, matching mockup */}
      <div className="w-full relative h-40">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
          <path d="M0,90 C100,40 300,140 400,80 L400,160 L0,160 Z" fill="#bbf7d0" />
          <path d="M0,120 C120,70 280,150 400,100 L400,160 L0,160 Z" fill="#4ade80" />
          <path d="M0,150 C130,110 270,160 400,130 L400,160 L0,160 Z" fill="#16a34a" />
        </svg>
      </div>
    </div>
  );
}