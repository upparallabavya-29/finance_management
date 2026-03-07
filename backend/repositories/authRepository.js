import { supabase, supabaseAuth } from '../config/supabase.js';

class AuthRepository {
    async signUp(email, password, firstName, lastName) {
        const { data, error } = await supabaseAuth.auth.signUp({
            email,
            password,
            options: {
                data: { first_name: firstName, last_name: lastName }
            }
        });
        if (error) throw error;
        return data;
    }

    async upsertUser(userId, email, firstName, lastName) {
        const { data, error } = await supabase
            .from('users')
            .upsert([{
                id: userId,
                email: email,
                first_name: firstName,
                last_name: lastName,
                password_hash: 'SYNCED_BY_AUTH_DO_NOT_USE'
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async signIn(email, password) {
        const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    }

    async getUserProfile(userId) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    async insertProfileFallback(userId, email, firstName, lastName) {
        const { data, error } = await supabase
            .from('users')
            .insert([{
                id: userId,
                email: email,
                first_name: firstName,
                last_name: lastName,
                password_hash: 'SYNCED_BY_AUTH_DO_NOT_USE'
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async signOut(token) {
        const { error } = await supabaseAuth.auth.admin.signOut(token);
        if (error) throw error;
        return true;
    }
}
export default new AuthRepository();
