import User from './User';
import Ride from './Ride';

// User can have multiple Rides (One-to-Many)
User.hasMany(Ride, {
  foreignKey: 'userId',
  as: 'rides'
});

// Ride belongs to one User
Ride.belongsTo(User, {
  foreignKey: 'userId',
  as: 'rider'
});

export { User, Ride };