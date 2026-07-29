function GrantEligibilitySection({ gridConnectionDate, setGridConnectionDate, isNewBuild, setIsNewBuild, eligibility, checkEligibility }) {
    return (
        < div className="bg-white rounded-xl shadow p-6 mb-6" >
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

            {
                eligibility !== null && (
                    <p className={`mt-4 font-medium ${eligibility ? 'text-green-600' : 'text-red-600'}`}>
                        {eligibility ? '✅ Eligible for SEAI grant (€2,400)' : '❌ Not eligible for SEAI grant'}
                    </p>
                )
            }
        </div >

    );
}

export default GrantEligibilitySection;