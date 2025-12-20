let array = [];
let animationSpeed = 800;
let isAnimating = false;
let isPaused = false;
let comparisonsCount = 0;
let swapsCount = 0;

// Initialize speed control
document.getElementById('speedControl').addEventListener('input', function() {
    animationSpeed = parseInt(this.value);
    document.getElementById('speedValue').textContent = animationSpeed + 'ms';
});

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

// Generate random array
function generateRandomArray() {
    if (isAnimating && !isPaused) return;
    
    // Stop animation if paused
    if (isPaused) {
        isAnimating = false;
        isPaused = false;
        disableButtons(false);
    }
    
    const size = 8;
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 90) + 10);
    }
    document.getElementById('arrayInput').value = array.join(', ');
    displayArray();
    resetStats();
    showMessage('Random array generated!', 'success');
}

// Display array as bars
function displayArray() {
    const container = document.getElementById('arrayContainer');
    container.innerHTML = '';
    
    const maxValue = Math.max(...array);
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'sort-bar';
        bar.style.height = `${(value / maxValue) * 300}px`;
        bar.innerHTML = `<span class="bar-value">${value}</span>`;
        bar.id = `bar-${index}`;
        container.appendChild(bar);
    });
}

// Reset statistics
function resetStats() {
    comparisonsCount = 0;
    swapsCount = 0;
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';
    document.getElementById('pass').textContent = '0';
}

// Show message
function showMessage(text, type = 'info') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Delay function with pause support
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

// Disable/enable buttons
function disableButtons(disabled) {
    const buttons = document.querySelectorAll('button:not(#pauseBtn):not(#resumeBtn)');
    buttons.forEach(button => button.disabled = disabled);
    // Keep speed control always enabled
    
    if (disabled) {
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('resumeBtn').style.display = 'none';
    } else {
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('resumeBtn').style.display = 'none';
    }
}

// Start sorting
async function startSort() {
    if (isAnimating) return;
    
    const input = document.getElementById('arrayInput').value.trim();
    if (!input) {
        showMessage('Please enter an array first!', 'error');
        return;
    }
    
    try {
        array = input.split(',').map(num => {
            const parsed = parseInt(num.trim());
            if (isNaN(parsed)) throw new Error('Invalid number');
            return parsed;
        });
        
        if (array.length === 0) {
            showMessage('Array cannot be empty!', 'error');
            return;
        }
        
        displayArray();
        resetStats();
        
        isAnimating = true;
        disableButtons(true);
        
        await selectionSort();
        
        showMessage('Sorting completed! Array is now sorted.', 'success');
        
    } catch (error) {
        showMessage('Invalid input! Please enter numbers separated by commas.', 'error');
    } finally {
        isAnimating = false;
        isPaused = false;
        disableButtons(false);
    }
}

// Selection Sort Algorithm
async function selectionSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        document.getElementById('pass').textContent = i + 1;
        
        // Highlight current position
        const currentBar = document.getElementById(`bar-${i}`);
        currentBar.classList.add('current-position');
        await delay(animationSpeed);
        showMessage(`Pass ${i + 1}: Finding minimum in remaining array...`, 'info');
        
        let minIndex = i;
        let minBar = document.getElementById(`bar-${minIndex}`);
        minBar.classList.add('minimum');
        
        // Find minimum element in remaining unsorted array
        for (let j = i + 1; j < n; j++) {
            const scanBar = document.getElementById(`bar-${j}`);
            scanBar.classList.add('comparing');
            
            comparisonsCount++;
            document.getElementById('comparisons').textContent = comparisonsCount;
            
            showMessage(`Comparing ${array[j]} with current minimum ${array[minIndex]}`, 'info');
            await delay(animationSpeed);
            
            if (array[j] < array[minIndex]) {
                // Found new minimum
                minBar.classList.remove('minimum');
                minIndex = j;
                minBar = document.getElementById(`bar-${minIndex}`);
                minBar.classList.add('minimum');
                showMessage(`New minimum found: ${array[minIndex]}`, 'info');
                await delay(animationSpeed / 2);
            }
            
            scanBar.classList.remove('comparing');
        }
        
        // Swap if needed
        if (minIndex !== i) {
            showMessage(`Swapping ${array[i]} with minimum ${array[minIndex]}`, 'info');
            
            const iBar = document.getElementById(`bar-${i}`);
            const minBarElement = document.getElementById(`bar-${minIndex}`);
            
            iBar.classList.add('swapping');
            minBarElement.classList.add('swapping');
            
            await delay(animationSpeed);
            
            // Perform swap
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            swapsCount++;
            document.getElementById('swaps').textContent = swapsCount;
            
            // Remove old classes before redrawing
            iBar.classList.remove('swapping', 'current-position');
            minBarElement.classList.remove('swapping', 'minimum');
            
            displayArray();
            await delay(animationSpeed / 2);
            
            // Re-apply classes after display update
            for (let k = 0; k <= i; k++) {
                document.getElementById(`bar-${k}`).classList.add('sorted');
            }
        } else {
            showMessage(`${array[i]} is already in correct position`, 'info');
            currentBar.classList.remove('current-position');
            minBar.classList.remove('minimum');
            currentBar.classList.add('sorted');
            await delay(animationSpeed / 2);
        }
    }
    
    // Mark last element as sorted
    document.getElementById(`bar-${n - 1}`).classList.add('sorted');
    await delay(animationSpeed);
}

// Reset sort
function resetSort() {
    // Stop animation if running
    if (isAnimating) {
        isAnimating = false;
        isPaused = false;
        disableButtons(false);
    }
    
    displayArray();
    resetStats();
    showMessage('Array reset!', 'info');
}

// Initialize with example array
window.addEventListener('load', () => {
    document.getElementById('arrayInput').value = '64, 34, 25, 12, 22, 11, 90';
    array = [64, 34, 25, 12, 22, 11, 90];
    displayArray();
});
