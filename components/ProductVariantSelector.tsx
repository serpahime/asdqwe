'use client';

import { Product } from '@/types';

interface ProductVariantSelectorProps {
  product: Product;
  selectedVolume: string;
  selectedResistance: string;
  onVolumeChange: (volume: string) => void;
  onResistanceChange: (resistance: string) => void;
}

export default function ProductVariantSelector({
  product,
  selectedVolume,
  selectedResistance,
  onVolumeChange,
  onResistanceChange,
}: ProductVariantSelectorProps) {
  if (!product.variants) return null;

  const volumes = product.variants.volumes || [];
  const resistances = product.variants.resistances || [];

  return (
    <div className="space-y-6 mb-8">
      {/* Volume Selection */}
      {volumes.length > 0 && (
        <div>
          <h3 className="text-base font-semibold mb-4 text-white">Об'єм (мл)</h3>
          <div className="flex flex-wrap gap-3">
            {volumes.map((volume) => {
              const isSelected = selectedVolume === volume;
              return (
                <button
                  key={volume}
                  onClick={() => onVolumeChange(volume)}
                  className={`
                    relative px-6 py-3 rounded-full text-sm font-medium 
                    transition-all duration-300 ease-out
                    transform hover:scale-105 active:scale-95
                    ${
                      isSelected
                        ? 'bg-dark-border text-white border-2 border-white shadow-lg shadow-white/20'
                        : 'bg-transparent text-gray-400 border-2 border-dark-border hover:border-gray-500 hover:text-gray-300'
                    }
                  `}
                >
                  {volume}
                  {isSelected && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 animate-pulse opacity-50"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Resistance Selection */}
      {resistances.length > 0 && (
        <div>
          <h3 className="text-base font-semibold mb-4 text-white">Опір</h3>
          <div className="flex flex-col gap-3">
            {/* First row - regular resistances */}
            <div className="flex flex-wrap gap-3">
              {resistances
                .filter(r => !r.includes('3мл'))
                .map((resistance) => {
                  const isSelected = selectedResistance === resistance;
                  const canSelect = !volumes.length || selectedVolume !== '2 мл' || !resistance.includes('3мл');
                  
                  return (
                    <button
                      key={resistance}
                      onClick={() => canSelect && onResistanceChange(resistance)}
                      disabled={!canSelect}
                      className={`
                        relative px-6 py-3 rounded-full text-sm font-medium 
                        transition-all duration-300 ease-out
                        transform hover:scale-105 active:scale-95
                        ${
                          !canSelect
                            ? 'bg-dark-border/30 text-gray-600 border-2 border-dark-border cursor-not-allowed opacity-40'
                            : isSelected
                            ? 'bg-dark-border text-white border-2 border-white shadow-lg shadow-white/20'
                            : 'bg-transparent text-gray-400 border-2 border-dark-border hover:border-gray-500 hover:text-gray-300'
                        }
                        border-solid
                      `}
                    >
                      {resistance}
                      {isSelected && canSelect && (
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 animate-pulse opacity-50"></span>
                      )}
                    </button>
                  );
                })}
            </div>
            
            {/* Second row - top fill resistances */}
            {resistances.some(r => r.includes('3мл')) && (
              <div className="flex flex-wrap gap-3">
                {resistances
                  .filter(r => r.includes('3мл'))
                  .map((resistance) => {
                    const isSelected = selectedResistance === resistance;
                    const isDisabled = volumes.length > 0 && selectedVolume === '2 мл';
                    const isTopFill = resistance.includes('top fill');
                    
                    return (
                      <button
                        key={resistance}
                        onClick={() => !isDisabled && onResistanceChange(resistance)}
                        disabled={isDisabled}
                        className={`
                          relative px-6 py-3 rounded-full text-sm font-medium 
                          transition-all duration-300 ease-out
                          transform hover:scale-105 active:scale-95
                          ${
                            isDisabled
                              ? 'bg-dark-border/30 text-gray-600 border-2 border-dashed border-dark-border cursor-not-allowed opacity-40'
                              : isSelected
                              ? 'bg-dark-border text-white border-2 border-dashed border-white shadow-lg shadow-white/20'
                              : 'bg-transparent text-gray-400 border-2 border-dashed border-dark-border hover:border-gray-500 hover:text-gray-300'
                          }
                        `}
                      >
                        {resistance}
                        {isSelected && !isDisabled && (
                          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 animate-pulse opacity-50"></span>
                        )}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
          {selectedVolume === '2 мл' && resistances.some(r => r.includes('3мл')) && (
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              Варіанти з 3мл доступні тільки при виборі об'єму 3 мл
            </p>
          )}
        </div>
      )}
    </div>
  );
}

