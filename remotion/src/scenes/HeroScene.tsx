import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title spring animation
  const titleScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 80, mass: 1.2 },
  });

  // Subtitle fade in
  const subtitleOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Tagline fade in
  const taglineOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background circle pulse
  const circleScale = interpolate(frame, [0, 120], [0.8, 1.2], {
    extrapolateRight: "clamp",
  });
  const circleOpacity = interpolate(frame, [80, 120], [0.3, 0], {
    extrapolateRight: "clamp",
  });

  // Floating dots
  const dots = Array.from({ length: 8 }, (_, i) => {
    const delay = i * 5;
    const x = interpolate(
      frame,
      [delay, delay + 60],
      [200 + i * 180, 200 + i * 180 + Math.sin(i) * 50],
      { extrapolateRight: "clamp" }
    );
    const y = interpolate(
      frame,
      [delay, delay + 60],
      [800 - i * 60, 750 - i * 60 + Math.cos(i) * 30],
      { extrapolateRight: "clamp" }
    );
    const dotOpacity = interpolate(frame, [delay, delay + 20, delay + 50, delay + 70], [0, 0.6, 0.6, 0], {
      extrapolateRight: "clamp",
    });
    return { x, y, opacity: dotOpacity, size: 6 + i * 2 };
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #0d0d0d 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background glow circle */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)",
          transform: `scale(${circleScale})`,
          opacity: circleOpacity,
        }}
      />

      {/* Floating accent dots */}
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            borderRadius: "50%",
            backgroundColor: i % 2 === 0 ? "#c9a84c" : "#6b3a2a",
            opacity: dot.opacity,
          }}
        />
      ))}

      {/* Main title */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 120,
            fontWeight: 700,
            color: "#c9a84c",
            margin: 0,
            letterSpacing: -2,
            textShadow: "0 0 60px rgba(201,168,76,0.3)",
          }}
        >
          Bantabaa
        </h1>
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: 28,
          color: "#e8c07a",
          marginTop: 20,
          opacity: subtitleOpacity,
          letterSpacing: 8,
          textTransform: "uppercase",
          fontWeight: 300,
        }}
      >
        The Gathering Tree
      </p>

      {/* Tagline */}
      <p
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: 22,
          color: "rgba(255,255,255,0.6)",
          marginTop: 30,
          opacity: taglineOpacity,
          fontWeight: 300,
          maxWidth: 600,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        Where West African developers gather, build, and grow together
      </p>
    </AbsoluteFill>
  );
};
