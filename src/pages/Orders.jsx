import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { buscarPedidosDoComprador } from '../services/pedidos'
import Navbar from '../components/Navbar'
import { useSearchParams } from 'react-router-dom'

const statusLabel = {
  aguardando: 'Aguardando pagamento',
  pago: 'Pago',
  enviado: 'Enviado',
  entregue: 'Entregue',
}

const statusColor = {
  aguardando: 'bg-yellow-100 text-yellow-800',
  pago: 'bg-green-100 text-green-800',
  enviado: 'bg-blue-100 text-blue-800',
  entregue: 'bg-gray-100 text-gray-800',
}

export default function Orders() {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')

  useEffect(() => {
    async function carregar() {
      const lista = await buscarPedidosDoComprador(user.uid)
      setPedidos(lista)
      setLoading(false)
    }
    carregar()
  }, [])

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-2">Meus pedidos</h1>

        {status === 'sucesso' && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
            Pagamento realizado com sucesso!
          </div>
        )}
        {status === 'falha' && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            Pagamento não aprovado. Tente novamente.
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-sm">Carregando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum pedido realizado ainda.</p>
        ) : (
          <div className="space-y-4">
            {pedidos.map(pedido => (
              <div key={pedido.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Pedido #{pedido.id.slice(0, 8)}</p>
                    <p className="font-semibold text-blue-600 mt-1">R$ {Number(pedido.total).toFixed(2)}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[pedido.status]}`}>
                    {statusLabel[pedido.status]}
                  </span>
                </div>
                <div className="divide-y">
                  {pedido.itens.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <img src={item.imageUrl || 'https://via.placeholder.com/48'} alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">Qtd: {item.quantidade} × R$ {Number(item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
