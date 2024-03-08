import productServices from '../services/productServices'
import jwtService from '../services/jwtService'
// CREATE PRODUCT
const createProduct = async (req, res) => {
    const {
        name, image, type, price, countInStock, rating, description, discount, selled
    } = req.body
    if (!name || !image || !type || !price || !countInStock || !rating) {
        return res.status(200).json({
            status: 'ERR',
            message: 'The input is required'
        })
    }
    const response = await productServices.createProduct(req.body)
    return res.status(200).json(
        response
    )
}
// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await productServices.updateProduct(productId, req.body)
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await productServices.deleteProduct(productId)
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// READ DETAIL PRODUCT
const getDetailProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await productServices.getDetailProduct(productId);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// READ ALL PRODUCT
const getAllProduct = async (req, res) => {
    try {
        let { limit, page, sort, filter } = req.query
        limit = Number(limit);
        page = Number(page)
        const response =
            await productServices.getAllProduct(limit, page || 0, sort, filter);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

// GET LATEST PRODUCT
const getLatestProduct = async (req, res) => {
    try {
        let { limit, sort } = req.query;
        limit = Number(limit);
        const response = await productServices.getLatestProduct(limit || 10, sort);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

// GET BY RANGE
const getByRange = async (req, res) => {
    try {
        const { filter, min, max, limit, page } = req.query;
        console.log('min max', min, max);
        if (!filter || !min || !max) {
            return res.status(200).json({
                status: 'ERR',
                message: 'MISSING SOME PARAMS'
            })
        }
        let setlimit = Number(limit);
        let setPage = Number(page);
        const response = await productServices.getByRange(filter, min, max, setlimit, setPage || 0);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// DELETE MANY
const deleteMany = async (req, res) => {
    try {
        console.log('Req.body: ', req.body)
        const ids = req.body;
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await productServices.deleteMany(ids);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// GET ALL TYPE
const getAllType = async (req, res) => {
    try {
        const response = await productServices.getAllType();
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
    createProduct,
    updateProduct,
    deleteProduct,
    getDetailProduct,
    getAllProduct,
    deleteMany,
    getAllType,
    getLatestProduct,
    getByRange
}
