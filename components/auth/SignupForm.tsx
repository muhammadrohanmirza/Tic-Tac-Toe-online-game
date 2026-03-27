"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonInput } from "@/components/ui/NeonInput";
import { NeonCard } from "@/components/ui/NeonCard";
import Link from "next/link";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
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
        setIsLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign in failed. Please try logging in.");
        setIsLoading(false);
        return;
      }

      router.push("/lobby");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <NeonCard variant="pink" className="w-full max-w-md mx-auto" glow>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neon-pink neon-text-pink mb-2">
          Create Account
        </h1>
        <p className="text-gray-400">Join the Tic-Tac-Toe arena</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <NeonInput
          label="Name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          variant="pink"
        />

        <NeonInput
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="pink"
        />

        <NeonInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="pink"
        />

        <NeonInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          variant="pink"
        />

        {error && (
          <div className="p-3 bg-neon-red/10 border border-neon-red rounded-lg text-neon-red text-sm">
            {error}
          </div>
        )}
     
        <NeonButton
          type="submit"
          variant="pink"
          className="w-full text-center"
          glow={true}
          style={{ borderRadius: "4px" }}
          isLoading={isLoading}
        >
          Create Account
        </NeonButton>
      
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-neon-cyan hover:underline neon-text-cyan"
          >
            Sign In
          </Link>
        </p>
      </div>
    </NeonCard>
  );
}
