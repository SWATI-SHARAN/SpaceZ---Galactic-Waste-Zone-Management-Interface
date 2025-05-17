document.addEventListener('DOMContentLoaded', function() {
    // Get all the elements we need
    const badTable = document.getElementById('bad-table');
    const soonTable = document.getElementById('soon-table');
    const badItems = document.getElementById('bad-items');
    const soonItems = document.getElementById('soon-items');
    const badEmpty = document.getElementById('bad-empty');
    const soonEmpty = document.getElementById('soon-empty');
    const badCount = document.getElementById('bad-count');
    const soonCount = document.getElementById('soon-count');
    const days = document.getElementById('days');
    
    const addBadBtn = document.getElementById('add-bad');
    const addSoonBtn = document.getElementById('add-soon');
    
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.querySelector('.cancel');
    const itemForm = document.getElementById('item-form');
    const tableType = document.getElementById('table-type');
    
    // Sample Data - some food items
    let stuff = [
        {
            id: 1,
            name: 'Milk',
            expiry: '2025-03-15',
            qty: 2,
            place: 'Refrigerator',
            use: 0.5
        },
        {
            id: 2,
            name: 'Bread',
            expiry: '2025-03-20',
            qty: 1,
            place: 'Pantry',
            use: 0.25
        },
        {
            id: 3,
            name: 'Cheese',
            expiry: '2025-04-10',
            qty: 3,
            place: 'Refrigerator',
            use: 0.1
        },
        {
            id: 4, 
            name: 'Yogurt',
            expiry: '2025-03-25',
            qty: 6,
            place: 'Refrigerator',
            use: 1
        },
        {
            id: 5,
            name: 'Eggs',
            expiry: '2025-04-15',
            qty: 12,
            place: 'Refrigerator',
            use: 2
        }
    ];
    
    // Calculate days between dates
    function dayDiff(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1 - date2) / oneDay));
    }
    
    // Update both tables with current data
    function updateTables() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const bad = [];
        const soon = [];
        
        stuff.forEach(item => {
            const expDate = new Date(item.expiry);
            expDate.setHours(0, 0, 0, 0);
            
            if (expDate < today) {
                bad.push({...item, daysPast: dayDiff(today, expDate)});
            } else if (dayDiff(today, expDate) <= 14) {
                soon.push({...item, daysLeft: dayDiff(today, expDate)});
            }
        });
        
        // Update counters at top
        badCount.textContent = bad.length;
        soonCount.textContent = soon.length;
        
        // Calculate how many days supplies will last
        const totalDays = stuff.reduce((total, item) => {
            return total + (item.qty / (item.use || 0.01));
        }, 0);
        
        days.textContent = Math.round(totalDays);
        
        // Fill in the expired items table
        showTable(bad, badItems, badEmpty, 'bad');
        
        // Fill in the soon-to-expire table
        showTable(soon, soonItems, soonEmpty, 'soon');
    }
    
    // Show items in a table
    function showTable(items, tableBody, emptyMsg, type) {
        tableBody.innerHTML = '';
        
        if (items.length === 0) {
            emptyMsg.style.display = 'block';
            tableBody.parentElement.style.display = 'none';
            return;
        }
        
        emptyMsg.style.display = 'none';
        tableBody.parentElement.style.display = 'table';
        
        items.forEach(item => {
            const row = document.createElement('tr');
            
            const expDate = new Date(item.expiry);
            const niceDate = expDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            if (type === 'bad') {
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td class="danger">${niceDate} (${item.daysPast} days ago)</td>
                    <td>${item.qty}</td>
                    <td>${item.place}</td>
                    <td class="actions">
                        <button class="edit" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                        <button class="trash" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            } else {
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${niceDate}</td>
                    <td class="warning">${item.daysLeft} days</td>
                    <td>${item.qty}</td>
                    <td>${item.place}</td>
                    <td class="actions">
                        <button class="edit" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                        <button class="trash" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            }
            
            tableBody.appendChild(row);
        });
        
        // Add button actions
        const editBtns = tableBody.querySelectorAll('.edit');
        const trashBtns = tableBody.querySelectorAll('.trash');
        
        editBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                editItem(itemId);
            });
        });
        
        trashBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                removeItem(itemId);
            });
        });
    }
    
    // Open the form popup
    function openPopup(type, editId = null) {
        popupTitle.textContent = editId ? 'Edit Item' : 'Add New Item';
        tableType.value = type;
        
        // Set up the form
        const nameInput = document.getElementById('name');
        const dateInput = document.getElementById('date');
        const qtyInput = document.getElementById('qty');
        const placeInput = document.getElementById('place');
        const useInput = document.getElementById('use');
        const saveBtn = document.querySelector('.save');
        
        if (editId) {
            const item = stuff.find(item => item.id === editId);
            if (item) {
                nameInput.value = item.name;
                dateInput.value = item.expiry;
                qtyInput.value = item.qty;
                placeInput.value = item.place;
                useInput.value = item.use || 0;
                saveBtn.textContent = 'Update Item';
                
                // Remember which item we're editing
                itemForm.setAttribute('data-edit-id', editId);
            }
        } else {
            nameInput.value = '';
            dateInput.value = '';
            qtyInput.value = 1;
            placeInput.value = '';
            useInput.value = 0;
            saveBtn.textContent = 'Add Item';
            
            // Clear any old edit ID
            itemForm.removeAttribute('data-edit-id');
        }
        
        popup.style.display = 'block';
    }
    
    // Close the popup
    function closePopup() {
        popup.style.display = 'none';
    }
    
    // Add a new item
    function addItem(item) {
        const newId = stuff.length > 0 ? Math.max(...stuff.map(i => i.id)) + 1 : 1;
        stuff.push({
            id: newId,
            ...item
        });
        updateTables();
    }
    
    // Edit an existing item
    function editItem(itemId) {
        openPopup('edit', itemId);
    }
    
    // Update an item with new info
    function updateItem(itemId, newData) {
        const index = stuff.findIndex(item => item.id === itemId);
        if (index !== -1) {
            stuff[index] = {
                ...stuff[index],
                ...newData
            };
            updateTables();
        }
    }
    
    // Delete an item
    function removeItem(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            stuff = stuff.filter(item => item.id !== itemId);
            updateTables();
        }
    }
    
    // Set up event listeners
    addBadBtn.addEventListener('click', function() {
        openPopup('bad');
    });
    
    addSoonBtn.addEventListener('click', function() {
        openPopup('soon');
    });
    
    closeBtn.addEventListener('click', closePopup);
    cancelBtn.addEventListener('click', closePopup);
    
    // Close popup when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            closePopup();
        }
    });
    
    // Handle form submission
    itemForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const newItem = {
            name: document.getElementById('name').value,
            expiry: document.getElementById('date').value,
            qty: parseInt(document.getElementById('qty').value),
            place: document.getElementById('place').value,
            use: parseFloat(document.getElementById('use').value) || 0
        };
        
        const editId = itemForm.getAttribute('data-edit-id');
        
        if (editId) {
            updateItem(parseInt(editId), newItem);
        } else {
            addItem(newItem);
        }
        
        closePopup();
    });
    
    // Start everything up
    updateTables();
});
const cursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', function (e) {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  });


  
