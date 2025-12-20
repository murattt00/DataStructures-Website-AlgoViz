let array = [];
let animationSpeed = 800;
let isAnimating = false;
let isPaused = false;
let comparisonsCount = 0;
let shiftsCount = 0;

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
    shiftsCount = 0;
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('shifts').textContent = '0';
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
        
        await insertionSort();
        
        showMessage('Sorting completed! Array is now sorted.', 'success');
        
    } catch (error) {
        showMessage('Invalid input! Please enter numbers separated by commas.', 'error');
    } finally {
        isAnimating = false;
        isPaused = false;
        disableButtons(false);
    }
}

// Insertion Sort Algorithm
async function insertionSort() {
    const n = array.length;
    
    // First element is considered sorted
    document.getElementById(`bar-0`).classList.add('sorted');
    await delay(animationSpeed / 2);
    
    for (let i = 1; i < n; i++) {
        document.getElementById('pass').textContent = i;
        
        const key = array[i];
        const keyBar = document.getElementById(`bar-${i}`);
        
        // Highlight the element to be inserted
        keyBar.classList.add('current-position');
        showMessage(`Pass ${i}: Inserting ${key} into sorted portion...`, 'info');
        await delay(animationSpeed);
        
        keyBar.classList.remove('current-position');
        keyBar.classList.add('inserting');
        
        let j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0) {
            const compareBar = document.getElementById(`bar-${j}`);
            compareBar.classList.add('comparing');
            
            comparisonsCount++;
            document.getElementById('comparisons').textContent = comparisonsCount;
            
            showMessage(`Comparing ${key} with ${array[j]}`, 'info');
            await delay(animationSpeed);
            
            if (array[j] > key) {
                // Shift element to the right
                showMessage(`${array[j]} > ${key}, shifting ${array[j]} to the right`, 'info');
                
                compareBar.classList.remove('comparing');
                compareBar.classList.add('swapping');
                await delay(animationSpeed / 2);
                
                array[j + 1] = array[j];
                shiftsCount++;
                document.getElementById('shifts').textContent = shiftsCount;
                
                displayArray();
                
                // Reapply classes
                for (let k = 0; k < i; k++) {
                    if (k !== j + 1) {
                        document.getElementById(`bar-${k}`).classList.add('sorted');
                    }
                }
                document.getElementById(`bar-${j + 1}`).classList.add('swapping');
                
                await delay(animationSpeed / 2);
                document.getElementById(`bar-${j + 1}`).classList.remove('swapping');
                
                j--;
            } else {
                compareBar.classList.remove('comparing');
                break;
            }
        }
        
        // Insert key at correct position
        array[j + 1] = key;
        showMessage(`Inserting ${key} at position ${j + 1}`, 'success');
        
        displayArray();
        await delay(animationSpeed / 2);
        
        // Mark all elements up to i as sorted
        for (let k = 0; k <= i; k++) {
            const bar = document.getElementById(`bar-${k}`);
            bar.classList.remove('inserting', 'comparing', 'swapping');
            bar.classList.add('sorted');
        }
        
        await delay(animationSpeed / 2);
    }
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
