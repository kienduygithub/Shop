'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ShippingAddress extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ShippingAddress.belongsTo(models.Order)
        }
    };
    ShippingAddress.init({
        fullName: DataTypes.STRING,
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        phone: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'ShippingAddress',
    });
    return ShippingAddress;
};