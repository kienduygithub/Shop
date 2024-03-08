import orderItemServices from '../services/orderItemServices'
import jwtService from '../services/jwtService'
// CREATE PRODUCT
const createOrderItem = async (req, res) => {
    let {
        name, amount, image, price
    } = req.body
    if (!name || !amount || !image || !price) {
        return res.status(200).json({
            status: 'ERR',
            message: 'The input is required'
        })
    }
    const response = await orderItemServices.createOrderItem(req.body)
    return res.status(200).json({
        response
    })
}
const getQuarter = async (req, res) => {
    try {
        const { year } = req.query;
        console.log('year', year)
        const response = await orderItemServices.getQuarter(Number(year));
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
const getBySelectedQuarter = async (req, res) => {
    try {
        const { quarter, year } = req.query;
        if (!quarter || !year) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The parameters is required'
            })
        }
        const response = await orderItemServices.getBySelectedQuarter(quarter, year);
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
    createOrderItem,
    getQuarter,
    getBySelectedQuarter
}
