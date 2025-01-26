class CurrencyConverter {
    constructor() {
        this.apiKey = '694ec262e845bcdd7c172a09'; // Replace with your ExchangeRate-API key
        this.baseUrl = 'https://v6.exchangerate-api.com/v6';
        this.initializeElements();
        this.setupEventListeners();
        this.loadCurrencies();
    }

    initializeElements() {
        this.amountInput = document.getElementById('amount');
        this.fromCurrency = document.getElementById('from-currency');
        this.toCurrency = document.getElementById('to-currency');
        this.convertBtn = document.getElementById('convert-btn');
        this.swapBtn = document.getElementById('swap-btn');
        this.resultDiv = document.getElementById('result');
        this.resultText = document.querySelector('.result-text');
        this.exchangeRate = document.querySelector('.exchange-rate');
    }

    setupEventListeners() {
        this.convertBtn.addEventListener('click', () => this.convertCurrency());
        this.swapBtn.addEventListener('click', () => this.swapCurrencies());
        this.amountInput.addEventListener('input', this.validateInput);
    }

    validateInput(e) {
        let value = e.target.value;
        value = value.replace(/[^\d.]/g, '');
        if (value.split('.').length > 2) value = value.replace(/\.+$/, '');
        e.target.value = value;
    }

    async loadCurrencies() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.apiKey}/codes`);
            const data = await response.json();
            
            if (data.result === 'success') {
                const currencies = data.supported_codes;
                this.populateCurrencyDropdowns(currencies);
            }
        } catch (error) {
            console.error('Error loading currencies:', error);
        }
    }

    populateCurrencyDropdowns(currencies) {
        currencies.forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.text = `${code} - ${name}`;
            this.fromCurrency.add(option.cloneNode(true));
            this.toCurrency.add(option);
        });

        // Set default values
        this.fromCurrency.value = 'USD';
        this.toCurrency.value = 'EUR';
    }

    swapCurrencies() {
        [this.fromCurrency.value, this.toCurrency.value] = 
        [this.toCurrency.value, this.fromCurrency.value];
    }

    async convertCurrency() {
        const amount = parseFloat(this.amountInput.value);
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/${this.apiKey}/pair/` +
                `${this.fromCurrency.value}/${this.toCurrency.value}/${amount}`
            );
            const data = await response.json();

            if (data.result === 'success') {
                this.displayResult(data);
            }
        } catch (error) {
            console.error('Error converting currency:', error);
            alert('Error converting currency. Please try again.');
        }
    }

    displayResult(data) {
        const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.fromCurrency.value
        }).format(this.amountInput.value);

        const formattedResult = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.toCurrency.value
        }).format(data.conversion_result);

        this.resultText.textContent = `${formattedAmount} = ${formattedResult}`;
        this.exchangeRate.textContent = 
            `1 ${this.fromCurrency.value} = ${data.conversion_rate} ${this.toCurrency.value}`;
        this.resultDiv.style.display = 'block';
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
});