document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('/submit-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, subject, message }),
        });

        if (response.ok) {
            alert('Message sent successfully!');
            document.getElementById('contact-form').reset(); // Reset form after successful submission
        } else {
            alert('Error sending message. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
