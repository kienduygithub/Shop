import { Op } from "sequelize";
import db from "../models";

const createOrderItem = (newOrderItem) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {
                name, amount, image, price
            } = newOrderItem
            if (!name || !amount || !image || !price) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            }
            // const createdOrderItem = await db.OrderItem.create({
            //     name: name,
            //     amount: amount,
            //     image: image,
            //     price: price
            // })
            try {
                const createdOrderItem = await db.OrderItem.findAll({
                    where: { id: 2 },
                    include: [db.Product],
                })
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdOrderItem
                })
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            reject(error)
        }
    })
}
// GET QUARTER RECORDS
const getQuarter = (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const quarters = [
                { start: new Date(year, 0, 1), end: new Date(year, 2, 31) },
                { start: new Date(year, 3, 1), end: new Date(year, 5, 30) },
                { start: new Date(year, 6, 1), end: new Date(year, 8, 30) },
                { start: new Date(year, 9, 1), end: new Date(year, 11, 31) }
            ]
            const quarterDatas = await Promise.all(
                quarters.map(async (quarter) => {
                    const res = await db.OrderItem.findAll({
                        where: {
                            createdAt: {
                                [Op.between]: [quarter.start, quarter.end]
                            }
                        },
                        attributes: ['productId', 'amount', 'price', 'discount'],
                        raw: true
                    })
                    // const itemsQuarter = [];
                    const itemsQuarter = await Promise.all(
                        res.map(async (item) => {
                            const result = await db.Product.findOne({
                                where: { id: item.productId },
                                raw: true,
                                attributes: ['type']
                            })
                            if (result) {
                                return { ...item, type: result.type }
                            }
                        })
                    )
                    // console.log('Quarter: ', itemsQuarter)
                    return itemsQuarter;
                })
            )
            resolve({
                status: 'OK',
                message: 'ALL QUARTER',
                data: quarterDatas
            })
        } catch (error) {
            reject(error);
        }
    })
}
// GET ALL RECORDS BY SELECTED QUARTER
const getBySelectedQuarter = (quarter, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const quarters = [
                { start: new Date(year, 0, 1), end: new Date(year, 2, 31) },
                { start: new Date(year, 3, 1), end: new Date(year, 5, 30) },
                { start: new Date(year, 6, 1), end: new Date(year, 8, 30) },
                { start: new Date(year, 9, 1), end: new Date(year, 11, 31) },
            ];
            const data = await db.OrderItem.findAll({
                where: {
                    createdAt: { [Op.between]: [quarters[quarter - 1].start, quarters[quarter - 1].end] }
                },
                attributes: ['productId', 'amount', 'price', 'discount'],
                raw: true
            })
            const requiredData = await Promise.all(
                data.map(async (item) => {
                    const productData = await db.Product.findOne({
                        where: { id: item.productId },
                        attributes: ['type'],
                        raw: true
                    })
                    return { ...item, type: productData.type }
                })
            )
            resolve({
                status: 'OK',
                message: 'GET DATA BY SELECTED QUARTER SUCCESS',
                data: requiredData
            })
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createOrderItem,
    getQuarter,
    getBySelectedQuarter
}