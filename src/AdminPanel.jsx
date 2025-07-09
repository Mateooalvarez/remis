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

  const generarMensaje = (nombre) =>
    `Hola ${nombre}, el viaje sale a las ${horarios.ida} y vuelve a las ${horarios.vuelta}.`;

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
            <li key={i} style={{ marginBottom: '10px' }}>
              <strong>{r.nombre}</strong> - {r.fecha} - {r.tipoViaje} - {r.hora} - {r.telefono}
              <br />
              <a
                href={`https://wa.me/54${r.telefono}?text=${encodeURIComponent(
                  generarMensaje(r.nombre)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  backgroundColor: '#25D366',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Enviar WhatsApp
              </a>
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
