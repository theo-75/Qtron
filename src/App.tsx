import React, { useState, useEffect } from 'react';
import { Users, Clock, Activity, Settings as SettingsIcon, BarChart3, UserCheck, AlertCircle, ChevronRight, Monitor, Smartphone, Menu, X, Sun, Moon, Phone } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CustomerKiosk from './components/CustomerKiosk';
import StaffPanel from './components/StaffPanel';
import Analytics from './components/Analytics';
import QueueManager from './components/QueueManager';
import Contact from './components/Contact';
import Settings from './components/Settings';
import Footer from './components/Footer';
import { QueueProvider } from './context/QueueContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, color: 'bg-primary-600' },
    { id: 'queue', label: 'Queue Manager', icon: Users, color: 'bg-success-600' },
    { id: 'kiosk', label: 'Customer Kiosk', icon: Monitor, color: 'bg-teal-600' },
    { id: 'staff', label: 'Staff Panel', icon: UserCheck, color: 'bg-warning-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'bg-neutral-600' },
    { id: 'contact', label: 'Contact', icon: Phone, color: 'bg-primary-600' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'queue':
        return <QueueManager />;
      case 'kiosk':
        return <CustomerKiosk />;
      case 'staff':
        return <StaffPanel />;
      case 'analytics':
        return <Analytics />;
      case 'contact':
        return <Contact />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-teal-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Qtron</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Smart Queue System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-primary-50 dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeView === item.id ? 'bg-primary-600' : item.color
                }`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-sm lg:text-base">{item.label}</span>
                {activeView === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Live System</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  {navigation.find(item => item.id === activeView)?.label}
                </h2>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  AI-powered queue management and optimization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-success-50 dark:bg-success-900 rounded-lg">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-sm text-success-700 dark:text-success-300 font-medium">System Active</span>
              </div>
              <div className="sm:hidden w-3 h-3 bg-success-500 rounded-full"></div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setActiveView('settings')}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueueProvider>
        <AppContent />
      </QueueProvider>
    </ThemeProvider>
  );
}

export default App;