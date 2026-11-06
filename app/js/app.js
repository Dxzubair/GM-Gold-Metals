const goldPurities = {
    '24K': { purity: '999', id: 'rate-24' },
    '22K': { purity: '916', id: 'rate-22' },
    '20K': { purity: '833', id: 'rate-20' },
    '18K': { purity: '750', id: 'rate-18' },
    '14K': { purity: '585', id: 'rate-14' },
    '10K': { purity: '417', id: 'rate-10' }
};

function showDetails(karat, purity) {
    const panel = document.getElementById('details-panel');
    const rate = document.getElementById(goldPurities[karat]?.id);

    document.getElementById('detail-title').textContent = `${karat} Gold Details`;
    document.getElementById('detail-purity').textContent = `Purity: ${purity}`;
    panel.querySelector('.muted').textContent =
        `Current rate: ${rate?.textContent || '—'} per gram.`;

    panel.hidden = false;
    document.body.classList.add('modal-open');
    document.getElementById('other-panel').hidden = true;
}

function closeDetails() {
    document.getElementById('details-panel').hidden = true;
    document.body.classList.remove('modal-open');
}

function closeOther() {
    document.getElementById('other-panel').hidden = true;
}

const products = [
    { name: 'Gold Coins', symbol: 'Au', description: 'Explore gold coin collections and available weights.', type: 'Gold' },
    { name: 'Silver Coins', symbol: 'Ag', description: 'Explore fine silver coins and available weights.', type: 'Silver' },
    { name: 'Gold Bars', symbol: 'GM', description: 'Explore gold bars in different weights.', type: 'Gold' },
    { name: 'Silver Bars', symbol: 'GM', description: 'Explore silver bars in different weights.', type: 'Silver' }
];

const purityInfo = [
    ['24K', '999', '99.9%', 'Investment-grade fine gold.'],
    ['22K', '916', '91.6%', 'Commonly used for jewellery.'],
    ['20K', '833', '83.3%', 'A lower-purity gold alloy.'],
    ['18K', '750', '75%', 'Popular for premium jewellery.'],
    ['14K', '585', '58.5%', 'Durable gold alloy.'],
    ['10K', '417', '41.7%', 'Lower gold-content alloy.']
];

const sections = {
    rates: {
        title: 'Market Rates',
        render: () => `
            <p class="muted">Gold and silver market prices per gram.</p>
            <div class="feature-list">
                <p>Gold: Explore all six purity levels from 24K to 10K.</p>
                <p>Silver: Fine silver 999 purity.</p>
                <p>All rates will be sourced from the GM market API.</p>
            </div>`
    },

    products: {
        title: 'Coins & Bars',
        render: () => `
            <p class="muted">Explore our precious metals catalogue.</p>
            <div class="catalogue-grid">
                ${products.map((p, i) => `
                    <button class="catalogue-card" onclick="openProductPreview(${i})">
                        <span class="catalogue-symbol">${p.symbol}</span>
                        <strong>${p.name}</strong>
                        <small>${p.description}</small>
                        <span class="catalogue-link">Explore →</span>
                    </button>
                `).join('')}
            </div>
            <div id="product-detail" class="product-detail" hidden></div>`
    },

    calculator: {
        title: 'Metal Calculator',
        render: () => `
            <p class="muted">Calculate metal value using weight, purity and market rate.</p>
            <div class="tool-form">
                <label>Metal</label>
                <select id="calc-metal">
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                </select>

                <label>Gold Purity</label>
                <select id="calc-purity">
                    <option value="999">24K — 999</option>
                    <option value="916">22K — 916</option>
                    <option value="833">20K — 833</option>
                    <option value="750">18K — 750</option>
                    <option value="585">14K — 585</option>
                    <option value="417">10K — 417</option>
                </select>

                <label>Weight (grams)</label>
                <input id="calc-weight" type="number" min="0.001" step="any" placeholder="Enter weight">

                <label>Market rate (₹ per gram)</label>
                <input id="calc-rate" type="number" min="0" step="any" placeholder="Enter rate">

                <button class="primary-btn" onclick="calculateMetal()">Calculate Value</button>
                <div id="calc-result" class="result-box">Your calculation will appear here.</div>
                <small class="muted">Indicative metal value only. Making charges, taxes and other fees are excluded.</small>
            </div>`
    },

    trends: {
        title: 'Market Trends',
        render: () => `
            <p class="muted">Gold and silver market performance.</p>
            <div class="trend-card">
                <span>GOLD MARKET</span>
                <h4>Historical Gold Prices</h4>
                <p>Daily, weekly and monthly market history.</p>
                <div class="trend-placeholder">Market chart will appear after API integration.</div>
            </div>
            <div class="trend-card">
                <span>SILVER MARKET</span>
                <h4>Historical Silver Prices</h4>
                <p>Track silver market performance.</p>
                <div class="trend-placeholder">Market chart will appear after API integration.</div>
            </div>`
    },

    alerts: {
        title: 'Price Alerts',
        render: () => `
            <p class="muted">Create a target price for your preferred metal.</p>
            <div class="tool-form">
                <label>Metal</label>
                <select id="alert-metal">
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                </select>
                <label>Target price (₹ per gram)</label>
                <input id="alert-price" type="number" min="0" step="any" placeholder="Enter target price">
                <label>Alert condition</label>
                <select id="alert-condition">
                    <option value="below">Notify when price falls below target</option>
                    <option value="above">Notify when price rises above target</option>
                </select>
                <button class="primary-btn" onclick="saveAlert()">Save Price Alert</button>
                <div id="alert-result" class="result-box">Alerts are stored on this device. Automatic notifications require a later notification service integration.</div>
            </div>
            <div id="saved-alerts"></div>`
    },

    purity: {
        title: 'Gold Purity Guide',
        render: () => `
            <p class="muted">Understand gold karat, fineness and gold content.</p>
            <div class="purity-list">
                ${purityInfo.map(p => `
                    <div class="purity-row">
                        <strong>${p[0]}</strong>
                        <div><b>${p[1]} fineness · ${p[2]}</b><small>${p[3]}</small></div>
                    </div>
                `).join('')}
            </div>
            <p class="muted">Fineness indicates the number of parts of pure gold per 1,000 parts of alloy.</p>`
    },

    news: {
        title: 'Market News',
        render: () => `
            <p class="muted">Precious metals market updates.</p>
            <div class="trend-placeholder">Market news feed will be added in a later integration.</div>`
    },

    more: {
        title: 'More',
        render: () => `
            <div class="feature-list">
                <p>GM — Gold & Metals</p>
                <p>Precious metals market platform</p>
                <p>Market data source and update information will be displayed here.</p>
                <p>Settings and account preferences coming soon.</p>
            </div>`
    }
};

function showSection(section) {
    const data = sections[section];
    if (!data) return;

    closeDetails();

    document.getElementById('other-title').textContent = data.title;
    document.getElementById('other-description').innerHTML = data.render();

    const panel = document.getElementById('other-panel');
    panel.hidden = false;

    document.querySelectorAll('.bottom-nav button').forEach(button => {
        button.classList.remove('active');
    });

    const navIndex = { rates: 1, products: 2, news: 3, more: 4 };
    if (navIndex[section] !== undefined) {
        document.querySelectorAll('.bottom-nav button')[navIndex[section]].classList.add('active');
    }

    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (section === 'alerts') renderSavedAlerts();
}


function openProductPreview(index) {
    const product = products[index];
    if (!product) return;

    document.getElementById('gm-product-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'gm-product-modal';
    modal.className = 'product-modal';

    modal.innerHTML = `
        <div class="product-modal-backdrop" onclick="closeProductPreview()"></div>
        <div class="product-popup">
            <button class="popup-close" onclick="closeProductPreview()">✕</button>
            <div class="popup-art ${product.type === 'Gold' ? 'popup-gold' : 'popup-silver'}">
                ${product.symbol}
            </div>
            <span class="popup-eyebrow">GM PREMIUM COLLECTION</span>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="popup-info">
                <div><small>METAL</small><strong>${product.type}</strong></div>
                <div><small>COLLECTION</small><strong>${product.name}</strong></div>
                <div><small>PRICING</small><strong>Market linked</strong></div>
            </div>
            <button class="primary-btn" onclick="openProductDetails(${index})">See More →</button>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeProductPreview() {
    document.getElementById('gm-product-modal')?.remove();
    document.body.style.overflow = '';
}

function openProductDetails(index) {
    const product = products[index];
    if (!product) return;

    closeProductPreview();

    const panel = document.getElementById('other-panel');
    document.getElementById('other-title').textContent = product.name;

    document.getElementById('other-description').innerHTML = `
        <button class="text-btn product-back" onclick="showSection('products')">← Back to Products</button>

        <div class="product-detail-page">
            <div class="detail-product-art ${product.type === 'Gold' ? 'popup-gold' : 'popup-silver'}">
                ${product.symbol}
            </div>
            <span class="popup-eyebrow">GM PREMIUM COLLECTION</span>
            <h2>${product.name}</h2>
            <p>${product.description}</p>

            <h4>Product Specifications</h4>
            <div class="spec-row"><span>Metal</span><strong>${product.type}</strong></div>
            <div class="spec-row"><span>Purity</span><strong>${product.type === 'Gold' ? 'To be specified' : '999'}</strong></div>
            <div class="spec-row"><span>Weight options</span><strong>Coming with catalogue data</strong></div>
            <div class="spec-row"><span>Price</span><strong>Awaiting market data</strong></div>

            <div class="result-box">
                Product prices and availability will be populated from the GM API when catalogue integration is ready.
            </div>
        </div>
    `;

    panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculateMetal() {
    const metal = document.getElementById('calc-metal').value;
    const purity = Number(document.getElementById('calc-purity').value);
    const weight = Number(document.getElementById('calc-weight').value);
    const rate = Number(document.getElementById('calc-rate').value);
    const result = document.getElementById('calc-result');

    if (!(weight > 0) || !(rate > 0)) {
        result.textContent = 'Please enter a valid weight and market rate.';
        return;
    }

    const purityFactor = metal === 'gold' ? purity / 1000 : 0.999;
    const value = weight * rate * purityFactor;

    result.innerHTML = `
        <small>Estimated metal value</small>
        <strong>₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>
        <small>${weight} g · ${metal === 'gold' ? purity + ' fineness' : '999 fineness'}</small>
    `;
}

function saveAlert() {
    const metal = document.getElementById('alert-metal').value;
    const price = Number(document.getElementById('alert-price').value);
    const condition = document.getElementById('alert-condition').value;

    if (!(price > 0)) {
        document.getElementById('alert-result').textContent = 'Enter a valid target price.';
        return;
    }

    const alerts = JSON.parse(localStorage.getItem('gm-price-alerts') || '[]');
    alerts.push({
        id: Date.now(),
        metal,
        price,
        condition
    });

    localStorage.setItem('gm-price-alerts', JSON.stringify(alerts));
    document.getElementById('alert-price').value = '';
    document.getElementById('alert-result').textContent = 'Price target saved on this device.';
    renderSavedAlerts();
}

function renderSavedAlerts() {
    const container = document.getElementById('saved-alerts');
    if (!container) return;

    const alerts = JSON.parse(localStorage.getItem('gm-price-alerts') || '[]');

    container.innerHTML = `
        <h4>Saved Alerts</h4>
        ${alerts.length ? alerts.map(a => `
            <div class="saved-alert">
                <span>${a.metal} · ₹${a.price.toLocaleString('en-IN')} · ${a.condition}</span>
                <button onclick="deleteAlert(${a.id})">Remove</button>
            </div>
        `).join('') : '<p class="muted">No saved alerts yet.</p>'}
    `;
}

function deleteAlert(id) {
    const alerts = JSON.parse(localStorage.getItem('gm-price-alerts') || '[]')
        .filter(a => a.id !== id);

    localStorage.setItem('gm-price-alerts', JSON.stringify(alerts));
    renderSavedAlerts();
}

document.addEventListener('DOMContentLoaded', () => {
    const status = document.querySelector('.market-status');
    if (status) status.textContent = '● Awaiting market data';
    console.log('GM — Gold & Metals initialized.');
});
