import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CTA content reveal
  const ctaSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 100, mass: 1.2 },
  });

  const ctaScale = interpolate(ctaSpring, [0, 1], [0.9, 1], {
    extrapolateRight: "clamp",
  });

  const ctaOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Button pulse
  const buttonPulse = interpolate(
    frame,
    [40, 55, 70, 85, 100, 115],
    [1, 1.05, 1, 1.05, 1, 1.05],
    { extrapolateRight: "clamp" }
  );

  // City names fade in
  const citiesOpacity = interpolate(frame, [80, 110], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo particles
  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const radius = interpolate(frame, [20 + i * 5, 60 + i * 5], [0, 200], {
      extrapolateRight: "clamp",
    });
    const px = 960 + Math.cos(angle) * radius;
    const py = 400 + Math.sin(angle) * radius;
    const pOpacity = interpolate(
      frame,
      [20 + i * 5, 35 + i * 5, 100 + i * 5, 115 + i * 5],
      [0, 0.8, 0.8, 0],
      { extrapolateRight: "clamp" }
    );
    return { x: px, y: py, opacity: pOpacity };
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
      {/* Particle ring */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: i % 2 === 0 ? "#c9a84c" : "#e8c07a",
            opacity: p.opacity,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Main CTA content */}
      <div
        style={{
          textAlign: "center",
          transform: `scale(${ctaScale})`,
          opacity: ctaOpacity,
          zIndex: 10,
        }}
      >
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 64,
            fontWeight: 700,
            color: "#f5f0e0",
            margin: "0 0 16px 0",
            lineHeight: 1.2,
          }}
        >
          Find your place
          <br />
          <span style={{ color: "#c9a84c" }}>under the tree</span>
        </h2>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 20,
            color: "rgba(255,255,255,0.6)",
            margin: "0 0 40px 0",
            maxWidth: 500,
            lineHeight: 1.6,
          }}
        >
          Join the community. Bring your work. Bring yourself.
        </p>

        {/* CTA Button */}
        <div
          style={{
            display: "inline-block",
            padding: "18px 48px",
            background: "linear-gradient(135deg, #c9a84c 0%, #e8c07a 100%)",
            borderRadius: 50,
            transform: `scale(${buttonPulse})`,
            boxShadow: "0 8px 32px rgba(201,168,76,0.3)",
          }}
        >
          <span
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: "#0d0d0d",
              letterSpacing: 1,
            }}
          >
            Join Bantabaa →
          </span>
        </div>
      </div>

      {/* Footer cities */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          textAlign: "center",
          opacity: citiesOpacity,
        }}
      >
        <p
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Banjul · Serrekunda · Dakar · Accra · Freetown · Lagos
        </p>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
            marginTop: 12,
          }}
        >
          Built under the tree, with care.
        </p>
      </div>
    </AbsoluteFill>
  );
};
