import { useState } from 'react'

import GrantEligibilitySection from './components/GrantEligibilitySection';
import BillSection from './components/BillSection';
import QuoteSection from './components/QuoteSection';
import PaybackSection from './components/PaybackSection';

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
  const [savedQuoteId, setSavedQuoteId] = useState(null)
  const [savedBillId, setSavedBillId] = useState(null);



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

  const saveQuote = async () => {
    const response = await fetch('http://localhost:8080/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        installerName,
        systemSizeKwp: parseFloat(systemSizeKwp),
        numberOfPanels: parseInt(numberOfPanels),
        batteryCapacityKwh: parseFloat(batteryCapacityKwh),
        totalPrice: parseFloat(totalPrice),
        grantAmountClaimed: parseFloat(grantAmountClaimed)
      })
    })
    const data = await response.json()
    setSavedQuoteId(data.id)
  }

  const saveBill = async () => {
    const response = await fetch('http://localhost:8080/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dayRatePerKwh: parseFloat(dayRate),
        nightRatePerKwh: parseFloat(nightRate),
        peakRatePerKwh: parseFloat(peakRate),
        standingChargePerDay: parseFloat(standingCharge),
        dayUnitsKwh: parseFloat(dayUnits),
        nightUnitsKwh: parseFloat(nightUnits),
        peakUnitsKwh: parseFloat(peakUnits),
        billPeriodDays: parseInt(billPeriodDays),
      }),
    });
    const data = await response.json();
    setSavedBillId(data.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-2">SolarSense</h1>
        <p className="text-gray-500 mb-8">Solar PV & Battery Decision Support Tool</p>

        {/* Section 1 */}
        <GrantEligibilitySection
          gridConnectionDate={gridConnectionDate}
          setGridConnectionDate={setGridConnectionDate}
          isNewBuild={isNewBuild}
          setIsNewBuild={setIsNewBuild}
          eligibility={eligibility}
          checkEligibility={checkEligibility}
        />

        {/* Section 2 */}
        <BillSection
          dayRate={dayRate} setDayRate={setDayRate}
          nightRate={nightRate} setNightRate={setNightRate}
          peakRate={peakRate} setPeakRate={setPeakRate}
          standingCharge={standingCharge} setStandingCharge={setStandingCharge}
          dayUnits={dayUnits} setDayUnits={setDayUnits}
          nightUnits={nightUnits} setNightUnits={setNightUnits}
          peakUnits={peakUnits} setPeakUnits={setPeakUnits}
          billPeriodDays={billPeriodDays} setBillPeriodDays={setBillPeriodDays}
          saveBill={saveBill} savedBillId={savedBillId}
        />

        {/* Section 3 */}
        <QuoteSection
          installerName={installerName} setInstallerName={setInstallerName}
          systemSizeKwp={systemSizeKwp} setSystemSizeKwp={setSystemSizeKwp}
          numberOfPanels={numberOfPanels} setNumberOfPanels={setNumberOfPanels}
          batteryCapacityKwh={batteryCapacityKwh} setBatteryCapacityKwh={setBatteryCapacityKwh}
          totalPrice={totalPrice} setTotalPrice={setTotalPrice}
          grantAmountClaimed={grantAmountClaimed} setGrantAmountClaimed={setGrantAmountClaimed}
          saveQuote={saveQuote} savedQuoteId={savedQuoteId}
        />

        {/* Section 4 */}
        <PaybackSection
          calculatePayback={calculatePayback}
          paybackResult={paybackResult}
          installerName={installerName}
        />

      </div>
    </div>
  )
}

export default App