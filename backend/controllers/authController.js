import { supabase, supabaseAuth } from '../config/supabase.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // 1. Sign up user via Supabase Auth
        const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName
                }
            }
        });

        if (authError) {
            return res.status(400).json({ success: false, message: authError.message });
        }

        const userId = authData.user.id;

        // Proactively insert the user into `public.users` because the DB trigger 
        // `on_auth_user_created` often fails if RLS or permissions are mismatched.
        // This guarantees `categories`, `budgets`, and `transactions` won't throw FK errors.
        await supabase
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

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: userId,
                email,
                firstName,
                lastName
            },
            session: authData.session
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};


// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const { data, error } = await supabaseAuth.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Supabase Login Error:', error);
            return res.status(401).json({ success: false, message: error.message || 'Invalid credentials' });
        }

        // Fetch user profile details
        let { data: profile, error: profileError } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('id', data.user.id)
            .single();

        // If user profile is not found in public.users, insert it now as a fallback
        if (profileError && profileError.code === 'PGRST116') {
            const { data: newProfile, error: insertError } = await supabase
                .from('users')
                .insert([{
                    id: data.user.id,
                    email: data.user.email,
                    first_name: data.user.user_metadata?.first_name || '',
                    last_name: data.user.user_metadata?.last_name || '',
                    password_hash: 'SYNCED_BY_AUTH_DO_NOT_USE'
                }])
                .select()
                .single();
            if (!insertError) profile = newProfile;
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
                firstName: profile?.first_name || '',
                lastName: profile?.last_name || ''
            },
            session: data.session
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ success: false, message: 'No token provided' });
        }

        // We sign out using the token. Note: In a true stateless JWT setup, deleting token client-side is often enough, 
        // but calling signOut invalidates the session in Supabase.
        const { error } = await supabaseAuth.auth.admin.signOut(token); // Or supabase.auth.signOut() if context is bound, but admin is safer for server-side if using service key.
        // For anon key, we generally rely on client to clear token, but we can try to invalidate it if we pass it down.
        // If we don't have admin key, we basically just tell the client "success, please delete your token".

        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ success: false, message: 'Server error during logout' });
    }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        // req.user should be set by authMiddleware
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const { data: profile, error } = await supabase
            .from('users')
            .select('id, email, first_name, last_name, created_at')
            .eq('id', userId)
            .single();

        if (error || !profile) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: profile.id,
                email: profile.email,
                firstName: profile.first_name,
                lastName: profile.last_name,
                createdAt: profile.created_at
            }
        });

    } catch (error) {
        console.error("GetMe Error:", error);
        res.status(500).json({ success: false, message: 'Server error retrieving profile' });
    }
};
