import React from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { ActionButton } from './ActionButton';

export const ProductList = () => {
  const { gameState, doAction } = useGameState();

  return (
    <section className="bg-white border-2 border-zinc-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[10px] font-black bg-zinc-900 text-white px-2 py-1 uppercase tracking-tighter">Product_Portfolio</h2>
        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
          {gameState.game.products.length} Products
        </span>
      </div>

      {gameState.game.products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">No Products Yet</p>
          <p className="text-zinc-300 text-xs mt-2">Develop your first app!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {gameState.game.products.map(product => (
            <div
              key={product.id}
              className={`border-2 p-4 ${product.stage !== 'sold' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-black uppercase tracking-wider">{product.name}</h3>
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                  product.stage === 'prototype' ? 'bg-yellow-100 text-yellow-600' :
                  product.stage === 'released' ? 'bg-blue-100 text-blue-600' :
                  product.stage === 'monetized' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {product.stage}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <span className="text-zinc-400 font-bold uppercase">Quality:</span>
                  <span className="font-black text-indigo-600 ml-1">{product.quality}</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-bold uppercase">Users:</span>
                  <span className="font-black text-zinc-600 ml-1">{product.users}</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-bold uppercase">Revenue:</span>
                  <span className="font-black text-green-600 ml-1">¥{product.monthlyRevenue?.toLocaleString() || 0}</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-bold uppercase">Age:</span>
                  <span className="font-black text-zinc-600 ml-1">{product.age} months</span>
                </div>
              </div>

              <div className="text-xs mb-2">
                <span className="text-zinc-400 font-bold uppercase">Assigned Employees:</span>
                {(() => {
                  const assignedEmployees = gameState.game.employees.filter(e => e.assignedProductId === product.id);
                  return assignedEmployees.length > 0 ? (
                    <div className="mt-1">
                      {assignedEmployees.map(emp => (
                        <span key={emp.id} className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs mr-1 mb-1">
                          {emp.name} ({emp.role})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="font-black text-gray-400 ml-1">None</span>
                  );
                })()}
              </div>

              {product.stage === 'released' && !product.hasPayment && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  ⚠ ユーザーはいるが、収益化できていない
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {product.stage === 'prototype' && (
                  <ActionButton
                    onClick={() => doAction('deploy', { id: product.id })}
                    colorClasses="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-500 text-blue-600 hover:text-blue-700 py-2 px-4 text-xs font-black uppercase"
                  >
                    DEPLOY
                  </ActionButton>
                )}
                {product.stage === 'released' && (
                  <ActionButton
                    onClick={() => doAction('payment', { id: product.id })}
                    colorClasses="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-500 text-purple-600 hover:text-purple-700 py-2 px-4 text-xs font-black uppercase"
                  >
                    ADD PAYMENT
                  </ActionButton>
                )}
                {(product.stage === 'released' || product.stage === 'monetized') && (
                  <>
                    <ActionButton
                      onClick={() => doAction('fix_bug', { id: product.id })}
                      colorClasses="bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 hover:border-orange-500 text-orange-600 hover:text-orange-700 py-2 px-4 text-xs font-black uppercase"
                    >
                      FIX BUG
                    </ActionButton>
                    <ActionButton
                      onClick={() => doAction('ui_improve', { id: product.id })}
                      colorClasses="bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-500 text-green-600 hover:text-green-700 py-2 px-4 text-xs font-black uppercase"
                    >
                      UI IMPROVE
                    </ActionButton>
                    <ActionButton
                      onClick={() => doAction('marketing', { id: product.id })}
                      colorClasses="bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 hover:border-pink-500 text-pink-600 hover:text-pink-700 py-2 px-4 text-xs font-black uppercase"
                    >
                      MARKETING
                    </ActionButton>
                  </>
                )}
                {product.stage === 'monetized' && product.age >= 12 && product.monthlyRevenue >= 10000 && (
                  <ActionButton
                    onClick={() => doAction('sell', { id: product.id })}
                    colorClasses="bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-500 text-red-600 hover:text-red-700 py-2 px-4 text-xs font-black uppercase"
                  >
                    SELL PRODUCT
                  </ActionButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};