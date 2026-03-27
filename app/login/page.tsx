"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonInput } from "@/components/ui/NeonInput";
import { NeonCard } from "@/components/ui/NeonCard";
import Link from "next/link";
import { Mail, Lock, X, Circle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useWindowSize } from "@/hooks/useWindowSize";

export default function LoginPage() {
  const { isMobile, isTablet, isDesktop } = useWindowSize();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      position: "relative",
      overflow: "hidden",
      backgroundColor: "#050505",
    }}>
      <Toaster position="top-right" />

      {/* Left Side - Animated (Hidden on mobile) */}
      {!isMobile && (
        <div style={{
          width: isTablet ? "35%" : "50%",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(13,13,13,0.5)",
          display: isDesktop ? "flex" : isTablet ? "flex" : "none",
        }}>
          <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />

          <motion.div
            style={{
              position: "absolute",
              top: isTablet ? "20%" : "25%",
              left: isTablet ? "20%" : "25%",
              color: "rgba(0,255,255,0.3)",
            }}
            animate={{ y: [0, -40, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <X style={{ width: isTablet ? 120 : 192, height: isTablet ? 120 : 192 }} strokeWidth={0.5} />
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              bottom: isTablet ? "20%" : "25%",
              right: isTablet ? "20%" : "25%",
              color: "rgba(255,0,255,0.3)",
            }}
            animate={{ y: [0, 40, 0], rotate: [0, -180, -360] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          >
            <Circle style={{ width: isTablet ? 120 : 192, height: isTablet ? 120 : 192 }} strokeWidth={0.5} />
          </motion.div>

          <motion.div
            style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "24px" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h1 style={{
              fontSize: isTablet ? "32px" : "48px",
              fontWeight: "bold",
              fontFamily: "monospace",
              marginBottom: "16px",
              lineHeight: 1.2,
            }}>
              <span className="neon-text-cyan">WELCOME</span>
              <br />
              <span className="neon-text-pink">BACK</span>
            </h1>
            <p style={{
              color: "#9ca3af",
              fontSize: isTablet ? "14px" : "18px",
              padding: isTablet ? "0 16px" : "0",
            }}>Ready for another round?</p>
          </motion.div>
        </div>
      )}

      {/* Right Side - Form */}
      <div style={{
        width: isMobile ? "100%" : isTablet ? "65%" : "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "20px 16px" : "24px",
      }}>
        <motion.div
          style={{ width: "100%", maxWidth: "448px" }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <LoginForm isMobile={isMobile} />
        </motion.div>
      </div>
    </div>
  );
}

function LoginForm({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Invalid email or password");
      toast.error("Invalid email or password");
      setIsLoading(false);
      return;
    }

    toast.success("Welcome back!");
    router.push("/lobby");
  };

  return (
    <NeonCard variant="cyan" glow>
      <div style={{ textAlign: "center", marginBottom: isMobile ? "24px" : "32px" }}>
        <h1 className="neon-text-cyan" style={{
          fontSize: isMobile ? "24px" : "28px",
          fontWeight: "bold",
          marginBottom: "8px",
        }}>Sign In</h1>
        <p style={{ color: "#9ca3af", fontSize: isMobile ? "13px" : "14px" }}>
          Continue your gaming journey
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "16px" : "24px",
      }}>
        <NeonInput
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="cyan"
          icon={<Mail className="w-5 h-5" />}
        />

        <NeonInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="cyan"
          icon={<Lock className="w-5 h-5" />}
          showPasswordToggle
        />

        {error && (
          <div style={{
            padding: isMobile ? "12px" : "16px",
            backgroundColor: "rgba(255,49,49,0.1)",
            border: "1px solid #FF3131",
            borderRadius: "12px",
            color: "#FF3131",
            fontSize: isMobile ? "13px" : "14px",
          }}>
            {error}
          </div>
        )}

        <NeonButton
          type="submit"
          variant="cyan"
          className="w-full"
          isLoading={isLoading}
          size="lg"
          style={{ minHeight: isMobile ? "48px" : "auto" }}
        >
          Sign In
        </NeonButton>
      </form>

      <div style={{
        marginTop: isMobile ? "24px" : "32px",
        textAlign: "center",
      }}>
        <p style={{ color: "#9ca3af", fontSize: isMobile ? "13px" : "14px" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="neon-text-pink" style={{ fontWeight: 600 }}>
            Sign Up
          </Link>
        </p>
      </div>
    </NeonCard>
  );
}
