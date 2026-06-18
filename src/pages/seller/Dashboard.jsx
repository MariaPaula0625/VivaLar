import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { uploadImagem } from '../../services/cloudinary'
import {
  criarProduto,
  buscarProdutosDoVendedor,
  deletarProduto,
} from '../../services/produtos'

const categorias = ['Móveis', 'Eletrônicos', 'Roupas', 'Calçados', 'Decoração', 'Outros']

const formInicial = { name: '', description: '', price: '', stock: '', category: 'Móveis' }

export default function Dashboard() {
  const { user } = useAuth()
  const [produtos, setProdutos] = useState([])
  const [form, setForm] = useState(formInicial)
  const [imagem, setImagem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    const lista = await buscarProdutosDoVendedor(user.uid)
    setProdutos(lista)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      let imageUrl = ''
      if (imagem) imageUrl = await uploadImagem(imagem)

      await criarProduto({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl,
        sellerId: user.uid,
        sellerName: user.name,
      })

      setForm(formInicial)
      setImagem(null)
      await carregar()
    } catch (err) {
      setErro('Erro ao cadastrar produto: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeletar(id) {
    if (!confirm('Deseja remover este produto?')) return
    await deletarProduto(id)
    await carregar()
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Painel do vendedor</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Novo produto</h2>

        {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm mb-1">Categoria</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {categorias.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Preço (R$)</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm mb-1">Estoque</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">Descrição</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">Imagem</label>
            <input type="file" accept="image/*" onChange={e => setImagem(e.target.files[0])}
              className="text-sm" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Salvando...' : 'Cadastrar produto'}
        </button>
      </form>

      <h2 className="text-lg font-medium mb-4">Meus produtos ({produtos.length})</h2>
      {produtos.length === 0 ? (
        <p className="text-gray-400 text-sm">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {produtos.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
              <img src={p.imageUrl || 'https://via.placeholder.com/80'} alt={p.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-sm text-gray-500">{p.category}</p>
                <p className="text-blue-600 font-semibold text-sm mt-1">R$ {Number(p.price).toFixed(2)}</p>
                <p className="text-xs text-gray-400">Estoque: {p.stock}</p>
              </div>
              <button onClick={() => handleDeletar(p.id)}
                className="text-red-400 hover:text-red-600 text-sm self-start">
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}