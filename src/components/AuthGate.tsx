"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

type AuthGateProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function AuthGate({ children, fallback }: AuthGateProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  if (!user) {
    return fallback ?? <SignInPrompt />;
  }

  return <>{children}</>;
}

function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
          Sign in to continue
        </h2>
        <p className="text-zinc-600 mb-8">
          Create a free account to search problems, save ideas, and access AI-powered features.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg font-medium hover:bg-zinc-50 transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
