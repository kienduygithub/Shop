import { Op } from "sequelize"
import db from "../models"

// CREATE PRODUCT
const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                name, image, type, price, countInStock, rating, description, discount, selled
            } = newProduct
            if (!name || !image || !type || !price || !countInStock || !rating) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            }
            const checkProduct = await db.Product.findOne({
                where: { name: name }
            });
            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already'
                })
            }
            const createdProduct = await db.Product.create({
                name: name,
                image: image,
                type: type,
                price: price,
                countInStock: Number(countInStock),
                rating: rating,
                description: description,
                discount: Number(discount),
                selled: Number(selled)
            })
            const newCategory = await db.Category.findOrCreate({
                where: { type: type }
            })
            if (createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'CREATE PRODUCT SUCCESS',
                    data: createdProduct
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
// UPDATE PRODUCT
const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('>>> Given data: ', data)
            let product = await db.Product.findOne({
                where: { id: id }
            })
            console.log('>>> Given product: ', product)
            if (product) {
                product.name = data.name;
                product.image = data.image;
                product.type = data.type;
                product.price = data.price;
                product.rating = data.rating;
                product.countInStock = data.countInStock;
                product.description = data.description;
                product.discount = data.discount;
                await product.save()
                let productList = await db.Product.findAll({
                    raw: true
                })
                resolve({
                    status: 'OK',
                    message: 'UPDATE PRODUCT SUCCESS',
                    data: productList
                })
            } else {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }
            resolve({ name: 'ccc' })
        } catch (error) {
            reject(error)
        }
    })
}
// DELETE PRODUCT
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await db.Product.findOne({
                where: { id: id }
            })
            let response = {}
            if (!product) {
                response = {
                    status: 'OK',
                    message: 'The product is not defined'
                }
            } else {
                await product.destroy();
                let productList = await db.Product.findAll({
                    raw: true
                });
                response = {
                    status: 'OK',
                    message: 'Delete PRODUCT SUCCESS',
                    data: productList
                }
            }
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
// READ DETAIL PRODUCT
const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await db.Product.findOne({
                raw: true,
                where: { id: id }
            })
            if (!product) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            } else {
                resolve({
                    status: 'OK',
                    message: 'Get INFO SUCCESS',
                    data: product
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
// READ ALL PRODUCT
// const getAllProduct = (limit, page, sort, filter) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const totalProduct = await db.Product.count();
//             console.log('>>> Filter: ', filter)
//             console.log('>>> Sort: ', sort)
//             if (sort) {
//                 console.log('Object Sort: ', sort)
//                 let objectSort = sort.reverse();
//                 let productListSort = await db.Product.findAll({
//                     raw: true,
//                     limit: limit ? limit : 100,
//                     order: [
//                         objectSort
//                     ],
//                     offset: limit ? page * limit : page * 0,
//                 })
//                 resolve({
//                     status: 'OK',
//                     message: 'All Products Sorted here!',
//                     data: productListSort,
//                     total: totalProduct,
//                     pageCurrent: Number(page + 1),
//                     totalPage: Math.ceil(totalProduct / limit)
//                 })
//             }
//             if (filter) {
//                 let objectFilter = {};
//                 objectFilter[filter[0]] = {
//                     [Op.like]: `${filter[1]}%`
//                 }
//                 console.log('objectFilter', objectFilter)
//                 let allObjectFilter = await db.Product.findAndCountAll({
//                     raw: true,
//                     where:
//                         objectFilter
//                 })
//                 const { count, rows } = allObjectFilter;
//                 console.log('>>>> ROWS: ', count);
//                 resolve({
//                     status: 'OK',
//                     message: 'All Products Filtered here!',
//                     data: rows,
//                     total: count,
//                     pageCurrent: Number(page + 1),
//                     totalPage: limit > 0 && Math.ceil(count / limit) ? Math.ceil(count / limit) : 1
//                 })
//             }
//             if (limit > 0) {
//                 let productListLimit = await db.Product.findAll({
//                     raw: true,
//                     limit: limit,
//                     offset: page * limit,
//                 })
//                 if (productListLimit && productListLimit.length > 0) {
//                     resolve({
//                         status: 'OK',
//                         message: 'All Products Limit here!',
//                         data: productListLimit,
//                         total: totalProduct,
//                         pageCurrent: Number(page + 1),
//                         totalPage: Math.ceil(totalProduct / limit)
//                     })
//                 }
//             }
//             let productList = await db.Product.findAll({
//                 raw: true,
//                 limit: limit ? limit : 100,
//                 offset: page * (limit ? limit : 0),
//             })
//             if (productList && productList.length > 0) {
//                 resolve({
//                     status: 'OK',
//                     message: 'All Products here!',
//                     data: productList,
//                     total: totalProduct,
//                     pageCurrent: Number(page + 1),
//                     totalPage: Math.ceil(totalProduct / (limit ? limit : totalProduct))
//                 })
//             } else {
//                 resolve({
//                     status: 'OK',
//                     message: 'Not Found'
//                 })
//             }
//         } catch (error) {
//             reject(error)
//         }
//     })
// }
const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProducts = await db.Product.count();
            if (sort && !filter) {
                sort.reverse();
                if (limit) {
                    const productListSort = await db.Product.findAll({
                        limit: limit,
                        order: [sort],
                        offset: limit * page
                    })
                    resolve({
                        status: 'OK',
                        message: 'ALL LIMIT SORTED PRODUCTS ',
                        data: productListSort,
                        total: totalProducts,
                        pageCurrent: Number(page + 1),
                        totalPage: Math.ceil(totalProducts / limit)
                    })
                }
                const productListSort = await db.Product.findAll({
                    order: [sort],
                    offset: 0
                })
                resolve({
                    status: 'OK',
                    message: 'ALL NO LIMIT SORTED PRODUCTS',
                    data: productListSort,
                    total: totalProducts,
                    pageCurrent: Number(page + 1),
                    totalPage: totalProducts / productListSort.length
                })
            } else if (filter) {
                let objectFilter = {};
                objectFilter[filter[0]] = {
                    [Op.like]: `${filter[1]}%`
                }
                const totalCount = await db.Product.count({
                    where: { ...objectFilter }
                })
                if (limit && !sort) {
                    const productListFilter = await db.Product.findAll({
                        where: { ...objectFilter },
                        limit: limit,
                        offset: limit * page
                    })
                    resolve({
                        status: 'OK',
                        message: 'ALL LIMIT FILTERED PRODUCTS',
                        data: productListFilter,
                        total: totalCount,
                        pageCurrent: Number(page + 1),
                        totalPage: Math.ceil(totalCount / limit)
                    })
                } else if (limit && sort) {
                    sort.reverse();
                    const productListFilter = await db.Product.findAndCountAll({
                        where: { ...objectFilter },
                        order: [sort],
                        limit: limit,
                        offset: limit * page
                    })
                    resolve({
                        status: 'OK',
                        message: 'ALL LIMIT SORT FILTERD PRODUCTSa',
                        data: productListFilter.rows,
                        total: productListFilter.count,
                        pageCurrent: Number(page + 1),
                        totalPage: Math.ceil(productListFilter.count / limit)
                    })
                } else if (!limit && sort) {
                    sort.reverse();
                    const productListSortedFilter = await db.Product.findAndCountAll({
                        where: { ...objectFilter },
                        order: [sort],
                        logger: true
                    })
                    const { rows, count } = productListSortedFilter;
                    resolve({
                        status: 'OK',
                        message: 'ALL NOLIMIT SORT FILTERED PRODUCTS',
                        data: rows,
                        total: count,
                        pageCurrent: Number(page + 1),
                        totalPage: 1
                    })
                }
                const productListFilters = await db.Product.findAndCountAll({
                    where: objectFilter
                })
                resolve({
                    status: 'OK',
                    message: 'ALL FILTERED PRODUCTS',
                    data: productListFilters.rows,
                    total: productListFilters.count,
                    pageCurrent: Number(page + 1),
                    totalPage: 1
                })
            } else if (!filter && !sort) {
                if (limit > 0) {
                    const productList = await db.Product.findAll({
                        limit: limit,
                        offset: page * limit,
                    })
                    resolve({
                        status: 'OK',
                        message: 'ALL LIMIT PRODUCTS',
                        data: productList,
                        total: totalProducts,
                        pageCurrent: Number(page + 1),
                        totalPage: Math.ceil(totalProducts / limit)
                    })
                }
                const productList = await db.Product.findAll();
                if (productList && productList.length > 0) {
                    resolve({
                        status: 'OK',
                        message: 'ALL PRODUCTS',
                        data: productList,
                        total: totalProducts,
                        pageCurrent: 1,
                        totalPage: 1
                    })
                } else {
                    resolve({
                        status: 'ERR',
                        message: 'NOT FOUND'
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}
const getLatestProduct = (limit, sort) => {
    return new Promise(async (resolve, reject) => {
        try {
            sort.reverse();
            let productLatests = await db.Product.findAndCountAll({
                limit: limit ? limit : 10,
                order: [sort],
            })
            if (!productLatests) {
                resolve({
                    status: 'ERR',
                    message: 'Not found'
                })
            }
            resolve({
                status: 'OK',
                message: 'ALL LATEST PRODUCTS',
                data: productLatests.rows,
                total: productLatests.rows.length
            })

        } catch (error) {
            reject(error)
        }
    })
}

// GET BY RANGE
const getByRange = (filter, min, max, limit, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            let objectFilter = {};
            objectFilter[filter[0]] = {
                [Op.like]: `${filter[1]}%`
            }
            const { count, rows } = await db.Product.findAndCountAll({
                raw: true,
                where: {
                    ...objectFilter,
                    price: { [Op.between]: [min, max] }
                },
                limit: limit
            })
            resolve({
                status: 'OK',
                message: 'ALL PRODUCT BY PRICE RANGE',
                data: rows,
                total: count,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(count / limit)
            })

        } catch (error) {
            reject(error)
        }
    })
}
// DELETE MANY
const deleteMany = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Product.destroy({
                where: { id: ids }
            })
            let productList = await db.Product.findAll({
                raw: true
            });
            resolve({
                status: 'OK',
                message: 'DELETE SUCCESS',
                data: productList
            })
        } catch (error) {
            resolve(error);
        }
    })
}
// GET ALL TYPE
const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await db.Product.findAll({
                attributes: ['type'],
                group: ['type']
            })
            resolve({
                status: 'OK',
                message: 'ALL TYPE SUCCESS',
                data: allType
            });
        } catch (error) {
            reject(error)
        }
    })
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