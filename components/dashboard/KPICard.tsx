import React from 'react';

interface KPICardProps {
    title: string;
    value: number;
    isCurrency?: boolean;
    trend?: 'up' | 'down' | 'neutral';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, isCurrency = false, trend = 'neutral' }) => {
    
    const formattedValue = isCurrency 
        ? value.toLocaleString('fr-FR', { minimumFractionDigits: 3 })
        : value.toLocaleString('fr-FR');

    const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-800';

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
            <h3 className="text-md font-semibold text-gray-500">{title}</h3>
            <p className={`text-3xl font-bold mt-2 ${trendColor}`}>{formattedValue}</p>
        </div>
    );
};

export default KPICard;
