import { supabase } from './config/supabase.js';

async function listAllColumns() {
    console.log('--- PROBING investments COLUMNS ---');

    // Testing potential column names since we can't easily list all without a specific row
    const potentials = [
        'id', 'user_id', 'name', 'title', 'asset_name', 'label',
        'type', 'category', 'asset_type',
        'quantity', 'units', 'amount',
        'purchase_price', 'buy_price', 'price',
        'current_value', 'value', 'market_value',
        'symbol', 'ticker',
        'created_at', 'updated_at'
    ];

    const results = {};
    for (const col of potentials) {
        const { error } = await supabase.from('investments').select(col).limit(1);
        results[col] = error ? 'MISSING' : 'EXISTS';
    }

    console.log('--- COLUMN RESULTS ---');
    console.log(JSON.stringify(results, null, 2));
    console.log('--- END RESULTS ---');
    process.exit(0);
}

listAllColumns();
