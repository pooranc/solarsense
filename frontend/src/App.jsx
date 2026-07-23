import { useState } from 'react'

function App() {
  const [gridConnectionDate, setGridConnectionDate] = useState('')
  const [isNewBuild, setIsNewBuild] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkEligibility = async () => {
    setLoading(true)
    setResult(null)
    const response = await fetch('http://localhost:8080/api/grant-eligibility/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gridConnectionDate, isNewBuild })
    })
    const data = await response.json()
    setResult(data.eligible)
    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>SolarSense</h1>
      <h2>SEAI Grant Eligibility Check</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Grid Connection Date</label><br />
        <input
          type="date"
          value={gridConnectionDate}
          onChange={e => setGridConnectionDate(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="checkbox"
            checked={isNewBuild}
            onChange={e => setIsNewBuild(e.target.checked)}
          />
          {' '}New build property
        </label>
      </div>

      <button onClick={checkEligibility} disabled={!gridConnectionDate || loading}>
        {loading ? 'Checking...' : 'Check Eligibility'}
      </button>

      {result !== null && (
        <div style={{ marginTop: '1rem', padding: '1rem',
          backgroundColor: result ? '#d4edda' : '#f8d7da',
          borderRadius: '4px' }}>
          {result
            ? '✅ Eligible for SEAI Solar PV Grant'
            : '❌ Not eligible for SEAI Solar PV Grant'}
        </div>
      )}
    </div>
  )
}

export default App