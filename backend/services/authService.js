import authRepository from '../repositories/authRepository.js';

class AuthService {
    async registerUser({ email, password, firstName, lastName }) {
        if (!email || !password || !firstName || !lastName) {
            throw Object.assign(new Error('Please provide all required fields'), { statusCode: 400 });
        }

        const authData = await authRepository.signUp(email, password, firstName, lastName);
        const userId = authData.user.id;

        await authRepository.upsertUser(userId, email, firstName, lastName);

        return {
            user: { id: userId, email, firstName, lastName },
            session: authData.session
        };
    }

    async loginUser({ email, password }) {
        if (!email || !password) {
            throw Object.assign(new Error('Please provide email and password'), { statusCode: 400 });
        }

        const authData = await authRepository.signIn(email, password);
        const userId = authData.user.id;

        let profile = await authRepository.getUserProfile(userId);
        if (!profile) {
            profile = await authRepository.insertProfileFallback(
                userId, authData.user.email,
                authData.user.user_metadata?.first_name || '',
                authData.user.user_metadata?.last_name || ''
            );
        }

        return {
            user: {
                id: userId,
                email: authData.user.email,
                firstName: profile?.first_name || '',
                lastName: profile?.last_name || ''
            },
            session: authData.session
        };
    }

    async logoutUser(token) {
        if (!token) throw Object.assign(new Error('No token provided'), { statusCode: 400 });
        return await authRepository.signOut(token);
    }

    async getMe(userId) {
        if (!userId) throw Object.assign(new Error('Not authorized'), { statusCode: 401 });
        const profile = await authRepository.getUserProfile(userId);
        if (!profile) throw Object.assign(new Error('User not found'), { statusCode: 404 });

        return {
            id: profile.id,
            email: profile.email,
            firstName: profile.first_name,
            lastName: profile.last_name,
            createdAt: profile.created_at
        };
    }
}
export default new AuthService();
