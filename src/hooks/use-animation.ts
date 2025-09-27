// hooks/useAnimations.ts
import type { Variants } from 'framer-motion'
import { easeOut, useReducedMotion } from 'framer-motion'

export function useAnimations() {
    const prefersReduced = useReducedMotion()

    return {
        stagger: {
            initial: {},
            whileInView: { transition: { staggerChildren: prefersReduced ? 0 : 0.08 } },
        } satisfies Variants,

        fadeUp: {
            initial: { opacity: 0, y: prefersReduced ? 0 : 20 },
            whileInView: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: easeOut },
            },
        } satisfies Variants,

        fadeUpDelay: {
            initial: { opacity: 0, y: prefersReduced ? 0 : 20 },
            whileInView: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: easeOut, delay: 0.2 },
            },
        } satisfies Variants,

        scaleIn: {
            initial: { opacity: 0, scale: prefersReduced ? 1 : 0.9 },
            whileInView: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.5, ease: easeOut },
            },
        } satisfies Variants,

        slideIn: {
            initial: { opacity: 0, x: prefersReduced ? 0 : -20 },
            whileInView: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: easeOut },
            },
        } satisfies Variants,

        slideInRight: {
            initial: { opacity: 0, x: prefersReduced ? 0 : 20 },
            whileInView: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: easeOut },
            },
        } satisfies Variants,
    }
}
