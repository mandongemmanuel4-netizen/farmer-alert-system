import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7); }
          70% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .anim-logo { animation: popIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both, floatSlow 4s ease-in-out 0.7s infinite; }
        .anim-title { animation: fadeInUp 0.6s ease-out 0.35s both; }
        .anim-tagline { animation: fadeInUp 0.6s ease-out 0.5s both; }
        .anim-subtitle { animation: fadeInUp 0.6s ease-out 0.65s both; }
        .anim-btn1 { animation: fadeInUp 0.6s ease-out 0.85s both; }
        .anim-btn2 { animation: fadeInUp 0.6s ease-out 1s both; }
      `}</style>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
        <div className="anim-logo mb-8">
          <Logo size={160} />
        </div>

        <h1 className="anim-title text-xl font-extrabold text-gray-900">
          Welcome to <span className="text-farmer">FSDAMS</span>
        </h1>
        <p className="anim-tagline text-farmer-dark font-medium mt-2 text-sm">Your safety, our priority.</p>
        <p className="anim-subtitle text-gray-400 text-xs mt-1 max-w-xs">We are here to protect you while you farm.</p>
      </div>

      <div className="space-y-3 max-w-md mx-auto w-full">
        <button
          onClick={() => navigate('/register')}
          className="anim-btn1 w-full bg-farmer hover:bg-farmer-dark active:scale-95 text-white font-semibold py-2.5 text-sm rounded-lg transition"
        >
          Register
        </button>
        <button
          onClick={() => navigate('/login')}
          className="anim-btn2 w-full border-2 border-farmer text-farmer font-semibold py-2.5 text-sm rounded-lg transition hover:bg-farmer-light/40 active:scale-95"
        >
          Login
        </button>
      </div>
    </div>
  );
}