import React from 'react';

export const Table: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`table-container ${className}`}>
    <table className="data-table">{children}</table>
  </div>
);

export const TableHead: React.FC<{
  columns: string[];
  className?: string;
}> = ({ columns, className = '' }) => (
  <thead className={className}>
    <tr>
      {columns.map((col, idx) => (
        <th key={idx}>{col}</th>
      ))}
    </tr>
  </thead>
);

export const TableEmpty: React.FC<{
  message?: string;
  colSpan?: number;
}> = ({ message = 'No data records found', colSpan = 5 }) => (
  <tbody>
    <tr>
      <td colSpan={colSpan} className="text-center py-10 text-[var(--text-muted)]">
        <p className="text-sm font-medium">{message}</p>
      </td>
    </tr>
  </tbody>
);
