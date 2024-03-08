import { Op, or } from "sequelize";
import db from "../models";
import emailServices from '../services/emailServices'

const today = new Date();
const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
startOfWeek.setHours(7, 0, 0, 0);
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(endOfWeek.getDate() + 6);
endOfWeek.setHours(30, 59, 59, 999);

// CREATE
const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                orderItems, paymentMethod, shippingMethod, itemsPrice,
                shippingPrice, totalPrice, fullName,
                address, city, phone,
                userId, isPaid, paidAt,
                email
            } = newOrder;
            const orderItemsParse = JSON.parse(orderItems);
            const promises = orderItemsParse.map(
                async (order) => {
                    const { productId, amount } = order;
                    const productData = await db.Product.findOne({
                        where: { id: productId, countInStock: { [ Op.gte ]: amount } }
                    })
                    if (productData) {
                        productData.countInStock -= amount;
                        productData.selled += amount;
                        await productData.save();
                        return {
                            status: 'OK',
                            message: 'SUCCESS'
                        }
                    } else {
                        return {
                            status: 'OK',
                            message: 'ERR',
                            id: order.productId
                        }
                    }
                }
            );

            const results = await Promise.all(promises);
            const newData = results && results.filter((item) => item.id);
            if (newData.length) {
                const arrId = [];
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: ` Sản phẩm với id: ${ arrId.join(',') } không đủ hàng`
                })
            } else {
                let shippingAddress = {
                    fullName, address, city, phone
                };
                let JSONShippingAddress = JSON.stringify(shippingAddress);
                const createdOrder = await db.Order.create({
                    orderItems: orderItems,
                    shippingAddress: JSONShippingAddress,
                    paymentMethod,
                    shippingMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    userId: userId,
                    isPaid: isPaid,
                    paidAt: paidAt
                })
                if (createdOrder) {
                    await emailServices.sendEmailCreateOrder(email, orderItemsParse);
                    resolve({
                        status: 'OK',
                        message: 'success',
                        data: createdOrder
                    })
                }
                await Promise.all(
                    orderItemsParse.map(async (item) => {
                        await db.OrderItem.create({
                            orderId: createdOrder.id,
                            name: item.name,
                            amount: item.amount,
                            image: item.image,
                            price: item.price,
                            productId: item.productId,
                            discount: item.discount,
                            countInStock: item.countInStock
                        })
                    })
                )
            }
            resolve({
                status: 'OK',
                message: 'success'
            })
        } catch (error) {
            reject(error)
        }
    })
}
// READ DETAILS
const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await db.Order.findOne({
                where: { id: id },
                // raw: true
            })
            if (!order) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            let items = await db.OrderItem.findAll({
                include: [ {
                    model: db.Order,
                    as: 'order'
                } ],
                where: { orderId: order.id },
                raw: true
            });
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order,
                items
            })
        } catch (error) {
            reject(error)
        }
    })
}
// CANCEL DETAIL
const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = [];
            const promises = data.map(async (order) => {
                const productData = await db.Product.findOne({
                    where: { id: order.productId, selled: { [ Op.gte ]: order.amount } },
                })
                if (productData) {
                    productData.countInStock += order.amount;
                    productData.selled -= order.amount;
                    await productData.save();
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.productId
                    }
                }
            })
            const results = await Promise.all(promises);
            const newData = results && results[ 0 ] && results[ 0 ].id;
            if (newData) {
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id: ${ newData } không tồn tại`
                })
            }
            order = await db.Order.findOne({
                where: { id: id }
            })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            await order.destroy();
            await db.OrderItem.destroy({
                where: { orderId: id }
            })
            resolve({
                status: 'OK',
                message: 'CANCEL ORDER SUCCESS',
                data: order
            })
        } catch (error) {
            reject(error)
        }
    })
}
// GET ALL ORDER
const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await db.Order.findAll({
                order: [
                    [ 'createdAt', 'ASC' ]
                ]
            })
            resolve({
                status: 'OK',
                message: 'SUCCESS GET ALL ORDER',
                data: allOrder
            })
        } catch (error) {
            reject(error);
        }
    })
}
// GET ALL ORDER LATEST
const getAllOrderLatest = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await db.Order.findAndCountAll({
                where: {
                    createdAt: {
                        [ Op.gte ]:
                            startOfWeek,
                        [ Op.lte ]:
                            endOfWeek
                    }
                },
                raw: true
            })
            if (!orders) {
                resolve({
                    status: 'ERR',
                    message: 'NOT FOUND'
                })
            }
            resolve({
                status: 'OK',
                message: 'ALL LATEST ORDERS HERE',
                data: orders.rows,
                total: orders.count
            })
        } catch (error) {
            reject(error)
        }
    })
}
// GET ALL ORDER DETAILS
const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await db.Order.findAll({
                order: [
                    [ 'createdAt', 'DESC' ]
                ],
                where: { userId: id },
                attributes: {
                    exclude: [ 'orderItems', 'createdAt', 'updatedAt' ]
                },
                include: {
                    model: db.OrderItem,
                    attributes: {
                        exclude: [ 'createdAt', 'updatedAt' ]
                    }
                },
                nest: true
            })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'Lêu Lêu The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS GET ALL ORDER BY USER ID',
                data: order
            })
        } catch (error) {
            reject(error)
        }
    })
}
// UPDATE ORDER
const updateOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { isPaid, isDelivered } = data;
            const order = await db.Order.findOne({
                where: { id: id },
            });
            if (order) {
                order.isPaid = isPaid;
                order.isDelivered = isDelivered;
                await order.save();
                resolve({
                    status: 'OK',
                    message: 'UPDATE ORDER SUCCESS'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
// DELETE ORDER ADMIN
const deleteOrderAdmin = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await db.Order.findOne({
                where: { id: orderId }
            });
            if (!order) {
                resolve({
                    status: 'ERR',
                    message: `The order with id=${ orderId } is not defined`
                })
            }
            await order.destroy();
            await db.OrderItem.destroy({
                where: { orderId: orderId }
            })
            resolve({
                status: 'OK',
                message: 'DELETE ORDER SUCCESS'
            })
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    createOrder: createOrder,
    getOrderDetails: getOrderDetails,
    cancelOrderDetails: cancelOrderDetails,
    getAllOrder: getAllOrder,
    getAllOrderDetails: getAllOrderDetails,
    updateOrder: updateOrder,
    deleteOrderAdmin: deleteOrderAdmin,
    getAllOrderLatest: getAllOrderLatest
}