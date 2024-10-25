document.getElementById('medicine-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const medicineName = document.getElementById('medicine-name').value;


    document.getElementById('medicine-name').value = '';

    try {
        const response = await fetch('/search-medicine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ medicineName }),
        });

        if (!response.ok) {
            throw new Error('Medicine not found');
        }

        const medicine = await response.json();

        const tableBody = document.getElementById('medicine-table').querySelector('tbody');
        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${medicine['Medicine Name']}</td>
            <td>${medicine['Price (INR)']}</td>
            <td>${medicine.Manufacturer}</td>
            <td>${medicine['Side Effects']}</td>
        `;

        tableBody.appendChild(newRow);
    } catch (error) {
        console.error('Error:', error);
        alert(error.message); 
    }
});
