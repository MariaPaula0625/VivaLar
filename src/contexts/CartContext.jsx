import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [itens, setItens] = useState([])

  function addItem(produto) {
    setItens(prev => {
      const existe = prev.find(i => i.id === produto.id)
      if (existe) {
        return prev.map(i =>
          i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
        )
      }
      return [...prev, { ...produto, quantidade: 1 }]
    })
  }

  function removeItem(id) {
    setItens(prev => prev.filter(i => i.id !== id))
  }

  function alterarQuantidade(id, quantidade) {
    if (quantidade < 1) return removeItem(id)
    setItens(prev => prev.map(i => i.id === id ? { ...i, quantidade } : i))
  }

  function limparCarrinho() {
    setItens([])
  }

  const total = itens.reduce((acc, i) => acc + i.price * i.quantidade, 0)
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0)

  return (
    <CartContext.Provider value={{ itens, addItem, removeItem, alterarQuantidade, limparCarrinho, total, totalItens }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
