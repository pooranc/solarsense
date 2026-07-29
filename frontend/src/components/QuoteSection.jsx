function QuoteSection({ installerName, setInstallerName, systemSizeKwp, setSystemSizeKwp,
  numberOfPanels, setNumberOfPanels, batteryCapacityKwh, setBatteryCapacityKwh,
  totalPrice, setTotalPrice, grantAmountClaimed, setGrantAmountClaimed,
  saveQuote, savedQuoteId }) {
  return (
     <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 3 — Solar Quote</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Installer Name', installerName, setInstallerName, 'text'],
              ['System Size (kWp)', systemSizeKwp, setSystemSizeKwp, 'number'],
              ['Number of Panels', numberOfPanels, setNumberOfPanels, 'number'],
              ['Battery Capacity (kWh)', batteryCapacityKwh, setBatteryCapacityKwh, 'number'],
              ['Total Price (€)', totalPrice, setTotalPrice, 'number'],
              ['Grant Claimed (€)', grantAmountClaimed, setGrantAmountClaimed, 'number'],
            ].map(([label, value, setter, type]) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type={type} value={value} onChange={e => setter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button onClick={saveQuote}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Save Quote
            </button>
            {savedQuoteId && (
              <p className="text-green-600 text-sm font-medium">✅ Quote saved (ID: {savedQuoteId})</p>
            )}
          </div>
        </div>
  );
}

export default QuoteSection;