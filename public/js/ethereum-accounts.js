// Get or Import Address page: import account from private key
const KEY_GENERATION_STORAGE_KEY = 'blockchain_tutorial_keypair';
const IMPORTED_ACCOUNT_STORAGE_KEY = 'ethereum_imported_account';

document.addEventListener('DOMContentLoaded', () => {
    const importBtn = document.getElementById('importBtn');
    const clearImportBtn = document.getElementById('clearImportBtn');
    const importPrivateKeyInput = document.getElementById('importPrivateKey');
    const importPrivateKeyShow = document.getElementById('importPrivateKeyShow');
    const importOutputSection = document.getElementById('importOutputSection');
    const copyPublicKeyBtn = document.getElementById('copyPublicKeyBtn');
    const copyImportAddressBtn = document.getElementById('copyImportAddressBtn');
    const importPublicKeyOutput = document.getElementById('importPublicKeyOutput');
    const importAddressOutput = document.getElementById('importAddressOutput');

    if (importBtn) importBtn.addEventListener('click', importFromPrivateKey);
    if (clearImportBtn) {
        clearImportBtn.addEventListener('click', () => {
            if (importPrivateKeyInput) importPrivateKeyInput.value = '';
            if (importOutputSection) importOutputSection.style.display = 'none';
            if (importPrivateKeyShow) importPrivateKeyShow.checked = false;
            if (importPrivateKeyInput) importPrivateKeyInput.type = 'password';
            try {
                localStorage.removeItem(IMPORTED_ACCOUNT_STORAGE_KEY);
            } catch (error) {
                console.warn('Could not clear imported account from storage:', error);
            }
        });
    }
    if (importPrivateKeyShow && importPrivateKeyInput) {
        importPrivateKeyShow.addEventListener('change', () => {
            importPrivateKeyInput.type = importPrivateKeyShow.checked ? 'text' : 'password';
        });
    }
    if (copyPublicKeyBtn && importPublicKeyOutput) {
        copyPublicKeyBtn.addEventListener('click', () => copyToClipboardFromEl(importPublicKeyOutput, copyPublicKeyBtn, 'Copy Public Key'));
    }
    if (copyImportAddressBtn && importAddressOutput) {
        copyImportAddressBtn.addEventListener('click', () => copyToClipboardFromEl(importAddressOutput, copyImportAddressBtn, 'Copy Address'));
    }

    // Prefill from key-generation page if available in localStorage.
    if (importPrivateKeyInput) {
        try {
            const stored = localStorage.getItem(KEY_GENERATION_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && typeof parsed.privateKey === 'string' && parsed.privateKey.trim()) {
                    const clean = parsed.privateKey.replace(/^0x/i, '').trim();
                    importPrivateKeyInput.value = '0x' + clean;
                }
            }
        } catch (error) {
            console.warn('Could not prefill private key from storage:', error);
        }
    }

    // Load previously imported account if available.
    try {
        const storedImportedAccount = localStorage.getItem(IMPORTED_ACCOUNT_STORAGE_KEY);
        if (storedImportedAccount && importOutputSection && importPublicKeyOutput && importAddressOutput) {
            const parsed = JSON.parse(storedImportedAccount);
            if (parsed && parsed.publicKey && parsed.ethereumAddress) {
                importPublicKeyOutput.textContent = parsed.publicKey;
                importAddressOutput.textContent = parsed.ethereumAddress;
                importOutputSection.style.display = 'block';
            }
        }
    } catch (error) {
        console.warn('Could not load imported account from storage:', error);
    }
});

function copyToClipboardFromEl(element, button, defaultLabel) {
    if (!element) return;
    const text = element.textContent;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            if (button) {
                button.textContent = 'Copied!';
                setTimeout(() => { button.textContent = defaultLabel; }, 2000);
            }
        }).catch(() => alert('Failed to copy'));
    } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            if (button) {
                button.textContent = 'Copied!';
                setTimeout(() => { button.textContent = defaultLabel; }, 2000);
            }
        } catch (e) { alert('Failed to copy'); }
        document.body.removeChild(ta);
    }
}

async function importFromPrivateKey() {
    const input = document.getElementById('importPrivateKey');
    const importOutputSection = document.getElementById('importOutputSection');
    const importPublicKeyOutput = document.getElementById('importPublicKeyOutput');
    const importAddressOutput = document.getElementById('importAddressOutput');
    if (!input || !importOutputSection || !importPublicKeyOutput || !importAddressOutput) return;

    let privateKeyHex = (input.value || '').replace(/^0x/i, '').trim();
    if (privateKeyHex.length !== 64 || !/^[a-fA-F0-9]+$/.test(privateKeyHex)) {
        alert('Invalid private key. Enter 64 hexadecimal characters (with or without 0x prefix).');
        return;
    }

    try {
        const response = await fetch('/api/import-keypair', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ privateKeyHex: privateKeyHex })
        });
        const data = await response.json();
        if (response.ok) {
            importPublicKeyOutput.textContent = '0x' + data.publicKey;
            importAddressOutput.textContent = data.ethereumAddress;
            importOutputSection.style.display = 'block';
            try {
                localStorage.setItem(
                    IMPORTED_ACCOUNT_STORAGE_KEY,
                    JSON.stringify({
                        publicKey: '0x' + data.publicKey,
                        ethereumAddress: data.ethereumAddress
                    })
                );
            } catch (error) {
                console.warn('Could not save imported account to storage:', error);
            }
        } else {
            alert(data.error || 'Failed to import key');
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}
