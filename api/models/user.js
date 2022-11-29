const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
const User = sequelize.define( "users", {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    speciality: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photourl: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {timestamps: true}, )
return User
}