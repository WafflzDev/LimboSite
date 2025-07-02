"use client";
import React, { useEffect, useState } from 'react'
import styles from './VictorsList.module.css'
import NavBar from './NavBar';

function getCellVictors(victors, pattern, key) {
  return victors.filter(v => v.Pattern === pattern && v.Key === key);
}

function getCellColor(colors, pattern, key) {
  const found = colors.find(c => c.Pattern === pattern && c.Key === key);
  return found ? found.Color : null;
}

function getColorHex(colorName) {
  // You can expand this map as needed
  const colorMap = {
    Yellow: "#ffd369",
    Pink: "#ff5fe7",
    Red: "#ff4242",
    Purple: "#9646ff",
    Blue: "#466fff",
    Green: "#67ff97",
    Lime: "#b0ff5d",
    Cyan: "#84fffc",
  };
  return colorMap[colorName] || colorName || "#ccc";
}

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

  // Popup state
  const [popup, setPopup] = useState({ open: false, victors: [], selected: 0, pattern: null, key: null });

  // Table dimensions
  const patterns = Array.from({ length: 15 }, (_, i) => i + 1);
  const keys = Array.from({ length: 8 }, (_, i) => i + 1);

  // Calculate colored cells per key (column) and per pattern (row)
  const coloredPerKey = keys.map(key =>
    patterns.reduce((acc, pattern) => {
      const cellVictors = getCellVictors(victors, pattern, key);
      return acc + (cellVictors.length ? 1 : 0);
    }, 0)
  );
  const coloredPerPattern = patterns.map(pattern =>
    keys.reduce((acc, key) => {
      const cellVictors = getCellVictors(victors, pattern, key);
      return acc + (cellVictors.length ? 1 : 0);
    }, 0)
  );
  const totalColored = coloredPerKey.reduce((a, b) => a + b, 0);

  // Find max for bolding
  const maxKey = Math.max(...coloredPerKey);
  const maxPattern = Math.max(...coloredPerPattern);

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

      {/* --- THE GRID TABLE --- */}
      <div style={{
        overflowX: 'auto',
        marginTop: 40,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <table
          style={{
            borderCollapse: 'collapse',
            minWidth: 900,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  background: '#000',
                  color: '#fff',
                  fontWeight: 'bold',
                  minWidth: 120,
                  border: '2px solid #000',
                  position: 'sticky',
                  left: 0,
                  zIndex: 2,
                }}
              >
                {victors.length} victors
              </th>
              {keys.map(key => (
                <th
                  key={key}
                  style={{
                    background: '#000',
                    color: '#fff',
                    fontWeight: 'bold',
                    minWidth: 90,
                    border: '2px solid #000',
                  }}
                >
                  Key {key}
                </th>
              ))}
              <th
                style={{
                  background: '#000',
                  color: '#fff',
                  fontWeight: 'bold',
                  minWidth: 90,
                  border: '2px solid #000',
                }}
              >
                Progress
              </th>
            </tr>
          </thead>
          <tbody>
            {patterns.map((pattern, rowIdx) => (
              <tr key={pattern}>
                <th
                  style={{
                    background: '#000',
                    color: '#fff',
                    fontWeight: 'bold',
                    minWidth: 120,
                    border: '2px solid #000',
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                  }}
                >
                  Pattern {pattern}
                </th>
                {keys.map((key, colIdx) => {
                  const cellVictors = getCellVictors(victors, pattern, key);
                  const cellColorName = getCellColor(colors, pattern, key);
                  const cellColor = cellVictors.length ? getColorHex(cellColorName) : "#fff";
                  const isMulti = cellVictors.length > 1;
                  const isClickable = cellVictors.length > 0;
                  return (
                    <td
                      key={key}
                      className={isClickable ? styles.clickableCell : ''}
                      style={{
                        background: cellColor,
                        color: cellVictors.length ? "#000" : "#fff",
                        border: isMulti ? '3px solid #222' : '1px solid #888',
                        fontWeight: isMulti ? 'bold' : 'normal',
                        minWidth: 90,
                        textAlign: 'center',
                        cursor: isClickable ? 'pointer' : 'default',
                        position: 'relative',
                      }}
                      title={cellVictors.length
                        ? cellVictors.map(v => v.Player).join('\n')
                        : undefined}
                      onClick={() => {
                        if (cellVictors.length) {
                          setPopup({
                            open: true,
                            victors: cellVictors,
                            selected: 0,
                            pattern,
                            key,
                            color: cellColor,
                            colorName: cellColorName,
                          });
                        }
                      }}
                      onMouseOver={e => {
                        if (cellVictors.length) {
                          e.currentTarget.setAttribute('data-tooltip', cellVictors.map(v => v.Player).join('\n'));
                        }
                      }}
                    >
                      {cellVictors.length ? (
                        <span>
                          {cellColorName}
                        </span>
                      ) : ''}
                    </td>
                  );
                })}
                {/* Patterns column */}
                <td
                  style={{
                    background: '#ddd',
                    color: '#000',
                    fontWeight: coloredPerPattern[rowIdx] === maxPattern ? 'bold' : 'normal',
                    border: '1px solid #000',
                    textAlign: 'center',
                  }}
                >
                  {coloredPerPattern[rowIdx]}/{keys.length}
                </td>
              </tr>
            ))}
            {/* Keys row at the bottom */}
            <tr>
              <th
                style={{
                  background: '#000',
                  color: '#fff',
                  fontWeight: 'bold',
                  minWidth: 120,
                  border: '2px solid #000',
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                }}
              >
                Progress
              </th>
              {coloredPerKey.map((val, idx) => (
                <td
                  key={idx}
                  style={{
                    background: '#ddd',
                    color: '#000',
                    fontWeight: val === maxKey ? 'bold' : 'normal',
                    border: '1px solid #000',
                    textAlign: 'center',
                  }}
                >
                  {val}/{patterns.length}
                </td>
              ))}
              {/* Bottom-right cell: total */}
              <td
                style={{
                  background: '#000',
                  color: '#fff',
                  fontWeight: 'bold',
                  border: '2px solid #000',
                  textAlign: 'center',
                }}
              >
                {totalColored}/{patterns.length * keys.length}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- POPUP --- */}
      {popup.open && (
        <div
          style={{
            background: popup.color || '#fff',
            color: '#000',
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setPopup({ ...popup, open: false })}
        >
          <div
            style={{
              background: '#fff',
              color: '#000',
              borderRadius: 12,
              padding: 32,
              minWidth: 320,
              maxWidth: 420,
              boxShadow: '0 4px 24px #0008',
              position: 'relative',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 24, textAlign: 'center' }}>
              Key {popup.key} / Pattern {popup.pattern}
            </div>
            <div
              style={{
                width: 80,
                height: 20,
                background: popup.color,
                borderRadius: 6,
                marginBottom: 20,
                border: '1px solid #888',
              }}
            >
              {popup.colorName}
            </div>
            {popup.victors.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
                {popup.victors.map((v, i) => (
                  <button
                    key={i}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: i === popup.selected ? '2px solid #222' : '1px solid #aaa',
                      background: i === popup.selected ? '#000' : '#fff',
                      color: i === popup.selected ? '#fff' : '#000',
                      fontWeight: i === popup.selected ? 'bold' : 'normal',
                      cursor: 'pointer',
                    }}
                    onClick={() => setPopup({ ...popup, selected: i })}
                  >
                    {v.Player}
                  </button>
                ))}
              </div>
            )}
            {/* Show selected victor info */}
            <div style={{ marginBottom: 24 }}>
              {Object.entries(popup.victors[popup.selected])
                .filter(([key]) =>
                  !['id', 'Pattern', 'Key', 'Color', 'Link'].includes(key)
                )
                .map(([key, value]) => {
                  if (key === 'Date') {
                    const d = new Date(value);
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = d.getFullYear();
                    value = `${month}/${day}/${year}`;
                  }
                  if (key === 'Attempts') {
                    if (value == null)
                      value = "Unknown"
                    else
                      value = Number(value).toLocaleString('en-US');
                  }
                  if (key === 'Enjoyment') {
                    if (value == null)
                      value = "Unknown"
                    else
                    value = Number(value) + "/10";
                  }
                  return (
                    <div key={key} style={{ marginBottom: 4 }}>
                      <span style={{ fontWeight: 'bold' }}>{key}:</span> {String(value)}
                    </div>
                  );
                })}
            </div>
            <a
              href="#"
              style={{
                display: 'block',
                margin: '0 auto',
                color: '#0070f3',
                textDecoration: 'underline',
                fontWeight: 'bold',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={e => {
                e.preventDefault();
                setPopup({ ...popup, open: false });
              }}
            >
              Close
            </a>
          </div>
        </div>
      )}
    </main>
  );
}