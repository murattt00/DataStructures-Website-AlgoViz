let queue = [];

function enqueue() {
    const input = document.getElementById('queueInput');
    const value = input.value.trim();
    
    if (value === '') {
        showMessage('Please enter a value!', 'error');
        return;
    }

    queue.push(value); // Add to rear
    input.value = '';
    updateDisplay();
    showMessage(`Enqueued "${value}" to queue`, 'success');
}

function dequeue() {
    if (queue.length === 0) {
        showMessage('Queue is empty! Cannot dequeue.', 'error');
        return;
    }

    const dequeuedValue = queue.shift(); // Remove from front
    updateDisplay();
    showMessage(`Dequeued "${dequeuedValue}" from queue`, 'success');
}

function peek() {
    if (queue.length === 0) {
        showMessage('Queue is empty! Nothing to peek.', 'error');
        return;
    }

    const frontValue = queue[0];
    showMessage(`Front element is "${frontValue}"`, 'info');
}

function clearQueue() {
    queue = [];
    updateDisplay();
    showMessage('Queue cleared!', 'info');
}

function updateDisplay() {
    const container = document.getElementById('queueContainer');
    const sizeElement = document.getElementById('queueSize');
    const frontElement = document.getElementById('frontElement');

    sizeElement.textContent = queue.length;
    frontElement.textContent = queue.length > 0 ? queue[0] : 'None';

    if (queue.length === 0) {
        container.innerHTML = '<div class="queue-empty">Queue is empty</div>';
    } else {
        container.innerHTML = '';
        // Display queue from front to rear (left to right)
        queue.forEach((item, index) => {
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            if (index === 0) {
                queueItem.classList.add('front-item');
            }
            if (index === queue.length - 1) {
                queueItem.classList.add('rear-item');
            }
            queueItem.innerHTML = `
                <span class="item-value">${item}</span>
            `;
            container.appendChild(queueItem);
        });
    }
}

function showMessage(message, type) {
    const messageElement = document.getElementById('statusMessage');
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = '';
    }, 100000);
}

// Allow Enter key to enqueue
document.getElementById('queueInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        enqueue();
    }
});
