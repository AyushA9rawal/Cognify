
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NavBar: React.FC = () => {
  const location = useLocation();
  const isExamPage = location.pathname.includes('/examination');
  const isResultPage = location.pathname.includes('/results');
  
  // Hide navigation on examination page for focus
  if (isExamPage) return null;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 animate-fade-in">
      <div className={cn(
        "flex items-center justify-between px-8 py-4 mx-auto max-w-7xl transition-all duration-300",
        isResultPage ? "glass-effect" : "bg-transparent"
      )}>
        <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-light to-medical-dark flex items-center justify-center">
            <span className="text-white font-semibold text-lg">M</span>
          </div>
          <span className="font-medium text-lg">MMSE Assessment</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
            About MMSE
          </Link>
        </nav>
        
        {!isResultPage && (
          <Link 
            to="/examination"
            className="btn-primary rounded-full px-6 shadow-button transition-all hover:shadow-lg"
          >
            Start Assessment
          </Link>
        )}
      </div>
    </header>
  );
};

export default NavBar;
