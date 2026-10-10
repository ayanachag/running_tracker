import { useState } from 'react'
import FiberDiagram from './FiberDiagram'
import './App.css'

type TabId = 'home' | 'products' | 'diary' | 'profile'
type ProductId = 'apple' | 'pear' | 'broccoli'

type Product = {
  id: ProductId
  name: string
  category: string
  fiber: string
  note: string
  portionLabel: string
  portionWeight: string
  portionFiber: string
  grams: number
  fiberAmount: number
  approximate: boolean
}

type DiaryEntry = {
  id: number
  productId: ProductId
  name: string
  portion: string
  fiber: string
}

const products: Product[] = [
  {
    id: 'apple',
    name: 'Яблоко',
    category: 'Фрукт • источник пищевых волокон',
    fiber: '2,4 г',
    note: 'Среднее содержание в свежем яблоке с кожурой',
    portionLabel: '1 среднее яблоко',
    portionWeight: '≈ 180 г',
    portionFiber: '4,3 г',
    grams: 180,
    fiberAmount: 4.3,
    approximate: true,
  },
  {
    id: 'pear',
    name: 'Груша',
    category: 'Фрукт • источник пищевых волокон',
    fiber: '3,1 г',
    note: 'Среднее содержание в свежей груше с кожурой',
    portionLabel: '100 г',
    portionWeight: '100 г',
    portionFiber: '3,1 г',
    grams: 100,
    fiberAmount: 3.1,
    approximate: false,
  },
  {
    id: 'broccoli',
    name: 'Брокколи',
    category: 'Овощ • источник пищевых волокон',
    fiber: '2,6 г',
    note: 'Среднее содержание в свежей брокколи',
    portionLabel: '100 г',
    portionWeight: '100 г',
    portionFiber: '2,6 г',
    grams: 100,
    fiberAmount: 2.6,
    approximate: false,
  },
]

const tabs: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Главная' },
  { id: 'products', label: 'Продукты' },
  { id: 'diary', label: 'Дневник' },
  { id: 'profile', label: 'Профиль' },
]

function productById(id: ProductId) {
  return products.find((item) => item.id === id) ?? products[0]
}

function formatGrams(value: number) {
  const rounded = Math.round(value * 10) / 10
  const text = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace('.', ',')
  return `${text} г`
}

function portionPhrase(product: Product, count: number) {
  if (count === 1) return product.portionLabel
  if (product.id !== 'apple') return `${count} × 100 г`

  const mod10 = count % 10
  const mod100 = count % 100
  const word =
    mod10 === 1 && mod100 !== 11
      ? 'яблоко'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? 'яблока'
        : 'яблок'
  return `${count} ${word}`
}

function BroccoliIcon() {
  return (
    <span className="broccoli" aria-hidden="true">
      <span className="broccoli-crown">
        <img
          src="/assets/broccoli-vector.svg"
          alt=""
          width={29.4247}
          height={25.4311}
        />
        <span className="broccoli-crown-fill">
          <img
            src="/assets/broccoli-fill.svg"
            alt=""
            width={33.0638}
            height={20.4022}
          />
        </span>
      </span>
      <span className="broccoli-stem">
        <img
          src="/assets/broccoli-vector-2.svg"
          alt=""
          width={11.0471}
          height={13.6012}
        />
        <span className="broccoli-stem-fill">
          <img
            src="/assets/broccoli-fill-2.svg"
            alt=""
            width={8.19264}
            height={12.4488}
          />
        </span>
      </span>
    </span>
  )
}

function ProductMark({ id }: { id: ProductId }) {
  if (id === 'apple') {
    return (
      <img
        src="/assets/apple-chip.svg"
        alt=""
        width={25.4971}
        height={31.3737}
      />
    )
  }

  if (id === 'pear') {
    return (
      <img src="/assets/pear.svg" alt="" width={26.6212} height={31.9998} />
    )
  }

  return <BroccoliIcon />
}

const APPLE_WIDTH = 194.597
const APPLE_HEIGHT = 239.429

function AppleCluster({ count }: { count: number }) {
  const overlap = 40
  const maxWidth = 392
  const naturalWidth = APPLE_WIDTH + (count - 1) * (APPLE_WIDTH - overlap)
  const scale = Math.min(1, maxWidth / naturalWidth)
  const groupWidth = naturalWidth * scale
  const groupHeight = APPLE_HEIGHT * scale
  const centerX = 123 + APPLE_WIDTH / 2
  const centerY = 195 + APPLE_HEIGHT / 2

  return (
    <div
      className="hero-cluster"
      style={{
        left: centerX - groupWidth / 2,
        top: centerY - groupHeight / 2,
        width: groupWidth,
        height: groupHeight,
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <img
          key={index}
          src="/assets/apple.svg"
          alt=""
          width={APPLE_WIDTH}
          height={APPLE_HEIGHT}
          style={{
            left: index * (APPLE_WIDTH - overlap) * scale,
            zIndex: index,
            transform: `scale(${scale})`,
          }}
        />
      ))}
    </div>
  )
}

function Hero({ id, count }: { id: ProductId; count: number }) {
  if (id === 'apple') {
    return <AppleCluster count={count} />
  }

  if (id === 'pear') {
    return (
      <img
        className="hero hero-pear"
        src="/assets/pear.svg"
        alt=""
        width={26.6212}
        height={31.9998}
      />
    )
  }

  return (
    <span className="hero hero-broccoli">
      <BroccoliIcon />
    </span>
  )
}

function TabIcon({ id, active }: { id: TabId; active: boolean }) {
  const fill = active ? '#4C9661' : '#8A958B'
  if (id === 'home') {
    return (
      <svg className="tab-icon" width="25" height="26" viewBox="0 0 25 26" aria-hidden="true">
        <path
          d="M25 10.7815V26H0V10.7815L12.5 0L25 10.7815ZM3.57143 12.3372V22.5344H21.4286V12.3372L12.5 4.63548L3.57143 12.3372Z"
          fill={fill}
        />
      </svg>
    )
  }
  if (id === 'products') {
    return (
      <svg className="tab-icon" width="25.3311" height="25.3281" viewBox="0 0 25.3311 25.3281" aria-hidden="true">
        <path
          d="M10.875 0C16.8811 1.44324e-05 21.75 4.86893 21.75 10.875C21.7499 13.3363 20.9304 15.6053 19.5518 17.4277L25.3311 23.207L23.21 25.3281L17.4316 19.5498C15.6086 20.9298 13.3378 21.75 10.875 21.75C4.86909 21.75 0.000278315 16.8808 0 10.875C0 4.86892 4.86892 0 10.875 0ZM10.875 3C6.52577 3 3 6.52577 3 10.875C3.00028 15.224 6.52594 18.75 10.875 18.75C15.224 18.75 18.7497 15.224 18.75 10.875C18.75 6.52578 15.2242 3.00001 10.875 3Z"
          fill={fill}
        />
      </svg>
    )
  }
  if (id === 'diary') {
    return (
      <svg className="tab-icon" width="20" height="26" viewBox="0 0 20 26" aria-hidden="true">
        <path d="M20 0V26H0V0H20ZM2.5 23.4H17.5V2.6H2.5V23.4ZM15 5.2V7.8H5V5.2H15Z" fill={fill} />
      </svg>
    )
  }
  return (
    <svg className="tab-icon" width="24" height="26" viewBox="0 0 24 26" aria-hidden="true">
      <path
        d="M15.8333 6.5C15.8333 4.10677 13.8932 2.16667 11.5 2.16667C9.10677 2.16667 7.16667 4.10677 7.16667 6.5C7.16667 8.89323 9.10677 10.8333 11.5 10.8333C13.8932 10.8333 15.8333 8.89323 15.8333 6.5ZM18 6.5C18 10.0899 15.0899 13 11.5 13C7.91015 13 5 10.0899 5 6.5C5 2.91015 7.91015 0 11.5 0C15.0899 0 18 2.91015 18 6.5Z"
        fill={fill}
      />
      <path
        d="M12 13C15.1306 13 17.7652 14.0963 19.807 16.2871C21.811 18.4374 23.1763 21.567 24 25.5442L21.6423 26C20.8629 22.2367 19.623 19.5606 18.02 17.8406C16.4548 16.1611 14.4803 15.3222 12 15.3222C9.51966 15.3222 7.54524 16.1611 5.98004 17.8406C4.37702 19.5606 3.13714 22.2367 2.35773 26L0 25.5442C0.82372 21.567 2.18899 18.4374 4.19296 16.2871C6.23479 14.0963 8.86941 13 12 13Z"
        fill={fill}
      />
    </svg>
  )
}

function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [productId, setProductId] = useState<ProductId>('apple')
  const [portionCount, setPortionCount] = useState(1)
  const [menuOpen, setMenuOpen] = useState(false)
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const product = productById(productId)
  const portion =
    portionCount === 1
      ? {
          label: product.portionLabel,
          weight: product.portionWeight,
          fiber: product.portionFiber,
        }
      : {
          label: portionPhrase(product, portionCount),
          weight: `${product.approximate ? '≈ ' : ''}${formatGrams(product.grams * portionCount)}`,
          fiber: formatGrams(product.fiberAmount * portionCount),
        }

  function openProduct(id: ProductId) {
    setProductId(id)
    setPortionCount(1)
    setTab('home')
    setMenuOpen(false)
  }

  function addPortion() {
    setEntries((current) => [
      {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        portion: portion.weight,
        fiber: portion.fiber,
      },
      ...current,
    ])
    setMenuOpen(false)
  }

  return (
    <div className="stage">
      <article className={tab === 'home' ? 'phone phone-home' : 'phone'}>
        <p className="time">9:41</p>
        <img
          className="status"
          src="/assets/status.svg"
          alt=""
          width={40.5}
          height={11.5}
        />

        <button
          className="back"
          type="button"
          aria-label="Назад"
          onClick={() => {
            setMenuOpen(false)
            if (tab !== 'home') {
              setTab('home')
              return
            }
            setProductId('apple')
            setPortionCount(1)
          }}
        >
          <img src="/assets/back.svg" alt="" width={23.9938} height={20.4} />
        </button>
        <p className="brand">КЛЕТЧАТКА</p>
        <button
          className="more"
          type="button"
          aria-label="Ещё"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <img src="/assets/more.svg" alt="" width={36} height={36} />
        </button>

        {menuOpen && (
          <div className="menu" role="menu">
            <button type="button" role="menuitem" onClick={addPortion}>
              Добавить порцию в дневник
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setTab('diary')
                setMenuOpen(false)
              }}
            >
              Открыть дневник
            </button>
          </div>
        )}

        {tab === 'home' && (
          <>
            <h1 className="title">{product.name}</h1>
            <p className="subtitle">{product.category}</p>
            <Hero id={product.id} count={portionCount} />

            <img
              className="fiber-card"
              src="/assets/fiber-card.svg"
              alt=""
              width={340}
              height={126}
            />
            <img
              className="leaf"
              src="/assets/leaf.svg"
              alt=""
              width={42.5002}
              height={42}
            />
            <p className="fiber-label">Клетчатка</p>
            <p className="fiber-value">{product.fiber}</p>
            <p className="fiber-unit">на 100 г</p>
            <img
              className="fiber-divider"
              src="/assets/divider.svg"
              alt=""
              width={299.524}
              height={1}
            />
            <p className="fiber-note">{product.note}</p>

            <p className="section">Размер порции</p>
            <img
              className="portion-card"
              src="/assets/portion-card.svg"
              alt=""
              width={340}
              height={64}
            />
            <button
              className="step minus"
              type="button"
              aria-label="Уменьшить порцию"
              onClick={() => setPortionCount((count) => Math.max(1, count - 1))}
            >
              <img src="/assets/minus.svg" alt="" width={40.4762} height={40} />
            </button>
            <button
              className="step plus"
              type="button"
              aria-label="Увеличить порцию"
              onClick={() => setPortionCount((count) => count + 1)}
            >
              <img src="/assets/plus.svg" alt="" width={40.4762} height={40} />
            </button>
            <p className="portion-label">{portion.label}</p>
            <p className="portion-weight">{portion.weight}</p>
            <p className="portion-fiber">{portion.fiber}</p>

            <p className="section section-products">Другие продукты</p>
            <div className="chips">
              {products.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip chip-${item.id}`}
                  aria-current={item.id === product.id ? 'true' : undefined}
                  onClick={() => openProduct(item.id)}
                >
                  <span className={`chip-mark chip-mark-${item.id}`}>
                    <ProductMark id={item.id} />
                  </span>
                  <span className="chip-copy">
                    <span className="chip-name">{item.name}</span>
                    <span className="chip-fiber">{item.fiber}</span>
                  </span>
                </button>
              ))}
            </div>
            <FiberDiagram />
          </>
        )}

        {tab === 'products' && (
          <section className="page">
            <h1 className="title">Продукты</h1>
            <p className="subtitle">Каталог источников клетчатки</p>
            <ul className="catalog">
              {products.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => openProduct(item.id)}>
                    <span className={`chip-mark chip-mark-${item.id}`}>
                      <ProductMark id={item.id} />
                    </span>
                    <span className="chip-copy">
                      <span className="chip-name">{item.name}</span>
                      <span className="chip-fiber">{item.fiber} на 100 г</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === 'diary' && (
          <section className="page">
            <h1 className="title">Дневник</h1>
            <p className="subtitle">
              {entries.length === 0
                ? 'Порции появятся здесь'
                : `Записей: ${entries.length}`}
            </p>
            {entries.length === 0 ? (
              <p className="empty">
                Добавьте порцию через меню «Ещё» на карточке продукта.
              </p>
            ) : (
              <ul className="catalog">
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <div className="entry">
                      <span className={`chip-mark chip-mark-${entry.productId}`}>
                        <ProductMark id={entry.productId} />
                      </span>
                      <span className="chip-copy">
                        <span className="chip-name">{entry.name}</span>
                        <span className="chip-fiber">
                          {entry.portion} • {entry.fiber}
                        </span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === 'profile' && (
          <section className="page">
            <h1 className="title">Профиль</h1>
            <p className="subtitle">Дневник пищевых волокон</p>
            <p className="empty">
              Клетчатка помогает смотреть, сколько пищевых волокон дают
              обычные продукты: фрукты, овощи и порции из дневника.
            </p>
          </section>
        )}

        <img
          className="nav-line"
          src="/assets/nav-line.svg"
          alt=""
          width={356}
          height={1}
        />
        <nav className="tabs" aria-label="Разделы">
          {tabs.map((item) => {
            const highlighted = (tab === 'home' ? 'diary' : tab) === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={highlighted ? 'tab tab-active' : 'tab'}
                aria-current={highlighted ? 'page' : undefined}
                onClick={() => {
                  setTab(item.id)
                  setMenuOpen(false)
                }}
              >
                <TabIcon id={item.id} active={highlighted} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </article>
    </div>
  )
}

export default App
