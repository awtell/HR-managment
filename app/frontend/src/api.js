const fetchCurrentUser = async (token) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/current_user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch current user error:', error);
    throw error;
  }
};

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

const postUser = async (formData, userType = 'employee') => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`http://127.0.0.1:5000/${userType === 'admin' ? 'admin' : 'user'}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData // FormData is sent directly
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

const hrLogin = async (userData) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error logging in:', errorData);
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    return data;
  } catch (error) {
    console.error('HR login error:', error);
    throw error;
  }
};

const uploadImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('id', id);
  formData.append('image', imageFile);

  try {
    const response = await fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error uploading image:', errorData);
      throw new Error(errorData.error || 'Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

export {
  hrLogin,
  fetchCurrentUser,
  fetchUsers,
  postUser,
  deleteUser,
  updateUser,
  adminLogin,
  uploadImage
};
