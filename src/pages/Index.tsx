
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <NavBar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full animate-fade-in">
                Mini Mental State Examination
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-slide-in">
                Advanced Cognitive Assessment Tool
              </h1>
              <p className="text-lg text-muted-foreground animate-slide-in" style={{ animationDelay: '100ms' }}>
                A comprehensive digital implementation of the MMSE, enhanced with AI analysis to provide deeper insights into cognitive health.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Link to="/examination" className="btn-primary py-3 px-8 rounded-full text-base">
                Start Assessment
              </Link>
              <Link to="/about" className="btn-secondary py-3 px-8 rounded-full text-base">
                Learn More
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-soft border border-border/50">
                <div className="text-2xl font-bold text-primary">30</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-soft border border-border/50">
                <div className="text-2xl font-bold text-primary">5-10</div>
                <div className="text-sm text-muted-foreground">Minute Assessment</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-soft border border-border/50">
                <div className="text-2xl font-bold text-primary">7</div>
                <div className="text-sm text-muted-foreground">Cognitive Domains</div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in hidden md:block" style={{ animationDelay: '400ms' }}>
            <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent opacity-70 blur-3xl rounded-full"></div>
            <div className="relative bg-card-gradient rounded-2xl overflow-hidden shadow-card border border-border/50">
              <div className="p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="inline-flex px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        Question 1 of 19
                      </div>
                      <div className="text-sm text-muted-foreground">5% Complete</div>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full">
                      <div className="w-[5%] h-full bg-primary rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium">What year is it now?</h3>
                    <p className="text-sm text-muted-foreground mt-1">Orientation to Time</p>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full text-left p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center border border-muted-foreground">
                        </div>
                        <span>Correct</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center border border-muted-foreground">
                        </div>
                        <span>Incorrect</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-24 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground">Our digital MMSE platform combines the traditional assessment with advanced AI analysis for comprehensive cognitive evaluation.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card-gradient rounded-xl p-6 shadow-soft border border-border/50 card-hover">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10v2a2 2 0 0 0 2 2h2"/><path d="m9 4 3 3h-3z"/><path d="M11 21H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/><path d="m16 19 2-2"/><path d="m21 14-3-3-2 3"/><path d="M11 12a9 9 0 0 0 9 9"/></svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Complete Assessment</h3>
              <p className="text-muted-foreground">Answer a series of standardized questions covering orientation, memory, attention, and more.</p>
            </div>
            
            <div className="bg-card-gradient rounded-xl p-6 shadow-soft border border-border/50 card-hover">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4z"/></svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Instant Scoring</h3>
              <p className="text-muted-foreground">Receive immediate results with detailed breakdowns across different cognitive domains.</p>
            </div>
            
            <div className="bg-card-gradient rounded-xl p-6 shadow-soft border border-border/50 card-hover">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3v12h-2V5H5v16h14v-2h2v4H3V3Z"/><path d="M16 10h5v7h-5z"/><path d="M16 21v-4"/><path d="M8 12h5v3H8z"/><path d="M11 12V8H8v4"/></svg>
              </div>
              <h3 className="text-xl font-medium mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">Advanced interpretation of results using Google's Gemini AI with personalized recommendations.</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              This tool is for screening purposes only and is not a diagnostic instrument. 
              Always consult healthcare professionals for proper evaluation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
