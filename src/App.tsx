import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ProductsView } from './components/ProductsView';
import { BlogsView } from './components/BlogsView';
import { AdminPanel } from './components/AdminPanel';
import { FloatingActions } from './components/FloatingActions';
import { Bell, Info, ShieldAlert } from 'lucide-react';
import { isSupabaseConfigured } from './supabaseClient';


function AppContent() {
  const { currentView, toast } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F8]">
      {/* Dynamic Header */}
      <Header />

      {/* Primary Main Content View Controller */}
      <main className="flex-grow">
        {currentView === 'home' && <HomeView />}
        {currentView === 'products' && <ProductsView />}
        {currentView === 'blogs' && <BlogsView />}
        {currentView === 'admin' && <AdminPanel />}
      </main>

      {/* Floating Messenger Zalo Widgets & Promo Popups */}
      <FloatingActions />

      {/* Dynamic Confirmation Toast Notifications */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-6 duration-300">
          <div className="bg-zinc-900 border border-zinc-800 text-white rounded-xl shadow-2xl px-5 py-4 flex items-center gap-3 max-w-sm sm:max-w-md">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-[#800000]'
            }`}>
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold leading-normal">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

