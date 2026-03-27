"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonInput } from "@/components/ui/NeonInput";
import { NeonCard } from "@/components/ui/NeonCard";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import * as Progress from "@radix-ui/react-progress";
import { useWindowSize } from "@/hooks/useWindowSize";

export default function SignupPage() {
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
              <span className="neon-text-pink">CREATE</span>
              <br />
              <span className="neon-text-cyan">ACCOUNT</span>
            </h1>
            <p style={{
              color: "#9ca3af",
              fontSize: isTablet ? "14px" : "18px",
              padding: isTablet ? "0 16px" : "0",
            }}>Join the arena and start playing</p>
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
          <SignupForm isMobile={isMobile} />
        </motion.div>
      </div>
    </div>
  );
}

function SignupForm({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length < 3) return { level: 0, label: "Weak", color: "#FF3131" };
    if (pwd.length < 6) return { level: 25, label: "Fair", color: "#FFD700" };
    if (pwd.length < 9) return { level: 50, label: "Good", color: "#00BFFF" };
    return { level: 100, label: "Strong", color: "#00FF41" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password too short");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create account");
        toast.error(data.message || "Failed to create account");
        setIsLoading(false);
        return;
      }

      toast.success("Account created!");

      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Account created but sign in failed");
        setIsLoading(false);
        return;
      }

      toast.success("Welcome aboard!");
      router.push("/lobby");
    } catch (err) {
      setError("Something went wrong");
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <NeonCard variant="pink" glow>
      <div style={{ textAlign: "center", marginBottom: isMobile ? "24px" : "32px" }}>
        <h1 className="neon-text-pink" style={{
          fontSize: isMobile ? "24px" : "28px",
          fontWeight: "bold",
          marginBottom: "8px",
        }}>Create Account</h1>
        <p style={{ color: "#9ca3af", fontSize: isMobile ? "13px" : "14px" }}>
          Join the Tic-Tac-Toe arena
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "12px" : "20px",
      }}>
        <NeonInput
          label="Name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          variant="pink"
          icon={<User className="w-5 h-5" />}
        />

        <NeonInput
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="pink"
          icon={<Mail className="w-5 h-5" />}
        />

        <NeonInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="pink"
          icon={<Lock className="w-5 h-5" />}
          showPasswordToggle
        />

        {password && (
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "6px" : "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: isMobile ? "11px" : "12px" }}>
              <span style={{ color: "#9ca3af" }}>Password Strength</span>
              <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
            </div>
            <Progress.Root
              style={{
                position: "relative",
                height: isMobile ? "6px" : "8px",
                backgroundColor: "#1a1a1a",
                borderRadius: "9999px",
                overflow: "hidden",
              }}
              value={passwordStrength.level}
            >
              <motion.div
                style={{
                  height: "100%",
                  backgroundColor: passwordStrength.color,
                  boxShadow: `0 0 10px ${passwordStrength.color}`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${passwordStrength.level}%` }}
                transition={{ duration: 0.3 }}
              />
            </Progress.Root>
          </div>
        )}

        <NeonInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          variant="pink"
          icon={<Lock className="w-5 h-5" />}
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
          variant="pink"
          className="w-full"
          isLoading={isLoading}
          size="lg"
          style={{ minHeight: isMobile ? "48px" : "auto" }}
        >
          Create Account
        </NeonButton>
      </form>

      <div style={{
        marginTop: isMobile ? "24px" : "32px",
        textAlign: "center",
      }}>
        <p style={{ color: "#9ca3af", fontSize: isMobile ? "13px" : "14px" }}>
          Already have an account?{" "}
          <Link href="/login" className="neon-text-cyan" style={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </NeonCard>
  );
}
