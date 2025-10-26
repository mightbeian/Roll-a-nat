// Roll history array
let rollHistory = [];

// Utility function to get random number
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Add to history
function addToHistory(rollType, result, details = '') {
    const timestamp = new Date().toLocaleTimeString();
    rollHistory.unshift({
        type: rollType,
        result: result,
        details: details,
        time: timestamp
    });
    
    // Keep only last 20 rolls
    if (rollHistory.length > 20) {
        rollHistory.pop();
    }
    
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const historyDiv = document.getElementById('history');
    
    if (rollHistory.length === 0) {
        historyDiv.innerHTML = '<p style="text-align: center; color: #999;">No rolls yet</p>';
        return;
    }
    
    historyDiv.innerHTML = rollHistory.map(item => `
        <div class="history-item">
            <strong>${item.type}:</strong> ${item.result}
            <div class="roll-details">${item.details} - ${item.time}</div>
        </div>
    `).join('');
}

// Clear history
function clearHistory() {
    rollHistory = [];
    updateHistoryDisplay();
}

// Coin flip
function flipCoin() {
    const result = Math.random() < 0.5 ? '🪙 Heads' : '🪙 Tails';
    const resultDiv = document.getElementById('coin-result');
    resultDiv.textContent = result;
    resultDiv.className = 'result success';
    
    addToHistory('Coin Flip', result);
}

// Single dice roll
function rollDice(sides) {
    const result = getRandomInt(1, sides);
    const resultDiv = document.getElementById('quick-result');
    
    let resultClass = 'result';
    let displayText = `🎲 ${result}`;
    
    // Check for natural 20 or natural 1
    if (sides === 20) {
        if (result === 20) {
            resultClass = 'result critical';
            displayText = `🎲 ${result} - NATURAL 20! 🎉`;
        } else if (result === 1) {
            displayText = `🎲 ${result} - Critical Fail 😅`;
        }
    }
    
    resultDiv.textContent = displayText;
    resultDiv.className = resultClass;
    
    addToHistory(`d${sides}`, result);
}

// Multiple dice roll with options
function rollMultiple(sides, count, dropLowest = false, type = 'normal') {
    let rolls = [];
    let resultDiv = document.getElementById('dnd-result');
    
    // Handle advantage/disadvantage
    if (type === 'advantage' || type === 'disadvantage') {
        count = 2;
        rolls = [getRandomInt(1, sides), getRandomInt(1, sides)];
        const result = type === 'advantage' ? Math.max(...rolls) : Math.min(...rolls);
        const typeText = type === 'advantage' ? 'Advantage' : 'Disadvantage';
        
        let resultClass = 'result';
        let displayText = `${typeText}: ${result}`;
        
        if (result === 20) {
            resultClass = 'result critical';
            displayText += ' - NATURAL 20! 🎉';
        } else if (result === 1) {
            displayText += ' - Critical Fail 😅';
        }
        
        resultDiv.textContent = displayText;
        resultDiv.className = resultClass;
        
        addToHistory(typeText, result, `Rolled: [${rolls.join(', ')}]`);
        return;
    }
    
    // Normal multiple dice
    for (let i = 0; i < count; i++) {
        rolls.push(getRandomInt(1, sides));
    }
    
    let total = rolls.reduce((a, b) => a + b, 0);
    let details = `Rolled: [${rolls.join(', ')}]`;
    
    // Drop lowest if specified (for ability scores)
    if (dropLowest && count > 1) {
        const lowest = Math.min(...rolls);
        const lowestIndex = rolls.indexOf(lowest);
        const keptRolls = rolls.filter((_, index) => index !== lowestIndex);
        total = keptRolls.reduce((a, b) => a + b, 0);
        details = `Rolled: [${rolls.join(', ')}], Dropped: ${lowest}, Kept: [${keptRolls.join(', ')}]`;
    }
    
    resultDiv.textContent = `Total: ${total}`;
    resultDiv.className = 'result';
    
    const rollType = dropLowest ? `${count}d${sides} drop lowest` : `${count}d${sides}`;
    addToHistory(rollType, total, details);
}

// Custom roll
function customRoll() {
    const numDice = parseInt(document.getElementById('num-dice').value) || 1;
    const diceSides = parseInt(document.getElementById('dice-sides').value) || 20;
    const modifier = parseInt(document.getElementById('modifier').value) || 0;
    
    if (numDice < 1 || numDice > 100) {
        alert('Please enter between 1 and 100 dice');
        return;
    }
    
    if (diceSides < 2 || diceSides > 1000) {
        alert('Please enter between 2 and 1000 sides');
        return;
    }
    
    let rolls = [];
    for (let i = 0; i < numDice; i++) {
        rolls.push(getRandomInt(1, diceSides));
    }
    
    const rollTotal = rolls.reduce((a, b) => a + b, 0);
    const finalTotal = rollTotal + modifier;
    
    const resultDiv = document.getElementById('custom-result');
    const modifierText = modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : '';
    
    let displayText = `${numDice}d${diceSides}${modifierText} = ${finalTotal}`;
    if (modifier !== 0) {
        displayText += ` (${rollTotal}${modifierText})`;
    }
    
    resultDiv.textContent = displayText;
    resultDiv.className = 'result';
    
    const details = numDice <= 10 ? `Rolls: [${rolls.join(', ')}]` : `${numDice} dice rolled`;
    addToHistory(`${numDice}d${diceSides}${modifierText}`, finalTotal, details);
}

// Initialize
updateHistoryDisplay();