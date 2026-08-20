import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

type WheelItem = { label: string; value: number };

type WheelColumnProps = {
  items: WheelItem[];
  value: number;
  onChange: (value: number) => void;
  accent: string;
  /** Bump this to force a re-center scroll (on open, or after "Now"). */
  resetSignal: number;
  itemHeight?: number;
  visibleCount?: number;
};

export default function WheelColumn({
  items,
  value,
  onChange,
  accent,
  resetSignal,
  itemHeight = 40,
  visibleCount = 5,
}: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isProgrammaticRef = useRef(false);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const padding = Math.floor(visibleCount / 2) * itemHeight;
  const height = itemHeight * visibleCount;

  // Re-center on open or external reset — not on every value change, so we
  // don't fight the user's finger mid-scroll.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const index = Math.max(
      0,
      items.findIndex((item) => item.value === valueRef.current),
    );

    isProgrammaticRef.current = true;
    container.scrollTo({ top: index * itemHeight, behavior: "auto" });

    const timeout = window.setTimeout(() => {
      isProgrammaticRef.current = false;
    }, 50);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  const handleScroll = () => {
    if (isProgrammaticRef.current) return;

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    // Debounce until scrolling settles, then read the resting position —
    // simpler and more reliable across browsers than the 'scrollend' event.
    scrollTimeoutRef.current = window.setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const index = Math.round(container.scrollTop / itemHeight);
      const clamped = Math.min(Math.max(index, 0), items.length - 1);
      const nextValue = items[clamped]?.value;

      if (nextValue !== undefined && nextValue !== valueRef.current) {
        onChange(nextValue);
      }
    }, 120);
  };

  const handleItemClick = (index: number) => {
    containerRef.current?.scrollTo({
      top: index * itemHeight,
      behavior: "smooth",
    });
  };

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        height,
        width: 56,
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        py: `${padding}px`,
      }}
    >
      {items.map((item, index) => {
        const isSelected = item.value === value;

        return (
          <Box
            key={item.value}
            onClick={() => handleItemClick(index)}
            sx={{
              height: itemHeight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scrollSnapAlign: "center",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                fontSize: isSelected ? 20 : 17,
                fontWeight: isSelected ? 700 : 400,
                color: isSelected ? accent : "text.secondary",
                opacity: isSelected ? 1 : 0.45,
                transition:
                  "opacity 0.15s ease, color 0.15s ease, font-size 0.15s ease",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
