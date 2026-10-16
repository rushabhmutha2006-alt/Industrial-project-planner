import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-950',
    error: 'border-rose-200 bg-rose-50/95 text-rose-950',
    info: 'border-sky-200 bg-sky-50/95 text-sky-950',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-200 no-print">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
