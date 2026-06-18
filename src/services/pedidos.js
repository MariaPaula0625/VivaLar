import { db } from './firebase'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

export async function criarPedido(buyerId, buyerName, itens, total) {
  return await addDoc(collection(db, 'orders'), {
    buyerId,
    buyerName,
    itens: itens.map(i => ({
      productId: i.id,
      name: i.name,
      price: i.price,
      quantidade: i.quantidade,
      imageUrl: i.imageUrl,
    })),
    total,
    status: 'aguardando',
    createdAt: serverTimestamp(),
  })
}

export async function buscarPedidosDoComprador(buyerId) {
  const q = query(
    collection(db, 'orders'),
    where('buyerId', '==', buyerId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
