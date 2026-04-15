import { createServerSupabaseClient, isSupabaseConfigured } from '@/utils/supabase-server';
import { redirect } from 'next/navigation';
import DashboardClient from '../components/DashboardClient';

export default async function DashboardPage() {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuration Required</h1>
          <p className="text-gray-600">Database not configured. Please check your environment variables.</p>
        </div>
      </div>
    );
  }

  try {
    const supabase = createServerSupabaseClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      redirect('/?login=true');
    }

    // Get user's profile and products
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: userProducts } = await supabase
      .from('user_products')
      .select(`
        id,
        granted_at,
        is_active,
        products (
          id,
          name,
          description,
          type,
          features
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true);

    const { data: purchases } = await supabase
      .from('purchases')
      .select(`
        id,
        amount,
        status,
        created_at,
        items:metadata->items
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    return (
      <DashboardClient
        user={user}
        profile={profile}
        userProducts={userProducts || []}
        purchases={purchases || []}
      />
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Unavailable</h1>
          <p className="text-gray-600">Unable to load dashboard. Please try again later.</p>
        </div>
      </div>
    );
  }
}