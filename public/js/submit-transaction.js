// Submit transaction functionality
const STORAGE_KEY = 'submitTransactionData';
const DEFAULT_RPC_URL = 'https://1rpc.io/sepolia';
const LEGACY_PUBLIC_SEPOLIA_RPC = 'https://rpc.sepolia.org';

document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Load stored data on page load
    loadStoredTransactionData();
    const rpcInput = document.getElementById('rpcUrl');
    if (rpcInput && !rpcInput.value.trim()) {
        rpcInput.value = DEFAULT_RPC_URL;
    }

    // Set up input listeners to save data on change
    setupInputListeners();

    if (submitBtn) {
        submitBtn.addEventListener('click', submitTransaction);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearForm);
    }
});

function setupInputListeners() {
    const rpcUrlInput = document.getElementById('rpcUrl');
    const signedTxInput = document.getElementById('signedTx');

    if (rpcUrlInput) {
        rpcUrlInput.addEventListener('input', saveTransactionData);
        rpcUrlInput.addEventListener('change', saveTransactionData);
    }

    if (signedTxInput) {
        signedTxInput.addEventListener('input', saveTransactionData);
        signedTxInput.addEventListener('change', saveTransactionData);
    }
}

function saveTransactionData() {
    const transactionData = {
        rpcUrl: document.getElementById('rpcUrl').value,
        signedTx: document.getElementById('signedTx').value
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactionData));
    } catch (error) {
        console.error('Error saving transaction data to localStorage:', error);
    }
}

function loadStoredTransactionData() {
    const rpcInput = document.getElementById('rpcUrl');
    const signedTxInput = document.getElementById('signedTx');
    if (!rpcInput || !signedTxInput) return;

    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (!storedData) {
            return;
        }
        const transactionData = JSON.parse(storedData);

        let rpc = (transactionData.rpcUrl || '').trim();
        if (rpc === LEGACY_PUBLIC_SEPOLIA_RPC) {
            rpc = DEFAULT_RPC_URL;
        }
        rpcInput.value = rpc || DEFAULT_RPC_URL;

        if (transactionData.signedTx) {
            signedTxInput.value = transactionData.signedTx;
        }
    } catch (error) {
        console.error('Error loading transaction data from localStorage:', error);
    }
}

function clearForm() {
    document.getElementById('rpcUrl').value = DEFAULT_RPC_URL;
    document.getElementById('signedTx').value = '';
    document.getElementById('transactionResult').style.display = 'none';
    document.getElementById('errorResult').style.display = 'none';
    
    // Clear localStorage
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing transaction data from localStorage:', error);
    }
}

async function submitTransaction() {
    const rpcUrl = document.getElementById('rpcUrl').value.trim();
    const signedTx = document.getElementById('signedTx').value.trim();

    // Validate inputs
    if (!rpcUrl) {
        alert('Please enter an RPC URL');
        return;
    }

    if (!signedTx) {
        alert('Please enter a signed transaction');
        return;
    }

    // Validate signed transaction format
    if (!signedTx.startsWith('0x')) {
        alert('Signed transaction must start with "0x"');
        return;
    }

    if (!signedTx.match(/^0x[a-fA-F0-9]+$/i)) {
        alert('Invalid hex format for signed transaction');
        return;
    }

    try {
        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Hide previous results
        document.getElementById('transactionResult').style.display = 'none';
        document.getElementById('errorResult').style.display = 'none';

        const response = await fetch('/api/submit-transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rpcUrl: rpcUrl,
                signedTransaction: signedTx
            })
        });

        const data = await response.json();

        // Restore button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        if (response.ok) {
            // Display success
            const txHash = data.transactionHash;
            document.getElementById('txHashOutput').textContent = txHash;
            
            // Update explorer link
            const explorerLink = document.getElementById('explorerLink');
            explorerLink.href = `https://sepolia.etherscan.io/tx/${txHash}`;
            explorerLink.textContent = `View Transaction on Sepolia Etherscan (${txHash.slice(0, 10)}...)`;
            
            document.getElementById('transactionResult').style.display = 'block';
            
            // Scroll to result
            document.getElementById('transactionResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // Display error
            document.getElementById('errorOutput').innerHTML = 
                '<strong>Error:</strong> ' + (data.error || 'Failed to submit transaction');
            document.getElementById('errorResult').style.display = 'block';
        }
    } catch (error) {
        alert('Error: ' + error.message);
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Transaction';
    }
}

