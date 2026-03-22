import { useEffect, useState } from 'react';
import './App.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Ride interface
interface Ride {
  id: number;
  pickupLocation: string;
  dropoffLocation: string;
  fare: string;
  userId: number;
}

function App() {
  // Set states
  const [users, setUsers] = useState<User[]>([]);
  const [rides, setRides] = useState<Ride[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  // User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Rider');
  const [userError, setUserError] = useState('');

  // Ride Form State
  const [pickup, setPickup] = useState(''); 
  const [dropoff, setDropoff] = useState('');
  const [fare, setFare] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [rideError, setRideError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ridesRes] = await Promise.all([
          fetch('http://localhost:3000/api/users'),
          fetch('http://localhost:3000/api/rides')
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (ridesRes.ok) setRides(await ridesRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, email: newEmail, role: newRole }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.errors ? data.errors[0].msg : data.error);
      
      setUsers((prev) => [...prev, data.user]);
      setNewName(''); setNewEmail(''); setNewRole('Rider');
    } catch (error: any) {
      setUserError(error.message);
    }
  };

  const handleCreateRide = async (e: React.FormEvent) => {
    e.preventDefault();
    setRideError('');
    try {
      const response = await fetch('http://localhost:3000/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pickupLocation: pickup, 
          dropoffLocation: dropoff, 
          fare: parseFloat(fare), 
          userId: parseInt(selectedUserId) 
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.errors ? data.errors[0].msg : data.error);
      
      setRides((prev) => [...prev, data.ride]);
      setPickup(''); setDropoff(''); setFare(''); setSelectedUserId('');
    } catch (error: any) {
      setRideError(error.message);
    }
  };

  if (loading) return <div className="app-container"><h2>Loading vault data...</h2></div>;

  return (
    <div className="app-container">
      <h1>ecoRide Admin Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="column">
          <div className="form-container">
            <h2>Add New User</h2>
            {userError && <p className="error-text">{userError}</p>}
            <form onSubmit={handleCreateUser} className="stacked-form">
              <input type="text" placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
              <input type="email" placeholder="Email Address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="Rider">Rider</option>
                <option value="Driver">Driver</option>
              </select>
              <button type="submit">Create User</button>
            </form>
          </div>

          <h2>Users Directory</h2>
          <div className="card-list">
            {users.map((user) => (
              <div key={user.id} className="data-card">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <span className={`badge ${user.role.toLowerCase()}`}>{user.role}</span>
              </div>
            ))}
          </div>
        </div>


        <div className="column">
          <div className="form-container">
            <h2>Book a Ride</h2>
            {rideError && <p className="error-text">{rideError}</p>}
            <form onSubmit={handleCreateRide} className="stacked-form">
              <input type="text" placeholder="Pickup Location" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
              <input type="text" placeholder="Dropoff Location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required />
              <input type="number" step="0.01" placeholder="Fare ($)" value={fare} onChange={(e) => setFare(e.target.value)} required />
              

              <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required>
                <option value="" disabled>Assign to User...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              
              <button type="submit">Book Ride</button>
            </form>
          </div>

          <h2>Recent Rides</h2>
          <div className="card-list">
            {rides.map((ride) => {
              // Find passenger's name based on userId
              const passenger = users.find(u => u.id === ride.userId)?.name || "Unknown";
              return (
                <div key={ride.id} className="data-card">
                  <h3>{ride.pickupLocation} to {ride.dropoffLocation}</h3>
                  <p><strong>Passenger:</strong> {passenger}</p>
                  <p className="fare-tag">${ride.fare}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;