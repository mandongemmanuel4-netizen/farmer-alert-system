import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import api from '../../services/api';

export default function Welcome() {
  const navigate = useNavigate();

  const [showPanic, setShowPanic] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const handlePanic = async () => {
    setSending(true);
    setMessage('');

    const sendPanic = async (gps = null) => {
      try {
        await api.post('/checkins/public-panic', {
          gps,
        });

        setMessage(
          'Emergency alert sent successfully. Help has been notified.'
        );

        setShowPanic(false);
      } catch (error) {
        console.error('Panic alert error:', error);

        setMessage(
          error?.response?.data?.message ||
            'Unable to send emergency alert. Please try again.'
        );
      } finally {
        setSending(false);
      }
    };

    /*
     * Try to get the farmer's current GPS location.
     * If GPS is unavailable or permission is denied,
     * send the panic request without GPS so the backend
     * can use the farmer's saved/last known location.
     */
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const gps = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          sendPanic(gps);
        },
        () => {
          // GPS unavailable - backend can use saved location
          sendPanic(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 30000,
        }
      );
    } else {
      sendPanic(null);
    }
  };

  const openPanicConfirmation = () => {
    setMessage('');
    setShowPanic(true);
  };

  const closePanicConfirmation = () => {
    if (sending) return;

    setShowPanic(false);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }

          70% {
            transform: scale(1.05);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        .anim-logo {
          animation:
            popIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both,
            floatSlow 4s ease-in-out 0.7s infinite;
        }

        .anim-title {
          animation: fadeInUp 0.6s ease-out 0.35s both;
        }

        .anim-tagline {
          animation: fadeInUp 0.6s ease-out 0.5s both;
        }

        .anim-subtitle {
          animation: fadeInUp 0.6s ease-out 0.65s both;
        }

        .anim-btn1 {
          animation: fadeInUp 0.6s ease-out 0.85s both;
        }

        .anim-btn2 {
          animation: fadeInUp 0.6s ease-out 1s both;
        }

        .anim-panic {
          animation: fadeInUp 0.6s ease-out 1.15s both;
        }
      `}</style>

      {/* Main Welcome Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
        <div className="anim-logo mb-8">
          <Logo size={160} />
        </div>

        <h1 className="anim-title text-xl font-extrabold text-gray-900">
          Welcome to <span className="text-farmer">FSDAMS</span>
        </h1>

        <p className="anim-tagline text-farmer-dark font-medium mt-2 text-sm">
          Your safety, our priority.
        </p>

        <p className="anim-subtitle text-gray-400 text-xs mt-1 max-w-xs">
          We are here to protect you while you farm.
        </p>
      </div>

      {/* Welcome Page Buttons */}
      <div className="space-y-3 max-w-md mx-auto w-full">

        {/* Register */}
        <button
          onClick={() => navigate('/register')}
          className="anim-btn1 w-full bg-farmer hover:bg-farmer-dark active:scale-95 text-white font-semibold py-2.5 text-sm rounded-lg transition"
        >
          Register
        </button>

        {/* Login */}
        <button
          onClick={() => navigate('/login')}
          className="anim-btn2 w-full border-2 border-farmer text-farmer font-semibold py-2.5 text-sm rounded-lg transition hover:bg-farmer-light/40 active:scale-95"
        >
          Login
        </button>

        {/* Panic / Emergency */}
        <button
          onClick={openPanicConfirmation}
          className="anim-panic w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-3 text-sm rounded-lg transition shadow-md"
        >
          🚨 Panic / Emergency
        </button>
      </div>

      {/* Panic Confirmation Modal */}
      {showPanic && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">

            {/* Emergency Icon */}
            <div className="text-center">
              <div className="text-5xl mb-3">
                🚨
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Emergency Panic Alert
              </h2>

              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Are you in an emergency?
              </p>

              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Press the button below to send an emergency alert to the
                appropriate safety responders and your emergency contacts.
              </p>
            </div>

            {/* Error / Status Message */}
            {message && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
                {message}
              </div>
            )}

            {/* Confirmation Buttons */}
            <div className="flex gap-3 mt-6">

              {/* Cancel */}
              <button
                type="button"
                onClick={closePanicConfirmation}
                disabled={sending}
                className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition hover:bg-gray-50 active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Send Alert */}
              <button
                type="button"
                onClick={handlePanic}
                disabled={sending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition active:scale-95 disabled:opacity-60"
              >
                {sending ? 'Sending...' : 'YES, SEND ALERT'}
              </button>

            </div>

            {/* Location Information */}
            <p className="text-[11px] text-gray-400 text-center mt-4">
              Your current location will be included when available.
            </p>

          </div>
        </div>
      )}
    </div>
  );
}