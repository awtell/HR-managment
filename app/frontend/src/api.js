const fetchUsers = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
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

const postUser = async (user) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
    try {
        const response = await fetch(`http://127.0.0.1:5000/user/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
};

export {
    fetchUsers, postUser, deleteUser
};
