import { supabase } from '../lib/supabaseClient'

export const revalidate = 0

export default async function HomePage() {
  console.log('Fetching messages...')

  // Add a manual timeout to avoid indefinite hangs
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Supabase request timed out')), 5000)
  )

  try {
    const { data: messages, error } = await Promise.race([
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
      timeout,
    ])

    if (error) {
      return <div>Error fetching messages: {error.message}</div>
    }

    console.log('Messages fetched:', messages)

    return (
      <main style={{ padding: '2rem' }}>
        <h1>Messages</h1>
        <ul>
          {messages.length === 0 && <li>No messages found</li>}
          {messages.map((msg) => (
            <li key={msg.id}>
              {msg.text} — {new Date(msg.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      </main>
    )
  } catch (err) {
    return <div>{err.message}</div>
  }
}