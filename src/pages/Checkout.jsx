import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { criarPedido } from '../services/pedidos'
import Navbar from '../components/Navbar'

export default function Checkout() {
  const { itens, total, limparCarrinho } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleFinalizar() {
    setErro('')
    setLoading(true)
    try {
      await criarPedido(user.uid, user.name, itens, total)

      const response = await fetch('/api/criar-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itens, buyerId: user.uid, buyerName: user.name }),
      })

      const { init_point } = await response.json()
      limparCarrinho()
      window.location.href = init_point
    } catch (err) {
      setErro('Erro ao finalizar compra: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-6">Resumo do pedido</h1>

        {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}

        <div className="bg-white rounded-xl shadow divide-y mb-6">
          {itens.map(item => (
            <div key={item.id} className="flex justify-between items-center p-4">
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-gray-400 text-xs">Qtd: {item.quantidade}</p>
              </div>
              <p className="text-blue-600 font-semibold text-sm">
                R$ {(item.price * item.quantidade).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold text-blue-600">R$ {total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleFinalizar}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
            {loading ? 'Redirecionando...' : 'Pagar com Mercado Pago'}
          </button>
        </div>
      </div>
    </>
  )
}
