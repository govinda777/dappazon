export default {
    name: 'shoppingCartProduct',
    type: 'document',
    title: 'Shopping Cart Product',
    fields: [
      {
        name: 'shoppingCartId',
        type: 'reference',
        to: [{ type: 'shoppingCart' }],
        title: 'Shopping Cart ID'
      },
      {
        name: 'productId',
        type: 'reference',
        to: [{ type: 'product' }],
        title: 'Product ID'
      },
      {
        name: 'quantity',
        type: 'number',
        title: 'Quantity'
      }
    ]
  }
  