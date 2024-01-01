export default {
    name: 'shoppingCart',
    type: 'document',
    title: 'Shopping Cart',
    fields: [
        {
            name: 'id',
            type: 'number',
            title: 'ID'
        },
        {
            name: 'account',
            type: 'string',
            title: 'Account'
        },
        {
            name: 'shoppingCartProducts',
            type: 'array',
            title: 'Shopping Cart Products',
            of: [
                {
                    type: 'reference',
                    to: [
                        {
                            type: 'shoppingCartProducts'
                        }
                    ]
                }
            ]
        },
    ]
}