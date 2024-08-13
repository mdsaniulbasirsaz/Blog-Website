document.getElementById('signIn').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate form data (basic example)
    if (!name || !email || !password) {
        alert('All fields are required');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('email', email);
            localStorage.setItem('name',name);
            localStorage.setItem('password', password);
            localStorage.setItem('token', result.token);
            alert('Registration successful');
            window.location.href = '/login.html'; // Redirect to login page
        } else {
            alert(result.msg || 'An error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was a problem with the registration');
    }
});