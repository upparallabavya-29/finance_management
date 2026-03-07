import { supabase } from './config/supabase.js';

async function findPriceCol() {
    const fields = ['purchase_price', 'price', 'buy_price', 'cost', 'cost_basis', 'purchase_amount', 'initial_value', 'original_value', 'amount', 'buy'];
    const exists = [];
    for (const f of fields) {
        const { error } = await supabase.from('investments').select(f).limit(1);
        if (!error) exists.push(f);
    }
    console.log('PRICE ALIASES:', exists);
    process.exit(0);
}
findPriceCol();
