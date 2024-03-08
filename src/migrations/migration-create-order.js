'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            orderItems: {
                type: Sequelize.JSON
            },
            shippingAddress: {
                type: Sequelize.JSON
            },
            paymentMethod: {
                type: Sequelize.STRING
            },
            shippingMethod: {
                type: Sequelize.STRING
            },
            itemsPrice: {
                type: Sequelize.FLOAT
            },
            shippingPrice: {
                type: Sequelize.FLOAT
            },
            totalPrice: {
                type: Sequelize.FLOAT
            },
            userId: {
                type: Sequelize.INTEGER
            },
            isPaid: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            paidAt: {
                type: Sequelize.DATE
            },
            isDelivered: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            deliveredAt: {
                type: Sequelize.DATE
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Orders');
    }
};