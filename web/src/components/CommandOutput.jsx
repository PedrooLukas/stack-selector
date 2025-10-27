import React, { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
export default function CommandOutput({ showCommand, onToggle, selected, stacks, stackType }) {
  const [copied, setCopied] = useState(false);

const copyCommand = () => {
  const allStacks = Object.values(stacks).flat();
  
  // Criar lista de IDs dos pacotes opcionais selecionados
  const selectedIds = selected
    .filter(id => {
      const stack = allStacks.find(s => s.id === id);
      return stack && !stack.required; // Não incluir obrigatórios
    })
    .join(',');
  
  // Comando usando o nome correto do pacote publicado no npm (--name será solicitado interativamente)
  const command = `npx stack-fast@latest init --type=${stackType} --package-manager=npm${selectedIds ? ` --packages=${selectedIds}` : ''}`;
  
  navigator.clipboard.writeText(command);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};
  // Contar pacotes opcionais selecionados
  const optionalPackages = selected.filter(id => {
    const stack = Object.values(stacks).flat().find(s => s.id === id);
    return stack && !stack.required;
  });

  return (
    <>
      {/* Aviso se nenhum pacote opcional foi selecionado */}
      {optionalPackages.length === 0 && !showCommand && (
        <div className="mb-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="text-yellow-400 font-semibold mb-1">Nenhum pacote opcional selecionado</h4>
              <p className="text-slate-300 text-sm">
                Você está prestes a criar um projeto apenas com as dependências obrigatórias. 
                Se deseja adicionar Tailwind CSS, React Router ou outras bibliotecas, 
                selecione-as acima antes de gerar o comando.
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" />
        {showCommand ? 'Ocultar Comando' : 'Gerar Comando CLI'}
      </button>

      {showCommand && (
        <div className="mt-8 bg-slate-950/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
          {/* Alerta se nenhum pacote opcional */}
          {optionalPackages.length === 0 && (
            <div className="mb-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-3">
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>⚠️</span>
                <span>Apenas dependências obrigatórias serão instaladas. Selecione pacotes opcionais acima se desejar.</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Comando CLI</h3>
            <button
              onClick={copyCommand}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>
          </div>
          
<div className="bg-slate-900 rounded-xl p-4 font-mono text-sm">
  <div className="text-green-400 mb-2"># Execute este comando:</div>
  <div className="text-blue-300 mb-4 break-all">
    npx stack-fast@latest init --type={stackType} --package-manager=npm
    {selected.filter(id => {
      const stack = Object.values(stacks).flat().find(s => s.id === id);
      return stack && !stack.required;
    }).length > 0 && ` --packages=${
      selected
        .filter(id => {
          const stack = Object.values(stacks).flat().find(s => s.id === id);
          return stack && !stack.required;
        })
        .join(',')
    }`}
  </div>
  <div className="text-slate-500 mb-4 text-xs italic">
    💡 O nome do projeto será solicitado interativamente
  </div>
      
      <div className="text-slate-500 mb-2"># Stacks selecionadas ({selected.length}):</div>
      <div className="space-y-1">
        {selected.map(id => {
          const allStacks = Object.values(stacks).flat();
          const stack = allStacks.find(s => s.id === id);
          return stack ? (
            <div key={id} className="flex items-center gap-2 ml-2">
              <span className="text-slate-300">
                • {stack.name} <span className="text-slate-500">({stack.version})</span>
              </span>
              {stack.required && (
                <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full border border-green-600/30">
                  obrigatório
                </span>
              )}
              {!stack.required && (
                <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full border border-blue-600/30">
                  opcional
                </span>
              )}
            </div>
          ) : null;
        })}
      </div>
    </div>
        </div>
      )}
    </>
  );
}
