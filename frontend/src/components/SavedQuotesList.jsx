import { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

function SavedQuotesList() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetch(API_BASE_URL + '/api/quotes/all', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(data => setQuotes(data));
  }, []);

  if (quotes.length === 0) {
    return <p className="text-gray-500 text-sm">No saved quotes yet.</p>;
  }

  return (
    <div className="mt-4">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="pb-2">Installer</th>
            <th className="pb-2">Size (kWp)</th>
            <th className="pb-2">Panels</th>
            <th className="pb-2">Battery (kWh)</th>
            <th className="pb-2">Price (€)</th>
            <th className="pb-2">Grant (€)</th>
          </tr>
        </thead>
        <tbody>
            {quotes.map(q => (
            <tr key={q.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{q.installerName}</td>
              <td className="py-2">{q.systemSizeKwp}</td>
              <td className="py-2">{q.numberOfPanels}</td>
              <td className="py-2">{q.batteryCapacityKwh}</td>
              <td className="py-2">{q.totalPrice}</td>
              <td className="py-2">{q.grantAmountClaimed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SavedQuotesList;