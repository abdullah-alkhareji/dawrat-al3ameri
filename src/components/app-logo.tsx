"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

const AppLogo = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div>
        <Image
          src="/assets/SVG/logo-black.svg"
          alt="Logo"
          width={100}
          height={100}
          className="size-10"
          priority
        />
      </div>
    );
  }

  return (
    <div>
      <Image
        src={
          theme === "dark"
            ? "/assets/SVG/logo-white.svg"
            : "/assets/SVG/logo-black.svg"
        }
        alt="Logo"
        width={100}
        height={100}
        className="size-10"
        priority
      />
    </div>
  );
};

export default AppLogo;
