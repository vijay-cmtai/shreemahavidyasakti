"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, CheckCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Clear authentication cookie
    document.cookie = "isLoggedIn=false; path=/; max-age=0";
    
    // Simulate logout process
    const logoutTimer = setTimeout(() => {
      setIsLoggingOut(false);
      
      // Redirect to login page after 3 seconds
      const redirectTimer = setTimeout(() => {
        router.push('/login');
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }, 1500);

    return () => clearTimeout(logoutTimer);
  }, [router]);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          {isLoggingOut ? (
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <LogOut className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Logging Out...</h1>
                <p className="text-gray-600">Please wait while we sign you out</p>
              </div>

              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Successfully Logged Out</h1>
                <p className="text-gray-600">You have been signed out of your account</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Redirecting to login page in a few seconds...
                </p>
                
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2025 Jyotish Lok. All rights reserved.
          </p>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}