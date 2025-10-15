"use client";

import SelectData from "@/components/select-data";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./Themes-toggle";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { Earth, Factory } from "lucide-react";
import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const { activePage, setActivePage } = useDashboardDataContext();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const isDark = theme === "dark";

  return (
    <div className="flex gap-3 items-center py-4 justify-between">
      <div className="flex gap-3 items-center">
        <div className="h-[90px] w-[210px] relative">
          {isMounted &&
            (isDark ? (
              <Image
                src="/elsewedy_logo_dark.png"
                alt="Logo"
                fill
                className="object-cover object-center"
              />
            ) : (
              <Image
                src="/egyplast_logo.png"
                alt="Logo"
                fill
                className="object-cover object-center"
              />
            ))}
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
      <div className="flex gap-3 items-center mx-auto">
        <Factory
          className={cn(
            "size-10 cursor-pointer",
            activePage === "production" ? "scale-125" : ""
          )}
          onClick={() => setActivePage("production")}
          style={{
            color:
              activePage === "production"
                ? "#BE2429"
                : isDark
                ? "#fff"
                : "#000",
            strokeWidth: 0.8,
          }}
        />
        <Earth
          className={cn(
            "size-10 cursor-pointer",
            activePage === "map" ? "scale-125" : ""
          )}
          onClick={() => setActivePage("map")}
          style={{
            strokeWidth: 0.8,
            color: activePage === "map" ? "#BE2429" : isDark ? "#fff" : "#000",
          }}
        />
      </div>
      <div className="flex gap-3 items-center">
        <ThemeToggle />
        <Card className="p-1">
          <CardContent className="flex gap-3 p-1">
            <SelectData method="FROM" />
            <SelectData method="TO" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NavBar;
