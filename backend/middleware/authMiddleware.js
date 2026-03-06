import { supabaseAuth } from '../config/supabase.js';

// JWT Middleware to protect routes ensuring user is authorized via Supabase Auth
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify the token with Supabase
            const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
            console.log('[AUTH DEBUG] getUser result - user.id:', user?.id, '| error:', error?.message);

            if (error || !user) {
                return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
            }

            // Attach user object to request
            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, no token' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};
