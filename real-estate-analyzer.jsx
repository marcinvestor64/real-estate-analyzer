import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Home, Calculator, AlertCircle, CheckCircle } from 'lucide-react';

const RealEstateAnalyzer = () => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [rehabCosts, setRehabCosts] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const generateAnalysis = () => {
    if (!street || !city || !state || !zip) {
      alert('Please fill in all address fields');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const baseValue = Math.floor(Math.random() * 300000) + 250000;
      const appreciationRate = 0.03 + (Math.random() * 0.04);
      
      const historicalData = [];
      let currentValue = baseValue * 0.82;
      for (let i = -5; i <= 0; i++) {
        historicalData.push({
          year: new Date().getFullYear() + i,
          value: Math.round(currentValue),
        });
        currentValue *= (1 + appreciationRate - 0.01);
      }
      
      const futureData = [];
      currentValue = baseValue;
      for (let i = 0; i <= 5; i++) {
        futureData.push({
          year: new Date().getFullYear() + i,
          projected: Math.round(currentValue),
          conservative: Math.round(currentValue * 0.95),
          optimistic: Math.round(currentValue * 1.05),
        });
        currentValue *= (1 + appreciationRate);
      }
      
      const downPayment = baseValue * 0.20;
      const loanAmount = baseValue * 0.80;
      const closingCosts = baseValue * 0.03;
      const monthlyRate = 0.065 / 12;
      const numPayments = 360;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                            (Math.pow(1 + monthlyRate, numPayments) - 1);
      const propertyTax = baseValue * 0.012 / 12;
      const insurance = (baseValue * 0.004) / 12;
      const hoa = 150;
      
      const totalMonthly = monthlyPayment + propertyTax + insurance + hoa;
      const totalInitial = downPayment + closingCosts + rehabCosts;
      
      const monthlyRentLongTerm = baseValue * 0.008;
      const monthlyRentShortTerm = baseValue * 0.012;
      const vacancyRateLongTerm = 0.08;
      const vacancyRateShortTerm = 0.15;
      const managementFeeLongTerm = 0.10;
      const managementFeeShortTerm = 0.20;
      
      const rentalProjections = [];
      for (let year = 1; year <= 3; year++) {
        const ltAnnualRent = monthlyRentLongTerm * 12 * (1 - vacancyRateLongTerm);
        const ltExpenses = (totalMonthly * 12) + (ltAnnualRent * managementFeeLongTerm) + 
                          (baseValue * 0.01);
        const ltProfit = ltAnnualRent - ltExpenses;
        
        const stAnnualRent = monthlyRentShortTerm * 12 * (1 - vacancyRateShortTerm);
        const stExpenses = (totalMonthly * 12) + (stAnnualRent * managementFeeShortTerm) + 
                          (baseValue * 0.02) + 6000;
        const stProfit = stAnnualRent - stExpenses;
        
        rentalProjections.push({
          year,
          longTermRevenue: Math.round(ltAnnualRent),
          longTermProfit: Math.round(ltProfit),
          shortTermRevenue: Math.round(stAnnualRent),
          shortTermProfit: Math.round(stProfit),
        });
      }
      
      const afterRepairValue = baseValue + (rehabCosts * 1.5);
      const holdingCosts = totalMonthly * 6;
      const flipProfit = afterRepairValue - baseValue - rehabCosts - holdingCosts - (afterRepairValue * 0.06);
      const flipROI = (flipProfit / totalInitial) * 100;
      
      const brrrARV = baseValue + (rehabCosts * 1.3);
      const refinanceAmount = brrrARV * 0.75;
      const cashRecovered = refinanceAmount - loanAmount;
      const brrrCashLeft = totalInitial - cashRecovered;
      const brrrAnnualCashFlow = rentalProjections[0].longTermProfit;
      const brrrROI = brrrCashLeft > 0 ? (brrrAnnualCashFlow / brrrCashLeft) * 100 : 999;
      
      const holdAppreciation = futureData[3].projected - baseValue;
      const holdCashFlow = rentalProjections.reduce((sum, p) => sum + p.longTermProfit, 0);
      const holdTotalReturn = holdAppreciation + holdCashFlow;
      const holdROI = (holdTotalReturn / totalInitial) * 100;
      
      let recommendation;
      let recommendationReason;
      
      if (flipROI > 25 && rehabCosts > 0) {
        recommendation = "Fix & Flip";
        recommendationReason = `Strong flip potential with ${flipROI.toFixed(1)}% ROI. Quick profit opportunity.`;
      } else if (brrrROI > 20 && rehabCosts > 0) {
        recommendation = "BRRR Strategy";
        recommendationReason = `Excellent BRRR opportunity with ${brrrROI.toFixed(1)}% cash-on-cash return. Recover most of your investment.`;
      } else if (holdROI > 15) {
        recommendation = "Long-Term Hold";
        recommendationReason = `Solid buy-and-hold with ${holdROI.toFixed(1)}% total ROI over 3 years. Strong appreciation and cash flow.`;
      } else if (rentalProjections[0].shortTermProfit > rentalProjections[0].longTermProfit * 1.5) {
        recommendation = "Short-Term Rental";
        recommendationReason = `Short-term rental shows significantly better returns. Consider Airbnb strategy.`;
      } else {
        recommendation = "Not Recommended";
        recommendationReason = `Returns are below investment-grade thresholds. Consider other opportunities.`;
      }
      
      setAnalysisData({
        property: {
          address: `${street}, ${city}, ${state} ${zip}`,
          currentValue: baseValue,
          appreciationRate: (appreciationRate * 100).toFixed(2),
        },
        historical: historicalData,
        projections: futureData,
        costs: {
          purchasePrice: baseValue,
          downPayment,
          loanAmount,
          closingCosts,
          rehabCosts,
          totalInitial,
          monthlyPayment,
          propertyTax,
          insurance,
          hoa,
          totalMonthly,
        },
        rental: rentalProjections,
        strategies: {
          flip: { profit: flipProfit, roi: flipROI },
          brrr: { cashRecovered, cashLeft: brrrCashLeft, roi: brrrROI },
          hold: { totalReturn: holdTotalReturn, roi: holdROI },
        },
        recommendation,
        recommendationReason,
      });
      
      setLoading(false);
    }, 1500);
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
    setStreet('');
    setCity('');
    setState('');
    setZip('');
    setRehabCosts(0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    fontSize: '16px',
    border: '2px solid rgba(96, 165, 250, 0.3)',
    borderRadius: '12px',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#e2e8f0',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    color: '#cbd5e1',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      fontFamily: '"Inter", -apple-system, sans-serif',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <Home size={40} color="#60a5fa" />
            <h1 style={{
              margin: 0,
              fontSize: '42px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}>
              Real Estate Investment Analyzer
            </h1>
          </div>
          <p style={{
            color: '#94a3b8',
            fontSize: '18px',
            margin: 0,
            fontWeight: '400',
          }}>
            Comprehensive property analysis and investment strategy recommendations
          </p>
        </div>

        {/* Input Section */}
        {!analysisData && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{
              color: '#e2e8f0',
              fontSize: '24px',
              marginTop: 0,
              marginBottom: '30px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <Calculator size={24} color="#60a5fa" />
              Property Details
            </h2>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>
                Street Address
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g., 123 Main Street"
                style={inputStyle}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '20px',
              marginBottom: '25px',
            }}>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., San Francisco"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select</option>
                  {usStates.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>ZIP Code</label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="e.g., 94102"
                  maxLength="5"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={labelStyle}>
                Estimated Rehab Costs (Optional)
              </label>
              <input
                type="number"
                value={rehabCosts}
                onChange={(e) => setRehabCosts(Number(e.target.value))}
                placeholder="Enter rehab budget (e.g., 25000)"
                style={inputStyle}
              />
              <p style={{
                color: '#94a3b8',
                fontSize: '13px',
                marginTop: '10px',
                marginBottom: 0,
              }}>
                Enter $0 if this is a turnkey property. Add estimated costs for renovations, repairs, or upgrades.
              </p>
            </div>

            <button
              onClick={generateAnalysis}
              disabled={loading}
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '18px',
                fontWeight: '700',
                background: loading
                  ? 'rgba(100, 116, 139, 0.3)'
                  : 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                color: loading ? '#64748b' : '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: loading ? 'none' : '0 10px 30px rgba(96, 165, 250, 0.3)',
              }}
            >
              {loading ? 'Analyzing Property...' : 'Generate Analysis'}
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {analysisData && (
          <div>
            {/* Recommendation Banner */}
            <div style={{
              background: analysisData.recommendation === 'Not Recommended'
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.15))',
              border: analysisData.recommendation === 'Not Recommended'
                ? '2px solid rgba(239, 68, 68, 0.3)'
                : '2px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '20px',
              padding: '30px',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}>
              {analysisData.recommendation === 'Not Recommended' ? (
                <AlertCircle size={48} color="#ef4444" />
              ) : (
                <CheckCircle size={48} color="#22c55e" />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '28px',
                  fontWeight: '800',
                  color: analysisData.recommendation === 'Not Recommended' ? '#fca5a5' : '#86efac',
                }}>
                  Recommendation: {analysisData.recommendation}
                </h3>
                <p style={{
                  margin: 0,
                  color: '#cbd5e1',
                  fontSize: '16px',
                  lineHeight: '1.6',
                }}>
                  {analysisData.recommendationReason}
                </p>
              </div>
            </div>

            {/* Property Overview */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '40px',
              marginBottom: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}>
              <h2 style={{
                color: '#e2e8f0',
                fontSize: '24px',
                marginTop: 0,
                marginBottom: '20px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Home size={24} color="#60a5fa" />
                Property Overview
              </h2>

              <div style={{
                background: 'rgba(96, 165, 250, 0.1)',
                border: '2px solid rgba(96, 165, 250, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '30px',
              }}>
                <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>
                  Property Address
                </div>
                <div style={{ color: '#60a5fa', fontSize: '20px', fontWeight: '700' }}>
                  {analysisData.property.address}
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px',
              }}>
                <div style={{
                  background: 'rgba(96, 165, 250, 0.1)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(96, 165, 250, 0.2)',
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Current Value
                  </div>
                  <div style={{ color: '#60a5fa', fontSize: '32px', fontWeight: '800' }}>
                    {formatCurrency(analysisData.property.currentValue)}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(167, 139, 250, 0.1)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(167, 139, 250, 0.2)',
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Appreciation Rate
                  </div>
                  <div style={{ color: '#a78bfa', fontSize: '32px', fontWeight: '800' }}>
                    {analysisData.property.appreciationRate}% / yr
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    5-Year Projection
                  </div>
                  <div style={{ color: '#22c55e', fontSize: '32px', fontWeight: '800' }}>
                    {formatCurrency(analysisData.projections[5].projected)}
                  </div>
                </div>
              </div>

              <h3 style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
                Property Value: Historical & Projected
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={[...analysisData.historical, ...analysisData.projections.slice(1)]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '13px' }} />
                  <YAxis 
                    stroke="#94a3b8" 
                    style={{ fontSize: '13px' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(96, 165, 250, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#60a5fa" 
                    strokeWidth={3}
                    name="Historical Value"
                    dot={{ fill: '#60a5fa', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projected" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Projected Value"
                    dot={{ fill: '#22c55e', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conservative" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    name="Conservative"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="optimistic" 
                    stroke="#a78bfa" 
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    name="Optimistic"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Purchase Costs */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '40px',
              marginBottom: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}>
              <h2 style={{
                color: '#e2e8f0',
                fontSize: '24px',
                marginTop: 0,
                marginBottom: '30px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <DollarSign size={24} color="#60a5fa" />
                Investment Details (20% Down)
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px',
              }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Purchase Price</div>
                  <div style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: '700' }}>
                    {formatCurrency(analysisData.costs.purchasePrice)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Down Payment (20%)</div>
                  <div style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: '700' }}>
                    {formatCurrency(analysisData.costs.downPayment)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Closing Costs</div>
                  <div style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: '700' }}>
                    {formatCurrency(analysisData.costs.closingCosts)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Rehab Costs</div>
                  <div style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: '700' }}>
                    {formatCurrency(analysisData.costs.rehabCosts)}
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(96, 165, 250, 0.15)',
                border: '2px solid rgba(96, 165, 250, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '30px',
              }}>
                <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                  Total Initial Investment
                </div>
                <div style={{ color: '#60a5fa', fontSize: '36px', fontWeight: '800' }}>
                  {formatCurrency(analysisData.costs.totalInitial)}
                </div>
              </div>

              <h3 style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
                Monthly Carrying Costs
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}>
                <div style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Mortgage (P&I)</div>
                  <div style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: '700' }}>
                    {formatCurrency(analysisData.costs.monthlyPayment)}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Property Tax</div>
                  <div style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: '700' }}>
                    {formatCurrency(analysisData.costs.propertyTax)}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Insurance</div>
                  <div style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: '700' }}>
                    {formatCurrency(analysisData.costs.insurance)}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>HOA</div>
                  <div style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: '700' }}>
                    {formatCurrency(analysisData.costs.hoa)}
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '16px',
                padding: '20px',
              }}>
                <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                  Total Monthly Costs
                </div>
                <div style={{ color: '#fca5a5', fontSize: '32px', fontWeight: '800' }}>
                  {formatCurrency(analysisData.costs.totalMonthly)}
                </div>
              </div>
            </div>

            {/* Rental Projections */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '40px',
              marginBottom: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}>
              <h2 style={{
                color: '#e2e8f0',
                fontSize: '24px',
                marginTop: 0,
                marginBottom: '30px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <TrendingUp size={24} color="#60a5fa" />
                3-Year Rental Projections
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                marginBottom: '40px',
              }}>
                <div>
                  <h3 style={{
                    color: '#22c55e',
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '20px',
                  }}>
                    Long-Term Rental
                  </h3>
                  {analysisData.rental.map((year, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                        Year {year.year}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>Annual Revenue</span>
                        <span style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: '700' }}>
                          {formatCurrency(year.longTermRevenue)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>Net Profit</span>
                        <span style={{
                          color: year.longTermProfit > 0 ? '#22c55e' : '#ef4444',
                          fontSize: '17px',
                          fontWeight: '800',
                        }}>
                          {formatCurrency(year.longTermProfit)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginTop: '16px',
                  }}>
                    <div style={{ color: '#86efac', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                      3-Year Total Profit
                    </div>
                    <div style={{ color: '#22c55e', fontSize: '28px', fontWeight: '800' }}>
                      {formatCurrency(analysisData.rental.reduce((sum, y) => sum + y.longTermProfit, 0))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{
                    color: '#a78bfa',
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '20px',
                  }}>
                    Short-Term Rental (Airbnb)
                  </h3>
                  {analysisData.rental.map((year, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(167, 139, 250, 0.1)',
                        border: '1px solid rgba(167, 139, 250, 0.2)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                        Year {year.year}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>Annual Revenue</span>
                        <span style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: '700' }}>
                          {formatCurrency(year.shortTermRevenue)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>Net Profit</span>
                        <span style={{
                          color: year.shortTermProfit > 0 ? '#a78bfa' : '#ef4444',
                          fontSize: '17px',
                          fontWeight: '800',
                        }}>
                          {formatCurrency(year.shortTermProfit)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div style={{
                    background: 'rgba(167, 139, 250, 0.2)',
                    border: '2px solid rgba(167, 139, 250, 0.4)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginTop: '16px',
                  }}>
                    <div style={{ color: '#c4b5fd', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                      3-Year Total Profit
                    </div>
                    <div style={{ color: '#a78bfa', fontSize: '28px', fontWeight: '800' }}>
                      {formatCurrency(analysisData.rental.reduce((sum, y) => sum + y.shortTermProfit, 0))}
                    </div>
                  </div>
                </div>
              </div>

              <h3 style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
                Rental Strategy Comparison
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={analysisData.rental}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '13px' }} />
                  <YAxis 
                    stroke="#94a3b8" 
                    style={{ fontSize: '13px' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(96, 165, 250, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                  <Bar dataKey="longTermProfit" fill="#22c55e" name="Long-Term Profit" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="shortTermProfit" fill="#a78bfa" name="Short-Term Profit" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Investment Strategies */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '40px',
              marginBottom: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}>
              <h2 style={{
                color: '#e2e8f0',
                fontSize: '24px',
                marginTop: 0,
                marginBottom: '30px',
                fontWeight: '700',
              }}>
                Investment Strategy Analysis
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
                  border: '2px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '16px',
                  padding: '28px',
                }}>
                  <h3 style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '700', marginTop: 0, marginBottom: '20px' }}>
                    Fix & Flip
                  </h3>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Estimated Profit</div>
                    <div style={{
                      color: analysisData.strategies.flip.profit > 0 ? '#fbbf24' : '#ef4444',
                      fontSize: '28px',
                      fontWeight: '800',
                    }}>
                      {formatCurrency(analysisData.strategies.flip.profit)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>ROI</div>
                    <div style={{
                      color: analysisData.strategies.flip.roi > 0 ? '#fbbf24' : '#ef4444',
                      fontSize: '24px',
                      fontWeight: '800',
                    }}>
                      {analysisData.strategies.flip.roi.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '16px',
                  padding: '28px',
                }}>
                  <h3 style={{ color: '#3b82f6', fontSize: '20px', fontWeight: '700', marginTop: 0, marginBottom: '20px' }}>
                    BRRR Strategy
                  </h3>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Cash Recovered</div>
                    <div style={{ color: '#3b82f6', fontSize: '24px', fontWeight: '800' }}>
                      {formatCurrency(analysisData.strategies.brrr.cashRecovered)}
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Cash Left In Deal</div>
                    <div style={{ color: '#cbd5e1', fontSize: '20px', fontWeight: '700' }}>
                      {formatCurrency(analysisData.strategies.brrr.cashLeft)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Cash-on-Cash Return</div>
                    <div style={{
                      color: analysisData.strategies.brrr.roi > 100 ? '#22c55e' : '#3b82f6',
                      fontSize: '24px',
                      fontWeight: '800',
                    }}>
                      {analysisData.strategies.brrr.roi > 500 ? '∞' : `${analysisData.strategies.brrr.roi.toFixed(1)}%`}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '28px',
                }}>
                  <h3 style={{ color: '#10b981', fontSize: '20px', fontWeight: '700', marginTop: 0, marginBottom: '20px' }}>
                    Buy & Hold
                  </h3>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>3-Year Total Return</div>
                    <div style={{ color: '#10b981', fontSize: '24px', fontWeight: '800' }}>
                      {formatCurrency(analysisData.strategies.hold.totalReturn)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Total ROI</div>
                    <div style={{
                      color: analysisData.strategies.hold.roi > 0 ? '#10b981' : '#ef4444',
                      fontSize: '24px',
                      fontWeight: '800',
                    }}>
                      {analysisData.strategies.hold.roi.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={resetAnalysis}
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '18px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 10px 30px rgba(96, 165, 250, 0.3)',
              }}
            >
              ← Analyze Another Property
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
      `}</style>
    </div>
  );
};

export default RealEstateAnalyzer;
