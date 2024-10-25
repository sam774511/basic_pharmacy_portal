async function validateLogin(event) {
    event.preventDefault(); // Prevent form submission

    const userId = document.getElementById('uid').value;
    const password = document.getElementById('pass').value;

    const response = await fetch('/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, password })
    });

    if (response.ok) {
        // Redirect to home page
        window.location.href = "home.html"; 
    } else {
        const message = await response.text();
        alert(message);
    }
}

async function validateSignup(event) {
    event.preventDefault(); // Prevent form submission

    const newUserId = document.getElementById('new-uid').value;
    const newPassword = document.getElementById('new-pass').value;
    const confirmPassword = document.getElementById('confirm-pass').value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: newUserId, password: newPassword })
    });

    if (response.ok) {
        alert("Sign up successful!");
        document.getElementById('signup-form').reset(); // Clear the signup form
    } else {
        const message = await response.text();
        alert(message);
    }
}