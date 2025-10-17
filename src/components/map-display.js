"use client";
import { data } from "./WorldMapObject.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useEffect, useRef, useState } from "react";
import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
import VerticalBar from "./charts/vertical-bar.js";
import { useGetDashboardData } from "@/features/batches/api/use-get-dashboard-data";
import { useTheme } from "next-themes";
import { ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils.js";
import CountriesBarChart from "./charts/countries-bar-chart.js";
import CountryCard from "./country-card.js";
gsap.registerPlugin(Draggable);
const countries = [
  "Egypt",
  "Algeria",
  "Guinea",
  "Syria",
  "Sudan",
  "Togo",
  "Saudi Arabia",
  "Cote d'Ivoire",
  "France",
  "United Arab Emirates",
  "Pakistan",
  "Spain",
  "Turkey",
  "Kuwait",
  "Kenya",
  "Libya",
  "Ethiopia",
  "Lebanon",
  "Oman",
  "Palestine, State of",
  "Morocco",
  "Tanzania, United Republic of",
  "Yemen",
  "Italy",
  "Portugal",
  "Romania",
  "Tunisia",
  "Brazil",
  "Jordan",
  "Ghana",
  "Cyprus",
  "Angola",
];
const MapDisplay = () => {
  const { from, to, dashboardData } = useDashboardDataContext();
  console.log(dashboardData);
  const countriesArray = dashboardData?.customerCountryData
    .filter((country) => country.customerCountry !== "Egypt")
    .map((country) => country.customerCountry);
  const [activeCountry, setActiveCountry] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [zoom, setZoom] = useState(1);
  const mapRef = useRef();
  const gRef = useRef();

  let pan = { x: 0, y: 0 };
  const tooltipRef = useRef();
  const [tooltipData, setTooltipData] = useState({
    visible: false,
    name: "",
    x: 0,
    y: 0,
  });
  useGSAP(() => {
    // focusOnCountry("Egypt", 3, 1.5);

    if (!isMounted) return;
    gsap.fromTo(
      mapRef.current.querySelectorAll("path"),
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: zoom,
        duration: 0.8,
        stagger: 0.005, // small delay per country
        ease: "power2.out",
      }
    );
    const svg = mapRef.current;
    const g = gRef.current;
    Draggable.create(g, {
      type: "x,y",
      inertia: true,
      bounds: svg, // keeps it inside
      onDrag: (e) => {
        pan.x = e.x;
        pan.y = e.y;
      },
      onThrowUpdate: (e) => {
        pan.x = e.x;
        pan.y = e.y;
      },
    });

    // svg.addEventListener("wheel", (e) => {
    //   e.preventDefault();
    //   if (startZooming) {
    //     return;
    //   }
    //   // zoom += e.deltaY * -0.001; // scroll up = zoom in, down = out
    //   // zoom = Math.min(Math.max(0.5, zoom), 10); // clamp between 0.5x and 5x
    //   const delta = e.deltaY;

    //   if (delta < 0) {
    //     // Scrolling up (zoom in)
    //     zoom += 0.1;
    //   } else if (zoom > 1) {
    //     // Scrolling down (zoom out)
    //     zoom -= 0.1;
    //   }

    //   gsap.to(g, {
    //     scale: zoom,

    //     transformOrigin: "0 0",
    //     ease: "power2.out",
    //     duration: 0.3,
    //   });
    // });
  }, []);
  const resetZoom = () => {
    gsap.to(gRef.current, {
      scale: 1,
      x: 0,
      y: 0,
      duration: 1,
      transformOrigin: "0 0",
      ease: "power2.inOut",
    });
    setZoom(1);
  };

  const handleMouseEnter = (e) => {
    const countryName =
      e.target.getAttribute("name") ||
      e.target.getAttribute("id") ||
      e.target.getAttribute("className");
    if (!countryName) return;

    setTooltipData((prev) => ({
      ...prev,
      visible: true,
      name: countryName,
    }));

    gsap.to(e.target, {
      scale: 1.05,
      transformOrigin: "center center",
      duration: 0.3,
    });
  };

  const handleMouseMove = (e) => {
    const svgRect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;

    setTooltipData((prev) => ({
      ...prev,
      x,
      y,
    }));
  };

  const handleMouseLeave = (e) => {
    gsap.to(e.target, {
      scale: 1,
      duration: 0.3,
    });
    setTooltipData((prev) => ({ ...prev, visible: false }));
  };
  const focusOnCountry = (name, targetZoom = 3, time = 1) => {
    setActiveCountry(name);
    const svg = mapRef.current;
    const g = gRef.current;
    let country =
      g.querySelector(`path[name="${name}"]`) ||
      g.querySelector(`path[className="${name}"]`) ||
      g.querySelector(`path[id="${name}"]`);
    if (!country) return;

    const bbox = country.getBBox();
    const svgWidth = svg.viewBox.baseVal.width;
    const svgHeight = svg.viewBox.baseVal.height;

    // Centers
    const countryCenterX = bbox.x + bbox.width / 2;
    const countryCenterY = bbox.y + bbox.height / 2;
    const svgCenterX = svgWidth / 2;
    const svgCenterY = svgHeight / 2;

    // Calculate pan (no manual offset)
    const newX = svgCenterX - countryCenterX * targetZoom;
    const newY = svgCenterY - countryCenterY * targetZoom;

    gsap.to(g, {
      scale: targetZoom,
      x: newX,
      y: newY,
      duration: time,
      ease: "power2.out",
      transformOrigin: "0 0", // ✅ crucial
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <div className="w-[100%] h-[80vh] flex items-center justify-center">
      <div
        className={cn(
          "w-[100%] flex-4 overflow-hidden rounded-[10px] relative ",
          isDark ? "bg-[#1E1E1E]" : "bg-white"
        )}
      >
        <button onClick={resetZoom} className="absolute bottom-2 left-2 z-50">
          <ZoomOut />
        </button>
        <svg
          baseProfile="tiny"
          className="w-full h-full"
          ref={mapRef}
          // fill="#3396D3"
          height="100%"
          stroke={isDark ? "#201E43" : "#201E43"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          style={{
            transformOrigin: "center center",
            transform: "scale(1.2)",
          }}
          version="1.2"
          viewBox="0 0 2000 1000"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            ref={gRef}
            fill={isDark ? "#E5E7EB" : "#E5E7EB"}
            style={{ transformOrigin: "center center" }}
          >
            <rect
              width="100%"
              height="100%"
              opacity={0.5}
              className="border-none"
              fill={isDark ? "#1E1E1E" : "#E5E7EB"}
            />
            {data.map((p, index) => {
              return (
                <path
                  key={index}
                  d={p.d}
                  id={p.id !== "Unknown" ? p.id : undefined}
                  name={p.name !== "Unknown" ? p.name : undefined}
                  fill={
                    activeCountry === p.name ||
                    activeCountry === p.className ||
                    activeCountry === p.id
                      ? "rgb(190,36,41)"
                      : countriesArray.includes(p.name) ||
                        countriesArray.includes(p.className) ||
                        countriesArray.includes(p.id)
                      ? isDark
                        ? "#3396D3"
                        : "#3396D3"
                      : isDark
                      ? "#323643"
                      : "#E5E7EB"
                  }
                  // onClick={handleZoom}
                  // onMouseEnter={handleMouseEnter}
                  // onMouseLeave={handleMouseLeave}
                  onMouseEnter={handleMouseEnter}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                ></path>
              );
            })}
          </g>
        </svg>
      </div>

      <div
        className="flex flex-col gap-2  h-[100%] flex-2 "
        style={{
          height: mapRef?.current?.clientHeight,
        }}
      >
        {activeCountry ? (
          <div>
            <CountryCard
              activeCountry={activeCountry}
              cardHeight={mapRef?.current?.clientHeight}
              countryCategoryData={dashboardData?.countryCategoryData.filter(
                (country) => country.country === activeCountry
              )}
              countryCustomerData={dashboardData?.countryCustomerData.filter(
                (country) => country.country === activeCountry
              )}
              onBack={() => {
                setActiveCountry(null);
                resetZoom();
              }}
            />
          </div>
        ) : (
          <CountriesBarChart
            data={dashboardData?.customerCountryData.filter(
              (country) => country.customerCountry !== "Egypt"
            )}
            onClick={(country) => {
              focusOnCountry(country);
              setActiveCountry(country);
            }}
          />
        )}
      </div>

      {tooltipData.visible && (
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none bg-black/70 text-white text-sm px-2 py-1 rounded-md z-50"
          style={{
            left: tooltipData.x,
            top: tooltipData.y,
            transform: "translate(-50%, -120%)",
            opacity: tooltipData.visible ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          {tooltipData.name}
        </div>
      )}
    </div>
  );
};
export default MapDisplay;
