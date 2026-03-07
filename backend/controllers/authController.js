import authService from '../services/authService.js';

export const registerUser = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: result.user,
            session: result.session
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        if (req.body.email) req.body.email = req.body.email.trim();
        if (req.body.password) req.body.password = req.body.password.trim();
        console.log(`[LOGIN ATTEMPT] Email: "${req.body.email}", Password length: ${req.body.password?.length}`);
        const result = await authService.loginUser(req.body);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: result.user,
            session: result.session
        });
    } catch (error) {
        // Map common errors
        if (error.message.includes('Invalid login credentials')) {
            error.statusCode = 401;
        }
        next(error);
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        await authService.logoutUser(token);
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user?.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};
