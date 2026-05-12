import { useState, useEffect } from 'react'

const BMI_CATEGORIES = [
  { label: 'Underweight', range: 'BMI < 18.5', color: '#60a5fa', min: 0, max: 18.5 },
  { label: 'Normal', range: '18.5 – 24.9', color: '#4ade80', min: 18.5, max: 25 },
  { label: 'Overweight', range: '25 – 29.9', color: '#facc15', min: 25, max: 30 },
  { label: 'Obese', range: 'BMI ≥ 30', color: '#f87171', min: 30, max: 100 },
]

const getCategory = (bmi) => {
  if (!bmi) return null
  if (bmi < 18.5) return BMI_CATEGORIES[0]
  if (bmi < 25) return BMI_CATEGORIES[1]
  if (bmi < 30) return BMI_CATEGORIES[2]
  return BMI_CATEGORIES[3]
}

const getGaugePercent = (bmi) => {
  if (!bmi) return 0
  const clamped = Math.min(Math.max(bmi, 10), 40)
  return ((clamped - 10) / 30) * 100
}

const tips = {
  Underweight: [
    'Increase caloric intake with nutrient-dense foods',
    'Add strength training to build muscle mass',
    'Consult a dietitian for a personalized meal plan',
  ],
  Normal: [
    'Maintain your healthy lifestyle — you\'re doing great!',
    'Keep up with regular physical activity (150 min/week)',
    'Focus on balanced nutrition and quality sleep',
  ],
  Overweight: [
    'Aim for a moderate calorie deficit of ~500 cal/day',
    'Increase aerobic activity — try brisk walking daily',
    'Reduce processed foods and sugary drinks',
  ],
  Obese: [
    'Consult a healthcare provider for a personalized plan',
    'Start with low-impact exercises like swimming or cycling',
    'Focus on sustainable lifestyle changes, not crash diets',
  ],
}

export default function App() {
  const [unit, setUnit] = useState('metric')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [bmi, setBmi] = useState(null)
  const [age, setAge] = useState('')
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (bmi) {
      setAnimated(false)
      setTimeout(() => setAnimated(true), 50)
    }
  }, [bmi])

  const calculate = () => {
    let h, w
    if (unit === 'metric') {
      h = parseFloat(height) / 100
      w = parseFloat(weight)
    } else {
      const totalIn = parseFloat(heightFt) * 12 + parseFloat(heightIn || 0)
      h = totalIn * 0.0254
      w = parseFloat(weight) * 0.453592
    }
    if (!h || !w || h <= 0 || w <= 0) return
    const result = w / (h * h)
    setBmi(Math.round(result * 10) / 10)
  }

  const reset = () => {
    setHeight(''); setWeight(''); setHeightFt('')
    setHeightIn(''); setBmi(null); setAge(''); setAnimated(false)
  }

  const category = getCategory(bmi)
  const gaugePercent = getGaugePercent(bmi)

  const idealWeightKg = height
    ? [18.5, 24.9].map(b => {
        const hm = parseFloat(height) / 100
        return Math.round(b * hm * hm)
      })
    : null

  return (
    <div style={styles.page}>
      <div style={styles.bg1} />
      <div style={styles.bg2} />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>HEALTH TOOL</div>
          <h1 style={styles.title}>BMI Calculator</h1>
          <p style={styles.subtitle}>
            Body Mass Index measures body fat based on height and weight
          </p>
        </div>

        {/* Unit Toggle */}
        <div style={styles.toggleRow}>
          {['metric', 'imperial'].map(u => (
            <button
              key={u}
              onClick={() => { setUnit(u); setBmi(null) }}
              style={{ ...styles.toggleBtn, ...(unit === u ? styles.toggleActive : {}) }}
            >
              {u === 'metric' ? '⚖ Metric (kg/cm)' : '📏 Imperial (lb/ft)'}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div style={styles.inputGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Age (optional)</label>
            <div style={styles.inputWrap}>
              <input
                type="number"
                placeholder="e.g. 25"
                value={age}
                onChange={e => setAge(e.target.value)}
                style={styles.input}
                min="1" max="120"
              />
              <span style={styles.unit}>yrs</span>
            </div>
          </div>

          {unit === 'metric' ? (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Height</label>
              <div style={styles.inputWrap}>
                <input
                  type="number"
                  placeholder="e.g. 170"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  style={styles.input}
                  min="50" max="300"
                />
                <span style={styles.unit}>cm</span>
              </div>
            </div>
          ) : (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Height</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ ...styles.inputWrap, flex: 1 }}>
                  <input
                    type="number"
                    placeholder="ft"
                    value={heightFt}
                    onChange={e => setHeightFt(e.target.value)}
                    style={styles.input}
                  />
                  <span style={styles.unit}>ft</span>
                </div>
                <div style={{ ...styles.inputWrap, flex: 1 }}>
                  <input
                    type="number"
                    placeholder="in"
                    value={heightIn}
                    onChange={e => setHeightIn(e.target.value)}
                    style={styles.input}
                    min="0" max="11"
                  />
                  <span style={styles.unit}>in</span>
                </div>
              </div>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Weight</label>
            <div style={styles.inputWrap}>
              <input
                type="number"
                placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
                value={weight}
                onChange={e => setWeight(e.target.value)}
                style={styles.input}
                min="1"
              />
              <span style={styles.unit}>{unit === 'metric' ? 'kg' : 'lb'}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.buttonRow}>
          <button onClick={calculate} style={styles.calcBtn}>Calculate BMI</button>
          {bmi && (
            <button onClick={reset} style={styles.resetBtn}>Reset</button>
          )}
        </div>

        {/* Result */}
        {bmi && category && (
          <div
            style={{
              ...styles.result,
              opacity: animated ? 1 : 0,
              transform: animated ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease',
            }}
          >
            {/* Score */}
            <div style={styles.scoreSection}>
              <div style={styles.scoreLabelRow}>
                <span style={styles.scoreLabel}>Your BMI</span>
                <span style={{ ...styles.categoryBadge, background: category.color + '22', color: category.color }}>
                  {category.label}
                </span>
              </div>
              <div style={{ ...styles.scoreNumber, color: category.color }}>
                {bmi}
              </div>

              {/* Gauge */}
              <div style={styles.gaugeWrap}>
                <div style={styles.gaugeTrack}>
                  {BMI_CATEGORIES.map((c, i) => (
                    <div key={i} style={{ ...styles.gaugeSegment, background: c.color, opacity: 0.3 }} />
                  ))}
                  <div
                    style={{
                      ...styles.gaugeNeedle,
                      left: `${Math.min(Math.max(gaugePercent, 1), 99)}%`,
                      background: category.color,
                      boxShadow: `0 0 12px ${category.color}`,
                      transition: 'left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  />
                </div>
                <div style={styles.gaugeLabels}>
                  <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div style={styles.categoriesGrid}>
              {BMI_CATEGORIES.map((c) => (
                <div
                  key={c.label}
                  style={{
                    ...styles.catCard,
                    borderColor: category.label === c.label ? c.color : 'transparent',
                    background: category.label === c.label ? c.color + '11' : 'var(--surface2)',
                  }}
                >
                  <div style={{ ...styles.catDot, background: c.color }} />
                  <div>
                    <div style={styles.catLabel}>{c.label}</div>
                    <div style={styles.catRange}>{c.range}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ideal Weight */}
            {unit === 'metric' && idealWeightKg && (
              <div style={styles.idealSection}>
                <div style={styles.idealLabel}>Ideal weight range for your height</div>
                <div style={styles.idealValue}>
                  {idealWeightKg[0]} – {idealWeightKg[1]} <span style={styles.idealUnit}>kg</span>
                </div>
              </div>
            )}

            {/* Tips */}
            <div style={styles.tipsSection}>
              <div style={styles.tipsTitle}>💡 Health Tips</div>
              <ul style={styles.tipsList}>
                {tips[category.label].map((t, i) => (
                  <li key={i} style={styles.tipItem}>
                    <span style={{ ...styles.tipDot, background: category.color }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <p style={styles.disclaimer}>
              BMI is a screening tool, not a diagnostic measure. Consult a healthcare professional for personalized advice.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    position: 'relative',
    overflow: 'hidden',
  },
  bg1: {
    position: 'fixed', top: '-20%', left: '-10%',
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,106,247,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bg2: {
    position: 'fixed', bottom: '-20%', right: '-10%',
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  container: {
    width: '100%',
    maxWidth: 540,
    position: 'relative',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  badge: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.15em',
    color: '#7c6af7',
    background: 'rgba(124,106,247,0.12)',
    border: '1px solid rgba(124,106,247,0.25)',
    padding: '4px 12px',
    borderRadius: 20,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 42,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#f0eff5',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#7a7a9a',
    lineHeight: 1.5,
  },
  toggleRow: {
    display: 'flex',
    gap: 8,
    marginBottom: '1.5rem',
    background: '#13131a',
    padding: 4,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  toggleBtn: {
    flex: 1,
    padding: '10px 0',
    border: 'none',
    background: 'transparent',
    color: '#7a7a9a',
    cursor: 'pointer',
    borderRadius: 9,
    fontSize: 13,
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  toggleActive: {
    background: '#1c1c26',
    color: '#f0eff5',
    boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
    marginBottom: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: '#7a7a9a',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 40px 12px 14px',
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    color: '#f0eff5',
    fontSize: 15,
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    transition: 'border 0.2s',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
  },
  unit: {
    position: 'absolute',
    right: 12,
    fontSize: 12,
    color: '#5a5a7a',
    pointerEvents: 'none',
  },
  buttonRow: {
    display: 'flex',
    gap: 10,
    marginBottom: '1.5rem',
  },
  calcBtn: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, #7c6af7, #a78bfa)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: 'Syne, sans-serif',
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: 'opacity 0.2s, transform 0.1s',
  },
  resetBtn: {
    padding: '14px 20px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#7a7a9a',
    fontSize: 14,
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
  },
  result: {
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  scoreSection: {
    padding: '1.75rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  scoreLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 13,
    color: '#7a7a9a',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: 20,
  },
  scoreNumber: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 72,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1,
    marginBottom: '1.5rem',
  },
  gaugeWrap: {
    width: '100%',
  },
  gaugeTrack: {
    position: 'relative',
    display: 'flex',
    height: 8,
    borderRadius: 8,
    overflow: 'visible',
    gap: 3,
    marginBottom: 6,
  },
  gaugeSegment: {
    flex: 1,
    borderRadius: 4,
  },
  gaugeNeedle: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 14,
    height: 14,
    borderRadius: '50%',
    border: '2px solid #0a0a0f',
    zIndex: 10,
  },
  gaugeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    color: '#5a5a7a',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    padding: '1.25rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  catCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid',
    transition: 'all 0.3s',
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: '#f0eff5',
    marginBottom: 2,
  },
  catRange: {
    fontSize: 11,
    color: '#7a7a9a',
  },
  idealSection: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idealLabel: {
    fontSize: 13,
    color: '#7a7a9a',
  },
  idealValue: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 20,
    fontWeight: 700,
    color: '#f0eff5',
  },
  idealUnit: {
    fontSize: 14,
    fontWeight: 400,
    color: '#7a7a9a',
  },
  tipsSection: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#f0eff5',
    marginBottom: 12,
    fontFamily: 'Syne, sans-serif',
  },
  tipsList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  tipItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    fontSize: 13,
    color: '#b0b0c8',
    lineHeight: 1.5,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 5,
  },
  disclaimer: {
    fontSize: 11,
    color: '#4a4a6a',
    padding: '1rem 1.5rem',
    lineHeight: 1.5,
  },
}
