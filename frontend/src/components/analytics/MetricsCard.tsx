import React from "react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, icon }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-between">
      <div>
        <h4 className="text-gray-600 dark:text-gray-300 text-sm">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      {icon && <div className="text-3xl text-blue-500">{icon}</div>}
    </div>
  );
};

export default MetricsCard;
