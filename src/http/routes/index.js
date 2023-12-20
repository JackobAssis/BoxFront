const { Router } = require('express')
const {
  listCategories,
} = require('../../controllers/Categories/ListCategories')
const { validateToken } = require('../middlewares/validateToken')
const { loginUser } = require('../../controllers/Users/LoginUser')
const { createUser } = require('../../controllers/Users/CreateUser')
const { detailUser } = require('../../controllers/Users/DetailUser')
const { updateUser } = require('../../controllers/Users/UpdateUser')
const { createProduct } = require('../../controllers/Products/CreateProduct')
const { listClients } = require('../../controllers/Client/ListClient')
const { registerClient } = require('../../controllers/Client/RegisterClient')
const { editProducts } = require('../../controllers/Products/EditProducts')
const { editClient } = require('../../controllers/Client/EditClient')
const { listProducts } = require('../../controllers/Products/ListProducts')
const { detailProduct } = require('../../controllers/Products/DetailProduct')
const { detailClient } = require('../../controllers/Client/DetailClient')
const { deleteProduct } = require('../../controllers/Products/DeleteProduct')
const { listOrders } = require('../../controllers/Orders/listOrders')
const { createOrder } = require('../../controllers/Orders/createOrder')

const multer = require('../middlewares/multer')

const appRoutes = Router()

appRoutes.post('/login', loginUser)
appRoutes.post('/usuario', createUser)
appRoutes.get('/categoria', listCategories)

// routes protected ----->
appRoutes.use(validateToken)
appRoutes.get('/usuario', detailUser)
appRoutes.put('/usuario', updateUser)
appRoutes.post('/produto', multer.single('produto_imagem'), createProduct)
appRoutes.get('/cliente', listClients)
appRoutes.put('/produto/:id', multer.single('produto_imagem'), editProducts)
appRoutes.delete('/produto/:id', deleteProduct)
appRoutes.post('/cliente', registerClient)
appRoutes.put('/cliente/:id', editClient)
appRoutes.get('/produto', listProducts)
appRoutes.get('/produto/:id', detailProduct)
appRoutes.get('/cliente/:id', detailClient)
appRoutes.get('/pedido', listOrders)
appRoutes.post('/pedido', createOrder)

module.exports = {
  appRoutes,
}
