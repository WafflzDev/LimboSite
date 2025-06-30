"use client";
import React, { useEffect, useState } from 'react'
import styles from './VictorsList.module.css'
import NavBar from './NavBar';

export default function Progress({ victors = [], colors = [] }) {
  // Get unique Pattern+Key combinations from victors
  const uniqueCombos = new Set(
    victors.map(v => `${v.Pattern}_${v.Key}`)
  );
  const percent = colors.length
    ? ((uniqueCombos.size / colors.length) * 100)
    : 0;

  // Animation state
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // ms
    const end = percent;
    const stepTime = 10;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;
    let current = start;
    let step = 0;

    const interval = setInterval(() => {
      current += increment;
      step++;
      if (step >= steps) {
        setDisplayPercent(end);
        clearInterval(interval);
      } else {
        setDisplayPercent(current);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [percent]);

  return (
    <main className={styles.main}>
      <NavBar />
      <h1 className={styles.h1}>LIMBO is</h1>
      {/* Circular progress bar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}>
        <div style={{ position: 'relative', width: 180, height: 180 }}>
          <svg width={180} height={180}>
            <g transform="rotate(-90 90 90)">
              <circle
                cx={90}
                cy={90}
                r={80}
                stroke="#5f5f5f"
                strokeWidth={16}
                fill="none"
              />
              <circle
                cx={90}
                cy={90}
                r={80}
                stroke="#eee"
                strokeWidth={16}
                fill="none"
                strokeDasharray={2 * Math.PI * 80}
                strokeDashoffset={2 * Math.PI * 80 * (1 - displayPercent / 100)}
                strokeLinecap="butt" // <-- straight ends
                style={{ transition: 'stroke-dashoffset 0.2s linear' }}
              />
            </g>
          </svg>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', fontWeight: 'bold'
          }}>
            {displayPercent.toFixed(2)}%
          </div>
        </div>
      </div>
      <h1 className={styles.h1}>complete</h1>
      <div style={{ textAlign: 'center', marginTop: '1rem', color: '#888' }}>
        {uniqueCombos.size} of {colors.length} keys collected
      </div>
    </main>
  );
}