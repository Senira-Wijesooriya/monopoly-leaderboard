"use client";

import { useState } from "react";
import TokenIcon from "./TokenIcon";

export default function Avatar({
  name,
  avatarUrl,
  className,
  iconClassName,
}: {
  name: string;
  avatarUrl?: string;
  className?: string;
  iconClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (avatarUrl && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setFailed(true)}
        className={`object-cover ${className ?? ""}`}
      />
    );
  }

  return (
    <span className={`flex items-center justify-center ${className ?? ""}`}>
      <TokenIcon name={name} className={iconClassName} />
    </span>
  );
}
