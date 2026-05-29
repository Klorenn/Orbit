"use client";

import { useActionState } from "react";
import { signUp } from "@/app/auth/actions";

const initialState = { error: null as string | null };

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      try {
        await signUp(formData);
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
          <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
          <p className="text-sm text-ink/60">
            Join the Orbit community
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="display_name" className="text-sm font-medium">
              Display Name
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-blue focus:ring-1 focus:ring-blue"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
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
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
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
            {isPending ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60">
          Already have an account?{" "}
          <a href="/auth/sign-in" className="text-blue hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </main>
  );
}
