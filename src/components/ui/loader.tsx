"use client";

import { useTheme } from "next-themes";

export default function Loader() {
  const { theme } = useTheme();

  return (
    <div
      className={`flex items-center justify-center w-full h-screen bg-background transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0f1729]" : "bg-[#f8fafc]"
      }`}
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
