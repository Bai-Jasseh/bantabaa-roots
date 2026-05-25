import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Sequence } from "remotion";

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  delay: number;
  accentColor: string;
}> = ({ icon, title, description, delay, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 150 },
  });

  const cardX = interpolate(cardSpring, [0, 1], [-100, 0], {
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateX(${cardX}px)`,
        opacity: cardOpacity,
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${accentColor}30`,
        borderRadius: 16,
        padding: "32px 28px",
        width: 380,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          fontSize: 40,
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 24,
          fontWeight: 600,
          color: "#f5f0e0",
          margin: "0 0 10px 0",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: 15,
          color: "rgba(255,255,255,0.55)",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  );
};

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const headerY = interpolate(frame, [0, 25], [30, 0], {
    extrapolateRight: "clamp",
  });

  const features = [
    {
      icon: "👤",
      title: "Developer Profiles",
      description: "Showcase your skills, projects, and story. Be visible to the world.",
      delay: 20,
      accentColor: "#c9a84c",
    },
    {
      icon: "🚀",
      title: "Project Showcase",
      description: "Share what you're building. Get feedback and find collaborators.",
      delay: 45,
      accentColor: "#e8c07a",
    },
    {
      icon: "💼",
      title: "Opportunities",
      description: "Discover jobs, contracts, grants, and mentorship opportunities.",
      delay: 70,
      accentColor: "#a0522d",
    },
    {
      icon: "🏘️",
      title: "Community Spaces",
      description: "Join discussions by domain, stage, or country. Connect with peers.",
      delay: 95,
      accentColor: "#87a878",
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0d0d0d 0%, #141432 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 50,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <p
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 14,
            color: "#c9a84c",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Everything you need
        </p>
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 48,
            fontWeight: 700,
            color: "#f5f0e0",
            margin: 0,
          }}
        >
          Built for West African developers
        </h2>
      </div>

      {/* Feature cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          maxWidth: 1400,
        }}
      >
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
