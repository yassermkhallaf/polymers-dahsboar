"use client";
import { data } from "./WorldMapObject.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useRef, useState } from "react";
import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
import VerticalBar from "./charts/vertical-bar.js";
import { useGetDashboardData } from "@/features/batches/api/use-get-dashboard-data";
gsap.registerPlugin(Draggable);
const MapDisplay = () => {
  const { from, to } = useDashboardDataContext();
  const { data: dashboardData } = useGetDashboardData({ from, to });

  const [startZooming, setStartZooming] = useState(false);
  const [activeCountry, setActiveCountry] = useState(null);
  // const [zoom, setZoom] = useState(1);
  const mapRef = useRef();
  const gRef = useRef();
  let zoom = 1;
  let pan = { x: 0, y: 0 };

  useGSAP(() => {
    focusOnCountry("Egypt", 3, 1.5);
    if (startZooming) {
      return;
    }
    gsap.fromTo(
      mapRef.current.querySelectorAll("path"),
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
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

    svg.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (startZooming) {
        return;
      }
      // zoom += e.deltaY * -0.001; // scroll up = zoom in, down = out
      // zoom = Math.min(Math.max(0.5, zoom), 10); // clamp between 0.5x and 5x
      const delta = e.deltaY;

      if (delta < 0) {
        // Scrolling up (zoom in)
        zoom += 0.1;
      } else if (zoom > 1) {
        // Scrolling down (zoom out)
        zoom -= 0.1;
      }

      gsap.to(g, {
        scale: zoom,

        transformOrigin: "50% 50%",
        ease: "power2.out",
        duration: 0.3,
      });
    });
  }, []);
  const handleMouseEnter = (e) => {
    gsap.to(e.target, {
      scale: 1.05,
      transformOrigin: "center center",
      duration: 0.3,
      fill: "#3b82f6", // blue
    });
  };
  const handleMouseLeave = (e) => {
    if (activeCountry === e.target.name) {
      return;
    }
    gsap.to(e.target, {
      scale: 1,
      duration: 0.3,
      fill: "transparent",
    });
  };
  const handleZoom = (e) => {
    gsap.to(e.target, {
      scale: 2,
      transformOrigin: "center center",
      duration: 0.6,
      ease: "power3.out",
    });
  };
  const focusOnCountry = (name, targetZoom = 5, time = 1) => {
    setStartZooming(true);
    const svg = mapRef.current;
    const g = gRef.current;
    let country = g.querySelector(`path[name="${name}"]`);
    if (!country) {
      country = g.querySelector(`path[className="${name}"]`);
    }

    if (!country) return;

    const bbox = country.getBBox();

    const svgWidth = svg.viewBox.baseVal.width;
    const svgHeight = svg.viewBox.baseVal.height;

    // Center of the country
    const countryCenterX = bbox.x + bbox.width / 2;
    const countryCenterY = bbox.y + bbox.height / 2;

    // Center of the SVG
    const svgCenterX = svgWidth / 2;
    const svgCenterY = svgHeight / 2;

    // Calculate pan so country center = svg center
    const offsetX = -400;
    const newX = svgCenterX - countryCenterX * targetZoom + offsetX;
    const newY = svgCenterY - countryCenterY * targetZoom;

    zoom = targetZoom;
    pan = { x: newX, y: newY };

    gsap.to(g, {
      scale: zoom,
      x: pan.x,
      y: pan.y,
      duration: time,
      ease: "power2.out",
      //   transformOrigin: "0 0", // important: use top-left origin
    });
    setStartZooming(false);
  };

  return (
    <div className="w-[100%] h-[100%] overflow-hidden border  relative">
      <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-gradient-to-r from-[transparent] to-slate-900/70 z-50">
        {dashboardData?.customerCountryData && (
          <VerticalBar data={dashboardData?.customerCountryData} />
        )}
      </div>
      <svg
        baseProfile="tiny"
        className="w-full h-full"
        ref={mapRef}
        fill="#7DC6E6"
        height="100%"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        version="1.2"
        viewBox="0 0 2000 857"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={gRef} fill="#7DC6E6">
          <rect width="100%" height="100%" fill="#A7D8F0" />
          {data.map((p, index) => {
            return (
              <path
                key={index}
                d={p.d}
                id={p.id !== "Unknown" ? p.id : undefined}
                name={p.name !== "Unknown" ? p.name : undefined}
                fill={activeCountry === p.name ? "#48CFCB" : "#7DC6E6"}
                // onClick={handleZoom}
                // onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
              ></path>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
export default MapDisplay;
