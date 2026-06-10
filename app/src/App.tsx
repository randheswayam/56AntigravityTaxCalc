import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import WizardShell from './components/WizardShell';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/AdminDashboard';
import ResultPage from './components/ResultPage';
import ProfilePage from './components/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { seedMockUsers } from './utils/mockDb';
import { supabase, isSupabaseConfigured } from './utils/supabaseClient';
import { dbService } from './utils/dbService';

function App() {
  const user = useAuthStore((state) => state.user);
  const hasPaid = useAuthStore((state) => state.hasPaid);
  const setPaid = useAuthStore((state) => state.setPaid);
  const logout = useAuthStore((state) => state.logout);

  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'wizard' | 'result' | 'profile' | 'admin'>('landing');

  // Seeding mock users database on startup and check for URL admin parameter
  useEffect(() => {
    seedMockUsers();
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.isAdmin) {
        setCurrentView('admin');
      } else {
        setCurrentView('login');
      }
    }
  }, []);

  // Listen to Supabase auth state change and sync to Zustand store
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          dbService.fetchUserProfile(session.user.id).then((profile) => {
            const resolved = profile || {
              id: session.user.id,
              name: session.user.user_metadata?.name || 'Valued User',
              email: session.user.email || '',
              hasPaid: false,
              isActive: true
            };
            
            // Sync user profile status
            const currentUser = useAuthStore.getState().user;
            if (!currentUser || currentUser.id !== resolved.id || currentUser.name !== resolved.name) {
              useAuthStore.getState().login(resolved);
            }
          }).catch(console.error);
        } else if (event === 'SIGNED_OUT') {
          const currentUser = useAuthStore.getState().user;
          if (currentUser && !currentUser.isAdmin) {
            useAuthStore.getState().logout();
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleExitAdmin = () => {
    logout();
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.history.replaceState({}, document.title, url.pathname);
    setCurrentView('landing');
  };

  // Active session gate for deactivated/paid status sync
  useEffect(() => {
    if (user && !user.isAdmin) {
      const syncUserStatus = async () => {
        try {
          if (isSupabaseConfigured) {
            const profile = await dbService.getCurrentUserProfile();
            if (profile) {
              // Sync account active status
              if (!profile.isActive) {
                logout();
                setCurrentView('landing');
                alert('Your session has been terminated because your account was deactivated.');
                return;
              }
              
              // Sync payment status
              const currentStoreHasPaid = useAuthStore.getState().hasPaid;
              if (profile.hasPaid !== currentStoreHasPaid) {
                setPaid(profile.hasPaid);
              }
            }
          } else {
            const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
            const found = users.find((u: any) => u.email === user.email);
            if (found) {
              // Sync account active status
              if (found.isActive === false) {
                logout();
                setCurrentView('landing');
                alert('Your session has been terminated because your account was deactivated.');
                return;
              }
              
              // Sync payment status
              const currentStoreHasPaid = useAuthStore.getState().hasPaid;
              if (!!found.hasPaid !== currentStoreHasPaid) {
                setPaid(!!found.hasPaid);
              }
            }
          }
        } catch (err) {
          console.error('Error syncing user status:', err);
        }
      };

      // Check on mount
      syncUserStatus();

      // Listen to storage events only if using local fallback
      if (!isSupabaseConfigured) {
        window.addEventListener('storage', syncUserStatus);
        return () => {
          window.removeEventListener('storage', syncUserStatus);
        };
      }
    }
  }, [user, logout, setPaid]);

  // Handle successful login redirects
  useEffect(() => {
    if (user) {
      if (currentView === 'login') {
        if (user.isAdmin) {
          setCurrentView('admin');
        } else if (hasPaid) {
          setCurrentView('wizard');
        } else {
          setCurrentView('landing');
        }
      }
    } else {
      if (currentView === 'wizard') {
        setCurrentView('landing');
      }
    }
  }, [user, hasPaid]);

  // Handle payment redirect parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' || params.get('status') === 'success' || params.has('payment_id')) {
      setPaid(true);
      // Clean up the URL so it doesn't re-trigger on manual refresh
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // If user is logged in, automatically proceed to wizard
      if (useAuthStore.getState().user) {
        setCurrentView('wizard');
      }
    }
  }, [setPaid]);

  // Render view based on state
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login 
            onGoToRegister={() => setCurrentView('register')} 
            onGoToHome={() => setCurrentView('landing')} 
          />
        );
      case 'register':
        return (
          <Register 
            onGoToLogin={() => setCurrentView('login')} 
            onGoToHome={() => setCurrentView('landing')} 
          />
        );
      case 'wizard':
        return (
          <WizardShell 
            onExit={() => setCurrentView('landing')} 
            onComplete={() => setCurrentView('result')} 
          />
        );
      case 'result':
        return <ResultPage onRestart={() => setCurrentView('landing')} />;
      case 'profile':
        return <ProfilePage onBack={() => setCurrentView('landing')} />;
      case 'admin':
        if (user && user.isAdmin) {
          return <AdminDashboard onExit={handleExitAdmin} />;
        }
        return (
          <Login 
            onGoToRegister={() => setCurrentView('register')} 
            onGoToHome={() => setCurrentView('landing')} 
          />
        );
      case 'landing':
      default:
        return (
          <LandingPage 
            onStart={() => setCurrentView('wizard')} 
            onNavigateToRegister={() => setCurrentView('register')} 
            onNavigateToLogin={() => setCurrentView('login')} 
            onNavigateToProfile={() => setCurrentView('profile')}
            onNavigateToAdmin={() => setCurrentView('admin')}
          />
        );
    }
  };

  return <div className="App">{renderView()}</div>;
}

export default App;