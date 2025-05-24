export const DateParser = {
    sqlToString: (sqlDate) => {
        const [datePart] = sqlDate.split('T');
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    },

    timestampToString: (timestamp) => {
        const [datePart] = timestamp.split('T');
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    },

    isoToStringWithTime: (isoString) => {
      if (!isoString) return '—';
      
      const date = new Date(isoString);
      if (isNaN(date)) return '—'; // Para proteger aún más por si llega basura
    
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Madrid'
      }).format(date);
    }    
};
