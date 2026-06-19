import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'active':
      case 'completed':
      case 'premium':
        return { bg: '#dcfce7', text: '#166534' };
      case 'pending':
      case 'free':
        return { bg: '#fef9c3', text: '#854d0e' };
      case 'cancelled':
      case 'inactive':
      case 'flagged':
        return { bg: '#fecaca', text: '#991b1b' };
      default:
        return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const { bg, text } = getStyles();

  return (
    <span style={{
      display: 'inline-flex',
      padding: '0.25rem 0.625rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      backgroundColor: bg,
      color: text,
      textTransform: 'capitalize'
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;
