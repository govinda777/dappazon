export default {
    name: 'cupon',
    type: 'document',
    title: 'Cupon',
    fields: [
        {
            name: 'id',
            type: 'string',
            title: 'ID'
        },
        {
            name: 'name',
            type: 'string',
            title: 'Name'
        },
        {
            name: 'desc',
            type: 'text',
            title: 'Description'
        },
        {
            name: 'discount',
            type: 'number',
            title: 'Discount'
        }
    ]
}   