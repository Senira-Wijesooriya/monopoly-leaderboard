"use client";

import { Car, Dog, Cat, Sailboat, Crown, Rocket, Gem, Cherry } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TOKENS: LucideIcon[] = [Car, Dog, Cat, Sailboat, Crown, Rocket, Gem, Cherry];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function tokenFor(name: string): LucideIcon {
  return TOKENS[hashName(name) % TOKENS.length];
}

export default function TokenIcon({ name, className }: { name: string; className?: string }) {
  const Icon = tokenFor(name);
  return <Icon className={className} strokeWidth={2} />;
}
