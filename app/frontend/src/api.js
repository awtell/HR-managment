const fetchUsers = async (limit, token) => {
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
  
  const postUser = async (user, token) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/user', {
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
  
  const deleteUser = async (id, token) => {
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
  
  const updateUser = async (id, user, token) => {
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
  
  export {
    fetchUsers, postUser, deleteUser, updateUser
  };
  