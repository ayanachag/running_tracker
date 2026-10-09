import { useEffect, useRef, useState } from "react";
import "./App.css";
import bg from "./assets/4699c.svg";
import dot from "./assets/dot.svg";
import cardStats from "./assets/card-stats.svg";
import cardRoute from "./assets/card-route.svg";
import togglePill from "./assets/toggle.svg";
import mapArt from "./assets/map.svg";
import cardPace from "./assets/card-pace.svg";
import chartGrid from "./assets/chart-grid.svg";
import chartFill from "./assets/chart-fill.svg";
import chartLine from "./assets/chart-line.svg";
import tooltip from "./assets/tooltip.svg";
import cardParams from "./assets/card-params.svg";
import locBtn from "./assets/loc-btn.svg";
import locIcon from "./assets/loc-icon.svg";
import settingsIcon from "./assets/settings.svg";
import statusIcons from "./assets/status-icons.svg";
import stopIcon from "./assets/stop.svg";
import pauseIcon from "./assets/pause.svg";
import lockBtn from "./assets/lock-btn.svg";
import lockIcon from "./assets/lock.svg";

const RING_RADIUS = 66;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const CHART_LEFT = 73.74;
const CHART_TOP = 608.52;
const PACE_AXIS_TOP = 625.03;
const PACE_PX_PER_MIN = 14.5;
const PACE_PATH =
  "M1.27215 66.209C11.0574 50.5458 22.1474 52.83 34.5421 73.0616C46.9368 93.2933 59.6576 90.6827 72.7047 65.23C85.7517 39.7773 99.4511 35.2089 113.803 51.5247C128.155 67.8406 141.854 76.6511 154.901 77.9564C167.948 79.2617 181.321 72.7353 195.021 58.3774C208.72 44.0195 222.093 47.9353 235.14 70.1248C248.187 92.3143 259.93 81.5459 270.367 37.8195C280.805 -5.90697 297.44 -10.1491 320.272 25.0931";
const ROUTE_PATH =
  "M76.2159 152.09C105.521 181.09 121.09 124.09 157.721 130.09C194.353 136.09 205.342 154.09 237.395 119.09C269.448 84.0895 272.195 73.0895 303.332 84.0895C334.469 95.0895 346.374 103.09 360.111 60.0895";

function formatPace(screenY) {
  const minutes = Math.min(8, Math.max(2, 8 - (screenY - PACE_AXIS_TOP) / PACE_PX_PER_MIN));
  let whole = Math.floor(minutes);
  let seconds = Math.round((minutes - whole) * 60);
  if (seconds === 60) {
    whole += 1;
    seconds = 0;
  }
  return `${whole}:${String(seconds).padStart(2, "0")}`;
}

export default function App() {
  const [mapMode, setMapMode] = useState("map");
  const [paused, setPaused] = useState(false);
  const [locked, setLocked] = useState(false);
  const pausedRef = useRef(false);
  const arcRef = useRef(null);
  const gradientRef = useRef(null);
  const progressValueRef = useRef(null);
  const progressSubRef = useRef(null);
  const pacePathRef = useRef(null);
  const paceDotRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipValueRef = useRef(null);
  const routePathRef = useRef(null);
  const runnerRef = useRef(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    let frame = 0;
    let elapsed = 0;
    let last = performance.now();

    const tick = (now) => {
      if (!pausedRef.current) {
        elapsed += now - last;
      }
      last = now;

      const t = elapsed / 1000;
      const progress = 64 + Math.sin(t * 0.85) * 14;
      const dash = (progress / 100) * RING_LENGTH;
      arcRef.current?.setAttribute("stroke-dasharray", `${dash} ${RING_LENGTH}`);

      if (progressValueRef.current) {
        progressValueRef.current.textContent = `${Math.round(progress)}%`;
      }
      if (progressSubRef.current) {
        const km = ((progress / 100) * 8).toFixed(2).replace(".", ",");
        progressSubRef.current.textContent = `${km} / 8 км`;
      }

      const shift = Math.sin(t * 0.65) * 18;
      gradientRef.current?.setAttribute("x1", String(6.5 + shift));
      gradientRef.current?.setAttribute("y1", String(138.5 - shift * 0.45));
      gradientRef.current?.setAttribute("x2", String(138.5 - shift));
      gradientRef.current?.setAttribute("y2", String(6.5 + shift * 0.45));

      const pacePath = pacePathRef.current;
      if (pacePath && paceDotRef.current && tooltipRef.current && tooltipValueRef.current) {
        const paceLength = pacePath.getTotalLength();
        const paceT = (Math.sin(t * 0.55 - Math.PI / 2) + 1) / 2;
        const pacePoint = pacePath.getPointAtLength(paceLength * paceT);
        const screenX = CHART_LEFT + pacePoint.x;
        const screenY = CHART_TOP + pacePoint.y;
        paceDotRef.current.setAttribute("cx", String(pacePoint.x));
        paceDotRef.current.setAttribute("cy", String(pacePoint.y));

        let tooltipTop = screenY - 36;
        if (tooltipTop < 606) tooltipTop = screenY + 12;
        const tooltipLeft = Math.min(365, Math.max(40, screenX - 22.5));
        tooltipRef.current.style.left = `${tooltipLeft}px`;
        tooltipRef.current.style.top = `${tooltipTop}px`;
        tooltipValueRef.current.style.left = `${tooltipLeft}px`;
        tooltipValueRef.current.style.top = `${tooltipTop + 4}px`;
        tooltipValueRef.current.textContent = formatPace(screenY);
      }

      const routePath = routePathRef.current;
      if (routePath && runnerRef.current) {
        const routeLength = routePath.getTotalLength();
        const routeT = (Math.sin(t * 0.38 - Math.PI / 2) + 1) / 2;
        const routePoint = routePath.getPointAtLength(routeLength * routeT);
        runnerRef.current.setAttribute("cx", String(routePoint.x));
        runnerRef.current.setAttribute("cy", String(routePoint.y));
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="viewport">
      <article className="screen" aria-label="Активная пробежка">
        <img className="bg" src={bg} alt="" width="440" height="956" />

        <p className="status-time">9:41</p>
        <img
          className="status-icons"
          src={statusIcons}
          alt=""
          width="40.5"
          height="11.5"
        />

        <header>
          <h1 className="title">Бег</h1>
          <button className="loc-btn" type="button" aria-label="Геолокация">
            <img src={locBtn} alt="" width="40" height="40" />
            <img
              className="loc-icon"
              src={locIcon}
              alt=""
              width="15.7143"
              height="20"
            />
          </button>
          <button className="settings-btn" type="button" aria-label="Настройки">
            <img src={settingsIcon} alt="" width="40" height="40" />
          </button>
        </header>

        <img className="live-dot" src={dot} alt="" width="10" height="10" />
        <p className="live-label">Тренировка активна</p>

        <img
          className="card card-stats"
          src={cardStats}
          alt=""
          width="380"
          height="195"
        />
        <svg
          className="ring"
          viewBox="0 0 145 145.423"
          width="145"
          height="145.423"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              ref={gradientRef}
              id="ringGrad"
              gradientUnits="userSpaceOnUse"
              x1="6.5"
              y1="138.5"
              x2="138.5"
              y2="6.5"
            >
              <stop offset="0" stopColor="#B4E827" />
              <stop offset="1" stopColor="#38C62D" />
            </linearGradient>
          </defs>
          <circle
            cx="72.5"
            cy="72.5"
            r={RING_RADIUS}
            fill="none"
            stroke="#E9EEF1"
            strokeWidth="13"
          />
          <circle
            ref={arcRef}
            cx="72.5"
            cy="72.5"
            r={RING_RADIUS}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={`${RING_LENGTH * 0.64} ${RING_LENGTH}`}
            transform="rotate(-90 72.5 72.5)"
          />
        </svg>
        <p className="progress-label">Прогресс</p>
        <p className="progress-value" ref={progressValueRef}>
          64%
        </p>
        <p className="progress-sub" ref={progressSubRef}>
          5,24 / 8 км
        </p>

        <p className="kicker">Время бега</p>
        <p className="elapsed">00:32:18</p>
        <p className="stat distance">
          5,24 <span>км</span>
        </p>
        <p className="stat-label distance-label">Дистанция</p>
        <p className="stat calories">412</p>
        <p className="stat-label calories-label">Калории</p>
        <p className="stat pace">
          6:09 <span>мин/км</span>
        </p>
        <p className="stat-label pace-label">Средний темп</p>
        <p className="stat stops">3</p>
        <p className="stops-dot" aria-hidden="true">
          ●
        </p>
        <p className="stat-label stops-label">Остановки</p>

        <img
          className="card card-route"
          src={cardRoute}
          alt=""
          width="380"
          height="220"
        />
        <h2 className="section-title route-title">Маршрут ›</h2>
        <img
          className={
            mapMode === "satellite" ? "toggle-pill is-satellite" : "toggle-pill"
          }
          src={togglePill}
          alt=""
          width="56"
          height="24"
        />
        <button
          className={mapMode === "map" ? "mode mode-map is-active" : "mode mode-map"}
          type="button"
          aria-pressed={mapMode === "map"}
          onClick={() => setMapMode("map")}
        >
          Карта
        </button>
        <button
          className={
            mapMode === "satellite" ? "mode mode-sat is-active" : "mode mode-sat"
          }
          type="button"
          aria-pressed={mapMode === "satellite"}
          onClick={() => setMapMode("satellite")}
        >
          Спутник
        </button>
        <div
          className={mapMode === "satellite" ? "map-clip is-satellite" : "map-clip"}
        >
          <img
            className="map"
            src={mapArt}
            alt="Маршрут пробежки"
            width="418.923"
            height="206.521"
          />
          <svg
            className="map-track"
            viewBox="0 0 418.923 206.521"
            width="418.923"
            height="206.521"
            aria-hidden="true"
          >
            <path ref={routePathRef} d={ROUTE_PATH} fill="none" />
            <circle
              ref={runnerRef}
              cx="76.22"
              cy="152.09"
              r="8"
              fill="#ffffff"
              stroke="#12c73a"
              strokeWidth="4"
            />
          </svg>
        </div>

        <img
          className="card card-pace"
          src={cardPace}
          alt=""
          width="380"
          height="171"
        />
        <h2 className="section-title pace-title">Темп ›</h2>
        <p className="pace-unit">мин/км</p>
        <img
          className="chart-grid"
          src={chartGrid}
          alt=""
          width="319"
          height="88"
        />
        <img
          className="chart-fill"
          src={chartFill}
          alt=""
          width="319"
          height="103"
        />
        <img
          className="chart-line"
          src={chartLine}
          alt=""
          width="321.531"
          height="88.0047"
        />
        <svg
          className="chart-motion"
          viewBox="0 0 321.531 88.0047"
          width="321.531"
          height="88.0047"
          aria-hidden="true"
        >
          <path ref={pacePathRef} d={PACE_PATH} fill="none" />
          <circle
            ref={paceDotRef}
            cx="1.27"
            cy="66.21"
            r="6"
            fill="#0AA742"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
        <img
          className="tooltip"
          ref={tooltipRef}
          src={tooltip}
          alt=""
          width="45"
          height="23"
        />
        <p className="tooltip-value" ref={tooltipValueRef}>
          5:45
        </p>
        <p className="axis y8">8:00</p>
        <p className="axis y6">6:00</p>
        <p className="axis y4">4:00</p>
        <p className="axis y2">2:00</p>
        <p className="axis x0">0</p>
        <p className="axis x10">10 мин</p>
        <p className="axis x20">20 мин</p>
        <p className="axis x30">30 мин</p>

        <img
          className="card card-params"
          src={cardParams}
          alt=""
          width="380"
          height="99"
        />
        <h2 className="params-title">Параметры тренировки</h2>
        <p className="param-label param-distance-label">Дистанция</p>
        <p className="param-value param-distance">5,24</p>
        <p className="param-label param-time-label">Время</p>
        <p className="param-value param-time">32:18</p>
        <p className="param-label param-pace-label">Темп</p>
        <p className="param-value param-pace">6:09</p>
        <p className="param-label param-cal-label">Калории</p>
        <p className="param-value param-cal">412</p>

        <button
          className={locked ? "lock-btn is-on" : "lock-btn"}
          type="button"
          aria-label="Блокировка экрана"
          aria-pressed={locked}
          onClick={() => setLocked((value) => !value)}
        >
          <img src={lockBtn} alt="" width="46" height="46" />
          <img className="lock-icon" src={lockIcon} alt="" width="21" height="21" />
        </button>
        <button
          className={paused ? "pause-btn is-on" : "pause-btn"}
          type="button"
          aria-label={paused ? "Продолжить" : "Пауза"}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          <img src={pauseIcon} alt="" width="62" height="62" />
        </button>
        <button className="stop-btn" type="button" aria-label="Стоп">
          <img src={stopIcon} alt="" width="46" height="46" />
        </button>
      </article>
    </div>
  );
}
