document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found in local storage.');
        return;
    }

    // Fetch user data from the server with authorization header
    fetch(`/user/${userEmail}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('User not found');
        }
        return response.json();
    })
    .then(userData => {
        // Update the DOM with the user's name and email
        document.getElementById('name').innerText = userData.name || 'No Name Provided';
        document.getElementById('email').innerHTML = `<strong>Email: </strong> ${userData.email}`;
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
});
