'use client';
import * as React from 'react';
import { motion } from 'motion/react';
import { getVariants, useAnimateIconContext, IconWrapper } from '@animate-ui/react/icons';

const animations = {
  default: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, -10, 10, -6, 6, 0],
        transition: { duration: 0.6, ease: 'easeInOut' }
      }
    },
    exclamation: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.25, 1],
        transition: { duration: 0.4, ease: 'easeOut' }
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <motion.path
        d="M12 8v4"
        variants={variants.exclamation}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M12 16h.01"
        variants={variants.exclamation}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

export function ShieldAlert(props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { ShieldAlert as ShieldAlertIcon };
