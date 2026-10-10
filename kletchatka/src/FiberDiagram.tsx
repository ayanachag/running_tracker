import { useState } from 'react'

type Period = 'day' | 'week' | 'month'
type CategoryId = 'veg' | 'fruit' | 'grain' | 'nuts'

type Category = {
  id: CategoryId
  percent: number
  grams: number
}

type PeriodData = {
  total: number
  goal: number
  categories: Category[]
}

const CX = 646
const CY = 747

const rings: Record<
  CategoryId,
  { name: string; name2?: string; arc: string; bubble: string; radius: number; icon: string }
> = {
  veg: { name: 'Овощи', arc: '#9AC27D', bubble: '#75A94F', radius: 475, icon: '/assets/fiber/a9330.svg' },
  fruit: { name: 'Фрукты', arc: '#F58B90', bubble: '#F55D6D', radius: 380.5, icon: '/assets/fiber/e7eb2.svg' },
  grain: { name: 'Крупы', arc: '#B48BEA', bubble: '#965CE0', radius: 285.5, icon: '/assets/fiber/86126.svg' },
  nuts: {
    name: 'Орехи',
    name2: 'и семена',
    arc: '#F0AF62',
    bubble: '#EFA032',
    radius: 191.5,
    icon: '/assets/fiber/600ca.svg',
  },
}

const ringOrder: CategoryId[] = ['veg', 'fruit', 'grain', 'nuts']

const periods: Record<Period, PeriodData> = {
  day: {
    total: 28,
    goal: 30,
    categories: [
      { id: 'veg', percent: 35, grams: 9.8 },
      { id: 'fruit', percent: 13, grams: 7 },
      { id: 'grain', percent: 20, grams: 5.6 },
      { id: 'nuts', percent: 25, grams: 5.6 },
    ],
  },
  week: {
    total: 186,
    goal: 210,
    categories: [
      { id: 'veg', percent: 32, grams: 59.5 },
      { id: 'fruit', percent: 24, grams: 44.6 },
      { id: 'grain', percent: 26, grams: 48.4 },
      { id: 'nuts', percent: 18, grams: 33.5 },
    ],
  },
  month: {
    total: 742,
    goal: 900,
    categories: [
      { id: 'veg', percent: 29, grams: 215.2 },
      { id: 'fruit', percent: 21, grams: 155.8 },
      { id: 'grain', percent: 33, grams: 244.9 },
      { id: 'nuts', percent: 17, grams: 126.1 },
    ],
  },
}

const segments: { id: Period; label: string; offset: number }[] = [
  { id: 'day', label: 'День', offset: 9 },
  { id: 'week', label: 'Неделя', offset: 193 },
  { id: 'month', label: 'Месяц', offset: 381 },
]

const switcherX = 1158.475 - 555

function formatAmount(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', ',')
}

function formatGrams(value: number) {
  return `${value.toFixed(1).replace('.', ',')} г`
}

function sweepOf(percent: number) {
  return Math.min(178, 96 + percent * 2.35)
}

function pointOnArc(radius: number, sweep: number) {
  const rad = (sweep * Math.PI) / 180
  return {
    x: CX - radius * Math.cos(rad),
    y: CY - radius * Math.sin(rad),
  }
}

function arcPath(radius: number) {
  return `M ${CX - radius} ${CY} A ${radius} ${radius} 0 0 1 ${CX} ${CY - radius} A ${radius} ${radius} 0 0 1 ${CX + radius} ${CY}`
}

function Layer({
  src,
  x,
  y,
  w,
  h,
  className,
}: {
  src: string
  x: number
  y: number
  w: number
  h: number
  className?: string
}) {
  return (
    <img
      className={className}
      src={src}
      alt=""
      width={w}
      height={h}
      style={{ left: x, top: y, width: w, height: h }}
    />
  )
}

export default function FiberDiagram() {
  const [period, setPeriod] = useState<Period>('day')
  const [selected, setSelected] = useState<CategoryId | null>(null)
  const data = periods[period]
  const active = segments.find((item) => item.id === period) ?? segments[0]

  return (
    <>
      <section className="fiber" aria-label="Диаграмма источников клетчатки">
        <Layer src="/assets/fiber/d4e2b.svg" x={switcherX} y={75} w={555} h={86} />
        <Layer
          className="fiber-pill"
          src="/assets/fiber/dfe77.svg"
          x={switcherX + active.offset}
          y={83}
          w={160}
          h={71}
        />
        <svg className="fiber-chart" width="1292" height="1171" viewBox="0 0 1292 1171">
          {ringOrder.map((id) => (
            <path
              key={`${id}-track`}
              d={arcPath(rings[id].radius)}
              fill="none"
              stroke="#F0F0F0"
              strokeWidth="75"
              strokeLinecap="round"
            />
          ))}
          {data.categories.map((category) => {
            const ring = rings[category.id]
            const sweep = sweepOf(category.percent)
            const dot = pointOnArc(ring.radius, sweep)
            const bubble = pointOnArc(ring.radius + 68, sweep)
            const lit = selected === category.id
            const faded = selected !== null && !lit
            return (
              <g key={category.id} className={faded ? 'fiber-arc fiber-arc-dim' : 'fiber-arc'}>
                <path
                  d={arcPath(ring.radius)}
                  fill="none"
                  stroke={lit ? ring.bubble : ring.arc}
                  strokeWidth={lit ? 84 : 75}
                  strokeLinecap="round"
                  pathLength={180}
                  strokeDasharray={`${sweep} 180`}
                />
                <circle cx={dot.x} cy={dot.y} r="16" fill="#fff" />
                <circle cx={bubble.x} cy={bubble.y} r="49" fill={ring.bubble} />
                <text
                  x={bubble.x}
                  y={bubble.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  fontFamily="Inter, sans-serif"
                  fontSize="33"
                  fontWeight="700"
                >
                  {category.percent}%
                </text>
              </g>
            )
          })}
          <circle cx={CX} cy={CY} r="113.5" fill="#FBFAF8" fillOpacity="0.5" stroke="#F0F0F0" />
        </svg>
        {segments.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === period ? 'fiber-seg fiber-seg-active' : 'fiber-seg'}
            style={{ left: switcherX + item.offset }}
            aria-pressed={item.id === period}
            onClick={() => setPeriod(item.id)}
          >
            {item.label}
          </button>
        ))}
        <p className="fiber-total-label">Всего</p>
        <p className="fiber-total">
          {formatAmount(data.total)} г
        </p>
        <p className="fiber-total-goal">из {formatAmount(data.goal)} г</p>
      </section>
      <div className="fiber-legend">
        {ringOrder.map((id) => {
          const category = data.categories.find((item) => item.id === id)!
          const ring = rings[id]
          return (
            <button
              key={id}
              type="button"
              className={
                selected === id ? `legend-card legend-card-on legend-${id}` : `legend-card legend-${id}`
              }
              aria-pressed={selected === id}
              onClick={() => setSelected((current) => (current === id ? null : id))}
            >
              <img src={ring.icon} alt="" width={24} height={24} />
              <span className="legend-copy">
                <span className="legend-name">{ring.name}</span>
                {ring.name2 ? <span className="legend-name">{ring.name2}</span> : null}
                <span className="legend-grams">{formatGrams(category.grams)}</span>
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}
