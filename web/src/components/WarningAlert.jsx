import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function WarningAlert({ title, message }) {
  return (
    <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-4 mb-8 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-yellow-400 mb-1">{title}</h3>
        <p className="text-sm text-yellow-200">{message}</p>
      </div>
    </div>
  );
}