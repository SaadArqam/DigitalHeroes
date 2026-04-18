import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardContent from './dashboard-content';
import Navbar from '@/components/navbar';
import { PageContainer } from '@/components/ui/page-container';
import ScoreManager from '@/components/score-manager';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <PageContainer className="pt-24 pb-20 space-y-24">
        {/* Core Dashboard Section (Subscription, Draws, Charity) */}
        <DashboardContent />

        {/* Unified Score Performance Management */}
        <section className="max-w-7xl mx-auto w-full">
           <div className="bg-card/30 border border-card-border p-8 lg:p-12 rounded-[2.5rem] backdrop-blur-xl group hover:border-primary-start/30 transition-all duration-500">
              <div className="mb-12">
                 <h2 className="text-3xl font-black text-white mb-2">Performance <span className="text-gradient">Analytics</span></h2>
                 <p className="text-text-secondary text-sm">Review your historical data and entry status.</p>
              </div>
              <ScoreManager />
           </div>
        </section>
      </PageContainer>
    </main>
  );
}