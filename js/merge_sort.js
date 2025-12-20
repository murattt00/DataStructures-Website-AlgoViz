// Global variables
let array = [];
let originalArray = [];
let isAnimating = false;
let isPaused = false;
let animationSpeed = 800;
let comparisons = 0;
let merges = 0;
let maxDepth = 0;

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
function pauseSort() {
    if (!isAnimating) return;
    isPaused = true;
    disableButtons(false); // Enable buttons when paused
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('resumeBtn').style.display = 'inline-block';
    showMessage('Animation paused - you can use other controls', 'info');
}

function resumeSort() {
    if (!isAnimating) return;
    isPaused = false;
    disableButtons(true); // Disable buttons when resumed
    document.getElementById('pauseBtn').style.display = 'inline-block';
    document.getElementById('resumeBtn').style.display = 'none';
    showMessage('Animation resumed', 'info');
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
    
    const size = 8;
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
    
    if (values.length > 15) {
        showMessage('Maximum array size is 15 elements', 'error');
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
    merges = 0;
    maxDepth = 0;
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('merges').textContent = merges;
    document.getElementById('recursionDepth').textContent = 0;
}

// Disable/enable buttons during animation
function disableButtons(disabled) {
    const buttons = document.querySelectorAll('button:not(#pauseBtn):not(#resumeBtn)');
    const input = document.getElementById('arrayInput');
    const speedControl = document.getElementById('speedControl');
    
    buttons.forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.5' : '1';
        btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
    });
    input.disabled = disabled;
    // Keep speed control always enabled
    
    if (disabled) {
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('resumeBtn').style.display = 'none';
    } else {
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('resumeBtn').style.display = 'none';
    }
}

// Start merge sort animation
async function startSort() {
    if (isAnimating) {
        showMessage('Sorting is already in progress', 'error');
        return;
    }
    
    if (array.length === 0) {
        showMessage('Please set an array first', 'error');
        return;
    }
    
    isAnimating = true;
    disableButtons(true);
    resetStats();
    
    showMessage('Starting Merge Sort...', 'info');
    await delay(1000);
    
    await mergeSort(0, array.length - 1, 0);
    
    // Mark all as sorted
    for (let i = 0; i < array.length; i++) {
        await highlightElements([i], 'sorted', null);
        await delay(100);
    }
    
    showMessage(`✓ Sorting complete! Comparisons: ${comparisons}, Merges: ${merges}`, 'success');
    disableButtons(false);
    isAnimating = false;
    isPaused = false;
}

// Merge sort algorithm with visualization
async function mergeSort(left, right, depth) {
    if (left < right) {
        maxDepth = Math.max(maxDepth, depth);
        document.getElementById('recursionDepth').textContent = maxDepth;
        
        const mid = Math.floor((left + right) / 2);
        
        // Highlight the range being divided
        const indices = [];
        for (let i = left; i <= right; i++) indices.push(i);
        await highlightElements(indices, 'dividing', `Depth ${depth}: Dividing range [${left}..${right}] at ${mid}`);
        await delay(animationSpeed);
        
        // Recursively sort left and right halves
        await mergeSort(left, mid, depth + 1);
        await mergeSort(mid + 1, right, depth + 1);
        
        // Merge the sorted halves
        await merge(left, mid, right);
    }
}

// Merge function with visualization
async function merge(left, mid, right) {
    const leftArray = [];
    const rightArray = [];
    
    // Copy data to temporary arrays
    for (let i = left; i <= mid; i++) {
        leftArray.push(array[i]);
    }
    for (let i = mid + 1; i <= right; i++) {
        rightArray.push(array[i]);
    }
    
    // Highlight arrays being merged
    const mergeIndices = [];
    for (let i = left; i <= right; i++) mergeIndices.push(i);
    await highlightElements(mergeIndices, 'merging', `Merging [${left}..${mid}] and [${mid + 1}..${right}]`);
    await delay(animationSpeed);
    
    let i = 0, j = 0, k = left;
    
    // Merge the arrays back
    while (i < leftArray.length && j < rightArray.length) {
        comparisons++;
        document.getElementById('comparisons').textContent = comparisons;
        
        await highlightElements([k], 'comparing', `Comparing ${leftArray[i]} and ${rightArray[j]}`);
        await delay(animationSpeed * 0.7);
        
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            showMessage(`${leftArray[i]} ≤ ${rightArray[j]}, placing ${leftArray[i]} at position ${k}`, 'info');
            i++;
        } else {
            array[k] = rightArray[j];
            showMessage(`${rightArray[j]} < ${leftArray[i]}, placing ${rightArray[j]} at position ${k}`, 'info');
            j++;
        }
        
        updateDisplay();
        await delay(animationSpeed * 0.5);
        k++;
    }
    
    // Copy remaining elements
    while (i < leftArray.length) {
        array[k] = leftArray[i];
        updateDisplay();
        await delay(animationSpeed * 0.3);
        i++;
        k++;
    }
    
    while (j < rightArray.length) {
        array[k] = rightArray[j];
        updateDisplay();
        await delay(animationSpeed * 0.3);
        j++;
        k++;
    }
    
    merges++;
    document.getElementById('merges').textContent = merges;
    
    // Highlight merged section
    await highlightElements(mergeIndices, 'merged', `Merged section [${left}..${right}] complete`);
    await delay(animationSpeed);
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
        container.innerHTML = '<div class="sort-empty">Enter an array to visualize merge sort</div>';
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

// Initialize with random array
generateRandom();
