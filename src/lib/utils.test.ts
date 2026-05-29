import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names with tailwind-merge", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes via clsx", () => {
    const isActive = true;
    const result = cn("base", isActive && "active");
    expect(result).toContain("active");
    expect(result).toContain("base");
  });

  it("resolves tailwind conflicts in favor of later classes", () => {
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  it("filters falsy values", () => {
    const result = cn("visible", false && "hidden", undefined, null, 0 as unknown as string);
    expect(result).toBe("visible");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});
