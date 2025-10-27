import React, { useState } from 'react';
import { Code2, Database } from 'lucide-react';
import StackCard from './StackCard';
import CommandOutput from './CommandOutput';
import WarningAlert from './WarningAlert';
import { REACT_STACKS, MERN_STACKS, TYPESCRIPT_STACKS } from '../data/stacksData';

export default function StackSelector() {
  const [stackType, setStackType] = useState('react');
  const [selected, setSelected] = useState(
    stackType === 'react' 
      ? ['react', 'vite']
      : stackType === 'typescript'
      ? ['typescript']
      : ['mongodb', 'express', 'react', 'nodejs']
  );
  const [showCommand, setShowCommand] = useState(false);

  const currentStacks = stackType === 'react' ? REACT_STACKS : stackType === 'typescript' ? TYPESCRIPT_STACKS : MERN_STACKS;

  const handleStackTypeChange = (type) => {
    setStackType(type);
    setShowCommand(false);
    
    if (type === 'react') {
      setSelected(['react', 'vite']);
    } else if (type === 'typescript') {
      setSelected(['typescript']);
    } else {
      setSelected(['mongodb', 'express', 'react', 'nodejs']);
    }
  };

  const toggleStack = (id) => {
    const allStacks = Object.values(currentStacks).flat();
    const stack = allStacks.find(s => s.id === id);
    
    if (stack.required) return;

    if (selected.includes(id)) {
      const newSelected = selected.filter(s => s !== id);
      allStacks.forEach(s => {
        if (s.deps?.includes(id)) {
          const index = newSelected.indexOf(s.id);
          if (index > -1) newSelected.splice(index, 1);
        }
      });
      setSelected(newSelected);
    } else {
      const newSelected = [...selected, id];
      if (stack.deps) {
        stack.deps.forEach(dep => {
          if (!newSelected.includes(dep)) {
            newSelected.push(dep);
          }
        });
      }
      setSelected(newSelected);
    }
  };

  const hasWarnings = () => {
    if (stackType === 'react') {
      return selected.includes('shadcn') && !selected.includes('tailwind');
    }
    return false;
  };

  const sectionConfig = {
    base: { title: 'Base Stack', color: '#22c55e', subtitle: '(obrigatório)' },
    backend: { title: 'Backend', color: '#22c55e', subtitle: '(obrigatório)' },
    frontend: { title: 'Frontend', color: '#22c55e', subtitle: '(obrigatório)' },
    frameworks: { title: 'Frameworks', color: '#3b82f6' },
    types: { title: 'Type Definitions', color: '#60a5fa' },
    styling: { title: 'Styling & UI', color: '#60a5fa' },
    database: { title: 'Database & ORM', color: '#f59e0b' },
    auth: { title: 'Authentication', color: '#ec4899' },
    tools: { title: 'Utilities & Tools', color: '#a78bfa' },
    testing: { title: 'Testing', color: '#10b981' },
    utils: { title: 'Utilities & Libraries', color: '#a78bfa' },
    devtools: { title: 'DevTools & Testing', color: '#8b5cf6' }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Stack Selector
          </h1>
          <p className="text-slate-300 text-lg">
            Escolha as tecnologias para seus projetos futuros
          </p>
        </div>

        {/* Stack Type Tabs */}
        <div className="flex gap-4 mb-8 bg-slate-800/50 p-2 rounded-2xl border border-slate-700">
          <button
            onClick={() => handleStackTypeChange('react')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              stackType === 'react'
                ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-5 h-5" />
            React + Vite
          </button>
          <button
            onClick={() => handleStackTypeChange('typescript')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              stackType === 'typescript'
                ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-5 h-5" />
            TypeScript
          </button>
          <button
            onClick={() => handleStackTypeChange('mern')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              stackType === 'mern'
                ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-5 h-5" />
            MERN Stack
          </button>
        </div>

        {/* Sections */}
        {Object.entries(currentStacks).map(([key, stacks]) => {
          const config = sectionConfig[key];

          return (
            <div key={key} className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700 mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></span>
                {config.title}
                {config.subtitle && (
                  <span className="text-sm text-slate-400 font-normal">{config.subtitle}</span>
                )}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stacks.map(stack => (
                  <StackCard
                    key={stack.id}
                    stack={stack}
                    isSelected={selected.includes(stack.id)}
                    onToggle={() => toggleStack(stack.id)}
                    color={config.color}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Warnings */}
        {hasWarnings() && (
          <WarningAlert
            title="Atenção"
            message="shadcn/ui requer Tailwind CSS. Selecione Tailwind CSS primeiro."
          />
        )}

        {/* Command Output */}
        <CommandOutput
          showCommand={showCommand}
          onToggle={() => setShowCommand(!showCommand)}
          selected={selected}
          stacks={currentStacks}
          stackType={stackType}
        />

        {/* Summary */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>
            {selected.length} {selected.length === 1 ? 'tecnologia selecionada' : 'tecnologias selecionadas'}
          </p>
        </div>
      </div>
    </div>
  );
}