import React, { useState } from 'react';

const MetricTreeCAS = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set([
    'mrr', 'apps', 'arpu_app', 'app1', 'app2', 'app3',
    'ad_revenue', 'ua', 'retention', 'ltv', 'cpi'
  ]));

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const MetricNode = ({ 
    id, 
    title, 
    value, 
    change, 
    color = 'blue', 
    level = 0,
    formula,
    subtitle,
    children,
    parentExpanded = true
  }) => {
    const isExpanded = expandedNodes.has(id);
    const hasChildren = children && children.length > 0;
    const isHovered = hoveredNode === id;
    
    const colorClasses = {
      blue: 'bg-blue-500 border-blue-600',
      green: 'bg-emerald-500 border-emerald-600',
      purple: 'bg-violet-500 border-violet-600',
      orange: 'bg-orange-500 border-orange-600',
      pink: 'bg-pink-500 border-pink-600',
      cyan: 'bg-cyan-500 border-cyan-600',
      indigo: 'bg-indigo-500 border-indigo-600',
      amber: 'bg-amber-500 border-amber-600',
      red: 'bg-red-500 border-red-600',
      teal: 'bg-teal-500 border-teal-600',
      slate: 'bg-slate-500 border-slate-600',
      lime: 'bg-lime-500 border-lime-600',
    };

    const lightColorClasses = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-emerald-50 border-emerald-200',
      purple: 'bg-violet-50 border-violet-200',
      orange: 'bg-orange-50 border-orange-200',
      pink: 'bg-pink-50 border-pink-200',
      cyan: 'bg-cyan-50 border-cyan-200',
      indigo: 'bg-indigo-50 border-indigo-200',
      amber: 'bg-amber-50 border-amber-200',
      red: 'bg-red-50 border-red-200',
      teal: 'bg-teal-50 border-teal-200',
      slate: 'bg-slate-50 border-slate-200',
      lime: 'bg-lime-50 border-lime-200',
    };

    if (!parentExpanded) return null;

    const getNodeWidth = () => {
      if (level === 0) return 'w-72';
      if (level === 1) return 'w-56';
      if (level === 2) return 'w-48';
      return 'w-40';
    };

    const getGap = () => {
      if (level === 0) return 'gap-6';
      if (level === 1) return 'gap-4';
      return 'gap-3';
    };

    const getSpacing = () => {
      if (level === 0) return 140;
      if (level === 1) return 110;
      if (level === 2) return 90;
      return 75;
    };

    return (
      <div className="flex flex-col items-center">
        {/* Node */}
        <div 
          className={`relative cursor-pointer transition-all duration-200 ${isHovered ? 'scale-105 z-10' : ''}`}
          onMouseEnter={() => setHoveredNode(id)}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={() => hasChildren && toggleNode(id)}
        >
          <div className={`
            rounded-xl border-2 shadow-lg overflow-hidden
            ${getNodeWidth()}
            ${lightColorClasses[color]}
          `}>
            {/* Header */}
            <div className={`${colorClasses[color]} text-white px-3 py-2 text-center`}>
              <div className={`font-semibold ${level === 0 ? 'text-base' : 'text-sm'}`}>
                {title}
              </div>
              {subtitle && (
                <div className="text-xs opacity-80">{subtitle}</div>
              )}
            </div>
            
            {/* Body */}
            <div className="px-3 py-2 text-center bg-white bg-opacity-80">
              <div className={`font-bold text-gray-800 ${level === 0 ? 'text-2xl' : level === 1 ? 'text-xl' : 'text-lg'}`}>
                {value}
              </div>
              {change && (
                <div className={`text-sm font-medium ${change.startsWith('+') ? 'text-emerald-600' : change.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>
                  {change}
                </div>
              )}
              {formula && (
                <div className="text-xs text-gray-500 mt-1 font-mono bg-gray-100 rounded px-2 py-1">
                  {formula}
                </div>
              )}
            </div>
          </div>
          
          {/* Expand/Collapse indicator */}
          {hasChildren && (
            <div className={`
              absolute -bottom-3 left-1/2 transform -translate-x-1/2
              w-6 h-6 rounded-full bg-white border-2 shadow
              flex items-center justify-center text-xs font-bold text-gray-600
              border-gray-300 hover:border-gray-400
            `}>
              {isExpanded ? '−' : '+'}
            </div>
          )}
        </div>

        {/* Connector line down */}
        {hasChildren && isExpanded && (
          <div className="w-0.5 h-6 bg-gray-300" />
        )}

        {/* Children container */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {/* Horizontal connector line */}
            {children.length > 1 && (
              <div 
                className="absolute top-0 h-0.5 bg-gray-300"
                style={{
                  left: `calc(50% - ${(children.length - 1) * getSpacing() / 2}px)`,
                  width: `${(children.length - 1) * getSpacing()}px`
                }}
              />
            )}
            
            {/* Children */}
            <div className={`flex ${getGap()} pt-0`}>
              {children.map((child, index) => (
                <div key={child.id} className="flex flex-col items-center">
                  {/* Vertical connector from horizontal line */}
                  <div className="w-0.5 h-6 bg-gray-300" />
                  <MetricNode 
                    {...child} 
                    level={level + 1}
                    parentExpanded={isExpanded}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const metricTreeData = {
    id: 'mrr',
    title: 'MRR',
    subtitle: 'Monthly Recurring Revenue',
    value: '$850K',
    change: '+22% MoM',
    color: 'blue',
    formula: 'Σ (App Revenue - UA Cost)',
    children: [
      {
        id: 'app1',
        title: 'Puzzle Game',
        subtitle: 'Casual',
        value: '$320K',
        change: '+15%',
        color: 'purple',
        formula: 'Ad Rev - UA Cost',
        children: [
          {
            id: 'ad_revenue_1',
            title: 'Ad Revenue',
            value: '$480K',
            change: '+18%',
            color: 'green',
            formula: 'DAU × ARPDAU',
            children: [
              {
                id: 'dau_1',
                title: 'DAU',
                value: '890K',
                change: '+12%',
                color: 'teal',
                children: [
                  { id: 'new_users_1', title: 'New Users', value: '45K/day', change: '+8%', color: 'cyan' },
                  { id: 'retention_1', title: 'D7 Retention', value: '28%', change: '+2%', color: 'cyan' },
                ]
              },
              {
                id: 'arpdau_1',
                title: 'ARPDAU',
                value: '$0.054',
                change: '+5%',
                color: 'amber',
                children: [
                  { id: 'impressions_1', title: 'Impr/DAU', value: '12.4', change: '+3%', color: 'orange' },
                  { id: 'ecpm_1', title: 'eCPM', value: '$4.35', change: '+2%', color: 'orange' },
                ]
              },
            ]
          },
          {
            id: 'ua_cost_1',
            title: 'UA Cost',
            value: '$160K',
            change: '+22%',
            color: 'red',
            formula: 'Installs × CPI',
            children: [
              { id: 'installs_1', title: 'Installs', value: '1.4M', change: '+18%', color: 'pink' },
              { id: 'cpi_1', title: 'CPI', value: '$0.11', change: '+3%', color: 'pink' },
            ]
          },
        ]
      },
      {
        id: 'app2',
        title: 'Idle Tycoon',
        subtitle: 'Idle/Clicker',
        value: '$280K',
        change: '+28%',
        color: 'indigo',
        formula: 'Ad Rev - UA Cost',
        children: [
          {
            id: 'ad_revenue_2',
            title: 'Ad Revenue',
            value: '$390K',
            change: '+25%',
            color: 'green',
            formula: 'DAU × ARPDAU',
            children: [
              {
                id: 'dau_2',
                title: 'DAU',
                value: '520K',
                change: '+20%',
                color: 'teal',
              },
              {
                id: 'arpdau_2',
                title: 'ARPDAU',
                value: '$0.075',
                change: '+4%',
                color: 'amber',
              },
            ]
          },
          {
            id: 'ua_cost_2',
            title: 'UA Cost',
            value: '$110K',
            change: '+18%',
            color: 'red',
          },
        ]
      },
      {
        id: 'app3',
        title: 'Word Master',
        subtitle: 'Word Game',
        value: '$250K',
        change: '+18%',
        color: 'teal',
        formula: 'Ad Rev - UA Cost',
        children: [
          {
            id: 'ad_revenue_3',
            title: 'Ad Revenue',
            value: '$310K',
            change: '+15%',
            color: 'green',
            children: [
              {
                id: 'dau_3',
                title: 'DAU',
                value: '380K',
                change: '+10%',
                color: 'teal',
              },
              {
                id: 'arpdau_3',
                title: 'ARPDAU',
                value: '$0.082',
                change: '+5%',
                color: 'amber',
              },
            ]
          },
          {
            id: 'ua_cost_3',
            title: 'UA Cost',
            value: '$60K',
            change: '+8%',
            color: 'red',
          },
        ]
      },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📊</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Mobile Publishing Metric Tree</h1>
          </div>
          <p className="text-slate-400">CAS Mediation · Рекламная монетизация · UA</p>
          <p className="text-sm text-slate-500 mt-2">Кликните на узел для раскрытия детализации</p>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-xs text-slate-300">MRR (NSM)</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
            <div className="w-3 h-3 rounded bg-purple-500"></div>
            <span className="text-xs text-slate-300">Apps</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-xs text-slate-300">Ad Revenue</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-xs text-slate-300">UA Cost</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
            <div className="w-3 h-3 rounded bg-teal-500"></div>
            <span className="text-xs text-slate-300">DAU</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span className="text-xs text-slate-300">ARPDAU</span>
          </div>
        </div>

        {/* Key Formulas */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
            <span className="text-slate-400 text-xs">MRR = </span>
            <span className="text-white text-sm font-mono">Σ(Ad Revenue - UA Cost)</span>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
            <span className="text-slate-400 text-xs">Ad Revenue = </span>
            <span className="text-white text-sm font-mono">DAU × ARPDAU × 30</span>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
            <span className="text-slate-400 text-xs">ARPDAU = </span>
            <span className="text-white text-sm font-mono">Impressions × eCPM / 1000</span>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
            <span className="text-slate-400 text-xs">ROAS = </span>
            <span className="text-white text-sm font-mono">LTV / CPI</span>
          </div>
        </div>

        {/* Tree */}
        <div className="flex justify-center overflow-x-auto pb-8">
          <MetricNode {...metricTreeData} />
        </div>

        {/* Metrics Deep Dive */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <span>📈</span> CAS Mediation Metrics
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex justify-between">
                <span>Fill Rate</span>
                <span className="text-white font-medium">98.2%</span>
              </li>
              <li className="flex justify-between">
                <span>Avg eCPM</span>
                <span className="text-white font-medium">$5.12</span>
              </li>
              <li className="flex justify-between">
                <span>Waterfall Win %</span>
                <span className="text-white font-medium">67%</span>
              </li>
              <li className="flex justify-between">
                <span>Bidding Win %</span>
                <span className="text-white font-medium">33%</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <h3 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <span>🎯</span> Ad Format Split
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex justify-between">
                <span>Interstitial</span>
                <span className="text-white font-medium">45% rev</span>
              </li>
              <li className="flex justify-between">
                <span>Rewarded Video</span>
                <span className="text-white font-medium">38% rev</span>
              </li>
              <li className="flex justify-between">
                <span>Banner</span>
                <span className="text-white font-medium">12% rev</span>
              </li>
              <li className="flex justify-between">
                <span>App Open</span>
                <span className="text-white font-medium">5% rev</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <h3 className="font-semibold text-pink-400 mb-3 flex items-center gap-2">
              <span>🚀</span> UA Channels
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex justify-between">
                <span>Unity Ads</span>
                <span className="text-white font-medium">35%</span>
              </li>
              <li className="flex justify-between">
                <span>Meta</span>
                <span className="text-white font-medium">28%</span>
              </li>
              <li className="flex justify-between">
                <span>Google Ads</span>
                <span className="text-white font-medium">22%</span>
              </li>
              <li className="flex justify-between">
                <span>Organic + ASO</span>
                <span className="text-white font-medium">15%</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-5 max-w-4xl mx-auto">
          <h3 className="font-semibold text-white mb-3">🔑 Ключевые точки роста MRR</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-slate-300"><span className="text-emerald-400 font-medium">↑ ARPDAU:</span> оптимизация waterfall, A/B тесты placement'ов, сегментация по GEO</p>
              <p className="text-slate-300"><span className="text-teal-400 font-medium">↑ DAU:</span> улучшение retention через LiveOps, контент апдейты</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-300"><span className="text-pink-400 font-medium">↓ CPI:</span> креативная оптимизация, lookalike аудитории, новые источники</p>
              <p className="text-slate-300"><span className="text-amber-400 font-medium">↑ LTV/CPI:</span> ROAS таргетинг, когортный анализ, payback optimization</p>
            </div>
          </div>
        </div>

        {/* Metrics Glossary */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6 max-w-5xl mx-auto">
          <h3 className="font-semibold text-white text-xl mb-6 flex items-center gap-2">
            <span>📖</span> Глоссарий метрик
          </h3>
          
          {/* North Star */}
          <div className="mb-6">
            <h4 className="text-blue-400 font-semibold mb-3 text-sm uppercase tracking-wider">North Star Metric</h4>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <div>
                  <span className="text-white font-semibold">MRR (Monthly Recurring Revenue)</span>
                  <p className="text-slate-400 text-sm mt-1">Ежемесячный доход от портфеля приложений за вычетом затрат на привлечение. Главная метрика бизнеса паблишера. Формула: <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">Σ(Ad Revenue - UA Cost)</span> по всем приложениям.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Metrics */}
          <div className="mb-6">
            <h4 className="text-emerald-400 font-semibold mb-3 text-sm uppercase tracking-wider">Метрики дохода (Revenue)</h4>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Ad Revenue</span>
                    <p className="text-slate-400 text-sm mt-1">Общий доход от рекламы в приложении за период. Складывается из всех форматов (Interstitial, Rewarded, Banner, App Open). Формула: <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">DAU × ARPDAU × Days</span></p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">ARPDAU (Average Revenue Per Daily Active User)</span>
                    <p className="text-slate-400 text-sm mt-1">Средний доход с одного активного пользователя в день. Ключевая метрика монетизации. Формула: <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">Impressions/DAU × eCPM / 1000</span>. Зависит от количества показов рекламы и ставок рекламодателей.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">eCPM (Effective Cost Per Mille)</span>
                    <p className="text-slate-400 text-sm mt-1">Эффективная стоимость 1000 показов рекламы. Показывает, сколько паблишер зарабатывает за каждую тысячу impressions. Зависит от GEO, формата рекламы, качества аудитории и настроек медиации. Формула: <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">(Revenue / Impressions) × 1000</span></p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Impressions / DAU</span>
                    <p className="text-slate-400 text-sm mt-1">Среднее количество рекламных показов на одного пользователя в день. Зависит от глубины сессии, количества placement'ов и частоты показа (frequency capping). Оптимизируется через UX и A/B тесты.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">LTV (Lifetime Value)</span>
                    <p className="text-slate-400 text-sm mt-1">Прогнозируемый суммарный доход от пользователя за всё время использования приложения. Формула: <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">ARPDAU × Lifetime Days</span> или через когортные кривые retention.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Metrics */}
          <div className="mb-6">
            <h4 className="text-teal-400 font-semibold mb-3 text-sm uppercase tracking-wider">Метрики пользователей (Users)</h4>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">DAU (Daily Active Users)</span>
                    <p className="text-slate-400 text-sm mt-1">Количество уникальных пользователей, открывших приложение за день. Базовая метрика масштаба приложения. Формула: <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">New Users + Retained Users</span></p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">New Users (Installs)</span>
                    <p className="text-slate-400 text-sm mt-1">Количество новых установок приложения в день. Зависит от UA-бюджета, органического трафика и ASO. Источники: платная реклама (Unity, Meta, Google), органика, кросс-промо.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Retention (D1, D7, D30)</span>
                    <p className="text-slate-400 text-sm mt-1">Процент пользователей, вернувшихся в приложение через N дней после установки. D1 = 40-50% (хорошо), D7 = 20-30%, D30 = 10-15% для казуальных игр. Ключевой индикатор качества продукта и соответствия ожиданиям пользователей из UA.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* UA Metrics */}
          <div className="mb-6">
            <h4 className="text-pink-400 font-semibold mb-3 text-sm uppercase tracking-wider">Метрики закупки (User Acquisition)</h4>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">UA Cost (User Acquisition Cost)</span>
                    <p className="text-slate-400 text-sm mt-1">Общие затраты на привлечение пользователей за период. Включает все рекламные каналы. Формула: <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">Installs × CPI</span></p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">CPI (Cost Per Install)</span>
                    <p className="text-slate-400 text-sm mt-1">Средняя стоимость одной установки. Зависит от GEO, качества креативов, конкуренции в нише и таргетинга. Для casual игр: $0.05-0.30 (T3 GEO), $0.50-2.00 (T1 GEO).</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">ROAS (Return On Ad Spend)</span>
                    <p className="text-slate-400 text-sm mt-1">Возврат на рекламные инвестиции. Показывает эффективность UA-кампаний. Формула: <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">LTV / CPI × 100%</span> или <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">Revenue / UA Cost × 100%</span>. ROAS &gt; 100% = прибыльная кампания.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Payback Period</span>
                    <p className="text-slate-400 text-sm mt-1">Количество дней, за которое доход от когорты пользователей покрывает затраты на их привлечение. Для здорового бизнеса: 7-30 дней. Формула определяется через пересечение LTV-кривой и CPI.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mediation Metrics */}
          <div className="mb-6">
            <h4 className="text-violet-400 font-semibold mb-3 text-sm uppercase tracking-wider">Метрики медиации (CAS)</h4>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Fill Rate</span>
                    <p className="text-slate-400 text-sm mt-1">Процент рекламных запросов, на которые пришёл ответ с рекламой. Формула: <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">(Filled Requests / Total Requests) × 100%</span>. Хороший показатель: 95-99%. Зависит от количества подключённых сетей и настроек waterfall.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Waterfall</span>
                    <p className="text-slate-400 text-sm mt-1">Последовательный запрос к рекламным сетям по убыванию ожидаемого eCPM. Каждая сеть получает запрос по очереди, пока одна не заполнит слот. Менее эффективен чем bidding, но более предсказуем.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">In-App Bidding</span>
                    <p className="text-slate-400 text-sm mt-1">Одновременный аукцион между рекламными сетями в реальном времени. Побеждает сеть с максимальной ставкой. Увеличивает eCPM на 10-30% по сравнению с waterfall за счёт конкуренции.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Show Rate</span>
                    <p className="text-slate-400 text-sm mt-1">Процент загруженной рекламы, которая была показана пользователю. Формула: <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">(Shown Ads / Loaded Ads) × 100%</span>. Низкий показатель указывает на проблемы с UX или слишком агрессивную предзагрузку.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Format Metrics */}
          <div>
            <h4 className="text-indigo-400 font-semibold mb-3 text-sm uppercase tracking-wider">Рекламные форматы</h4>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Interstitial</span>
                    <p className="text-slate-400 text-sm mt-1">Полноэкранная реклама между экранами/уровнями. Высокий eCPM ($3-15), но негативно влияет на retention при злоупотреблении. Оптимально: после завершения логического блока (уровень, раунд).</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Rewarded Video</span>
                    <p className="text-slate-400 text-sm mt-1">Видеореклама по инициативе пользователя в обмен на награду. Самый высокий eCPM ($5-25) и лучший UX. Не вредит retention. Ключевое: правильный баланс ценности награды.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Banner</span>
                    <p className="text-slate-400 text-sm mt-1">Небольшой рекламный блок (обычно внизу экрана). Низкий eCPM ($0.10-1), но стабильный доход без влияния на геймплей. Подходит для постоянного отображения.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">App Open Ads</span>
                    <p className="text-slate-400 text-sm mt-1">Полноэкранная реклама при запуске или возврате в приложение. Средний eCPM ($2-8). Важно: показывать только при "холодном" старте или длительном отсутствии, иначе раздражает пользователей.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricTreeCAS;
