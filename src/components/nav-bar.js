"use client";

import SelectData from "@/components/select-data";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./Themes-toggle";
const NavBar = () => {
  return (
    <div className="flex gap-3 items-center py-4 justify-between">
      <div className="flex gap-3 items-center">
        <div className="h-[90px] w-[200px] relative">
          <Image
            src="/egyplast_logo.png"
            alt="Logo"
            fill
            className="object-cover object-center"
          />
        </div>
        <Separator
          orientation="vertical"
          className="mx-2 !h-[80px] !w-[1px]  !bg-gray-300"
        />
        <div className="flex flex-col font-montserrat-alternates">
          <span className="text-[#BE2429] text-xl letter-spacing-[2px] font-bold uppercase">
            Masterbatch
          </span>
          <span className="text-gray-500 font-normal ">Department </span>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <ThemeToggle />
        <Card>
          <CardContent className="flex gap-3">
            <SelectData method="FROM" />
            <SelectData method="TO" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NavBar;
