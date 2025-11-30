"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-background" />
    );
  }

  return (
    <div
      className={`flex items-center justify-center w-full h-screen transition-colors duration-300 bg-background`}
    >
      <div className="loader">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`box box${i}`}>
            <div></div>
          </div>
        ))}
        <div className="ground">
          <div></div>
        </div>
      </div>
    </div>
  );
}
