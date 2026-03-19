import { DataTypes } from 'sequelize';
import sequelize from '../database'; 

const Ride = sequelize.define('Ride', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dropoffLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Completed'), 
        allowNull: false,
        defaultValue: 'Pending' 
    }
});

export default Ride; 