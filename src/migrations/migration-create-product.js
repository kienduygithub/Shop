'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            image: {
                type: Sequelize.STRING(500000),
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
            },
            price: {
                type: Sequelize.FLOAT
            },
            rating: {
                type: Sequelize.INTEGER
            },
            countInStock: {
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.STRING
            },
            discount: {
                type: Sequelize.INTEGER
            },
            selled: {
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('products');
    }
};