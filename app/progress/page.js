import { supabase } from '../../lib/supabaseClient';
import Progress from '../../components/Progress';

export default async function ProgressPage() {
  const [{ data: victors }, { data: colors }] = await Promise.all([
    supabase.from('victors').select('*'),
    supabase.from('colors').select('*'),
  ]);

  return <Progress victors={victors || []} colors={colors || []} />;
}