import React, { useState, useEffect } from "react";
import { Mail, Bell, ArrowRight } from "lucide-react";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 15,
  });
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center max-w-4xl mx-auto">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-6 mx-auto">
            <div className="w-8 h-8 bg-white rounded"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Coming Soon
          </h1>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          We're working hard to bring you something amazing. Stay tuned and be
          the first to know when we launch.
        </p>

        {/* Email Subscription */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <Mail className="w-5 h-5 text-gray-400 ml-4" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-500 px-4 py-4 focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              className="bg-white text-gray-900 px-6 py-4 font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
            >
              <Bell className="w-4 h-4" />
              <span>Notify Me</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Success Message */}
          {isSubscribed && (
            <div className="mt-4 p-4 bg-green-900 border border-green-700 rounded-lg text-green-300">
              ✓ Thank you! You'll be notified when we launch.
            </div>
          )}
        </div>

        {/* Bottom Links */}
        <div className="flex space-x-8 text-sm">
          <button className="text-gray-400 hover:text-white transition-colors duration-200">
            About
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200">
            Contact
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200">
            Privacy
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-gray-500 text-sm">
          © 2025 Your Company. All rights reserved.
        </div>
      </div>
    </div>
  );
}
