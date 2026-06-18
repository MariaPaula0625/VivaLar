export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { itens, buyerId, buyerName } = req.body

  const items = itens.map(i => ({
    title: i.name,
    quantity: i.quantidade,
    unit_price: Number(i.price),
    currency_id: 'BRL',
  }))

  const body = {
    items,
    payer: { name: buyerName },
    back_urls: {
      success: `${process.env.VITE_APP_URL}/pedidos?status=sucesso`,
      failure: `${process.env.VITE_APP_URL}/pedidos?status=falha`,
      pending: `${process.env.VITE_APP_URL}/pedidos?status=pendente`,
    },
    auto_return: 'approved',
    external_reference: buyerId,
  }

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  res.status(200).json({ init_point: data.init_point })
}
