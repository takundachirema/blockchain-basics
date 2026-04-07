// Navigation data for Blockchain Concepts section
window.navigationTitle = 'Blockchain Concepts';
const navigationData = {
    topics: [
        {
            id: 'public-key-crypto',
            name: 'Public Key Cryptography',
            icon: '🔐',
            expanded: true,
            pages: [
                { id: 'intro', name: 'Introduction', path: '/blockchain-concepts/public-key-cryptography/intro.html' },
                { id: 'digital-signing', name: 'Digital Signing', path: '/blockchain-concepts/public-key-cryptography/digital-signing.html' },
                { id: 'key-generation', name: 'Key Generation & Operations', path: '/blockchain-concepts/public-key-cryptography/key-generation.html' }
            ]
        },
        {
            id: 'distributed-ledgers',
            name: 'Distributed Ledgers',
            icon: '📚',
            expanded: false,
            pages: [
                { id: 'intro', name: 'Introduction', path: '/blockchain-concepts/distributed-ledgers/intro.html' },
                { id: 'utxo', name: 'UTXO Model', path: '/blockchain-concepts/distributed-ledgers/utxo.html' },
                { id: 'account-model', name: 'Account Model', path: '/blockchain-concepts/distributed-ledgers/account-model.html' }
            ]
        },
        {
            id: 'consensus-mechanisms',
            name: 'Consensus Mechanisms',
            icon: '🤝',
            expanded: false,
            pages: [
                { id: 'intro', name: 'Introduction', path: '/blockchain-concepts/consensus-mechanisms/intro.html' },
                { id: 'transaction-flow', name: 'Transaction Flow', path: '/blockchain-concepts/consensus-mechanisms/transaction-flow.html' },
                { id: 'proof-of-work', name: 'Proof of Work', path: '/blockchain-concepts/consensus-mechanisms/proof-of-work.html' },
                { id: 'proof-of-stake', name: 'Proof of Stake', path: '/blockchain-concepts/consensus-mechanisms/proof-of-stake.html' }
            ]
        }
    ]
};
