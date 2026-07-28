import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function App() {
const [gridConnectionDate, setGridConnectionDate] = useState('2015-06-01')
const [isNewBuild, setIsNewBuild] = useState(false)
const [eligibility, setEligibility] = useState(null)

const [dayRate, setDayRate] = useState('0.43')
const [nightRate, setNightRate] = useState('0.22')
const [peakRate, setPeakRate] = useState('0.51')
const [standingCharge, setStandingCharge] = useState('0.75')
const [dayUnits, setDayUnits] = useState('1200')
const [nightUnits, setNightUnits] = useState('800')
const [peakUnits, setPeakUnits] = useState('200')
const [billPeriodDays, setBillPeriodDays] = useState('90')

const [installerName, setInstallerName] = useState('SolarCo')
const [systemSizeKwp, setSystemSizeKwp] = useState('6')
const [numberOfPanels, setNumberOfPanels] = useState('12')
const [batteryCapacityKwh, setBatteryCapacityKwh] = useState('10')
const [totalPrice, setTotalPrice] = useState('15000')
const [grantAmountClaimed, setGrantAmountClaimed] = useState('2400')

const [paybackResult, setPaybackResult] = useState(null)



  const checkEligibility = async () => {
    const response = await fetch('http://localhost:8080/api/grant-eligibility/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gridConnectionDate, isNewBuild })
    })
    const data = await response.json()
    setEligibility(data.eligible)
  }

  const calculatePayback = async () => {
  const response = await fetch('http://localhost:8080/api/payback/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      installerName,
      systemSizeKwp: parseFloat(systemSizeKwp),
      numberOfPanels: parseInt(numberOfPanels),
      batteryCapacityKwh: parseFloat(batteryCapacityKwh),
      totalPrice: parseFloat(totalPrice),
      grantAmountClaimed: parseFloat(grantAmountClaimed),
      dayRatePerKwh: parseFloat(dayRate),
      nightRatePerKwh: parseFloat(nightRate),
      peakRatePerKwh: parseFloat(peakRate),
      standingChargePerDay: parseFloat(standingCharge),
      dayUnitsKwh: parseFloat(dayUnits),
      nightUnitsKwh: parseFloat(nightUnits),
      peakUnitsKwh: parseFloat(peakUnits),
      billPeriodDays: parseInt(billPeriodDays)
    })
  })
  const data = await response.json()
  setPaybackResult(data)
}

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-2">SolarSense</h1>
        <p className="text-gray-500 mb-8">Solar PV & Battery Decision Support Tool</p>

        {/* Section 1 */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 1 — Property Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Grid Connection Date</label>
            <input type="date" value={gridConnectionDate}
              onChange={e => setGridConnectionDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={isNewBuild}
                onChange={e => setIsNewBuild(e.target.checked)} />
              New build property
            </label>
          </div>

          <button onClick={checkEligibility} disabled={!gridConnectionDate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
            Check Grant Eligibility
          </button>

          {eligibility !== null && (
            <p className={`mt-4 font-medium ${eligibility ? 'text-green-600' : 'text-red-600'}`}>
              {eligibility ? '✅ Eligible for SEAI grant (€2,400)' : '❌ Not eligible for SEAI grant'}
            </p>
          )}
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 2 — Your Electricity Bill</h2>
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
        </div>

        {/* Section 3 */}
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
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 4 — Calculate Payback</h2>

          <button onClick={calculatePayback}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Calculate Payback Period
          </button>

{paybackResult !== null && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">Results for {installerName}</h3>
    <div className="grid grid-cols-3 gap-4">
      {[
        ['Conservative', '30% self-use', paybackResult.conservativeYears],
        ['Moderate', '50% self-use', paybackResult.moderateYears],
        ['Optimistic', '70% self-use', paybackResult.optimisticYears],
      ].map(([label, sub, years]) => (
        <div key={label} className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xs text-gray-400">{sub}</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{years.toFixed(1)}</p>
          <p className="text-sm text-gray-500">years</p>
        </div>
      ))}
    </div>

    <div className="mt-6">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={[
          { scenario: 'Conservative', years: parseFloat(paybackResult.conservativeYears.toFixed(1)) },
          { scenario: 'Moderate', years: parseFloat(paybackResult.moderateYears.toFixed(1)) },
          { scenario: 'Optimistic', years: parseFloat(paybackResult.optimisticYears.toFixed(1)) },
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="scenario" />
          <YAxis label={{ value: 'Years', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => [`${value} years`, 'Payback']} />
          <Bar dataKey="years" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
)}
        </div>

      </div>
    </div>
  )
}

export default App