
import React from 'react';
import { Alert } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface AIStatusBarProps {
  loading: boolean;
  error: string | null;
}

const AIStatusBar: React.FC<AIStatusBarProps> = ({ loading, error }) => {
  if (!loading && !error) return null;

  return (
    <Alert variant={error ? "destructive" : "default"} className="fixed bottom-4 right-4 max-w-md">
      {loading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading AI models...</span>
        </div>
      )}
      {error && <span>Error loading AI models: {error}</span>}
    </Alert>
  );
};

export default AIStatusBar;
