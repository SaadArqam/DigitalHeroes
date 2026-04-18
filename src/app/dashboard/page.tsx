import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardContent from './dashboard-content';
import Navbar from '@/components/navbar';
import { PageContainer } from '@/components/ui/page-container';
import ScoreManager from '@/components/ScoreManager';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      
      <PageContainer className="pt-24 pb-20 space-y-24">
        {/* Core Dashboard Section (Subscription, Draws, Charity) */}
        <DashboardContent />

        {/* Unified Score Performance Management */}
        <section className="max-w-7xl mx-auto px-4">
           <div className="bg-slate-900/20 border border-slate-800/60 p-10 lg:p-16 rounded-[4rem] backdrop-blur-xl group hover:border-slate-700/60 transition-colors">
              <ScoreManager />
           </div>
        </section>
      </PageContainer>
    </div>
  );
}