export default function EventPolicy() {
  return (
    <div>
      <h2 className="mb-2 text-lg font-bold">Política</h2>

      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <h3 className="font-medium">Cancelamento de pedidos pagos</h3>
          <p>
            Cancelamentos de pedidos serão aceitos até 7 dias após a compra,
            desde que a solicitação seja enviada até 48 horas antes do início do
            evento.
          </p>
        </div>

        <div>
          <h3 className="font-medium">Edição de participantes</h3>
          <p>
            Você poderá editar o participante de um ingresso apenas uma vez.
            Essa opção ficará disponível até 24 horas antes do início do evento.
          </p>
        </div>
      </div>
    </div>
  );
}
