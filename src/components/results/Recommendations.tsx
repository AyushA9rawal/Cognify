
import React from 'react';

interface RecommendationsProps {
  severity: string;
}

const Recommendations: React.FC<RecommendationsProps> = ({ severity }) => {
  return (
    <div className="space-y-4 pt-4">
      <h3 className="text-xl font-medium">Recommendations</h3>
      <ul className="space-y-2">
        {severity === 'Normal' ? (
          <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            Maintain cognitive health through regular mental exercises and social engagement.
          </li>
        ) : severity === 'Mild' ? (
          <>
            <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              Consider a follow-up assessment with a healthcare professional.
            </li>
            <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              Engage in regular cognitive exercises targeting areas of weakness.
            </li>
          </>
        ) : (
          <>
            <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              Comprehensive evaluation by a neurologist or geriatric specialist is recommended.
            </li>
            <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              Consider structured cognitive rehabilitation therapy.
            </li>
            <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              Evaluation for possible medication or treatment options.
            </li>
          </>
        )}
      </ul>
      <div className="text-sm text-muted-foreground mt-6">
        <p>
          Analysis generated using an integrated machine learning model. This information is for reference only and 
          should not replace professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default Recommendations;
