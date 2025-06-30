"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './VictorsList.module.css'
import NavBar from './NavBar';

const colorMap = {
  Yellow: "#ffd369",
  Pink: "#ff5fe7",
  Red: "#ff4242",
  Purple: "#9646ff",
  Blue: "#466fff",
  Green: "#67ff97",
  Lime: "#b0ff5d",
  Cyan: "#84fffc",
}

const columns = [
  { key: 'Player', label: 'Player', type: 'text' },
  { key: 'Date', label: 'Date', type: 'date' },
  { key: 'Attempts', label: 'Attempts', type: 'number' },
  { key: 'WorstFail', label: 'Worst Fail', type: 'number' },
  { key: 'Enjoyment', label: 'Enjoyment', type: 'number' },
  { key: 'Pattern', label: 'Pattern', type: 'number' },
  { key: 'Key', label: 'Key', type: 'number' },
  { key: 'Color', label: 'Color', type: 'text' },
];

export default function VictorsList({ messages }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Columns to color dynamically
  const colorCols = ['Attempts', 'WorstFail', 'Enjoyment', 'Pattern', 'Key'];

  // Calculate min and max for each numeric column
  const minMax = {};
  colorCols.forEach(col => {
    const values = messages.map(msg => Number(msg[col])).filter(v => !isNaN(v));
    minMax[col] = {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  });

  // Filter messages based on search input (case-insensitive)
  const filteredMessages = messages.filter(msg =>
    msg.Player && msg.Player.toLowerCase().includes(search.toLowerCase())
  );

  // Sort messages based on sortColumn and sortDirection
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (!sortColumn) return 0;
    const col = columns.find(c => c.key === sortColumn);
    if (!col) return 0;

    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    if (col.type === 'number') {
      aVal = aVal == null ? -Infinity : Number(aVal);
      bVal = bVal == null ? -Infinity : Number(bVal);
    } else if (col.type === 'date') {
      aVal = aVal ? new Date(aVal).getTime() : -Infinity;
      bVal = bVal ? new Date(bVal).getTime() : -Infinity;
    } else {
      aVal = aVal ? aVal.toString().trim().toLowerCase() : '';
      bVal = bVal ? bVal.toString().trim().toLowerCase() : '';
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle header click for sorting
  function handleSort(colKey) {
    if (sortColumn !== colKey) {
      setSortColumn(colKey);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortColumn(null);
      setSortDirection('asc');
    }
  }

  // Helper to get background color for a value
  function getGrayBg(col, value) {
    if (value == null || isNaN(value)) return undefined;
    const { min, max } = minMax[col];
    if (max === min) return '#5f5f5f'; // all values are the same
    // Interpolate between white and #5f5f5f
    const percent = (value - min) / (max - min);
    const gray = Math.round(255 - percent * (255 - 95));
    return `rgb(${gray},${gray},${gray})`;
  }

  // Safe link check (prevents javascript: links)
  function isSafeLink(url) {
    try {
      const u = new URL(url, window.location.origin);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  return (
    <main className={styles.main}>
      <NavBar />
      <h1 className={styles.h1}>The LIMBO Victors List</h1>
      <div className={styles.tableWrapper}>
        <table
          border="1"
          cellSpacing="0"
          className={styles.tableCenter}
        >
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  title="Click to sort"
                >
                  {col.label}
                  {sortColumn === col.key
                    ? sortDirection === 'asc'
                      ? ' ▼'
                      : ' ▲'
                    : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedMessages.map((msg) => {
              const colorName = (msg.Color || '').charAt(0).toUpperCase() + (msg.Color || '').slice(1).toLowerCase();
              const bgColor = colorMap[colorName] || 'transparent';
              return (
                <tr key={msg.id}>
                  <td>
                    {msg.Link && isSafeLink(msg.Link) ? (
                      <a href={msg.Link} target="_blank" rel="noopener noreferrer">
                        {msg.Player}
                      </a>
                    ) : (
                      msg.Player
                    )}
                  </td>
                  <td>
                    {msg.Date ? (() => {
                      const d = new Date(msg.Date);
                      const day = String(d.getDate()).padStart(2, '0');
                      const month = String(d.getMonth() + 1).padStart(2, '0');
                      const year = d.getFullYear();
                      return `${day}/${month}/${year}`;
                    })() : ''}
                  </td>
                  <td style={{ backgroundColor: getGrayBg('Attempts', Number(msg.Attempts)) }}>
                    {msg.Attempts == null
                      ? ''
                      : Number(msg.Attempts).toLocaleString('en-US')}
                  </td>
                  <td style={{ backgroundColor: getGrayBg('WorstFail', Number(msg.WorstFail)) }}>
                    {msg.WorstFail}
                  </td>
                  <td style={{ backgroundColor: getGrayBg('Enjoyment', Number(msg.Enjoyment)) }}>
                    {msg.Enjoyment}
                  </td>
                  <td style={{ backgroundColor: getGrayBg('Pattern', Number(msg.Pattern)) }}>
                    {msg.Pattern}
                  </td>
                  <td style={{ backgroundColor: getGrayBg('Key', Number(msg.Key)) }}>
                    {msg.Key}
                  </td>
                  <td style={{ backgroundColor: bgColor }}>{msg.Color}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.searchBar} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
        <input
          id="search-player"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for player"
          style={{ padding: '4px 8px', borderRadius: 8, border: '1px solid #ccc', textAlign: 'center' }}
        />
      </div>
    </main>
  );
}