/**
 * Comprehensive error handling and logging system for MUSE
 * Provides structured error management, logging, and monitoring capabilities
 */

export enum ErrorCategory {
    AUDIO = 'AUDIO',
    NETWORK = 'NETWORK',
    VALIDATION = 'VALIDATION',
    SYSTEM = 'SYSTEM',
    UI = 'UI',
    TELEGRAM = 'TELEGRAM',
    WIDGET = 'WIDGET'
}

export enum ErrorSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export interface AppError {
    id: string;
    message: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    timestamp: Date;
    context?: Record<string, any>;
    originalError?: Error | unknown;
    userFriendlyMessage?: string;
    actionable?: boolean;
    autoRetry?: boolean;
    retryCount?: number;
}

export interface ErrorLogEntry extends AppError {
    stack?: string;
    userAgent?: string;
    url?: string;
    sessionId?: string;
}

class ErrorHandler {
    private static instance: ErrorHandler;
    private errorLog: ErrorLogEntry[] = [];
    private maxLogSize = 1000;
    private sessionId: string;
    private errorCallbacks: Array<(error: AppError) => void> = [];
    private isDevelopment = process.env.NODE_ENV === 'development';
    
    private constructor() {
        this.sessionId = this.generateSessionId();
        this.setupGlobalErrorHandlers();
    }

    static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    private generateSessionId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private setupGlobalErrorHandlers(): void {
        if (typeof window !== 'undefined') {
            // Handle unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
                this.handleError({
                    message: `Unhandled promise rejection: ${event.reason?.message || event.reason}`,
                    category: ErrorCategory.SYSTEM,
                    severity: ErrorSeverity.HIGH,
                    originalError: event.reason instanceof Error ? event.reason : new Error(event.reason),
                    context: { type: 'unhandled_rejection' }
                });
            });

            // Handle JavaScript errors
            window.addEventListener('error', (event) => {
                this.handleError({
                    message: `JavaScript error: ${event.message}`,
                    category: ErrorCategory.SYSTEM,
                    severity: ErrorSeverity.HIGH,
                    originalError: new Error(event.message),
                    context: {
                        filename: event.filename,
                        lineno: event.lineno,
                        colno: event.colno,
                        type: 'window_error'
                    }
                });
            });
        }
    }

    handleError(options: {
        message: string;
        category: ErrorCategory;
        severity?: ErrorSeverity;
        originalError?: Error | unknown;
        context?: Record<string, any>;
        userFriendlyMessage?: string;
        actionable?: boolean;
        autoRetry?: boolean;
    }): AppError {
        const {
            message,
            category,
            severity = ErrorCategory.NETWORK ? ErrorSeverity.MEDIUM : ErrorSeverity.LOW,
            originalError,
            context = {},
            userFriendlyMessage,
            actionable = true,
            autoRetry = false
        } = options;

        const error: AppError = {
            id: this.generateErrorId(),
            message,
            category,
            severity,
            timestamp: new Date(),
            context,
            originalError,
            userFriendlyMessage: userFriendlyMessage || this.getDefaultUserMessage(category, severity),
            actionable,
            autoRetry,
            retryCount: 0
        };

        // Log the error
        this.logError(error);

        // Notify callbacks
        this.errorCallbacks.forEach(callback => {
            try {
                callback(error);
            } catch (callbackError) {
                console.error('Error in error callback:', callbackError);
            }
        });

        // Console logging for development
        if (this.isDevelopment) {
            console.group(`[${error.category}] ${error.severity}: ${error.message}`);
            console.log('Error ID:', error.id);
            console.log('Context:', error.context);
            if (error.originalError) {
                console.log('Original error:', error.originalError);
            }
            console.groupEnd();
        }

        return error;
    }

    private generateErrorId(): string {
        return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getDefaultUserMessage(category: ErrorCategory, severity: ErrorSeverity): string {
        const messages: Record<ErrorCategory, Record<ErrorSeverity, string>> = {
            [ErrorCategory.AUDIO]: {
                [ErrorSeverity.LOW]: 'Audio playback issue detected',
                [ErrorSeverity.MEDIUM]: 'Audio playback failed. Trying again...',
                [ErrorSeverity.HIGH]: 'Audio playback error. Please try a different track',
                [ErrorSeverity.CRITICAL]: 'Critical audio system failure'
            },
            [ErrorCategory.NETWORK]: {
                [ErrorSeverity.LOW]: 'Network connection issue',
                [ErrorSeverity.MEDIUM]: 'Network error. Check your connection',
                [ErrorSeverity.HIGH]: 'Network failure. Please check internet connection',
                [ErrorSeverity.CRITICAL]: 'Critical network error'
            },
            [ErrorCategory.VALIDATION]: {
                [ErrorSeverity.LOW]: 'Input validation issue',
                [ErrorSeverity.MEDIUM]: 'Invalid input detected',
                [ErrorSeverity.HIGH]: 'Validation error. Please check your input',
                [ErrorSeverity.CRITICAL]: 'Critical validation failure'
            },
            [ErrorCategory.SYSTEM]: {
                [ErrorSeverity.LOW]: 'System issue detected',
                [ErrorSeverity.MEDIUM]: 'System error occurred',
                [ErrorSeverity.HIGH]: 'System failure. Please refresh the page',
                [ErrorSeverity.CRITICAL]: 'Critical system error'
            },
            [ErrorCategory.UI]: {
                [ErrorSeverity.LOW]: 'UI issue detected',
                [ErrorSeverity.MEDIUM]: 'Interface error',
                [ErrorSeverity.HIGH]: 'UI failure. Interface may not work properly',
                [ErrorSeverity.CRITICAL]: 'Critical UI failure'
            },
            [ErrorCategory.TELEGRAM]: {
                [ErrorSeverity.LOW]: 'Telegram integration issue',
                [ErrorSeverity.MEDIUM]: 'Telegram bot error',
                [ErrorSeverity.HIGH]: 'Telegram service unavailable',
                [ErrorSeverity.CRITICAL]: 'Critical Telegram failure'
            },
            [ErrorCategory.WIDGET]: {
                [ErrorSeverity.LOW]: 'Widget issue detected',
                [ErrorSeverity.MEDIUM]: 'Widget error',
                [ErrorSeverity.HIGH]: 'Widget failure',
                [ErrorSeverity.CRITICAL]: 'Critical widget error'
            }
        };

        return messages[category]?.[severity] || 'An unexpected error occurred';
    }

    private logError(error: AppError): void {
        const logEntry: ErrorLogEntry = {
            ...error,
            stack: error.originalError && typeof error.originalError === 'object' && 'stack' in error.originalError 
                ? (error.originalError as any).stack 
                : undefined,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            sessionId: this.sessionId
        };

        this.errorLog.push(logEntry);

        // Maintain log size limit
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(-this.maxLogSize);
        }

        // Send to external logging service in production
        if (!this.isDevelopment) {
            this.sendToLoggingService(logEntry);
        }
    }

    private async sendToLoggingService(error: ErrorLogEntry): Promise<void> {
        // Placeholder for external logging service integration
        // Could integrate with services like Sentry, LogRocket, etc.
        try {
            // Example: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(error) });
        } catch {
            // Silently fail to avoid infinite error loops
        }
    }

    addErrorCallback(callback: (error: AppError) => void): () => void {
        this.errorCallbacks.push(callback);
        return () => {
            const index = this.errorCallbacks.indexOf(callback);
            if (index > -1) {
                this.errorCallbacks.splice(index, 1);
            }
        };
    }

    getErrorLog(): ErrorLogEntry[] {
        return [...this.errorLog];
    }

    getErrorsByCategory(category: ErrorCategory): AppError[] {
        return this.errorLog.filter(error => error.category === category);
    }

    getErrorsBySeverity(severity: ErrorSeverity): AppError[] {
        return this.errorLog.filter(error => error.severity === severity);
    }

    clearErrorLog(): void {
        this.errorLog = [];
    }

    // Specific error handlers for common scenarios
    handleAudioError(message: string, originalError?: Error | unknown, context?: Record<string, any>): AppError {
        return this.handleError({
            message,
            category: ErrorCategory.AUDIO,
            severity: ErrorSeverity.MEDIUM,
            originalError,
            context,
            autoRetry: true
        });
    }

    handleNetworkError(message: string, originalError?: Error | unknown, context?: Record<string, any>): AppError {
        return this.handleError({
            message,
            category: ErrorCategory.NETWORK,
            severity: ErrorSeverity.MEDIUM,
            originalError,
            context,
            autoRetry: true
        });
    }

    handleTelegramError(message: string, originalError?: Error | unknown, context?: Record<string, any>): AppError {
        return this.handleError({
            message,
            category: ErrorCategory.TELEGRAM,
            severity: ErrorSeverity.LOW,
            originalError,
            context
        });
    }

    handleWidgetError(message: string, originalError?: Error | unknown, context?: Record<string, any>): AppError {
        return this.handleError({
            message,
            category: ErrorCategory.WIDGET,
            severity: ErrorSeverity.LOW,
            originalError,
            context
        });
    }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Convenience functions
export const handleError = (options: Parameters<typeof errorHandler.handleError>[0]) => errorHandler.handleError(options);
export const handleAudioError = (message: string, originalError?: Error | unknown, context?: Record<string, any>) => 
    errorHandler.handleAudioError(message, originalError, context);
export const handleNetworkError = (message: string, originalError?: Error | unknown, context?: Record<string, any>) => 
    errorHandler.handleNetworkError(message, originalError, context);
export const handleTelegramError = (message: string, originalError?: Error | unknown, context?: Record<string, any>) => 
    errorHandler.handleTelegramError(message, originalError, context);
export const handleWidgetError = (message: string, originalError?: Error | unknown, context?: Record<string, any>) => 
    errorHandler.handleWidgetError(message, originalError, context);