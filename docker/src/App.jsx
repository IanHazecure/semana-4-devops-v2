import { useEffect, useState } from 'react'

const PASOS = [
  'GitHub',
  'Azure Pipelines (build)',
  'Azure Container Registry',
  'Azure Pipelines (deploy)',
  'VM con Docker',
]

export default function App() {
  const [cfg, setCfg] = useState(null)
  const [fallo, setFallo] = useState(false)
  const [clics, setClics] = useState(0)
  const [hora] = useState(() => new Date().toLocaleTimeString('es-CL'))

  // config.json lo genera Nginx al iniciar el contenedor (APP_ENV y APP_VERSION)
  useEffect(() => {
    fetch('/config.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setCfg)
      .catch(() => setFallo(true))
  }, [])

  const entorno = cfg?.environment ?? '...'
  const datos = [
    ['Entorno', entorno],
    ['Versión de la imagen', cfg?.version ?? '...'],
    ['Servidor', window.location.host],
    ['Página cargada a las', hora],
  ]

  return (
    <main className="wrap">
      <header>
        <span className={`badge env-${entorno}`}>{entorno.toUpperCase()}</span>
        <h1>Semana 6 · React en Nginx</h1>
        <p>Compilada con Vite dentro de Docker y desplegada con Azure Pipelines.</p>
      </header>

      {fallo && <p className="aviso">No se pudo leer /config.json</p>}

      <section className="grid">
        {datos.map(([k, v]) => (
          <div className="card" key={k}>
            <small>{k}</small>
            <strong>{v}</strong>
          </div>
        ))}
      </section>

      <p className="flow">{PASOS.join('  →  ')}</p>

      <button onClick={() => setClics(clics + 1)}>Clics: {clics}</button>
    </main>
  )
}
