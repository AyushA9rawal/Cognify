
import React from 'react';

interface ResultsHeaderProps {
  patientName: string;
  patientAge: string;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ patientName, patientAge }) => {
  return (
    <div className="text-center space-y-4 animate-slide-in">
      <div className="inline-flex px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
        Assessment Complete
      </div>
      <h1 className="text-3xl md:text-4xl font-bold">MMSE Results</h1>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Below is a detailed breakdown of the Mini Mental State Examination results
        for {patientName}, {patientAge} years old.
      </p>
    </div>
  );
};

export default ResultsHeader;
