// Global variables
let array = [];
let originalArray = [];
let isAnimating = false;
let isPaused = false;
let animationSpeed = 600;
let comparisons = 0;

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
function pauseSearch() {
    if (!isAnimating) return;
    isPaused = true;
    disableButtons(false); // Enable buttons when paused
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('resumeBtn').style.display = 'inline-block';
    showMessage('Search paused - you can use other controls', 'info');
}

function resumeSearch() {
    if (!isAnimating) return;
    isPaused = false;
    disableButtons(true); // Disable buttons when resumed
    document.getElementById('pauseBtn').style.display = 'inline-block';
    document.getElementById('resumeBtn').style.display = 'none';
    showMessage('Search resumed', 'info');
}

// Update speed value display
document.getElementById('speedControl').addEventListener('input', function(e) {
    animationSpeed = parseInt(e.target.value);
    document.getElementById('speedValue').textContent = animationSpeed + 'ms';
});

// Generate random array
function generateRandom() {
    if (isAnimating && !isPaused) {
        showMessage('Please pause or wait for the animation to complete', 'error');
        return;
    }
    
    // Stop animation if paused
    if (isPaused) {
        isAnimating = false;
        isPaused = false;
        disableButtons(false);
    }
    
    const size = 10;
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    originalArray = [...array];
    resetStats();
    updateDisplay();
    showMessage(`Generated random array of ${size} elements`, 'info');
}

// Set custom array
function setArray() {
    if (isAnimating && !isPaused) {
        showMessage('Please pause or wait for the animation to complete', 'error');
        return;
    }
    
    // Stop animation if paused
    if (isPaused) {
        isAnimating = false;
        isPaused = false;
        disableButtons(false);
    }
    
    const input = document.getElementById('arrayInput');
    const values = input.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    
    if (values.length === 0) {
        showMessage('Please enter valid numbers separated by commas', 'error');
        return;
    }
    
    if (values.length > 20) {
        showMessage('Maximum array size is 20 elements', 'error');
        return;
    }
    
    array = values;
    originalArray = [...array];
    resetStats();
    updateDisplay();
    showMessage(`Array set with ${array.length} elements`, 'info');
    input.value = '';
}

// Reset array to original
function resetArray() {
    // Stop animation if running
    if (isAnimating) {
        isAnimating = false;
        isPaused = false;
        disableButtons(false);
    }
    
    array = [...originalArray];
    resetStats();
    updateDisplay();
    showMessage('Array reset to original state', 'info');
}

// Reset statistics
function resetStats() {
    comparisons = 0;
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('searchResult').textContent = 'None';
    document.getElementById('searchResult').style.color = '#555';
}

// Disable/enable buttons during animation
function disableButtons(disabled) {
    const buttons = document.querySelectorAll('button:not(#pauseBtn):not(#resumeBtn)');
    const inputs = document.querySelectorAll('input:not(#speedControl)');
    
    buttons.forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.5' : '1';
        btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
    });
    inputs.forEach(inp => inp.disabled = disabled);
    // Speed control stays enabled
    
    if (disabled) {
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('resumeBtn').style.display = 'none';
    } else {
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('resumeBtn').style.display = 'none';
    }
}

// Start linear search animation
async function startSearch() {
    if (isAnimating) {
        showMessage('Search is already in progress', 'error');
        return;
    }
    
    if (array.length === 0) {
        showMessage('Please set an array first', 'error');
        return;
    }
    
    const searchInput = document.getElementById('searchInput');
    const target = parseInt(searchInput.value);
    
    if (isNaN(target)) {
        showMessage('Please enter a valid number to search', 'error');
        return;
    }
    
    isAnimating = true;
    disableButtons(true);
    resetStats();
    
    showMessage(`Starting Linear Search for ${target}...`, 'info');
    await delay(1000);
    
    const result = await linearSearch(target);
    
    const resultElement = document.getElementById('searchResult');
    if (result !== -1) {
        resultElement.textContent = `Found at index ${result}`;
        resultElement.style.color = '#00ff88';
        showMessage(`✓ Found ${target} at index ${result} after ${comparisons} comparisons`, 'success');
    } else {
        resultElement.textContent = 'Not found';
        resultElement.style.color = '#ff4444';
        showMessage(`✗ ${target} not found after checking all ${comparisons} elements`, 'error');
    }
    
    disableButtons(false);
    isAnimating = false;
    isPaused = false;
}

// Linear search algorithm with visualization
async function linearSearch(target) {
    for (let i = 0; i < array.length; i++) {
        // Highlight current element being checked
        await highlightElements([i], 'comparing', `Checking position ${i}: ${array[i]}`);
        comparisons++;
        document.getElementById('comparisons').textContent = comparisons;
        await delay(animationSpeed);
        
        if (array[i] === target) {
            // Found the target
            await highlightElements([i], 'sorted', `✓ Found ${target} at position ${i}!`);
            await delay(animationSpeed * 1.5);
            return i;
        } else {
            // Not a match, mark as checked
            await highlightElements([i], 'checked', `${array[i]} ≠ ${target}, continue searching...`);
            await delay(animationSpeed * 0.5);
        }
    }
    
    // Not found
    return -1;
}

// Highlight elements with specific class
async function highlightElements(indices, className, message) {
    if (message) {
        showMessage(message, 'info');
    }
    
    updateDisplay();
    await delay(50);
    
    const bars = document.querySelectorAll('.sort-bar');
    indices.forEach(index => {
        if (bars[index]) {
            bars[index].classList.add(className);
        }
    });
    
    await delay(animationSpeed * 0.3);
}

// Update display
function updateDisplay() {
    const container = document.getElementById('sortContainer');
    document.getElementById('arraySize').textContent = array.length;
    
    if (array.length === 0) {
        container.innerHTML = '<div class="sort-empty">Enter an array to visualize linear search</div>';
        return;
    }
    
    container.innerHTML = '';
    
    const maxValue = Math.max(...array);
    const minValue = Math.min(...array);
    const range = maxValue - minValue || 1;
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'sort-bar';
        
        const heightPx = 50 + ((value - minValue) / range) * 250;
        bar.style.height = heightPx + 'px';
        
        bar.innerHTML = `
            <div class="bar-value">${value}</div>
        `;
        
        container.appendChild(bar);
    });
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
        if (!isAnimating) {
            messageElement.style.display = 'none';
        }
    }, 100000);
}

// Initialize with random array on page load
window.addEventListener('load', () => {
    generateRandom();
});
