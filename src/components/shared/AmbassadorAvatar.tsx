"use client";

import { cn } from "@/lib/utils";
import type { Profile } from "@/types/forum";

type AmbassadorAvatarProps = {
  profile: Profile;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

const badgeSizeMap = {
  sm: "w-3.5 h-3.5 -bottom-0.5 -right-0.5",
  md: "w-4 h-4 -bottom-0.5 -right-0.5",
  lg: "w-5 h-5 -bottom-0.5 -right-0.5",
};

export function AmbassadorAvatar({
  profile,
  size = "md",
}: AmbassadorAvatarProps) {
  const initials = profile.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="relative inline-flex shrink-0">
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={`${profile.display_name ?? "User"} avatar`}
          className={cn(
            "rounded-full object-cover",
            sizeMap[size],
          )}
          role="img"
        />
      ) : (
        <div
          className={cn(
            "rounded-full bg-plum text-white flex items-center justify-center font-semibold",
            sizeMap[size],
          )}
        >
          {initials}
        </div>
      )}

      {/* Verified NFT badge */}
      {profile.verified_nft && (
        <span
          data-testid="verified-badge"
          className={cn(
            "absolute rounded-full bg-green-500 border-2 border-white",
            "flex items-center justify-center",
            badgeSizeMap[size],
          )}
        >
          <svg
            className="w-full h-full p-0.5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </div>
  );
}
