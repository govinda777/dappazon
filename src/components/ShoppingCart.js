import { useEffect, useState } from 'react'

const ShoppingCart = ({ account, shoppingCartId, provider, dappazon, shoppingCart }) => {

    const [card, setCard] = useState(null)
    const [products, setProducts] = useState(null)

    const fetchDetails = async (account, shoppingCartId) => {

        setCard(await getCard(account, shoppingCartId))
        setProducts(await getProducts(account, shoppingCartId))


    }

    const getCard = async (account, shoppingCartId) => {
        return await shoppingCart.read(account, shoppingCartId)
    }

    const getProducts = async (account, shoppingCartId) => {
        return await shoppingCart.readProducts(account, shoppingCartId)
    }

    const addProduct = async (account, shoppingCartId, productId, quantity) => {
        return await shoppingCart.addProduct(account, shoppingCartId, productId, quantity)
    }

    const removeProduct = async (account, shoppingCartId, productId, quantity) => {
        return await shoppingCart.removeProduct(account, shoppingCartId, productId, quantity)
    }

    const buyHandler = async () => {
        const signer = await provider.getSigner()

        // Buy item...
        let transaction = await dappazon.connect(signer).buy(signer, shoppingCartId, {
            value: card.totalCost
        })

        console.log({ transaction })

        let result = await transaction.wait()

        console.log({ result })

    }

    useEffect(() => {
        fetchDetails(account, shoppingCartId)
    }, [account, shoppingCartId])

    return (<div>

        <button className='product__buy' onClick={buyHandler}>
            Buy Now
        </button>

    </div>);

}

export default ShoppingCart;