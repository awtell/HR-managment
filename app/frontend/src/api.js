const fetchUsers = async (limit) => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`http://127.0.0.1:5000/user?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
const postUser = async (user, userType = 'employee') => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`http://127.0.0.1:5000/${userType === 'admin' ? 'admin' : 'user'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(user)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Post error:', error);
    throw error;
  }
};


const deleteUser = async (id) => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`http://127.0.0.1:5000/user/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

const updateUser = async (id, user) => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`http://127.0.0.1:5000/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(user)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
};

const adminLogin = async (adminCredentials) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminCredentials)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    return data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

export {
  fetchUsers, postUser, deleteUser, updateUser, adminLogin
};
