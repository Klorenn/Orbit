"use client";

import { useActionState } from "react";
import { signIn } from "@/app/auth/actions";

const initialState = { error: null as string | null };

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      try {
        await signIn(formData);
        return { error: null };
      } catch (e) {
        return { error: (e as Error).message };
      }
    },
    initialState,
  );

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-ink/60">
            Welcome back to Orbit
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-blue focus:ring-1 focus:ring-blue"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-blue focus:ring-1 focus:ring-blue"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60">
          Don&apos;t have an account?{" "}
          <a href="/auth/sign-up" className="text-blue hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </main>
  );
}
