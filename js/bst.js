// BST Node
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

let root = null;
let operationSteps = [];
let isAnimating = false;
let isPaused = false;

// Helper function to delay execution with pause support
function delay(ms) {
    return new Promise(resolve => {
        const checkPause = () => {
            if (!isPaused) {
                setTimeout(resolve, ms);
            } else {
                setTimeout(checkPause, 100);
            }
        };
        checkPause();
    });
}

// Pause/Resume functions
function pauseOperation() {
    if (!isAnimating) return;
    isPaused = true;
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('resumeBtn').style.display = 'inline-block';
    showMessage('Operation paused', 'info');
}

function resumeOperation() {
    if (!isAnimating) return;
    isPaused = false;
    document.getElementById('pauseBtn').style.display = 'inline-block';
    document.getElementById('resumeBtn').style.display = 'none';
    showMessage('Operation resumed', 'info');
}

// Get height of tree
function getHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

// Count nodes
function countNodes(node) {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
}

// Find minimum value node
function minValueNode(node) {
    let current = node;
    while (current.left) {
        current = current.left;
    }
    return current;
}

// Delete a node (recursive helper)
function deleteNodeRec(node, value) {
    if (!node) {
        return node;
    }

    if (value < node.value) {
        node.left = deleteNodeRec(node.left, value);
    } else if (value > node.value) {
        node.right = deleteNodeRec(node.right, value);
    } else {
        // Node found - delete it
        // Case 1: No child or one child
        if (!node.left) {
            return node.right;
        } else if (!node.right) {
            return node.left;
        }

        // Case 2: Two children
        const temp = minValueNode(node.right);
        node.value = temp.value;
        node.right = deleteNodeRec(node.right, temp.value);
    }

    return node;
}

// Simple search (non-animated, for delete check)
function searchNode(node, value) {
    if (!node) return false;
    if (value === node.value) return true;
    if (value < node.value) return searchNode(node.left, value);
    return searchNode(node.right, value);
}

// Public functions
async function insert() {
    if (isAnimating) {
        showMessage('Please wait for the current animation to complete', 'error');
        return;
    }
    
    const input = document.getElementById('bstInput');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showMessage('Please enter a valid number!', 'error');
        return;
    }

    isAnimating = true;
    operationSteps = [];
    disableButtons(true);
    
    operationSteps.push(`Starting insertion of ${value}`);
    if (root) {
        operationSteps.push(`Root is ${root.value}`);
    } else {
        operationSteps.push(`Tree is empty, ${value} will be root`);
    }
    
    showMessage(operationSteps.join(' → '), 'info');
    await delay(800);
    
    root = await insertNodeAnimated(root, value);
    input.value = '';
    updateDisplay();
    
    disableButtons(false);
    isAnimating = false;
    isPaused = false;
    
    showMessage(operationSteps.join(' → '), 'success');
}

// Animated insert
async function insertNodeAnimated(node, value) {
    if (!node) {
        operationSteps.push(`✓ Found empty spot, inserting ${value}`);
        await highlightAndShow(value, 'new-node', `Inserting ${value} here`);
        return new Node(value);
    }

    await highlightAndShow(node.value, 'visiting', `Checking node ${node.value}`);

    if (value < node.value) {
        operationSteps.push(`${value} < ${node.value}, going LEFT`);
        await highlightAndShow(node.value, 'comparing', `${value} < ${node.value}, going LEFT`);
        node.left = await insertNodeAnimated(node.left, value);
    } else if (value > node.value) {
        operationSteps.push(`${value} > ${node.value}, going RIGHT`);
        await highlightAndShow(node.value, 'comparing', `${value} > ${node.value}, going RIGHT`);
        node.right = await insertNodeAnimated(node.right, value);
    } else {
        operationSteps.push(`${value} already exists, duplicate not allowed`);
        await highlightAndShow(node.value, 'comparing', `${value} already exists!`);
    }

    return node;
}

async function search() {
    if (isAnimating) {
        showMessage('Please wait for the current animation to complete', 'error');
        return;
    }
    
    const input = document.getElementById('bstInput');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showMessage('Please enter a valid number to search!', 'error');
        return;
    }

    isAnimating = true;
    operationSteps = [];
    disableButtons(true);
    
    operationSteps.push(`Starting search for ${value}`);
    if (root) {
        operationSteps.push(`Root is ${root.value}`);
    } else {
        operationSteps.push(`Tree is empty`);
    }

    showMessage(operationSteps.join(' → '), 'info');
    await delay(800);

    const found = await searchNodeAnimated(root, value);
    const resultElement = document.getElementById('searchResult');
    
    if (found) {
        resultElement.textContent = `Found: ${value}`;
        resultElement.style.color = '#27ae60';
        showMessage(operationSteps.join(' → '), 'success');
    } else {
        resultElement.textContent = `Not Found: ${value}`;
        resultElement.style.color = '#e74c3c';
        showMessage(operationSteps.join(' → '), 'error');
    }
    
    disableButtons(false);
    isAnimating = false;
    isPaused = false;
}

// Animated search
async function searchNodeAnimated(node, value) {
    if (!node) {
        operationSteps.push(`✗ Reached empty node, ${value} not found`);
        await delay(800);
        return false;
    }

    await highlightAndShow(node.value, 'visiting', `Checking node ${node.value}`);
    operationSteps.push(`Checking node ${node.value}`);

    if (value === node.value) {
        operationSteps.push(`✓ Found ${value}!`);
        await highlightAndShow(node.value, 'new-node', `Found ${value}!`);
        return true;
    } else if (value < node.value) {
        operationSteps.push(`${value} < ${node.value}, going LEFT`);
        await highlightAndShow(node.value, 'comparing', `${value} < ${node.value}, going LEFT`);
        return await searchNodeAnimated(node.left, value);
    } else {
        operationSteps.push(`${value} > ${node.value}, going RIGHT`);
        await highlightAndShow(node.value, 'comparing', `${value} > ${node.value}, going RIGHT`);
        return await searchNodeAnimated(node.right, value);
    }
}

// Helper to highlight node and update display
async function highlightAndShow(value, className, message) {
    showMessage(message, 'info');
    updateDisplay();
    
    // Find and highlight the node
    const allNodes = document.querySelectorAll('.bst-node, .tree-node');
    allNodes.forEach(nodeEl => {
        const nodeValue = parseInt(nodeEl.querySelector('.node-value').textContent);
        if (nodeValue === value) {
            nodeEl.classList.add(className);
        }
    });
    
    await delay(1000);
    
    // Remove highlight
    allNodes.forEach(nodeEl => {
        nodeEl.classList.remove(className);
    });
}

// Disable/enable buttons during animation
function disableButtons(disabled) {
    const buttons = document.querySelectorAll('button:not(#pauseBtn):not(#resumeBtn)');
    const input = document.getElementById('bstInput');
    buttons.forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.5' : '1';
        btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
    });
    input.disabled = disabled;
    
    if (disabled) {
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('resumeBtn').style.display = 'none';
    } else {
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('resumeBtn').style.display = 'none';
    }
}

function clearTree() {
    if (isAnimating) return;
    root = null;
    operationSteps = [];
    document.getElementById('searchResult').textContent = 'None';
    document.getElementById('searchResult').style.color = '#555';
    updateDisplay();
    showMessage('Tree cleared!', 'info');
}

function deleteNode() {
    if (isAnimating) {
        showMessage('Please wait for the current animation to complete', 'error');
        return;
    }
    
    const input = document.getElementById('bstInput');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showMessage('Please enter a valid number to delete!', 'error');
        return;
    }

    if (!searchNode(root, value)) {
        showMessage(`Value ${value} not found in tree!`, 'error');
        return;
    }

    root = deleteNodeRec(root, value);
    input.value = '';
    updateDisplay();
    showMessage(`Deleted ${value} from BST`, 'success');
}

function updateDisplay() {
    const container = document.getElementById('treeContainer');
    const heightElement = document.getElementById('treeHeight');
    const countElement = document.getElementById('nodeCount');

    heightElement.textContent = getHeight(root);
    countElement.textContent = countNodes(root);

    if (!root) {
        container.innerHTML = '<div class="tree-empty">Tree is empty</div>';
    } else {
        container.innerHTML = '';
        // Calculate required height based on tree height
        const treeHeight = getHeight(root);
        const requiredHeight = Math.max(400, treeHeight * 80 + 100);
        container.style.minHeight = requiredHeight + 'px';
        
        drawTree(container, root, container.offsetWidth / 2, 30, container.offsetWidth / 4);
    }
}

function drawTree(container, node, x, y, offset) {
    if (!node) return;

    // Draw children first (so lines are behind nodes)
    if (node.left) {
        drawLine(container, x, y, x - offset, y + 80);
        drawTree(container, node.left, x - offset, y + 80, offset / 2);
    }
    if (node.right) {
        drawLine(container, x, y, x + offset, y + 80);
        drawTree(container, node.right, x + offset, y + 80, offset / 2);
    }

    // Draw node
    const nodeElement = document.createElement('div');
    nodeElement.className = 'tree-node bst-node';
    nodeElement.style.left = (x - 25) + 'px';
    nodeElement.style.top = y + 'px';
    
    nodeElement.innerHTML = `<div class="node-value">${node.value}</div>`;
    
    container.appendChild(nodeElement);
}

function drawLine(container, x1, y1, x2, y2) {
    const line = document.createElement('div');
    line.className = 'tree-line';
    
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    line.style.width = length + 'px';
    line.style.left = x1 + 'px';
    line.style.top = (y1 + 25) + 'px';
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 0';
    
    container.appendChild(line);
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

// Allow Enter key to insert
document.getElementById('bstInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        insert();
    }
});
