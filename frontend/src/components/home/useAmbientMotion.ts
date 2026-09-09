'use client';
import {useEffect, useRef, useState} from 'react';

export function useAmbientMotion() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduced(preference.matches);
    const updateVisibility = () => setHidden(document.hidden);
    updatePreference(); updateVisibility();
    preference.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {threshold: 0.15});
    if (root.current) observer.observe(root.current);
    return () => {observer.disconnect(); preference.removeEventListener('change', updatePreference); document.removeEventListener('visibilitychange', updateVisibility);};
  }, []);
  return {root, visible, hidden, reduced, paused, setPaused, running: visible && !hidden && !reduced && !paused};
}
