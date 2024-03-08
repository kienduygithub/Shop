'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('orderItems', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            amount: {
                type: Sequelize.INTEGER
            },
            image: {
                type: Sequelize.STRING(500000)
            },
            price: {
                type: Sequelize.FLOAT
            },
            orderId: {
                type: Sequelize.INTEGER,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            productId: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: 'Product',
                //     key: 'product_id'
                // }
            },
            discount: {
                type: Sequelize.INTEGER
            },
            countInStock: {
                type: Sequelize.INTEGER
            },
            // userId: {
            //     type: Sequelize.INTEGER
            // },
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
        await queryInterface.dropTable('orderItems');
    }
};