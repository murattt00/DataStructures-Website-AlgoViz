// Global variables
let array = [];
let originalArray = [];
let isAnimating = false;
let isPaused = false;
let animationSpeed = 800;
let comparisons = 0;
let swaps = 0;

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

// Pause animation
function pauseSort() {
    if (!isAnimating) {
        showMessage('No animation running', 'error');
        return;
    }
    isPaused = true;
    disableButtons(false); // Enable buttons when paused
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('resumeBtn').style.display = 'inline-block';
    showMessage('Animation paused - you can use other controls', 'info');
}

// Resume animation
function resumeSort() {
    if (!isAnimating) {
        showMessage('No animation to resume', 'error');
        return;
    }
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
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('swaps').textContent = swaps;
    document.getElementById('currentPass').textContent = 0;
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
    
    // Show/hide pause button based on animation state
    if (disabled) {
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('resumeBtn').style.display = 'none';
    } else {
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('resumeBtn').style.display = 'none';
    }
}

// Start bubble sort animation
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
    
    showMessage('Starting Bubble Sort...', 'info');
    await delay(1000);
    
    await bubbleSort();
    
    showMessage(`✓ Sorting complete! Comparisons: ${comparisons}, Swaps: ${swaps}`, 'success');
    disableButtons(false);
    isAnimating = false;
    isPaused = false;
}

// Bubble sort algorithm with visualization
async function bubbleSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        document.getElementById('currentPass').textContent = i + 1;
        showMessage(`Pass ${i + 1}: Moving largest unsorted element to position ${n - i}`, 'info');
        await delay(animationSpeed);
        
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            // Highlight elements being compared
            await highlightElements([j, j + 1], 'comparing', `Comparing ${array[j]} and ${array[j + 1]}`);
            comparisons++;
            document.getElementById('comparisons').textContent = comparisons;
            
            if (array[j] > array[j + 1]) {
                // Swap elements
                showMessage(`${array[j]} > ${array[j + 1]}, swapping...`, 'info');
                await highlightElements([j, j + 1], 'swapping', `Swapping ${array[j]} ↔ ${array[j + 1]}`);
                
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swaps++;
                document.getElementById('swaps').textContent = swaps;
                swapped = true;
                
                updateDisplay();
                await delay(animationSpeed);
            } else {
                showMessage(`${array[j]} ≤ ${array[j + 1]}, no swap needed`, 'info');
                await delay(animationSpeed * 0.5);
            }
            
            // Remove highlight
            updateDisplay();
        }
        
        // Mark the sorted element
        await highlightElements([n - i - 1], 'sorted', `Element ${array[n - i - 1]} is now in correct position`);
        await delay(animationSpeed);
        
        // Early termination if no swaps occurred
        if (!swapped) {
            showMessage('No swaps in this pass - array is sorted!', 'success');
            break;
        }
    }
    
    // Mark all elements as sorted
    for (let i = 0; i < array.length; i++) {
        await highlightElements([i], 'sorted', 'Marking all as sorted');
        await delay(100);
    }
}

// Highlight elements with specific class
async function highlightElements(indices, className, message) {
    if (message) {
        showMessage(message, 'info');
    }
    
    updateDisplay();
    
    await delay(50); // Small delay for display update
    
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
        container.innerHTML = '<div class="sort-empty">Enter an array to visualize bubble sort</div>';
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
