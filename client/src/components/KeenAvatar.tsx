/**
 * KEEN brand avatar (Brief F2) — the official faceted-arrow badge, never a
 * human face (an AI agent must not look like a person). `online` renders the
 * variant with the green presence dot. Falls back to a "K" monogram if the
 * asset is missing so nothing ever shows broken.
 */
import { useState } from "react";

export default function KeenAvatar({
  size = 40,
  online = false,
}: {
  size?: number;
  online?: boolean;
}) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div
        className="rounded-full bg-[#00D4FF]/20 border-2 border-[#00D4FF]/50 flex items-center justify-center text-[#00D4FF] font-black"
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        aria-hidden="true"
      >
        K
      </div>
    );
  }

  const src = online
    ? "/keen-brand-online-128.png"
    : size > 128
      ? "/keen-brand-256.png"
      : size > 64
        ? "/keen-brand-128.png"
        : "/keen-brand-64.png";

  return (
    <img
      src={src}
      alt="KEEN — LeadPrime AI agent"
      width={size}
      height={size}
      loading="lazy"
      className="rounded-full object-contain"
      style={{ width: size, height: size }}
      onError={() => setBroken(true)}
    />
  );
}
