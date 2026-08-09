import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function PaybackSection({ calculatePayback, paybackResult, installerName }) {
  return (
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
  );
}

export default PaybackSection;