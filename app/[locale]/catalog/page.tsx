'use client';

import { useState, useMemo } from 'react';
import { Filter, X, SlidersHorizontal, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { products, categoryNames, strengthNames } from '@/lib/data';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { useTranslations, useLocale } from '@/hooks/useTranslations';

type CategoryFilter = 'all' | 'fruits' | 'mint' | 'dessert' | 'mix';
type StrengthFilter = 'all' | 'light' | 'medium' | 'strong';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export default function CatalogPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [strengthFilter, setStrengthFilter] = useState<StrengthFilter>('all');
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showHitOnly, setShowHitOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered: Product[] = [...products];

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (strengthFilter !== 'all') {
      filtered = filtered.filter(p => p.strength === strengthFilter);
    }

    if (showNewOnly) {
      filtered = filtered.filter(p => p.isNew);
    }
    if (showHitOnly) {
      filtered = filtered.filter(p => p.isHit);
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [categoryFilter, strengthFilter, showNewOnly, showHitOnly, sortBy]);

  const clearFilters = () => {
    setCategoryFilter('all');
    setStrengthFilter('all');
    setShowNewOnly(false);
    setShowHitOnly(false);
    setSortBy('default');
  };

  const hasActiveFilters = categoryFilter !== 'all' || strengthFilter !== 'all' || showNewOnly || showHitOnly;
  const activeFiltersCount = [
    categoryFilter !== 'all',
    strengthFilter !== 'all',
    showNewOnly,
    showHitOnly,
  ].filter(Boolean).length;

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {t.catalog.title}
          </h1>
          <p className="text-gray-400 text-lg">
            {t.catalog.subtitle}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside 
            className={`lg:w-72 ${isFiltersOpen ? 'block fixed inset-0 z-50 lg:relative lg:z-auto bg-dark-bg lg:bg-transparent p-4 lg:p-0 overflow-y-auto' : 'hidden'} lg:block`}
            aria-label={t.catalog.filters}
          >
            <div className="card sticky top-24 lg:max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-border">
                <h2 className="text-xl font-bold flex items-center space-x-2 text-white">
                  <SlidersHorizontal size={22} className="text-neon-cyan" />
                  <span>{t.catalog.filters}</span>
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-neon-cyan/20 text-neon-cyan text-xs font-bold rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-neon-cyan transition-colors p-1"
                >
                  <X size={22} />
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full mb-6 py-2.5 px-4 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/30 rounded-lg text-sm font-semibold text-neon-cyan hover:from-neon-cyan/20 hover:to-neon-purple/20 hover:border-neon-cyan/50 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <RotateCcw size={16} />
                  <span>{t.catalog.resetFilters}</span>
                </button>
              )}

              {/* Taste Filter */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-white flex items-center space-x-2">
                  <Sparkles size={18} className="text-neon-purple" />
                  <span>{t.catalog.taste}</span>
                </h3>
                <div className="space-y-2.5">
                  {(['all', 'fruits', 'mint', 'dessert', 'mix'] as CategoryFilter[]).map((cat) => (
                    <label 
                      key={cat} 
                      className={`flex items-center space-x-3 cursor-pointer p-2.5 rounded-lg transition-all duration-200 ${
                        categoryFilter === cat 
                          ? 'bg-neon-cyan/10 border border-neon-cyan/30' 
                          : 'hover:bg-dark-border/50'
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="category"
                          checked={categoryFilter === cat}
                          onChange={() => setCategoryFilter(cat)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          categoryFilter === cat 
                            ? 'border-neon-cyan bg-neon-cyan' 
                            : 'border-gray-500 bg-transparent'
                        }`}>
                          {categoryFilter === cat && (
                            <div className="w-2.5 h-2.5 rounded-full bg-dark-bg"></div>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-medium transition-colors flex-1 ${
                        categoryFilter === cat ? 'text-neon-cyan' : 'text-gray-300'
                      }`}>
                        {cat === 'all' ? t.catalog.all : categoryNames[cat as keyof typeof categoryNames]}
                      </span>
                      {categoryFilter === cat && (
                        <CheckCircle2 size={16} className="text-neon-cyan flex-shrink-0" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Strength Filter */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-white flex items-center space-x-2">
                  <Sparkles size={18} className="text-neon-purple" />
                  <span>{t.catalog.strength}</span>
                </h3>
                <div className="space-y-2.5">
                  {(['all', 'light', 'medium', 'strong'] as StrengthFilter[]).map((str) => (
                    <label 
                      key={str} 
                      className={`flex items-center space-x-3 cursor-pointer p-2.5 rounded-lg transition-all duration-200 ${
                        strengthFilter === str 
                          ? 'bg-neon-cyan/10 border border-neon-cyan/30' 
                          : 'hover:bg-dark-border/50'
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="strength"
                          checked={strengthFilter === str}
                          onChange={() => setStrengthFilter(str)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          strengthFilter === str 
                            ? 'border-neon-cyan bg-neon-cyan' 
                            : 'border-gray-500 bg-transparent'
                        }`}>
                          {strengthFilter === str && (
                            <div className="w-2.5 h-2.5 rounded-full bg-dark-bg"></div>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-medium transition-colors flex-1 ${
                        strengthFilter === str ? 'text-neon-cyan' : 'text-gray-300'
                      }`}>
                        {str === 'all' ? t.catalog.all : strengthNames[str as keyof typeof strengthNames]}
                      </span>
                      {strengthFilter === str && (
                        <CheckCircle2 size={16} className="text-neon-cyan flex-shrink-0" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Filters */}
              <div className="mb-6">
                <h3 className="font-bold mb-4 text-white flex items-center space-x-2">
                  <Sparkles size={18} className="text-neon-purple" />
                  <span>{t.catalog.special}</span>
                </h3>
                <div className="space-y-2.5">
                  <label 
                    className={`flex items-center space-x-3 cursor-pointer p-2.5 rounded-lg transition-all duration-200 ${
                      showNewOnly 
                        ? 'bg-neon-cyan/10 border border-neon-cyan/30' 
                        : 'hover:bg-dark-border/50'
                    }`}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showNewOnly}
                        onChange={(e) => setShowNewOnly(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        showNewOnly 
                          ? 'border-neon-cyan bg-neon-cyan' 
                          : 'border-gray-500 bg-transparent'
                      }`}>
                        {showNewOnly && (
                          <CheckCircle2 size={14} className="text-dark-bg" />
                        )}
                      </div>
                    </div>
                    <span className={`text-sm font-medium transition-colors flex-1 ${
                      showNewOnly ? 'text-neon-cyan' : 'text-gray-300'
                    }`}>
                      {t.catalog.newOnly}
                    </span>
                  </label>
                  <label 
                    className={`flex items-center space-x-3 cursor-pointer p-2.5 rounded-lg transition-all duration-200 ${
                      showHitOnly 
                        ? 'bg-neon-cyan/10 border border-neon-cyan/30' 
                        : 'hover:bg-dark-border/50'
                    }`}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showHitOnly}
                        onChange={(e) => setShowHitOnly(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        showHitOnly 
                          ? 'border-neon-cyan bg-neon-cyan' 
                          : 'border-gray-500 bg-transparent'
                      }`}>
                        {showHitOnly && (
                          <CheckCircle2 size={14} className="text-dark-bg" />
                        )}
                      </div>
                    </div>
                    <span className={`text-sm font-medium transition-colors flex-1 ${
                      showHitOnly ? 'text-neon-cyan' : 'text-gray-300'
                    }`}>
                      {t.catalog.hitOnly}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="lg:hidden btn-secondary flex items-center space-x-2"
                aria-label={t.catalog.filters}
                aria-expanded={isFiltersOpen}
              >
                <Filter size={20} />
                <span>{t.catalog.filters}</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-neon-cyan text-dark-bg text-xs font-bold rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-4 ml-auto w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center space-x-2">
                  <span className="text-sm md:text-base text-gray-400">
                    {t.catalog.found}:
                  </span>
                  <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                    {filteredAndSortedProducts.length}
                  </span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all cursor-pointer hover:border-neon-cyan/50 touch-manipulation min-h-[44px]"
                  aria-label={t.catalog.sortDefault}
                >
                  <option value="default">{t.catalog.sortDefault}</option>
                  <option value="price-asc">{t.catalog.sortPriceAsc}</option>
                  <option value="price-desc">{t.catalog.sortPriceDesc}</option>
                  <option value="rating">{t.catalog.sortRating}</option>
                </select>
              </div>
            </div>

            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">{t.catalog.noResults}</p>
                <button onClick={clearFilters} className="btn-secondary">
                  {t.catalog.resetFilters}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


