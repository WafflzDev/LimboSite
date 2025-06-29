import { supabase } from '../lib/supabaseClient'
import VictorsList from '../components/VictorsList'

export const revalidate = 0

export default async function HomePage() {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Supabase request timed out')), 5000)
  )

  try {
    const [{ data: victors }, { data: colors }] = await Promise.race([
      Promise.all([
        supabase.from('victors').select('*').order('id', { ascending: true }),
        supabase.from('colors').select('*'),
      ]),
      timeout,
    ])

    // Create a lookup for colors by Pattern and Key
    const colorMap = {}
    colors.forEach((colorRow) => {
      colorMap[`${colorRow.Pattern}_${colorRow.Key}`] = colorRow.Color
    })

    // Add Color to each victor
    const victorsWithColor = victors.map((victor) => ({
      ...victor,
      Color: colorMap[`${victor.Pattern}_${victor.Key}`] || '',
    }))

    return <VictorsList messages={victorsWithColor} />
  } catch (err) {
    return <div>{err.message}</div>
  }
}