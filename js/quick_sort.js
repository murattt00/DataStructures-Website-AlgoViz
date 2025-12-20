// Global variables
let array = [];
let originalArray = [];
let isAnimating = false;
let isPaused = false;
let animationSpeed = 800;
let comparisons = 0;
let swaps = 0;
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
    swaps = 0;
    maxDepth = 0;
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('swaps').textContent = swaps;
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
    // Keep speed control always enabled so users can adjust during animation
    
    if (disabled) {
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('resumeBtn').style.display = 'none';
    } else {
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('resumeBtn').style.display = 'none';
    }
}

// Start quick sort animation
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
    
    showMessage('Starting Quick Sort...', 'info');
    await delay(1000);
    
    await quickSort(0, array.length - 1, 0);
    
    // Mark all as sorted
    for (let i = 0; i < array.length; i++) {
        await highlightElements([i], 'sorted', null);
        await delay(100);
    }
    
    showMessage(`✓ Sorting complete! Comparisons: ${comparisons}, Swaps: ${swaps}`, 'success');
    disableButtons(false);
    isAnimating = false;
    isPaused = false;
}

// Quick sort algorithm with visualization
async function quickSort(low, high, depth) {
    if (low < high) {
        maxDepth = Math.max(maxDepth, depth);
        document.getElementById('recursionDepth').textContent = maxDepth;
        
        showMessage(`Recursion depth ${depth}: Sorting range [${low}..${high}]`, 'info');
        await delay(animationSpeed * 0.5);
        
        // Partition the array
        const pivotIndex = await partition(low, high);
        
        // Highlight pivot in its final position
        await highlightElements([pivotIndex], 'sorted', `Pivot ${array[pivotIndex]} is in correct position`);
        await delay(animationSpeed);
        
        // Recursively sort left and right sub-arrays
        await quickSort(low, pivotIndex - 1, depth + 1);
        await quickSort(pivotIndex + 1, high, depth + 1);
    }
}

// Partition function with visualization
async function partition(low, high) {
    const pivot = array[high];
    await highlightElements([high], 'pivot', `Selected pivot: ${pivot}`);
    await delay(animationSpeed);
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        // Highlight elements being compared
        await highlightElements([j, high], 'comparing', `Comparing ${array[j]} with pivot ${pivot}`);
        comparisons++;
        document.getElementById('comparisons').textContent = comparisons;
        await delay(animationSpeed);
        
        if (array[j] < pivot) {
            i++;
            
            if (i !== j) {
                showMessage(`${array[j]} < ${pivot}, swapping positions ${i} and ${j}`, 'info');
                await highlightElements([i, j], 'swapping', null);
                
                [array[i], array[j]] = [array[j], array[i]];
                swaps++;
                document.getElementById('swaps').textContent = swaps;
                
                updateDisplay();
                await delay(animationSpeed);
            }
        }
        
        updateDisplay();
    }
    
    // Place pivot in correct position
    showMessage(`Placing pivot ${pivot} at position ${i + 1}`, 'info');
    await highlightElements([i + 1, high], 'swapping', null);
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swaps++;
    document.getElementById('swaps').textContent = swaps;
    
    updateDisplay();
    await delay(animationSpeed);
    
    return i + 1;
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
        container.innerHTML = '<div class="sort-empty">Enter an array to visualize quick sort</div>';
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
