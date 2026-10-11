import { useEffect, useState } from 'react'

const blankForm = { nombre: '', rut: '', fecha_nacimiento: '' }

export default function App() {
  const [personas, setPersonas] = useState([])
  const [form, setForm] = useState(blankForm)
  const [editingId, setEditingId] = useState(null)
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

  function load() {
    fetch('/api/personas')
      .then(r => { if (!r.ok) throw new Error('API respondió ' + r.status); return r.json() })
      .then(setPersonas)
      .catch(e => setError(e.message))
  }

  function savePersona(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.rut.trim() || !form.fecha_nacimiento) {
      setError('Completa todos los campos.')
      return
    }

    const url = editingId ? `/api/personas/${editingId}` : '/api/personas'
    fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(response => {
      if (!response.ok) throw new Error('No se pudo guardar el registro.')
      setForm(blankForm)
      setEditingId(null)
      setError(null)
      load()
    }).catch(e => setError(e.message))
  }

  function editPersona(persona) {
    setEditingId(persona.id)
    setForm({
      nombre: persona.nombre,
      rut: persona.rut,
      fecha_nacimiento: persona.fecha_nacimiento,
    })
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(blankForm)
  }

  function remove(id) {
    if (!window.confirm('¿Eliminar esta persona?')) return
    fetch(`/api/personas/${id}`, { method: 'DELETE' })
      .then(response => { if (!response.ok) throw new Error('No se pudo eliminar el registro.'); load() })
      .catch(e => setError(e.message))
  }

  const entorno = cfg?.environment ?? '...'

  return (
    <main className="wrap">
      <header>
        <span className={`badge env-${entorno}`}>{entorno.toUpperCase()}</span>
        <h1>Personas (React + API + MySQL)</h1>
      </header>

      {error && <p className="aviso">No se pudo conectar a la API: {error}</p>}

      <form onSubmit={savePersona} className="form">
        <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre" aria-label="Nombre" />
        <input value={form.rut} onChange={e => setForm({ ...form, rut: e.target.value })} placeholder="RUT" aria-label="RUT" />
        <input type="date" value={form.fecha_nacimiento} onChange={e => setForm({ ...form, fecha_nacimiento: e.target.value })} aria-label="Fecha de nacimiento" />
        <button type="submit">{editingId ? 'Guardar cambios' : 'Agregar'}</button>
        {editingId && <button type="button" className="secondary" onClick={cancelEdit}>Cancelar</button>}
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Fecha de nacimiento</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.length === 0 ? (
              <tr><td colSpan="6" className="empty">No hay registros.</td></tr>
            ) : personas.map(persona => (
              <tr key={persona.id}>
                <td>{persona.id}</td>
                <td>{persona.nombre}</td>
                <td>{persona.rut}</td>
                <td>{persona.fecha_nacimiento}</td>
                <td>{persona.created_at || '-'}</td>
                <td className="actions">
                  <button type="button" className="edit" onClick={() => editPersona(persona)}>Editar</button>
                  <button type="button" className="del" onClick={() => remove(persona.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}