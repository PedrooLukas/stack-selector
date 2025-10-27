import React from 'react';
import { Check } from 'lucide-react';

export default function StackCard({ stack, isSelected, onToggle, color }) {
  const colorClasses = {
    '#22c55e': 'border-green-500 bg-green-500/20',
    '#60a5fa': 'border-blue-400 bg-blue-400/20',
    '#f59e0b': 'border-amber-500 bg-amber-500/20',
    '#ec4899': 'border-pink-500 bg-pink-500/20',
    '#a78bfa': 'border-purple-400 bg-purple-400/20',
    '#8b5cf6': 'border-violet-500 bg-violet-500/20'
  };

  const hoverClasses = {
    '#22c55e': 'hover:border-green-400',
    '#60a5fa': 'hover:border-blue-300',
    '#f59e0b': 'hover:border-amber-400',
    '#ec4899': 'hover:border-pink-400',
    '#a78bfa': 'hover:border-purple-300',
    '#8b5cf6': 'hover:border-violet-400'
  };

  if (stack.required) {
    return (
      <div className="rounded-xl p-4 border-2 border-green-500/30 bg-slate-700/50 cursor-not-allowed">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{stack.name}</span>
          <Check className="w-5 h-5 text-green-400" />
        </div>
        <span className="text-sm text-slate-400">{stack.version}</span>
        {stack.description && (
          <div className="mt-2 text-xs text-slate-400">{stack.description}</div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onToggle}
      className={`rounded-xl p-4 border-2 transition-all cursor-pointer ${
        isSelected
          ? colorClasses[color]
          : `bg-slate-700/50 border-slate-600 ${hoverClasses[color]}`
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{stack.name}</span>
        {isSelected && <Check className="w-5 h-5" style={{ color }} />}
      </div>
      <span className="text-sm text-slate-400">{stack.version}</span>
      {stack.deps && (
        <div className="mt-2 text-xs text-slate-500">
          Requer: {stack.deps.join(', ')}
        </div>
      )}
      {stack.description && (
        <div className="mt-2 text-xs text-slate-400">{stack.description}</div>
      )}
    </div>
  );
}