// Node class for linked list
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null; // Only used for doubly linked list
    }
}

// LinkedList class
class LinkedList {
    constructor(type = 'singly') {
        this.head = null;
        this.tail = null;
        this.type = type; // 'singly', 'doubly', 'circular'
        this.size = 0;
    }

    // Insert at head
    insertAtHead(value) {
        const newNode = new Node(value);
        
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            
            // For circular, point to itself
            if (this.type === 'circular') {
                newNode.next = newNode;
            }
        } else {
            if (this.type === 'doubly') {
                newNode.next = this.head;
                this.head.prev = newNode;
                this.head = newNode;
            } else if (this.type === 'circular') {
                newNode.next = this.head;
                this.tail.next = newNode;
                this.head = newNode;
            } else { // singly
                newNode.next = this.head;
                this.head = newNode;
            }
        }
        
        this.size++;
    }

    // Insert at tail
    insertAtTail(value) {
        const newNode = new Node(value);
        
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            
            // For circular, point to itself
            if (this.type === 'circular') {
                newNode.next = newNode;
            }
        } else {
            if (this.type === 'doubly') {
                this.tail.next = newNode;
                newNode.prev = this.tail;
                this.tail = newNode;
            } else if (this.type === 'circular') {
                this.tail.next = newNode;
                newNode.next = this.head;
                this.tail = newNode;
            } else { // singly
                this.tail.next = newNode;
                this.tail = newNode;
            }
        }
        
        this.size++;
    }

    // Delete by value
    deleteByValue(value) {
        if (!this.head) {
            return false;
        }

        // If head needs to be deleted
        if (this.head.value === value) {
            if (this.head === this.tail) {
                // Only one node
                this.head = null;
                this.tail = null;
            } else {
                if (this.type === 'doubly') {
                    this.head = this.head.next;
                    this.head.prev = null;
                } else if (this.type === 'circular') {
                    this.head = this.head.next;
                    this.tail.next = this.head;
                } else { // singly
                    this.head = this.head.next;
                }
            }
            this.size--;
            return true;
        }

        // Search for the node
        let current = this.head;
        let prev = null;

        // For circular, we need to stop when we reach head again
        const startNode = this.head;
        let isFirst = true;

        while (current && (this.type !== 'circular' || isFirst || current !== startNode)) {
            isFirst = false;
            
            if (current.value === value) {
                if (this.type === 'doubly') {
                    if (current.next) {
                        current.next.prev = current.prev;
                    }
                    if (prev) {
                        prev.next = current.next;
                    }
                    if (current === this.tail) {
                        this.tail = prev;
                    }
                } else if (this.type === 'circular') {
                    prev.next = current.next;
                    if (current === this.tail) {
                        this.tail = prev;
                        this.tail.next = this.head;
                    }
                } else { // singly
                    prev.next = current.next;
                    if (current === this.tail) {
                        this.tail = prev;
                    }
                }
                this.size--;
                return true;
            }
            
            prev = current;
            current = current.next;
        }

        return false;
    }

    // Search for a value
    search(value) {
        if (!this.head) {
            return { found: false, steps: ["List is empty"] };
        }

        const steps = [`Starting search for ${value}`];
        let current = this.head;
        let position = 0;

        // For circular, we need to stop when we reach head again
        const startNode = this.head;
        let isFirst = true;

        while (current && (this.type !== 'circular' || isFirst || current !== startNode)) {
            isFirst = false;
            steps.push(`Checking position ${position}: value = ${current.value}`);
            
            if (current.value === value) {
                steps.push(`✓ Found ${value} at position ${position}!`);
                return { found: true, position, steps };
            }
            
            steps.push(`${current.value} ≠ ${value}, moving to next node`);
            current = current.next;
            position++;
        }

        steps.push(`✗ Value ${value} not found in the list`);
        return { found: false, steps };
    }

    // Clear the list
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    // Get all nodes as array
    toArray() {
        const nodes = [];
        if (!this.head) {
            return nodes;
        }

        let current = this.head;
        const startNode = this.head;
        let isFirst = true;

        while (current && (this.type !== 'circular' || isFirst || current !== startNode)) {
            isFirst = false;
            nodes.push(current);
            current = current.next;
        }

        return nodes;
    }
}

// Global variables
let list = new LinkedList('singly');
let currentListType = 'singly';
let isAnimating = false;

// Helper function to delay execution
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to highlight node by value
async function highlightNode(value, className, message) {
    showMessage(message, 'info');
    updateDisplay();
    
    await delay(100); // Small delay for display to update
    
    // Find and highlight the node
    const allNodes = document.querySelectorAll('.list-node');
    allNodes.forEach(nodeEl => {
        const valueEl = nodeEl.querySelector('.node-value');
        if (valueEl && parseInt(valueEl.textContent) === value) {
            nodeEl.classList.add(className);
        }
    });
    
    await delay(1000);
    
    // Remove highlight
    allNodes.forEach(nodeEl => {
        nodeEl.classList.remove('visiting', 'comparing', 'new-node');
    });
}

// Disable/enable buttons during animation
function disableButtons(disabled) {
    const buttons = document.querySelectorAll('button');
    const input = document.getElementById('listInput');
    buttons.forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.5' : '1';
        btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
    });
    input.disabled = disabled;
}

// Change list type
function changeListType(type) {
    if (isAnimating) {
        showMessage('Please wait for the current animation to complete', 'error');
        return;
    }
    
    currentListType = type;
    
    // Update active button
    document.getElementById('btnSingly').classList.remove('active');
    document.getElementById('btnDoubly').classList.remove('active');
    document.getElementById('btnCircular').classList.remove('active');
    
    if (type === 'singly') {
        document.getElementById('btnSingly').classList.add('active');
        document.getElementById('listType').textContent = 'Singly Linked List';
    } else if (type === 'doubly') {
        document.getElementById('btnDoubly').classList.add('active');
        document.getElementById('listType').textContent = 'Doubly Linked List';
    } else {
        document.getElementById('btnCircular').classList.add('active');
        document.getElementById('listType').textContent = 'Circular Linked List';
    }
    
    // Recreate list with new type
    list = new LinkedList(type);
    updateDisplay();
    showMessage(`Switched to ${type} linked list`, 'info');
}

// Insert at head
async function insertAtHead() {
    if (isAnimating) {
        showMessage('Please wait for the current animation to complete', 'error');
        return;
    }
    
    const input = document.getElementById('listInput');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showMessage('Please enter a valid number', 'error');
        return;
    }
    
    isAnimating = true;
    disableButtons(true);
    
    showMessage(`Starting insertion of ${value} at HEAD...`, 'info');
    await delay(800);
    
    if (list.head) {
        await highlightNode(list.head.value, 'visiting', `Current HEAD is ${list.head.value}`);
        showMessage(`Inserting ${value} before ${list.head.value}`, 'info');
        await delay(800);
    } else {
        showMessage(`List is empty, ${value} will be the HEAD`, 'info');
        await delay(800);
    }
    
    list.insertAtHead(value);
    input.value = '';
    
    await highlightNode(value, 'new-node', `✓ ${value} inserted at HEAD!`);
    
    disableButtons(false);
    isAnimating = false;
    
    showMessage(`✓ Successfully inserted ${value} at head`, 'success');
}

// Insert at tail
async function insertAtTail() {
    if (isAnimating) {
        showMessage('Please wait for the current animation to complete', 'error');
        return;
    }
    
    const input = document.getElementById('listInput');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showMessage('Please enter a valid number', 'error');
        return;
    }
    
    isAnimating = true;
    disableButtons(true);
    
    showMessage(`Starting insertion of ${value} at TAIL...`, 'info');
    await delay(800);
    
    if (list.tail) {
        await highlightNode(list.tail.value, 'visiting', `Current TAIL is ${list.tail.value}`);
        showMessage(`Inserting ${value} after ${list.tail.value}`, 'info');
        await delay(800);
    } else {
        showMessage(`List is empty, ${value} will be the TAIL`, 'info');
        await delay(800);
    }
    
    list.insertAtTail(value);
    input.value = '';
    
    await highlightNode(value, 'new-node', `✓ ${value} inserted at TAIL!`);
    
    disableButtons(false);
    isAnimating = false;
    
    showMessage(`✓ Successfully inserted ${value} at tail`, 'success');
}

// Delete by value
async function deleteByValue() {
    if (isAnimating) {
        showMessage('Please wait for the current animation to complete', 'error');
        return;
    }
    
    const input = document.getElementById('listInput');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showMessage('Please enter a valid number', 'error');
        return;
    }
    
    isAnimating = true;
    disableButtons(true);
    
    showMessage(`Starting search for ${value} to delete...`, 'info');
    await delay(800);
    
    // Animate search process
    let current = list.head;
    let found = false;
    let position = 0;
    const startNode = list.head;
    let isFirst = true;
    
    while (current && (list.type !== 'circular' || isFirst || current !== startNode)) {
        isFirst = false;
        
        await highlightNode(current.value, 'visiting', `Checking position ${position}: ${current.value}`);
        
        if (current.value === value) {
            await highlightNode(current.value, 'comparing', `Found ${value}! Deleting...`);
            await delay(800);
            found = true;
            break;
        }
        
        showMessage(`${current.value} ≠ ${value}, moving to next node`, 'info');
        await delay(600);
        
        current = current.next;
        position++;
    }
    
    const deleted = list.deleteByValue(value);
    input.value = '';
    
    if (deleted) {
        updateDisplay();
        showMessage(`✓ Deleted ${value} from the list`, 'success');
    } else {
        showMessage(`✗ Value ${value} not found in the list`, 'error');
    }
    
    disableButtons(false);
    isAnimating = false;
}

// Search for a value
async function search() {
    if (isAnimating) {
        showMessage('Please wait for the current animation to complete', 'error');
        return;
    }
    
    const input = document.getElementById('listInput');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showMessage('Please enter a valid number', 'error');
        return;
    }
    
    isAnimating = true;
    disableButtons(true);
    
    showMessage(`Starting search for ${value}...`, 'info');
    await delay(800);
    
    const searchResultSpan = document.getElementById('searchResult');
    let current = list.head;
    let position = 0;
    let found = false;
    const steps = [];
    
    if (!list.head) {
        searchResultSpan.textContent = 'Not found (empty list)';
        searchResultSpan.style.color = '#ff4444';
        showMessage('List is empty', 'error');
        disableButtons(false);
        isAnimating = false;
        return;
    }
    
    const startNode = list.head;
    let isFirst = true;
    
    while (current && (list.type !== 'circular' || isFirst || current !== startNode)) {
        isFirst = false;
        
        await highlightNode(current.value, 'visiting', `Checking position ${position}: value = ${current.value}`);
        steps.push(`Position ${position}: ${current.value}`);
        
        if (current.value === value) {
            await highlightNode(current.value, 'new-node', `✓ Found ${value} at position ${position}!`);
            steps.push(`✓ Found!`);
            found = true;
            searchResultSpan.textContent = `Found at position ${position}`;
            searchResultSpan.style.color = '#00ff88';
            break;
        }
        
        showMessage(`${current.value} ≠ ${value}, moving to next node`, 'info');
        await delay(600);
        
        current = current.next;
        position++;
    }
    
    if (!found) {
        searchResultSpan.textContent = 'Not found';
        searchResultSpan.style.color = '#ff4444';
        steps.push(`✗ Not found`);
    }
    
    showMessage(steps.join(' → '), found ? 'success' : 'error');
    
    disableButtons(false);
    isAnimating = false;
}

// Clear the list
function clearList() {
    if (isAnimating) return;
    list.clear();
    updateDisplay();
    document.getElementById('searchResult').textContent = 'None';
    showMessage('List cleared', 'info');
}

// Update display
function updateDisplay() {
    const container = document.getElementById('listContainer');
    document.getElementById('nodeCount').textContent = list.size;
    
    if (list.size === 0) {
        container.innerHTML = '<div class="list-empty">List is empty</div>';
        return;
    }
    
    const nodes = list.toArray();
    container.innerHTML = '';
    
    // Create list visualization based on type
    if (currentListType === 'singly') {
        drawSinglyList(container, nodes);
    } else if (currentListType === 'doubly') {
        drawDoublyList(container, nodes);
    } else {
        drawCircularList(container, nodes);
    }
}

// Draw singly linked list
function drawSinglyList(container, nodes) {
    const listWrapper = document.createElement('div');
    listWrapper.className = 'list-wrapper';
    
    // Add HEAD label
    const headLabel = document.createElement('div');
    headLabel.className = 'list-label';
    headLabel.textContent = 'HEAD';
    listWrapper.appendChild(headLabel);
    
    nodes.forEach((node, index) => {
        // Node box
        const nodeBox = document.createElement('div');
        nodeBox.className = 'list-node';
        nodeBox.innerHTML = `
            <div class="node-value">${node.value}</div>
            <div class="node-pointer">→</div>
        `;
        listWrapper.appendChild(nodeBox);
        
        // Arrow (except for last node)
        if (index < nodes.length - 1) {
            const arrow = document.createElement('div');
            arrow.className = 'list-arrow';
            arrow.textContent = '→';
            listWrapper.appendChild(arrow);
        }
    });
    
    // Add NULL at the end
    const nullBox = document.createElement('div');
    nullBox.className = 'list-null';
    nullBox.textContent = 'NULL';
    listWrapper.appendChild(nullBox);
    
    container.appendChild(listWrapper);
}

// Draw doubly linked list
function drawDoublyList(container, nodes) {
    const listWrapper = document.createElement('div');
    listWrapper.className = 'list-wrapper';
    
    // Add HEAD label
    const headLabel = document.createElement('div');
    headLabel.className = 'list-label';
    headLabel.textContent = 'HEAD';
    listWrapper.appendChild(headLabel);
    
    nodes.forEach((node, index) => {
        // Node box with prev and next pointers
        const nodeBox = document.createElement('div');
        nodeBox.className = 'list-node doubly-node';
        nodeBox.innerHTML = `
            <div class="node-pointer prev-pointer">←</div>
            <div class="node-value">${node.value}</div>
            <div class="node-pointer next-pointer">→</div>
        `;
        listWrapper.appendChild(nodeBox);
        
        // Bidirectional arrow (except for last node)
        if (index < nodes.length - 1) {
            const arrow = document.createElement('div');
            arrow.className = 'list-arrow bidirectional';
            arrow.textContent = '⇄';
            listWrapper.appendChild(arrow);
        }
    });
    
    // Add NULL at the end
    const nullBox = document.createElement('div');
    nullBox.className = 'list-null';
    nullBox.textContent = 'NULL';
    listWrapper.appendChild(nullBox);
    
    container.appendChild(listWrapper);
}

// Draw circular linked list
function drawCircularList(container, nodes) {
    const listWrapper = document.createElement('div');
    listWrapper.className = 'list-wrapper circular-wrapper';
    
    // Add HEAD label
    const headLabel = document.createElement('div');
    headLabel.className = 'list-label';
    headLabel.textContent = 'HEAD';
    listWrapper.appendChild(headLabel);
    
    nodes.forEach((node, index) => {
        // Node box
        const nodeBox = document.createElement('div');
        nodeBox.className = 'list-node';
        nodeBox.innerHTML = `
            <div class="node-value">${node.value}</div>
            <div class="node-pointer">→</div>
        `;
        listWrapper.appendChild(nodeBox);
        
        // Arrow (for all nodes in circular)
        const arrow = document.createElement('div');
        arrow.className = 'list-arrow';
        arrow.textContent = '→';
        listWrapper.appendChild(arrow);
    });
    
    // Add circular indicator back to HEAD
    const circularIndicator = document.createElement('div');
    circularIndicator.className = 'circular-indicator';
    circularIndicator.textContent = '↻ Back to HEAD';
    listWrapper.appendChild(circularIndicator);
    
    container.appendChild(listWrapper);
}

// Show message
function showMessage(message, type) {
    const messageElement = document.getElementById('statusMessage');
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    if (type === 'success') {
        messageElement.style.color = '#00ff88';
    } else if (type === 'error') {
        messageElement.style.color = '#ff4444';
    } else {
        messageElement.style.color = '#ffd700';
    }
    
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 100000);
}

// Initialize display
updateDisplay();
