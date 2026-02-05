import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;


/*──────────────────────────────────────
  REUSABLE SINGLE-AMOUNT INPUT
──────────────────────────────────────*/
const AmountInput = ({ id, value, onChange, label, dotClass }) => (
  <div className="relative">
    {/* mobile label */}
    <label className="md:hidden mb-1 flex items-center gap-2 text-xs text-white/80">
      <span className={`w-2 h-2 ${dotClass} rounded-full`} />
      {label}
    </label>

    {/* desktop label (absolute) */}
    <div className="hidden md:flex items-center gap-2 absolute -top-6 left-2 text-white font-medium">
      <span className={`w-3 h-3 ${dotClass} rounded-full`} />
      {label}
    </div>

    <input
      id={id}
      name={id}
      type="text"
      // Only allow numbers and a single decimal point
      onInput={(e) => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
      }}
      value={value}
      onChange={onChange}
      placeholder="Enter amount"
      className="w-full h-12 px-4 pr-8 rounded-xl bg-black/30 backdrop-blur-md border border-white/30
                 text-white placeholder-white/60 shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
    />
    <span className="absolute right-3 top-2.5 text-lg text-white/70">₹</span>
  </div>
);

const DailyBasics = () => {
  /*────────────────────────────────────
    1. STATE
  ────────────────────────────────────*/
  const initialFormState = {
    petrolCost: '',
    cashOnDelivery: '',
    cashDeposit: '',
    otherCash: '',
    otherType: '',
    customOtherType: '',
    dailyWithDrawAmount: '',
    totalEarnings: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const [otherOptions, setOtherOptions] = useState([]);

  const [currentDate, setCurrentDate] = useState('');

  // State for API submission
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'
  const [submissionMessage, setSubmissionMessage] = useState('');

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    );
  }, []);

  /*────────────────────────────────────
    2. HANDLERS
  ────────────────────────────────────*/
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOtherTypeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      otherType: value,
      customOtherType: value === 'custom' ? prev.customOtherType : ''
    }));
  };

  useEffect(() => {
    const fetchOtherTypes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/daily-earnings/other-types`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setOtherOptions(data);
        }
      } catch (err) {
        console.error('Failed to load other types:', err);
      }
    };

    fetchOtherTypes();
  }, []);

  const handleCustomOtherType = (e) => {
    const v = e.target.value;
    setFormData((prev) => ({ ...prev, customOtherType: v }));
    if (v.trim() && !otherOptions.includes(v.trim()))
      setOtherOptions((o) => [...o, v.trim()]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmissionStatus(null);
    setSubmissionMessage('');

    // Format date to YYYY-MM-DD for the backend
    const isoDate = new Date().toISOString().split('T')[0];

    // Construct the payload as expected by the API
    const payload = {
      isoDate,
      petrolCost: parseFloat(formData.petrolCost) || 0,
      cashOnDelivery: parseFloat(formData.cashOnDelivery) || 0,
      cashDeposit: parseFloat(formData.cashDeposit) || 0,
      otherCash: parseFloat(formData.otherCash) || 0,
      otherType:
        formData.otherType === 'custom'
          ? formData.customOtherType.trim()
          : formData.otherType,
      dailyWithDrawAmount: parseFloat(formData.dailyWithDrawAmount) || 0,
      totalEarnings: parseFloat(formData.totalEarnings) || 0,    
    };

    try {
      console.log(payload, "Earnings Payload");
      const response = await fetch(`${BASE_URL}/daily-earnings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle HTTP errors like 400 or 500
        throw new Error(result.error || `Server responded with ${response.status}`);
      }
      
      console.log('API Response:', result);
      setSubmissionStatus('success');
      setSubmissionMessage('Daily earnings submitted successfully!');

      // Wait 2 seconds then reload the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err) {
      console.error('Submission Error:', err);
      setSubmissionStatus('error');
      setSubmissionMessage(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);

      // Hide the message after 5 seconds
      setTimeout(() => {
        setSubmissionStatus(null);
        setSubmissionMessage('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen py-6 font-sans bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* decorative blobs (sizes now responsive) */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPC9zdmc+')] opacity-20" />
      <div className="fixed top-20 right-20 w-60 h-60 sm:w-80 sm:h-80 xl:w-96 xl:h-96 rounded-full bg-pink-400 blur-[100px] opacity-30 animate-pulse" />
      <div className="fixed bottom-20 left-20 w-60 h-60 sm:w-80 sm:h-80 xl:w-96 xl:h-96 rounded-full bg-blue-400 blur-[100px] opacity-30 animate-pulse delay-1000" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[650px] lg:w-[800px] h-[500px] sm:h-[650px] lg:h-[800px] rounded-full bg-purple-500 blur-[120px] opacity-20 animate-pulse delay-700" />

      {/* ============  MAIN  ============ */}
      <div className="container mx-auto px-4 relative z-10">
        {/* ---------- HEADER ---------- */}
        <header className="relative mb-12 backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl shadow-[0_15px_50px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="flex flex-col items-center py-10">
            <div className="flex items-center gap-5 mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg rotate-12 hover:rotate-0 transition">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-pink-100 to-white text-transparent bg-clip-text drop-shadow-md">ZOMATO</h1>
            </div>
            <p className="text-lg sm:text-2xl text-white/90 font-medium mb-4 drop-shadow-md">Daily Earnings Dashboard</p>
            <div className="px-8 py-2 mb-6 bg-white/30 border border-white/30 rounded-full backdrop-blur-md shadow-lg">
              <p className="font-medium text-white drop-shadow-md">{currentDate}</p>
            </div>

            {/* quick stats (static classes so purge won’t remove them) */}
            <div className="flex flex-wrap justify-center gap-4 w-full max-w-3xl px-6">
              {[
                { dot: 'bg-green-400', text: "Today's Earnings: ₹2,450" },
                { dot: 'bg-blue-400', text: 'Orders: 18' },
                { dot: 'bg-amber-400', text: 'KM: 86' }
              ].map(({ dot, text }, i) => (
                <div key={i} className="flex items-center gap-2 px-5 py-3 bg-white/20 border border-white/30 rounded-full backdrop-blur-md text-white font-medium shadow-md hover:bg-white/30 hover:shadow-lg transition">
                  <span className={`w-3 h-3 rounded-full ${dot}`} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ----------  FORM  ---------- */}
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          <section className="relative p-8 mb-8 bg-white/20 border border-white/30 rounded-3xl backdrop-blur-lg shadow-[0_15px_50px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 sm:w-64 sm:h-64 bg-pink-400/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 sm:w-64 sm:h-64 bg-blue-400/30 rounded-full blur-3xl" />

            {/* section title */}
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-pink-400 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">Daily Transaction Entries</h2>
            </div>

            {/* amount inputs - now 6 cols on md */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-8">
              <AmountInput id="petrolCost" value={formData.petrolCost} onChange={handleInputChange} label="Petrol Cost" dotClass="bg-red-400" />
              <AmountInput id="cashOnDelivery" value={formData.cashOnDelivery} onChange={handleInputChange} label="Cash on Delivery" dotClass="bg-blue-400" />
              <AmountInput id="cashDeposit" value={formData.cashDeposit} onChange={handleInputChange} label="Cash Deposit" dotClass="bg-green-400" />
              <AmountInput id="otherCash" value={formData.otherCash} onChange={handleInputChange} label="Other Expense" dotClass="bg-pink-400" />
              <AmountInput id="dailyWithDrawAmount" value={formData.dailyWithDrawAmount} onChange={handleInputChange} label="Daily Withdraw Amount" dotClass="bg-yellow-400" />
              <AmountInput id="totalEarnings" value={formData.totalEarnings} onChange={handleInputChange} label="Total Earnings" dotClass="bg-green-600" />
            </div>

            {/* expense type selector */}
            <div className="relative mb-6">
              <select
                id="otherType"
                name="otherType"
                value={formData.otherType}
                onChange={handleOtherTypeChange}
                disabled={!formData.otherCash} // Disable if 'Other Expense' is empty
                className="w-full h-12 px-4 rounded-xl bg-black/30 backdrop-blur-md border border-white/30 text-white appearance-none shadow-md focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-blue-900 text-white">Select expense type</option>
                {otherOptions.map((o, i) => (
                  <option key={i} value={o} className="bg-blue-900 text-white">
                    {o}
                  </option>
                ))}
                <option value="custom" className="bg-blue-900 text-white">+ New expense type</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.245a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </div>
            </div>

            {formData.otherType === 'custom' && (
              <div className="mt-4">
                <input
                  type="text"
                  value={formData.customOtherType}
                  onChange={handleCustomOtherType}
                  placeholder="Enter new expense type"
                  className="w-full h-12 px-4 rounded-xl bg-black/30 backdrop-blur-md border border-white/30 text-white placeholder-white/60 shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            )}

            {/* Submission Status Message */}
            {submissionStatus && (
              <div
                className={`mt-4 p-4 rounded-xl text-center font-semibold ${
                  submissionStatus === 'success'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {submissionMessage}
              </div>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full mt-10 group overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 blur opacity-70 group-hover:opacity-100 transition animate-gradient-x" />
              <div className="relative flex items-center justify-center py-5 px-6 rounded-xl bg-black/30 backdrop-blur-md border border-white/30 group-hover:bg-black/40 transition">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
                      SUBMITTING...
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6 mr-2 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
                      SUBMIT DAILY EARNINGS
                    </span>
                  </>
                )}
              </div>
            </button>
          </section>
        </form>

        {/* floating stats card and twinkle stars remain unchanged */}

        <aside className="fixed bottom-4 right-4 md:bottom-6 md:right-6">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/20 backdrop-blur-lg border border-white/30 text-white shadow-lg hover:bg-black/30 hover:shadow-xl transition">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-400 to-blue-400">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm text-white/80">Weekly Avg</div>
              <div className="text-lg font-bold drop-shadow-sm">₹2,840</div>
            </div>
          </div>
        </aside>
      </div>

      {/* twinkle stars */}
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s linear ${Math.random() * 5}s infinite`
            }}
          />
        ))}
      </div>

      {/* local keyframes */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default DailyBasics;
