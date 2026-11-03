'use client';
import * as React from 'react';
import { motion } from 'motion/react';
import { getVariants, useAnimateIconContext, IconWrapper } from '@animate-ui/react/icons';

const animations = {
  default: {
    group: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.12, 1],
        transition: { duration: 0.5, ease: 'easeInOut' }
      }
    },
    line: {
      initial: { pathLength: 1, opacity: 1 },
      animate: {
        pathLength: [0.3, 1],
        opacity: [0.7, 1],
        transition: { duration: 0.6, ease: 'easeOut' }
      }
    }
  }
};

function IconComponent({ size = 16, ...props }) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants.group}
      initial="initial"
      animate={controls}
      {...props}
    >
      <path d="M3 3v18h18" />
      <motion.path
        d="m19 9-5 5-4-4-3 3"
        variants={variants.line}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

export function LineChart(props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { LineChart as LineChartIcon };
