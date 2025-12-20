// AVL Tree Node
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

let root = null;
let operationLog = [];
let lastOperation = 'None';
let isAnimating = false;
let isPaused = false;
let visualSteps = [];

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

// Helper to add visual step
function addVisualStep(nodeValue, stepType, message) {
    visualSteps.push({ nodeValue, stepType, message });
}

// Get height of node
function getHeight(node) {
    return node ? node.height : 0;
}

// Get balance factor
function getBalance(node) {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

// Update height of node
function updateHeight(node) {
    if (node) {
        node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    }
}

// Right rotation
function rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    updateHeight(y);
    updateHeight(x);

    return x;
}

// Left rotation
function rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    updateHeight(x);
    updateHeight(y);

    return y;
}

// Find minimum value node
function minValueNode(node) {
    let current = node;
    while (current.left) {
        current = current.left;
    }
    return current;
}

// Delete a node
function deleteNodeRec(node, value) {
    if (!node) {
        return node;
    }

    if (value < node.value) {
        node.left = deleteNodeRec(node.left, value);
    } else if (value > node.value) {
        node.right = deleteNodeRec(node.right, value);
    } else {
        // Node with only one child or no child
        if (!node.left || !node.right) {
            node = node.left ? node.left : node.right;
        } else {
            // Node with two children
            const temp = minValueNode(node.right);
            node.value = temp.value;
            node.right = deleteNodeRec(node.right, temp.value);
        }
    }

    if (!node) {
        return node;
    }

    // Update height
    updateHeight(node);

    // Get balance factor
    const balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && getBalance(node.left) >= 0) {
        return rotateRight(node);
    }

    // Left Right Case
    if (balance > 1 && getBalance(node.left) < 0) {
        operationLog.push('Left-Right Rotation');
        node.left = rotateLeft(node.left);
        return rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && getBalance(node.right) <= 0) {
        return rotateLeft(node);
    }

    // Right Left Case
    if (balance < -1 && getBalance(node.right) > 0) {
        operationLog.push('Right-Left Rotation');
        node.right = rotateRight(node.right);
        return rotateLeft(node);
    }

    return node;
}

// Count nodes
function countNodes(node) {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
}

// Public functions
async function insert() {
    if (isAnimating) {
        showMessage('Please wait for the current animation to complete', 'error');
        return;
    }
    
    const input = document.getElementById('avlInput');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showMessage('Please enter a valid number!', 'error');
        return;
    }

    isAnimating = true;
    operationLog = [];
    visualSteps = [];
    
    // Disable buttons during animation
    disableButtons(true);
    
    showMessage(`Starting insertion of ${value}...`, 'info');
    await delay(800);
    
    root = await insertNodeAnimated(root, value);
    input.value = '';
    
    lastOperation = operationLog.length > 0 ? operationLog.join(', ') : 'Simple Insert';
    updateDisplay();
    
    // Re-enable buttons
    disableButtons(false);
    isAnimating = false;
    isPaused = false;
    
    showMessage(`✓ Inserted ${value}. Operations: ${lastOperation}`, 'success');
}

// Animated insert function
async function insertNodeAnimated(node, value, parentValue = null) {
    // Standard BST insertion
    if (!node) {
        addVisualStep(value, 'new-node', `Found empty spot, inserting ${value}`);
        await highlightAndShow(value, 'new-node', `Inserting ${value} here`);
        return new Node(value);
    }

    addVisualStep(node.value, 'visiting', `Visiting node ${node.value}`);
    await highlightAndShow(node.value, 'visiting', `Checking node ${node.value}`);

    if (value < node.value) {
        addVisualStep(node.value, 'comparing', `${value} < ${node.value}, going LEFT`);
        await highlightAndShow(node.value, 'comparing', `${value} < ${node.value}, going LEFT`);
        node.left = await insertNodeAnimated(node.left, value, node.value);
    } else if (value > node.value) {
        addVisualStep(node.value, 'comparing', `${value} > ${node.value}, going RIGHT`);
        await highlightAndShow(node.value, 'comparing', `${value} > ${node.value}, going RIGHT`);
        node.right = await insertNodeAnimated(node.right, value, node.value);
    } else {
        await highlightAndShow(node.value, 'comparing', `Value ${value} already exists!`);
        return node; // Duplicate values not allowed
    }

    // Update height
    updateHeight(node);

    // Get balance factor
    const balance = getBalance(node);
    
    if (Math.abs(balance) > 1) {
        await highlightAndShow(node.value, 'rotating', `Node ${node.value} is unbalanced (BF=${balance}), needs rotation!`);
        await delay(1000);
    }

    // Left Left Case
    if (balance > 1 && value < node.left.value) {
        operationLog.push('Right Rotation');
        showMessage(`Performing RIGHT rotation at node ${node.value}`, 'info');
        await delay(1000);
        return rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && value > node.right.value) {
        operationLog.push('Left Rotation');
        showMessage(`Performing LEFT rotation at node ${node.value}`, 'info');
        await delay(1000);
        return rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && value > node.left.value) {
        operationLog.push('Left-Right Rotation');
        showMessage(`Performing LEFT-RIGHT rotation at node ${node.value}`, 'info');
        await delay(1000);
        node.left = rotateLeft(node.left);
        await delay(500);
        return rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && value < node.right.value) {
        operationLog.push('Right-Left Rotation');
        showMessage(`Performing RIGHT-LEFT rotation at node ${node.value}`, 'info');
        await delay(1000);
        node.right = rotateRight(node.right);
        await delay(500);
        return rotateLeft(node);
    }

    return node;
}

// Helper to highlight node and update display
async function highlightAndShow(value, className, message) {
    showMessage(message, 'info');
    updateDisplay();
    
    // Find and highlight the node
    const allNodes = document.querySelectorAll('.tree-node');
    allNodes.forEach(nodeEl => {
        const nodeValue = parseInt(nodeEl.querySelector('.node-value').textContent);
        if (nodeValue === value) {
            nodeEl.classList.add(className);
        }
    });
    
    await delay(1200);
    
    // Remove highlight
    allNodes.forEach(nodeEl => {
        nodeEl.classList.remove(className);
    });
}

// Disable/enable buttons during animation
function disableButtons(disabled) {
    const buttons = document.querySelectorAll('button:not(#pauseBtn):not(#resumeBtn)');
    buttons.forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.5' : '1';
        btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
    });
    
    if (disabled) {
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('resumeBtn').style.display = 'none';
    } else {
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('resumeBtn').style.display = 'none';
    }
}

function deleteNode() {
    if (isAnimating) {
        showMessage('Please wait for the current animation to complete', 'error');
        return;
    }
    
    const input = document.getElementById('avlInput');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        showMessage('Please enter a valid number to delete!', 'error');
        return;
    }

    operationLog = [];
    root = deleteNodeRec(root, value);
    input.value = '';
    
    lastOperation = operationLog.length > 0 ? operationLog.join(', ') : 'Simple Delete';
    updateDisplay();
    showMessage(`Deleted ${value}. Operations: ${lastOperation}`, 'success');
}

function clearTree() {
    if (isAnimating) return;
    root = null;
    operationLog = [];
    lastOperation = 'None';
    updateDisplay();
    showMessage('Tree cleared!', 'info');
}

function updateDisplay() {
    const container = document.getElementById('treeContainer');
    const heightElement = document.getElementById('treeHeight');
    const countElement = document.getElementById('nodeCount');
    const operationElement = document.getElementById('lastOperation');

    heightElement.textContent = getHeight(root);
    countElement.textContent = countNodes(root);
    operationElement.textContent = lastOperation;

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
    nodeElement.className = 'tree-node';
    nodeElement.style.left = (x - 25) + 'px';
    nodeElement.style.top = y + 'px';
    
    const balance = getBalance(node);
    const balanceClass = Math.abs(balance) <= 1 ? 'balanced' : 'unbalanced';
    
    nodeElement.innerHTML = `
        <div class="node-value">${node.value}</div>
        <div class="node-balance ${balanceClass}">BF: ${balance}</div>
    `;
    
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
document.getElementById('avlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        insert();
    }
});
