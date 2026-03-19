import * as fs from 'fs';
import { execSync } from 'child_process';

// Geometric Brownian Motion parameters for BTC
const S0 = 40000; // Initial price
const mu = 0.001; // Expected daily return
const sigma = 0.03; // Daily volatility
const dt = 1; // 1 day
const days = 60;

function generateData(): number[] {
    const prices: number[] = [S0];
    for (let i = 1; i < days; i++) {
        const z = Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3; // Approx normal distribution
        const dS = prices[i - 1] * (mu * dt + sigma * Math.sqrt(dt) * z);
        prices.push(prices[i - 1] + dS);
    }
    return prices;
}

function saveToCSV(prices: number[], filename: string) {
    let csvContent = 'day,price\n';
    prices.forEach((price, index) => {
        csvContent += `${index + 1},${price.toFixed(2)}\n`;
    });
    fs.writeFileSync(filename, csvContent);
}

function readProcessedCSV(filename: string): any[] {
    const data = fs.readFileSync(filename, 'utf-8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');

    const records = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        records.push({
            day: parseInt(values[0]),
            price: parseFloat(values[1]),
            ma7: parseFloat(values[2]),
            ma30: parseFloat(values[3])
        });
    }
    return records;
}

function runTradingAlgorithm(records: any[]) {
    let position = 0; // 0 = flat, 1 = long
    let balance = 100000; // Start with $100,000
    let btc = 0;

    console.log(`Starting Portfolio Balance: $${balance.toFixed(2)}\n`);
    console.log('Daily Ledger:');

    for (let i = 1; i < records.length; i++) {
        const today = records[i];
        const yesterday = records[i-1];

        // Golden Cross: 7-day MA crosses above 30-day MA
        if (position === 0 && yesterday.ma7 <= yesterday.ma30 && today.ma7 > today.ma30) {
            // Buy
            btc = balance / today.price;
            console.log(`Day ${today.day}: BUY  ${btc.toFixed(4)} BTC @ $${today.price.toFixed(2)} | MA7: ${today.ma7.toFixed(2)} > MA30: ${today.ma30.toFixed(2)}`);
            balance = 0;
            position = 1;
        }
        // Death Cross: 7-day MA crosses below 30-day MA
        else if (position === 1 && yesterday.ma7 >= yesterday.ma30 && today.ma7 < today.ma30) {
            // Sell
            balance = btc * today.price;
            console.log(`Day ${today.day}: SELL ${btc.toFixed(4)} BTC @ $${today.price.toFixed(2)} | MA7: ${today.ma7.toFixed(2)} < MA30: ${today.ma30.toFixed(2)}`);
            btc = 0;
            position = 0;
        }
    }

    // Close position at the end
    if (position === 1) {
        const lastDay = records[records.length - 1];
        balance = btc * lastDay.price;
        console.log(`Day ${lastDay.day}: SELL ${btc.toFixed(4)} BTC @ $${lastDay.price.toFixed(2)} (End of Simulation)`);
        btc = 0;
        position = 0;
    }

    console.log(`\nFinal Portfolio Balance: $${balance.toFixed(2)}`);
    const returnPct = ((balance - 100000) / 100000) * 100;
    console.log(`Performance: ${returnPct >= 0 ? '+' : ''}${returnPct.toFixed(2)}%`);
}

function main() {
    console.log("Simulating 60 days of BTC price data...");
    const prices = generateData();
    saveToCSV(prices, 'data.csv');
    console.log("Saved simulated data to data.csv.");

    console.log("Calculating moving averages via Python...");
    execSync('python3 process.py data.csv processed.csv');
    console.log("Calculated 7-day and 30-day Moving Averages and saved to processed.csv.\n");

    const records = readProcessedCSV('processed.csv');
    runTradingAlgorithm(records);
}

if (require.main === module) {
    main();
}

export { generateData, saveToCSV };