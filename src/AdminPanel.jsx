import { useState } from 'react';

function AdminPanel() {
  const [clave, setClave] = useState('');
  const [acceso, setAcceso] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [horarios, setHorarios] = useState({ ida: '', vuelta: '' });
  const [mensaje, setMensaje] = useState('');

  const verificarClave = async () => {
    const res = await fetch('http://localhost:3000/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clave }),
    });

    if (res.ok) {
      const data = await res.json();
      setReservas(data.reservas);
      setAcceso(true);

      // Trae también los horarios
      const horariosRes = await fetch('http://localhost:3000/horarios');
      const horariosData = await horariosRes.json();
      setHorarios(horariosData);
    } else {
      setMensaje('❌ Clave incorrecta');
    }
  };

  const actualizarHorarios = async () => {
    const res = await fetch('http://localhost:3000/actualizar-horarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...horarios, clave }),
    });

    if (res.ok) {
      setMensaje('✅ Horarios actualizados');
    } else {
      setMensaje('❌ Error al actualizar horarios');
    }
  };

  if (!acceso) {
    return (
      <div className="form-container">
        <h2>Acceso solo para la conductora</h2>
        <input
          type="password"
          placeholder="Ingresar clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
        <button onClick={verificarClave}>Ingresar</button>
        {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Panel de administración</h2>

      <h3>Reservas</h3>
      {reservas.length === 0 ? (
        <p>No hay reservas aún.</p>
      ) : (
        <ul>
          {reservas.map((r, i) => (
            <li key={i}>
              <strong>{r.nombre}</strong> - {r.fecha} - {r.tipoViaje} - {r.telefono}
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h3>Actualizar horarios</h3>
      <label>Hora de ida</label>
      <input
        type="time"
        value={horarios.ida}
        onChange={(e) => setHorarios({ ...horarios, ida: e.target.value })}
      />

      <label>Hora de vuelta</label>
      <input
        type="time"
        value={horarios.vuelta}
        onChange={(e) => setHorarios({ ...horarios, vuelta: e.target.value })}
      />

      <button onClick={actualizarHorarios}>Guardar horarios</button>
      {mensaje && <p style={{ marginTop: '10px' }}>{mensaje}</p>}
    </div>
  );
}

export default AdminPanel;
