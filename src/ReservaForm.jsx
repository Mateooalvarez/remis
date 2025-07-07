import { useEffect, useState } from 'react';

function ReservaForm() {
  const [form, setForm] = useState({
    nombre: '',
    fecha: '',
    tipoViaje: '',
    telefono: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [color, setColor] = useState('black');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje('Enviando reserva...');
    setColor('black');

    try {
      const res = await fetch('http://localhost:3000/reserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('✅ ¡Reserva guardada con éxito!');
        setColor('green');
        setForm({
          nombre: '',
          fecha: '',
          tipoViaje: '',
          telefono: ''
        });
      } else {
        setMensaje(`❌ Error: ${data.error || 'Algo salió mal'}`);
        setColor('red');
      }
    } catch (err) {
      setMensaje('❌ Error de conexión con el servidor');
      setColor('red');
    }
  };

  return (
    <div className="form-container">
      <h1>Reservá tu viaje</h1>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required />

        <label>Fecha</label>
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />

        <label>Tipo de viaje</label>
        <select name="tipoViaje" value={form.tipoViaje} onChange={handleChange} required>
          <option value="">Seleccionar</option>
          <option value="Solo ida">Solo ida</option>
          <option value="Solo vuelta">Solo vuelta</option>
          <option value="Ida y vuelta">Ida y vuelta</option>
        </select>

        <label>Teléfono</label>
        <input name="telefono" value={form.telefono} onChange={handleChange} />

        <button type="submit">Reservar viaje</button>
      </form>
      <p style={{ color, marginTop: '20px' }}>{mensaje}</p>
    </div>
  );
}

export default ReservaForm;
