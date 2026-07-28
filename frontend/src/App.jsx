import { useState } from 'react'

function App() {
  const [gridConnectionDate, setGridConnectionDate] = useState('')
  const [isNewBuild, setIsNewBuild] = useState(false)
  const [eligibility, setEligibility] = useState(null)
  const [dayRate, setDayRate] = useState('')

const [nightRate, setNightRate] = useState('')
const [peakRate, setPeakRate] = useState('')
const [standingCharge, setStandingCharge] = useState('')
const [dayUnits, setDayUnits] = useState('')
const [nightUnits, setNightUnits] = useState('')
const [peakUnits, setPeakUnits] = useState('')
const [billPeriodDays, setBillPeriodDays] = useState('')

const [installerName, setInstallerName] = useState('')
const [systemSizeKwp, setSystemSizeKwp] = useState('')
const [numberOfPanels, setNumberOfPanels] = useState('')
const [batteryCapacityKwh, setBatteryCapacityKwh] = useState('')
const [totalPrice, setTotalPrice] = useState('')
const [grantAmountClaimed, setGrantAmountClaimed] = useState('')

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
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>SolarSense</h1>

      <section>
        <h2>Step 1 — Property Details</h2>

        <div>
          <label>Grid Connection Date</label><br />
          <input
            type="date"
            value={gridConnectionDate}
            onChange={e => setGridConnectionDate(e.target.value)}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isNewBuild}
              onChange={e => setIsNewBuild(e.target.checked)}
            />
            {' '}New build property
          </label>
        </div>

        <button onClick={checkEligibility} disabled={!gridConnectionDate}>
          Check Grant Eligibility
        </button>

        {eligibility !== null && (
          <p>{eligibility ? 'Eligible for SEAI grant' : 'Not eligible for SEAI grant'}</p>
        )}
      </section>

       <section>
        <h2>Step 2 — Your Electricity Bill</h2>

        <div>
          <label>Day Rate (€/kWh)</label><br />
          <input type="number" value={dayRate} onChange={e => setDayRate(e.target.value)} />
        </div>

        <div>
          <label>Night Rate (€/kWh)</label><br />
          <input type="number" value={nightRate} onChange={e => setNightRate(e.target.value)} />
        </div>

        <div>
          <label>Peak Rate (€/kWh)</label><br />
          <input type="number" value={peakRate} onChange={e => setPeakRate(e.target.value)} />
        </div>

        <div>
          <label>Standing Charge (€/day)</label><br />
          <input type="number" value={standingCharge} onChange={e => setStandingCharge(e.target.value)} />
        </div>

        <div>
          <label>Day Units Used (kWh)</label><br />
          <input type="number" value={dayUnits} onChange={e => setDayUnits(e.target.value)} />
        </div>

        <div>
          <label>Night Units Used (kWh)</label><br />
          <input type="number" value={nightUnits} onChange={e => setNightUnits(e.target.value)} />
        </div>

        <div>
          <label>Peak Units Used (kWh)</label><br />
          <input type="number" value={peakUnits} onChange={e => setPeakUnits(e.target.value)} />
        </div>

        <div>
          <label>Bill Period (days)</label><br />
          <input type="number" value={billPeriodDays} onChange={e => setBillPeriodDays(e.target.value)} />
        </div>
      </section>

            <section>
        <h2>Step 3 — Solar Quote</h2>

        <div>
          <label>Installer Name</label><br />
          <input type="text" value={installerName} onChange={e => setInstallerName(e.target.value)} />
        </div>

        <div>
          <label>System Size (kWp)</label><br />
          <input type="number" value={systemSizeKwp} onChange={e => setSystemSizeKwp(e.target.value)} />
        </div>

        <div>
          <label>Number of Panels</label><br />
          <input type="number" value={numberOfPanels} onChange={e => setNumberOfPanels(e.target.value)} />
        </div>

        <div>
          <label>Battery Capacity (kWh)</label><br />
          <input type="number" value={batteryCapacityKwh} onChange={e => setBatteryCapacityKwh(e.target.value)} />
        </div>

        <div>
          <label>Total Price (€)</label><br />
           <input type="number" value={totalPrice} onChange={e => setTotalPrice(e.target.value)} />
        </div>

        <div>
          <label>Grant Amount Claimed (€)</label><br />
          <input type="number" value={grantAmountClaimed} onChange={e => setGrantAmountClaimed(e.target.value)} />
        </div>
      </section>

          <section>
        <h2>Step 4 — Calculate Payback</h2>

        <button onClick={calculatePayback}>
          Calculate Payback Period
        </button>

        {paybackResult !== null && (
          <div>
            <h3>Results for {installerName}</h3>
            <p>Conservative (30% self-use): <strong>{paybackResult.conservativeYears.toFixed(1)} years</strong></p>
            <p>Moderate (50% self-use): <strong>{paybackResult.moderateYears.toFixed(1)} years</strong></p>
            <p>Optimistic (70% self-use): <strong>{paybackResult.optimisticYears.toFixed(1)} years</strong></p>
          </div>
        )}
      </section>

    </div>
  )
}

export default App