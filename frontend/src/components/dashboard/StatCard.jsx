import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="glass-card p-6 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300`}>
            <Icon className="w-24 h-24" />
        </div>
        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 border border-white/5`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                {trend && (
                    <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-lg flex items-center gap-1">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-text-muted text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-heading font-bold text-white">{value}</p>
        </div>
    </div>
);

export default StatCard;
