import { useEffect, useState } from 'react';
import './App.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form state for creating a new user
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Rider'); // Default to Rider
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch users when page loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle form submission to create new user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page from refreshing
    setErrorMsg(''); // Clear old errors

    try {
      // Send POST request to backend
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          role: newRole
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors ? data.errors[0].msg : data.error);
      }

      // Update the users list with newly created user
      setUsers((prevUsers) => [...prevUsers, data.user]);
      
      // Clear form fields after successful creation
      setNewName('');
      setNewEmail('');
      setNewRole('Rider');

    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="app-container">
      <h1>ecoRide Admin Dashboard</h1>
      
      <div className="form-container">
        <h2>Add New User</h2>
        {errorMsg && <p className="error-text">{errorMsg}</p>}
        
        <form onSubmit={handleCreateUser} className="user-form">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={newEmail} 
            onChange={(e) => setNewEmail(e.target.value)} 
            required 
          />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="Rider">Rider</option>
            <option value="Driver">Driver</option>
          </select>
          <button type="submit">Create User</button>
        </form>
      </div>

      <h2>Current Users</h2>
      {loading ? (
        <p>Loading data from the vault...</p>
      ) : (
        <div className="card-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;