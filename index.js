const express = require("express")
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())

const orders = []

const ckeckId = (request, require, next) => {

    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)
    request.orderIndex = index
    request.orderId = id
    if (index < 0) {
        return request.status(404).json({ error: "User not found" })

        
    }
    
    next()

}
const myRouteMiddlewares = (request, response, next) => {
    const method = request.method
    const url = request.url

    console.log(`method: ${method} url: ${url}`)

    next()
}

app.get('/orders', myRouteMiddlewares, (request, response) => {
    return response.json(orders)

})

app.post('/orders/new', myRouteMiddlewares, (request, response) => {
    const { order, clientName, price, status } = request.body
    const newOrder = { id: uuid.v4(), order, clientName, price, status }

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})
app.put('/orders/update/:id', ckeckId ,myRouteMiddlewares, (request, response) => {

    const index = request.orderIndex
    const id = request.orderId
    const { order, clientName, price, status } = request.body
    const newOrder = { id, order, clientName, price, status }

    orders[index] = newOrder
    return response.json(orders)
})
app.delete('/orders/cancel/:id', ckeckId ,myRouteMiddlewares, (request, response) => {

    const index = request.orderIndex
    orders.splice(index, 1)

    return response.json(orders)
})
app.get("/orders/filter/:id", ckeckId ,myRouteMiddlewares, (request, response) => {
    const index = request.orderIndex
    return response.json(orders[index])
})
app.patch("/orders/status/:id", ckeckId ,myRouteMiddlewares, (request, response) => {

    const index = request.orderIndex
    orders[index].status = "Pronto"

    return response.json(orders[index])

})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})