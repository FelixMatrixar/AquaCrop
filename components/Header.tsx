import React from 'react';
import type { View, AppUser } from '../types';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
  user: AppUser;
  onLogout: () => void;
  onUpgrade: () => void;
}

const SproutIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.59c0 .55-.45 1-1 1s-1-.45-1-1v-2.09c-1.39-.4-2.48-1.49-2.88-2.88H3.41c-.55 0-1-.45-1-1s.45-1 1-1h2.09c.4-1.39 1.49-2.48 2.88-2.88V5.41c0-.55.45-1 1-1s1 .45 1 1v2.09c1.39.4 2.48 1.49 2.88 2.88h7.21c.55 0 1 .45 1 1s-.45 1-1 1h-7.21c-.4 1.39-1.49 2.48-2.88 2.88v2.09z"/>
      <path d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" opacity=".3"/>
    </svg>
);

const UpgradeIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
    </svg>
);

const navItems: { id: View; label: string; icon: React.FC<{className: string}> }[] = [
    { 
      id: 'DASHBOARD', 
      label: 'Dashboard',
      icon: ({className}) => (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      )
    },
    { 
      id: 'FIELDS', 
      label: 'My Fields',
      icon: ({className}) => (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM17 11h-4v4h-2v-4H7V9h4V5h2v4h4v2z"/>
        </svg>
      )
    },
    { 
      id: 'SPROUT_AI', 
      label: 'Sprout AI',
      icon: ({className}) => (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm3 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm3 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/>
        </svg>
      )
    },
];

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, user, onLogout, onUpgrade }) => {
  
  const getTourId = (viewId: View) => {
      if (viewId === 'FIELDS') return 'tour-step-5';
      if (viewId === 'SPROUT_AI') return 'tour-step-6';
      return undefined;
  };

  return (
    <>
      <header className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <SproutIcon className="h-10 w-10 text-green-600" />
              <h1 className="text-3xl font-bold text-amber-950 dark:text-white">AquaCrop</h1>
            </div>
            <div className="flex items-center space-x-4">
                <nav className="flex items-center space-x-2 bg-amber-100 dark:bg-stone-700 p-1 rounded-full">
                {navItems.map((item) => (
                    <button
                    key={item.id}
                    id={getTourId(item.id)}
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                        activeView === item.id
                        ? 'bg-white text-green-600 shadow'
                        : 'text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-white'
                    }`}
                    >
                    <item.icon className="h-5 w-5" /> 
                    <span>{item.label}</span>
                    </button>
                ))}
                </nav>
                {user.plan === 'TANI_DASAR' && (
                    <button
                        onClick={onUpgrade}
                        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-md hover:scale-105 transition-transform"
                    >
                        Upgrade Plan
                    </button>
                )}
                <div className="flex items-center space-x-3">
                    <img src={user.photoURL || undefined} alt="User" className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-semibold text-sm text-amber-900 dark:text-amber-200">{user.displayName}</p>
                        <button onClick={onLogout} className="text-xs text-amber-600 dark:text-amber-400 hover:underline">{user.uid === 'guest' ? 'Exit Guest Mode' : 'Sign Out'}</button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm border-t border-amber-200 dark:border-stone-700 z-10 flex justify-around p-2">
          {navItems.map((item) => (
          <button
              key={item.id}
              id={`${getTourId(item.id)}-mobile`}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center flex-1 text-center px-2 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
              activeView === item.id
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-amber-600 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-stone-700'
              }`}
          >
              <item.icon className="h-6 w-6 mb-1"/>
              {item.label}
          </button>
          ))}
          {user.plan === 'TANI_DASAR' && (
              <button
                key="upgrade"
                onClick={onUpgrade}
                className={`flex flex-col items-center justify-center flex-1 text-center px-2 py-1 rounded-lg text-xs font-medium transition-colors duration-200 text-orange-500 hover:bg-amber-100 dark:text-orange-400 dark:hover:bg-stone-700`}
              >
                  <UpgradeIcon className="h-6 w-6 mb-1"/>
                  Upgrade
              </button>
          )}
      </nav>
    </>
  );
};

export default Header;