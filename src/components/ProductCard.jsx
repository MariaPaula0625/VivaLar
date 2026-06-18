import { Link } from 'react-router-dom'

export default function ProductCard({ produto }) {
  return (
    <Link to={`/produto/${produto.id}`} className="block bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
      <img
        src={produto.imageUrl || 'https://via.placeholder.com/300x200?text=Sem+imagem'}
        alt={produto.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="font-medium text-gray-800 truncate">{produto.name}</h2>
        <p className="text-sm text-gray-500 mt-1 truncate">{produto.category}</p>
        <p className="text-blue-600 font-semibold mt-2">
          R$ {Number(produto.price).toFixed(2)}
        </p>
      </div>
    </Link>
  )
}
