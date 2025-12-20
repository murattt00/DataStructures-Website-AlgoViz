let stack = [];

function push() {
    const input = document.getElementById('stackInput');
    const value = input.value.trim();
    
    if (value === '') {
        showMessage('Please enter a value!', 'error');
        return;
    }

    stack.push(value);
    input.value = '';
    updateDisplay();
    showMessage(`Pushed "${value}" to stack`, 'success');
}

function pop() {
    if (stack.length === 0) {
        showMessage('Stack is empty! Cannot pop.', 'error');
        return;
    }

    const poppedValue = stack.pop();
    updateDisplay();
    showMessage(`Popped "${poppedValue}" from stack`, 'success');
}

function peek() {
    if (stack.length === 0) {
        showMessage('Stack is empty! Nothing to peek.', 'error');
        return;
    }

    const topValue = stack[stack.length - 1];
    showMessage(`Top element is "${topValue}"`, 'info');
}

function clearStack() {
    stack = [];
    updateDisplay();
    showMessage('Stack cleared!', 'info');
}

function updateDisplay() {
    const container = document.getElementById('stackContainer');
    const sizeElement = document.getElementById('stackSize');
    const topElement = document.getElementById('topElement');

    sizeElement.textContent = stack.length;
    topElement.textContent = stack.length > 0 ? stack[stack.length - 1] : 'None';

    if (stack.length === 0) {
        container.innerHTML = '<div class="stack-empty">Stack is empty</div>';
    } else {
        container.innerHTML = '';
        // Display stack from top to bottom
        for (let i = stack.length - 1; i >= 0; i--) {
            const item = document.createElement('div');
            item.className = 'stack-item';
            if (i === stack.length - 1) {
                item.classList.add('top-item');
            }
            item.innerHTML = `
                <span class="item-value">${stack[i]}</span>
                ${i === stack.length - 1 ? '<span class="top-label">← TOP</span>' : ''}
            `;
            container.appendChild(item);
        }
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

// Allow Enter key to push
document.getElementById('stackInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        push();
    }
});
