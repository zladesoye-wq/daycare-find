import React from 'react';

const DataTable = ({ columns, data, loading, onRowClick }) => {
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading data...</div>;
  }

  if (!data || data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No records found.</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-gray)' }}>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                style={{ 
                  padding: '1rem', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: 'var(--text-muted)',
                  width: col.width
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr 
              key={rowIdx} 
              onClick={() => onRowClick && onRowClick(row)}
              style={{ 
                borderBottom: '1px solid var(--border-gray)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => onRowClick && (e.currentTarget.style.backgroundColor = 'var(--light-gray)')}
              onMouseLeave={(e) => onRowClick && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
