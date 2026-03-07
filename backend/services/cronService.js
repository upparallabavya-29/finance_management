import cron from 'node-cron';
import logger from '../utils/logger.js';

class CronService {
    start() {
        logger.info('CronService starting scheduled jobs...');

        // Example: Run everyday at midnight to check for due bills
        cron.schedule('0 0 * * *', async () => {
            logger.info('Running daily bill reminder check...');
            try {
                // Future Implementation: Fetch pending bills due today/tomorrow and dispatch emails
            } catch (error) {
                logger.error('Error running daily bill check:', error);
            }
        });

        // Run on the 1st of every month at midnight to reset monthly budgets
        cron.schedule('0 0 1 * *', async () => {
            logger.info('Running monthly budget reset...');
            try {
                // Future Implementation: Auto-reset repeating budgets
            } catch (error) {
                logger.error('Error running monthly budget reset:', error);
            }
        });

        // Weekly Financial Summary (Every Monday at 9:00 AM)
        cron.schedule('0 9 * * 1', async () => {
            logger.info('Generating weekly financial summaries for all users...');
            try {
                // In a production environment with an email service:
                // 1. Fetch all active users
                // 2. Calculate weekly income/expense totals
                // 3. Compare with previous week
                // 4. Send email using services like Resend or SendGrid
                logger.info('Weekly Summary Job: Email service not configured. Summary generated in logs.');
            } catch (error) {
                logger.error('Error running weekly summary job:', error);
            }
        });
    }
}

export default new CronService();
