import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

export const CommunityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quote reveal animation
  const quoteOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const quoteY = interpolate(frame, [10, 40], [40, 0], {
    extrapolateRight: "clamp",
  });

  // Stats counter animation
  const statsSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const statsOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Animated connection lines
  const lineProgress = interpolate(frame, [30, 100], [0, 1], {
    extrapolateRight: "clamp",
  });

  const stats = [
    { value: "500+", label: "Developers" },
    { value: "150+", label: "Projects" },
    { value: "12", label: "Countries" },
    { value: "50+", label: "Opportunities" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #141432 0%, #0d0d0d 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Decorative tree silhouette - abstract */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 400,
          height: 300,
          opacity: 0.08,
        }}
      >
        <svg viewBox="0 0 400 300" width="100%" height="100%">
          <path
            d="M200 300 L200 200 Q200 180 180 160 Q160 140 140 120 Q120 100 100 80 Q140 100 180 110 Q200 115 220 110 Q260 100 300 80 Q280 100 260 120 Q240 140 220 160 Q200 180 200 200"
            fill="none"
            stroke="#c9a84c"
            strokeWidth="3"
            strokeDasharray="600"
            strokeDashoffset={600 - lineProgress * 600}
          />
          <circle cx="100" cy="80" r="8" fill="#c9a84c" opacity={lineProgress > 0.3 ? 0.3 : 0} />
          <circle cx="300" cy="80" r="8" fill="#c9a84c" opacity={lineProgress > 0.5 ? 0.3 : 0} />
          <circle cx="200" cy="110" r="6" fill="#c9a84c" opacity={lineProgress > 0.7 ? 0.3 : 0} />
        </svg>
      </div>

      {/* Quote */}
      <div
        style={{
          textAlign: "center",
          maxWidth: 900,
          opacity: quoteOpacity,
          transform: `translateY(${quoteY}px)`,
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 42,
            fontWeight: 400,
            color: "#f5f0e0",
            lineHeight: 1.4,
            fontStyle: "italic",
          }}
        >
          "Bantabaa is the Mandinka word for the great tree at the center of a village — the place where elders teach, neighbors solve problems together, and travelers are welcomed."
        </p>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 18,
            color: "#c9a84c",
            marginTop: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          The original gathering place
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 60,
          marginTop: 80,
          opacity: statsOpacity,
          zIndex: 10,
        }}
      >
        {stats.map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 56,
                fontWeight: 700,
                color: "#c9a84c",
                transform: `scale(${statsSpring})`,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginTop: 8,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
