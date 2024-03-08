'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Product.hasOne(models.OrderItem);
            Product.belongsTo(models.Category, {
                foreignKey: 'type', as: 'typeData', targetKey: 'type'
            })
        }
    };
    Product.init({
        name: DataTypes.STRING,
        image: DataTypes.STRING(500000),
        type: DataTypes.STRING,
        price: DataTypes.FLOAT,
        countInStock: DataTypes.INTEGER,
        rating: DataTypes.INTEGER,
        description: DataTypes.STRING,
        discount: DataTypes.INTEGER,
        selled: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};