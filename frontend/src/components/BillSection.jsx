function BillSection({ dayRate, setDayRate, nightRate, setNightRate, peakRate, setPeakRate,
    standingCharge, setStandingCharge, dayUnits, setDayUnits, nightUnits, setNightUnits,
    peakUnits, setPeakUnits, billPeriodDays, setBillPeriodDays, saveBill, savedBillId }) {
    return (

        <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Step 2 — Your Electricity Bill</h2>
            <div className="grid grid-cols-2 gap-4">
                {[
                    ['Day Rate (€/kWh)', dayRate, setDayRate],
                    ['Night Rate (€/kWh)', nightRate, setNightRate],
                    ['Peak Rate (€/kWh)', peakRate, setPeakRate],
                    ['Standing Charge (€/day)', standingCharge, setStandingCharge],
                    ['Day Units (kWh)', dayUnits, setDayUnits],
                    ['Night Units (kWh)', nightUnits, setNightUnits],
                    ['Peak Units (kWh)', peakUnits, setPeakUnits],
                    ['Bill Period (days)', billPeriodDays, setBillPeriodDays],
                ].map(([label, value, setter]) => (
                    <div key={label}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input type="number" value={value} onChange={e => setter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
                    </div>
                ))}
            </div>
            <button
                onClick={saveBill}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Save Bill
            </button>
            {savedBillId && (
                <p className="mt-2 text-green-700">✅ Bill saved (ID: {savedBillId})</p>
            )}
        </div>
    );
}

export default BillSection;