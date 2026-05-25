import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { HeroScene } from "./scenes/HeroScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { CommunityScene } from "./scenes/CommunityScene";
import { CtaScene } from "./scenes/CtaScene";

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0d" }}>
      <TransitionSeries>
        {/* Hero Scene: 0-120 frames (4s) */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <HeroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* Features Scene: 120-300 (6s) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <FeaturesScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 20, stiffness: 200 } })}
        />

        {/* Community Scene: 300-480 (6s) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <CommunityScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* CTA Scene: 480-660 (6s) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <CtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
