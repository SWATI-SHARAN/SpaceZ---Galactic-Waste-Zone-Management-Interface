document.addEventListener("DOMContentLoaded", function () {
    // Default inventory items (for demo purposes)
    const defaultItems = [
      { id:
  1, name: "Quantum Stabilizer", quantity: 5, zone: "Zone 1", priority: 9 },
      { id: 2, name: "Plasma Injector", quantity: 2, zone: "Zone 3", priority: 5 },
      { id: 3, name: "Graviton Emitter", quantity: 1, zone: "Zone 2", priority: 2 },
      { id: 4, name: "Neural Interface", quantity: 8, zone: "Zone 4", priority: 10 },
      { id: 5, name: "Antimatter Capsule", quantity: 3, zone: "Zone 5", priority: 7 }
    ];
  
    // Load items from storage or use defaults
    let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || defaultItems;
    
    // Save items to local storage
    function saveToStorage() {
      localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
    }
  
    // Create a new unique ID for items
    function createNewId() {
      return Math.max(0, ...inventoryItems.map(item => item.id)) + 1;
    }
    
    // Display all inventory items in the table
    function displayItems(itemsToShow = inventoryItems) {
      const itemsList = document.getElementById('inventory-list');
      itemsList.innerHTML = '';
      
      itemsToShow.forEach(item => {
        const row = document.createElement('tr');
        
        // Add new-item class if the item is newly added
        if (item.isNew) {
          row.classList.add('new-item');
        }
        
        // Ensure priority is a number between 1-10
        const priorityNumber = Math.min(10, Math.max(1, parseInt(item.priority) || 5));
        
        // Create name cell with NEW badge if needed
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        
        // Add "NEW" badge next to name if item is new
        if (item.isNew) {
          const newBadge = document.createElement('span');
          newBadge.className = 'new-badge';
          newBadge.textContent = 'NEW';
          nameCell.appendChild(newBadge);
        }
        
        row.appendChild(nameCell);
        
        // Add other cells
        row.innerHTML += `
          <td>${item.quantity}</td>
          <td>${item.zone}</td>
          <td><span class="priority-${priorityNumber}">${priorityNumber}</span></td>
          <td>
            <button class="action-btn edit-btn" data-id="${item.id}">Edit</button>
            <button class="action-btn delete-btn" data-id="${item.id}">Delete</button>
          </td>
        `;
        
        itemsList.appendChild(row);
      });
      
      // Set up button event handlers
      document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', editItemHandler);
      });
      
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteItemHandler);
      });
      
      // Remove the isNew flag after a certain time period
      setTimeout(() => {
        let needsUpdate = false;
        inventoryItems.forEach(item => {
          if (item.isNew) {
            item.isNew = false;
            needsUpdate = true;
          }
        });
        if (needsUpdate) {
          saveToStorage();
          displayItems();
        }
      }, 60000); // Remove the "new" status after 1 minute
    }
    
    // Handle form submission to add a new item
    function addItemHandler(e) {
      e.preventDefault();
      
      // Get form input values
      const nameInput = document.getElementById('name-input');
      const quantityInput = document.getElementById('quantity-input');
      const zoneInput = document.getElementById('zone-select');
      const priorityInput = document.getElementById('priority-input');
      
      // Validate priority input is between 1-10
      const priority = parseInt(priorityInput.value);
      if (isNaN(priority) || priority < 1 || priority > 10) {
        showNotification('Priority must be a number between 1 and 10!', 'error');
        return;
      }
      
      // Create new item object
      const newItem = {
        id: createNewId(),
        name: nameInput.value.trim(),
        quantity: parseInt(quantityInput.value),
        zone: zoneInput.value,
        priority: priority,
        isNew: true // Add this flag for newly added items
      };
      
      // Add to inventory and update display
      inventoryItems.push(newItem);
      saveToStorage();
      displayItems();
      
      // Reset the form
      document.getElementById('item-form').reset();
      document.getElementById('priority-input').value = 5; // Reset to default priority
      
      // Show success message
      showNotification('Item added successfully!', 'success');
    }
    
    // Handle edit button click
    function editItemHandler(e) {
      const itemId = parseInt(e.target.dataset.id);
      const item = inventoryItems.find(item => item.id === itemId);
      
      if (item) {
        // Fill the form with item data
        document.getElementById('name-input').value = item.name;
        document.getElementById('quantity-input').value = item.quantity;
        document.getElementById('zone-select').value = item.zone;
        document.getElementById('priority-input').value = item.priority;
        
        // Remove item from list (will be re-added on submit)
        inventoryItems = inventoryItems.filter(item => item.id !== itemId);
        saveToStorage();
        displayItems();
        
        // Notify user
        showNotification('Item ready to edit. Update form and submit.', 'info');
        
        // Scroll to form
        document.querySelector('.space-panel').scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Handle delete button click
    let deleteItemId = null;

    function deleteItemHandler(e) {
      deleteItemId = parseInt(e.target.dataset.id);
      document.getElementById('confirmModal').classList.remove('hidden');
    }
    
    document.getElementById('confirmYes').addEventListener('click', () => {
      if (deleteItemId !== null) {
        inventoryItems = inventoryItems.filter(item => item.id !== deleteItemId);
        saveToStorage();
        displayItems();
        showNotification('Item deleted successfully!', 'error');
        deleteItemId = null;
      }
      document.getElementById('confirmModal').classList.add('hidden');
    });
    
    document.getElementById('confirmNo').addEventListener('click', () => {
      deleteItemId = null;
      document.getElementById('confirmModal').classList.add('hidden');
    });
    
    
    // Filter items based on search input
    function searchItemsHandler(e) {
      const searchText = e.target.value.toLowerCase();
      
      // If search is empty, show all items
      if (searchText === '') {
        displayItems();
        return;
      }
      
      // Filter items that match the search term
      const filteredItems = inventoryItems.filter(item => 
        item.name.toLowerCase().includes(searchText) || 
        item.zone.toLowerCase().includes(searchText) ||
        item.priority.toString().includes(searchText)
      );
      
      displayItems(filteredItems);
    }
    
    // Display notification message
    function showNotification(message, type) {
      // Create or get notification element
      let notification = document.querySelector('.space-notification');
      
      if (!notification) {
        notification = document.createElement('div');
        notification.className = 'space-notification';
        document.body.appendChild(notification);
      }
      
      // Set appearance based on message type
      if (type === 'success') {
        notification.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
        notification.style.border = '1px solid #00ff00';
        notification.style.color = '#00ff00';
        notification.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.4)';
      } else if (type === 'error') {
        notification.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        notification.style.border = '1px solid #ff0000';
        notification.style.color = '#ff0000';
        notification.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.4)';
      } else {
        notification.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
        notification.style.border = '1px solid #00ffff';
        notification.style.color = '#00ffff';
        notification.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
      }
      
      // Display the message
      notification.textContent = message;
      notification.style.transform = 'translateY(0)';
      
      // Hide after 3 seconds
      setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
      }, 3000);
    }
    
    // Custom cursor effect
    document.addEventListener('mousemove', function (e) {
      const cursor = document.getElementById('cursor-effect');
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  
    // Initialize the app
    displayItems();
    
    // Set up event listeners
    document.getElementById('item-form').addEventListener('submit', addItemHandler);
    document.getElementById('search-input').addEventListener('input', searchItemsHandler);
  });