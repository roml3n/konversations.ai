import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

const Navbar = () => {
  return (
    <main className="fixed container top-0 z-50 flex py-4 px-16 mx-auto justify-between items-center">
      <Image src="/logo/color-logo.svg" alt="logo" width={150} height={18} />
      <div className="flex items-center gap-4">
        <Link href="#">Product</Link>
        <Link href="#">Features</Link>
      </div>
      <Button href="#" label="Schedule a demo" variant="secondary" />
    </main>
  );
};

export default Navbar;
