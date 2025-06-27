
import { toast } from 'sonner';
import { notificationService } from '@/services/notifications';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = async (error: unknown, userId?: string) => {
  console.error('Application error:', error);

  let message = 'An unexpected error occurred';
  let title = 'Error';

  if (error instanceof AppError) {
    message = error.message;
    title = `Error ${error.statusCode || ''}`.trim();
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Show toast notification
  toast.error(title, {
    description: message,
    duration: 5000,
  });

  // Log to notifications if user is available
  if (userId) {
    try {
      await notificationService.createNotification(
        userId,
        title,
        message,
        'error'
      );
    } catch (notificationError) {
      console.error('Failed to create error notification:', notificationError);
    }
  }
};

export const handleSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 3000,
  });
};
