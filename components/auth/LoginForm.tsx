"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonInput } from "@/components/ui/NeonInput";
import { NeonCard } from "@/components/ui/NeonCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
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
    <NeonCard variant="cyan" className="w-full max-w-md mx-auto" glow>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neon-cyan neon-text-cyan mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-400">Sign in to continue playing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <NeonInput
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="cyan"
        />

        <NeonInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="cyan"
        />

        {error && (
          <div className="p-3 bg-neon-red/10 border border-neon-red rounded-lg text-neon-red text-sm">
            {error}
          </div>
        )}

        <NeonButton
          type="submit"
          variant="cyan"
          className="neon-border-cyan w-full text-center justify-center items-center"
          isLoading={isLoading}
        >
          Sign In
        </NeonButton>
        
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-neon-pink hover:underline neon-text-pink"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </NeonCard>
  );
}
