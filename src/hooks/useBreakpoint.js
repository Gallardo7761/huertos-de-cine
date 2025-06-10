import { useEffect, useState } from "react";

const getBreakpoint = (width) => {
  if (width < 576) return "xs";
  if (width >= 576 && width < 768) return "sm";
  if (width >= 768 && width < 992) return "md";
  if (width >= 992 && width < 1200) return "lg";
  if (width >= 1200 && width < 1400) return "xl";
  return "xxl";
};

export default function useBootstrapBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(getBreakpoint(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}
