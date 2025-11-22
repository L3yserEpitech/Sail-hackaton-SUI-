"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { WalletModal } from "@/components/WalletModal";
import { motion } from "framer-motion";

export default function AppPage() {
  const currentAccount = useCurrentAccount();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen bg-[#0a0f1e] flex items-center justify-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(78, 222, 174, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78, 222, 174, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-8"
        >
          {/* Animated Loading Icon */}
          <div className="relative w-32 h-32 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-walrus-mint/40"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border-2 border-walrus-mint/30"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-4 h-4 bg-walrus-mint rounded-full"
              />
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <p className="text-walrus-mint font-pixel text-sm tracking-widest">
              INITIALIZING SYSTEM
            </p>
            <div className="flex items-center justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 bg-walrus-mint/60"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show wallet modal if not connected
  const showWalletModal = !currentAccount;

  return (
    <div className="min-h-screen bg-[#020514] relative">
      <WalletModal isOpen={showWalletModal} />

      {/* App Content - Only visible when wallet is connected */}
      {currentAccount && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-6 py-20"
        >
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-pixel text-white tracking-wider">
              WELCOME TO SAIL
            </h1>
            <p className="text-gray-400 text-lg">
              Connected: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
            </p>
            <div className="pt-8">
              <div className="bg-walrus-mint/10 border-4 border-walrus-mint/40 p-8 max-w-2xl mx-auto">
                <p className="text-white font-pixel text-sm">
                  APP CONTENT COMING SOON
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
