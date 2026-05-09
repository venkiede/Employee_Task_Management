import React from 'react';

const StatCard = ({ title, value, icon, trend, trendValue, colorClass = "text-primary-500", bgClass = "bg-primary-500/10" }) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-soft hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-subtle mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-heading group-hover:text-primary-500 transition-colors">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
          {icon}
        </div>
      </div>
      
      {(trend || trendValue) && (
        <div className="mt-4 flex items-center text-sm">
          {trend === 'up' && <span className="text-success-500 font-medium flex items-center">↑ {trendValue}</span>}
          {trend === 'down' && <span className="text-danger-500 font-medium flex items-center">↓ {trendValue}</span>}
          {trend === 'neutral' && <span className="text-subtle font-medium">{trendValue}</span>}
          <span className="text-faint ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
