"use client";

import Image from "next/image";
import logo from "../../public/logo.png";
import { useRouter } from "next/navigation";

const LogoAndName = () => {
  const router = useRouter();
  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => router.push("/")}
    >
      <Image
        src={logo}
        alt="logo"
        width={40}
        height={40}
        className="rounded-full"
      />
      <span className="text-xl font-semibold hidden sm:inline">
        Kirana kart
      </span>
    </div>
  );
};

export default LogoAndName;

