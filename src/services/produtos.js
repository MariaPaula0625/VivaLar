import { db } from './firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

export async function criarProduto(dados) {
  return await addDoc(collection(db, 'products'), {
    ...dados,
    createdAt: serverTimestamp(),
  })
}

export async function buscarProdutos(categoria = null) {
  let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
  if (categoria) {
    q = query(collection(db, 'products'), where('category', '==', categoria), orderBy('createdAt', 'desc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function buscarProdutoPorId(id) {
  const snap = await getDoc(doc(db, 'products', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function buscarProdutosDoVendedor(sellerId) {
  const q = query(collection(db, 'products'), where('sellerId', '==', sellerId))
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function atualizarProduto(id, dados) {
  await updateDoc(doc(db, 'products', id), dados)
}

export async function deletarProduto(id) {
  await deleteDoc(doc(db, 'products', id))
}
