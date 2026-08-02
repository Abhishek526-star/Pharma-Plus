export const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) {
    return alert('No data available to export.');
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Convert JSON to CSV format
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(fieldName => {
        // Escape quotes and wrap in quotes if it contains a comma
        let value = row[fieldName];
        if (value === null || value === undefined) value = '';
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      }).join(',')
    )
  ].join('\n');

  // Create a Blob and trigger download
  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};