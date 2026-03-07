import { supabase } from './config/supabase.js';

async function deepProbe() {
    console.log('--- DEEP PROBING investments ---');

    // We want to find啥 columns exist.
    // If we can't select * and get keys (table empty), we probe.
    const fields = [
        'id', 'user_id', 'user', 'uid',
        'name', 'title', 'ticker', 'symbol', 'asset', 'description', 'label',
        'type', 'category', 'asset_type',
        'quantity', 'units', 'amount', 'balance', 'shares', 'count',
        'purchase_price', 'purchase_amount', 'buy_price', 'cost_basis', 'price',
        'current_price', 'current_value', 'value', 'market_value', 'price_current',
        'created_at', 'updated_at', 'date'
    ];

    const exists = [];
    for (const f of fields) {
        const { error } = await supabase.from('investments').select(f).limit(1);
        if (!error) exists.push(f);
    }

    console.log('EXISTING COLUMNS:', JSON.stringify(exists, null, 2));
    process.exit(0);
}

deepProbe();
