import styles from './VictorsList.module.css'

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

export default function VictorsList({ messages }) {
  return (
    <main className={styles.main} style={{ padding: '20px' }}>
      <h1>{'~ {'} The LIMBO Victors List {'} ~'}</h1>
      <table
        border="1"
        cellSpacing="0"
        className={styles.tableCenter}
      >
        <thead>
          <tr>
            <th>Player</th>
            <th>Date</th>
            <th>Attempts</th>
            <th>WorstFail</th>
            <th>Enjoyment</th>
            <th>Pattern</th>
            <th>Key</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => {
            const colorName = (msg.Color || '').charAt(0).toUpperCase() + (msg.Color || '').slice(1).toLowerCase();
            const bgColor = colorMap[colorName] || 'transparent';
            return (
              <tr key={msg.id}>
                <td>{msg.Player}</td>
                <td>{new Date(msg.Date).toLocaleString().slice(0, 10).replace(/-/g, '/')}</td>
                <td>
                  {msg.Attempts == null
                    ? ''
                    : Number(msg.Attempts).toLocaleString('en-US')}
                </td>
                <td>{msg.WorstFail}</td>
                <td>{msg.Enjoyment}</td>
                <td>{msg.Pattern}</td>
                <td>{msg.Key}</td>
                <td style={{ backgroundColor: bgColor }}>{msg.Color}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}