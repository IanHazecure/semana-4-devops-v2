import { useEffect, useState } from 'react'

export default function App() {
  const [personas, setPersonas] = useState([])
  const [form, setForm] = useState({ nombre: '', rut: '', fecha_nacimiento: '' })
  const [cfg, setCfg] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/config.json', { cache: 'no-store' }).then(r => r.json()).then(setCfg).catch(() => {})
    load()
  }, [])

  function load() {
    fetch('/api/personas')
      .then(r => { if (!r.ok) throw new Error('API respondió ' + r.status); return r.json() })
      .then(setPersonas)
      .catch(e => setError(e.message))
  }

  function addPersona(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.rut.trim() || !form.fecha_nacimiento) return
    fetch('/api/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(() => { setForm({ nombre: '', rut: '', fecha_nacimiento: '' }); load() })
  }

  function remove(id) {
    fetch(`/api/personas/${id}`, { method: 'DELETE' }).then(load)
  }

  const entorno = cfg?.environment ?? '...'

  return (
    <main className="wrap">
      <header>
        <span className={`badge env-${entorno}`}>{entorno.toUpperCase()}</span>
        <h1>Personas (React + API + MySQL)</h1>
      </header>

      {error && <p className="aviso">No se pudo conectar a la API: {error}</p>}

      <form onSubmit={addPersona} className="form">
        <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre" />
        <input value={form.rut} onChange={e => setForm({ ...form, rut: e.target.value })} placeholder="RUT" />
        <input type="date" value={form.fecha_nacimiento} onChange={e => setForm({ ...form, fecha_nacimiento: e.target.value })} />
        <button type="submit">Agregar</button>
      </form>

      <ul className="list">
        {personas.map(p => (
          <li key={p.id}>
            <span>{p.nombre} — {p.rut} — {p.fecha_nacimiento}</span>
            <button className="del" onClick={() => remove(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </main>
  )
}