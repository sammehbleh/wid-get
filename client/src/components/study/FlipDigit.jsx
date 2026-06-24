import { useEffect, useRef, useState } from "react";

export default function FlipDigit({ value, className = "" }) {
  const [flip, setFlip] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setFlip(true);
      const t = setTimeout(() => setFlip(false), 350);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span key={flip ? "flipping" : "static"} className={`${flip ? "animate-flip-digit" : ""} ${className}`}>
      {value}
    </span>
  );
}
