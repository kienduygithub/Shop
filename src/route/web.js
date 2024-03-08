import express from 'express'
import userController from '../controllers/userController'
import productController from '../controllers/productController'
import orderItemController from '../controllers/orderItemController'
import orderController from '../controllers/orderController'
import db from '../models'
import dotenv from 'dotenv'
dotenv.config();
// Middleware
import { authMiddleware, authUserMiddleware } from '../middleware/authMiddleware'

let router = express.Router()
const initWebRoutes = (app) => {
  // NGƯỜI DÙNG
  // router.get('/getProductOrderItem/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const data = await db.OrderItem.findAll({
  //     include: [{
  //       model: db.Product,
  //       as: 'Product'
  //     }],
  //     where: { id: id }
  //   })
  //   return res.status(200).json({
  //     data: data
  //   })
  // })
  router.post('/sign-up', userController.createUser)
  router.post('/sign-in', userController.loginUser)
  router.get('/log-out', userController.logoutUser)
  router.post('/user/update-user/:id', authUserMiddleware, userController.updateUser)
  router.delete('/user/delete-user/:id', authMiddleware, userController.deleteUser)
  router.get('/user/getAll', userController.getAllUser)
  router.get('/user/get-details/:id', authUserMiddleware, userController.getDetailUser)
  router.post('/user/delete-many', authMiddleware, userController.deleteMany)
  router.get('/refresh-token', userController.refreshToken)
  router.post('/user/change-password/:id', authUserMiddleware, userController.changePassword)
  router.post('/forgot-password', userController.forgotPassword)
  router.get('/reset-password', userController.resetPassword)
  router.post('/verify-otp', userController.verifyOTP)
  // SẢN PHẨM
  router.post('/product/create-product', authMiddleware, productController.createProduct)
  router.post('/product/update-product/:id', authMiddleware, productController.updateProduct)
  router.delete('/product/delete-product/:id', authMiddleware, productController.deleteProduct)
  router.get('/product/getAll', productController.getAllProduct)
  router.get('/product/details-product/:id', productController.getDetailProduct)
  router.post('/product/delete-many', authUserMiddleware, productController.deleteMany)
  router.get('/product/get-all-type', productController.getAllType)
  router.get('/product/get-latest', productController.getLatestProduct)
  router.get('/product/get-by-range', productController.getByRange)
  // ORDER ITEM
  router.post('/order/create-order/:id', authUserMiddleware, orderController.createOrder);
  router.get('/order/get-order-details/:id', orderController.getOrderDetails)
  router.delete('/order/cancel-order/:id', orderController.cancelOrderDetails)
  router.get('/order/get-all-order', authMiddleware, orderController.getAllOrder)
  router.get('/order/get-all-order/:id', orderController.getAllOrderDetails)
  router.post('/order/update-order/:id', orderController.updateOrder)
  router.delete('/order/delete-order/:id', orderController.deleteOrderAdmin)
  router.get('/order/get-order-latest', orderController.getAllOrderLatest)
  router.get('/order-item/get-quarter', orderItemController.getQuarter)
  router.get('/order-item/get-by-selected-quarter', orderItemController.getBySelectedQuarter)
  // PAYMENT PAYPAL
  router.get('/payment/config', (req, res) => {
    return res.status(200).json({
      status: 'OK',
      data: process.env.CLIENT_ID
    })
  })
  router.get('/get-products-category', async (req, res) => {
    try {
      const data = await db.Product.findAll({
        where: { type: 'iPhone' },
        include: [
          { model: db.Category, as: 'typeData' }
        ],
        attributes: {
          exclude: [ 'image' ]
        },
        nest: true,
        raw: true
      });
      return res.status(200).json({
        data: data
      })
    } catch (error) {
      return res.status(404).json({
        message: error
      })
    }
  })
  return app.use('/api', router)

}
// Hoàn thành
module.exports = initWebRoutes
