// Global variables
let array = [];
let originalArray = [];
let isAnimating = false;
let isPaused = false;
let animationSpeed = 800;
let comparisons = 0;
let isSorted = false;

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
    isSorted = false;
    updateSortStatus();
    resetStats();
    updateDisplay();
    showMessage(`Generated random array of ${size} elements. Array is unsorted - sort it first!`, 'info');
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
    isSorted = isArraySorted();
    updateSortStatus();
    resetStats();
    updateDisplay();
    showMessage(`Array set with ${array.length} elements`, 'info');
    input.value = '';
}

// Sort array
function sortArray() {
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
    
    if (array.length === 0) {
        showMessage('Please set an array first', 'error');
        return;
    }
    
    array.sort((a, b) => a - b);
    isSorted = true;
    updateSortStatus();
    updateDisplay();
    showMessage('Array sorted! Now you can perform binary search', 'success');
}

// Check if array is sorted
function isArraySorted() {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) return false;
    }
    return true;
}

// Update sort status display
function updateSortStatus() {
    const statusElement = document.getElementById('sortStatus');
    if (isSorted) {
        statusElement.textContent = 'Sorted ✓';
        statusElement.style.color = '#00ff88';
    } else {
        statusElement.textContent = 'Unsorted ✗';
        statusElement.style.color = '#ff4444';
    }
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
    isSorted = isArraySorted();
    updateSortStatus();
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

// Start binary search animation
async function startSearch() {
    if (isAnimating) {
        showMessage('Search is already in progress', 'error');
        return;
    }
    
    if (array.length === 0) {
        showMessage('Please set an array first', 'error');
        return;
    }
    
    if (!isSorted) {
        showMessage('Array must be sorted for binary search! Click "Sort Array" button', 'error');
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
    
    showMessage(`Starting Binary Search for ${target}...`, 'info');
    await delay(1000);
    
    const result = await binarySearch(target);
    
    const resultElement = document.getElementById('searchResult');
    if (result !== -1) {
        resultElement.textContent = `Found at index ${result}`;
        resultElement.style.color = '#00ff88';
        showMessage(`✓ Found ${target} at index ${result} with only ${comparisons} comparisons!`, 'success');
    } else {
        resultElement.textContent = 'Not found';
        resultElement.style.color = '#ff4444';
        showMessage(`✗ ${target} not found after ${comparisons} comparisons`, 'error');
    }
    
    disableButtons(false);
    isAnimating = false;
    isPaused = false;
}

// Binary search algorithm with visualization
async function binarySearch(target) {
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        // Highlight search range
        const rangeIndices = [];
        for (let i = left; i <= right; i++) rangeIndices.push(i);
        await highlightElements(rangeIndices, 'searching', `Search range: [${left}..${right}]`);
        await delay(animationSpeed * 0.7);
        
        // Highlight middle element
        await highlightElements([mid], 'pivot', `Middle element at index ${mid}: ${array[mid]}`);
        comparisons++;
        document.getElementById('comparisons').textContent = comparisons;
        await delay(animationSpeed);
        
        if (array[mid] === target) {
            // Found the target
            await highlightElements([mid], 'sorted', `✓ Found ${target} at index ${mid}!`);
            await delay(animationSpeed * 1.5);
            return mid;
        } else if (array[mid] < target) {
            // Search right half
            showMessage(`${array[mid]} < ${target}, searching right half [${mid + 1}..${right}]`, 'info');
            
            // Mark left half as eliminated
            for (let i = left; i <= mid; i++) {
                await highlightElements([i], 'eliminated', null);
            }
            await delay(animationSpeed * 0.5);
            
            left = mid + 1;
        } else {
            // Search left half
            showMessage(`${array[mid]} > ${target}, searching left half [${left}..${mid - 1}]`, 'info');
            
            // Mark right half as eliminated
            for (let i = mid; i <= right; i++) {
                await highlightElements([i], 'eliminated', null);
            }
            await delay(animationSpeed * 0.5);
            
            right = mid - 1;
        }
        
        updateDisplay();
        await delay(animationSpeed * 0.5);
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
        container.innerHTML = '<div class="sort-empty">Enter an array to visualize binary search</div>';
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
