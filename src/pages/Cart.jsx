import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Cart() {
  const { itens, removeItem, alterarQuantidade, total, limparCarrinho } = useCart()
  const navigate = useNavigate()

  if (itens.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <p className="text-gray-400 text-lg mb-4">Seu carrinho está vazio.</p>
          <button onClick={() => navigate('/')} className="text-blue-600 hover:underline text-sm">
            Ver produtos
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-6">Carrinho</h1>

        <div className="bg-white rounded-xl shadow divide-y mb-6">
          {itens.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/80'}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-blue-600 text-sm font-semibold">
                  R$ {Number(item.price).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alterarQuantidade(item.id, item.quantidade - 1)}
                  className="w-7 h-7 border rounded-full text-gray-600 hover:border-blue-400">
                  -
                </button>
                <span className="text-sm w-4 text-center">{item.quantidade}</span>
                <button
                  onClick={() => alterarQuantidade(item.id, item.quantidade + 1)}
                  className="w-7 h-7 border rounded-full text-gray-600 hover:border-blue-400">
                  +
                </button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-sm ml-2">
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold text-blue-600">R$ {total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
            Finalizar compra
          </button>
        </div>
      </div>
    </>
  )
}
