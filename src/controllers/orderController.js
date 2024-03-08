import orderServices from '../services/orderServices'
const createOrder = async (req, res) => {
    try {
        const {paymentMethod, itemsPrice, shippingMethod, shippingPrice, totalPrice, fullName, address, city, phone} = req.body;
        if (!paymentMethod || !shippingMethod || !itemsPrice || !totalPrice || !fullName || !address || !city || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await orderServices.createOrder(req.body);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// READ DETAILS
const getOrderDetails = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await orderServices.getOrderDetails(id);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
const cancelOrderDetails = async (req, res) => {
    try {
        const {orderId, orderItems} = req.body;
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await orderServices.cancelOrderDetails(orderId, orderItems);
        return res.status(200).json(
            response
        )
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message: error
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const response = await orderServices.getAllOrder();
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
const getAllOrderLatest = async (req, res) => {
    try {
        const response = await orderServices.getAllOrderLatest();
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await orderServices.getAllOrderDetails(userId);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// UPDATE ORDER
const updateOrder = async (req, res) => {
    try {
        let orderId = req.params.id;
        let {isPaid, isDelivered} = req.body;
        const response = await orderServices.updateOrder(orderId, {isPaid, isDelivered});
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// DELETE ORDER ADMIN
const deleteOrderAdmin = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await orderServices.deleteOrderAdmin(orderId);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
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