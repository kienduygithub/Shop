'use strict';
import db from '../models/index'
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */

        static associate(models) {
            OrderItem.belongsTo(models.Product, {
                foreignKey: 'productId',
                as: 'product'
            })
            OrderItem.belongsTo(models.Order, {
                foreignKey: 'orderId',
                as: 'order'
            })
        }
    };
    OrderItem.init({
        name: DataTypes.STRING,
        amount: DataTypes.INTEGER,
        image: DataTypes.STRING(500000),
        price: DataTypes.FLOAT,
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Order',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Product',
                key: 'id'
            }
        },
        discount: DataTypes.INTEGER,
        countInStock: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'OrderItem',
    });
    return OrderItem;
};