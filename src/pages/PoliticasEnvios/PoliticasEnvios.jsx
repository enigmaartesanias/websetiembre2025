import React from 'react';

const PoliticasEnvios = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-12 mt-8 mb-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Políticas de Envío y Tarifas</h1>
      
      {/* Sección de Envíos dentro de Perú (mejorada) */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Envíos dentro de Perú</h2>
        <p className="text-gray-700 mb-2 font-bold">
          Todos los pedidos deben ser cancelados previamente para poder ser procesados.
        </p>
        <p className="text-gray-700 mb-2">
          Realizamos envíos a nivel nacional a través de <span className="font-semibold">Olva Courier</span>. El plazo de entrega y el costo varían según el producto y la ubicación.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-2">
          <li>
            <span className="font-semibold">Envíos en Lima:</span> El tiempo promedio de entrega es de <span className="font-semibold">2 días hábiles</span>, con un costo fijo de <span className="font-semibold">S/10.00</span>.
          </li>
          <li>
            <span className="font-semibold">Envíos a provincia:</span> El plazo de entrega y el costo se coordinan y cotizan según el lugar de destino.
          </li>
          <li>
            <span className="font-semibold">Recojo en tienda:</span> Ofrecemos la opción de recojo gratuito en nuestro local de Carabayllo, previa coordinación.
          </li>
        </ul>
        <p className="text-gray-700">
          Aceptamos pagos por transferencia bancaria y billeteras digitales como <span className="font-semibold">Yape y Plin</span>. Una vez que tu pedido sea enviado, recibirás un número de seguimiento.
        </p>
        <p className="text-gray-700 mt-2">
          Para más detalles, contáctanos a nuestro WhatsApp <span className="font-semibold">960282376</span>.
        </p>
      </section>

      <hr className="my-8 border-gray-300" />

      {/* Sección de Envíos internacionales */}
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Envíos Internacionales</h2>
        <p className="text-gray-700 mb-2">
          Realizamos envíos a nivel mundial desde <span className="font-semibold">Perú</span>, con excepción de algunos países sin cobertura. Todas nuestras joyas se elaboran a pedido, por lo que requerimos la cancelación previa para iniciar el proceso.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-2">
          <li>El pago se realiza vía <span className="font-semibold">depósito por Western Union</span> o <span className="font-semibold">transferencia móvil</span>, según la disponibilidad en el país de destino.</li>
          <li>El costo del envío se cotiza una vez que el pedido sea confirmado y varía según el peso y la región (América suele ser más accesible que Europa).</li>
          <li>Utilizamos el servicio postal de <span className="font-semibold">Serpost</span>, con un tiempo estimado de entrega de hasta <span className="font-semibold">20 días hábiles</span>.</li>
        </ul>
        <p className="text-gray-700">
          Para más información, puedes escribirnos al WhatsApp <span className="font-semibold">+51 960282376</span>.
        </p>
      </section>
    </div>
  );
};

export default PoliticasEnvios;