import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './Buttons';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'INGESTING TELEMETRY STREAM...',
  subtext = 'Calibrating personal physiological baselines and synchronized clocks',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white border border-astro-border-hairline rounded-sm ${className}`}
    >
      <div className="relative w-8 h-8 mb-4">
        <div className="w-8 h-8 border-2 border-astro-border-hairline rounded-full" />
        <div className="absolute top-0 left-0 w-8 h-8 border-2 border-astro-text-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-astro-text-primary mb-1">
        {message}
      </p>
      {subtext && <p className="font-body text-xs text-astro-text-secondary max-w-sm">{subtext}</p>}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white border border-astro-border-hairline rounded-sm ${className}`}
    >
      {icon && <div className="mb-3 text-astro-text-tertiary">{icon}</div>}
      <h4 className="font-display text-sm font-semibold text-astro-text-primary mb-1">{title}</h4>
      <p className="font-body text-xs text-astro-text-secondary max-w-md mb-4">{description}</p>
      {actionText && onAction && (
        <SecondaryButton onClick={onAction} size="sm">
          {actionText}
        </SecondaryButton>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'TELEMETRY DISRUPTION DETECTED',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center bg-astro-status-critical/5 border border-astro-status-critical/30 rounded-sm ${className}`}
    >
      <AlertTriangle className="w-6 h-6 text-astro-status-critical mb-2" />
      <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-astro-status-critical mb-1">
        {title}
      </h5>
      <p className="font-body text-xs text-astro-text-secondary max-w-md mb-3">{message}</p>
      {onRetry && (
        <SecondaryButton onClick={onRetry} size="sm">
          RETRY LINK
        </SecondaryButton>
      )}
    </div>
  );
};

interface NotificationProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ type, title, message, onClose }) => {
  const config = {
    info: {
      icon: Info,
      color: 'text-astro-text-primary border-astro-border-hairline bg-white',
      iconColor: 'text-astro-text-secondary',
    },
    success: {
      icon: CheckCircle2,
      color: 'text-astro-status-healthy border-astro-status-healthy/30 bg-astro-status-healthy/5',
      iconColor: 'text-astro-status-healthy',
    },
    warning: {
      icon: AlertCircle,
      color: 'text-astro-status-caution border-astro-status-caution/30 bg-astro-status-caution/5',
      iconColor: 'text-astro-status-caution',
    },
    error: {
      icon: AlertTriangle,
      color: 'text-astro-status-critical border-astro-status-critical/30 bg-astro-status-critical/5',
      iconColor: 'text-astro-status-critical',
    },
  }[type];

  const Icon = config.icon;

  return (
    <div
      className={`flex items-start justify-between p-3 border rounded-sm shadow-subtle ${config.color}`}
    >
      <div className="flex items-start space-x-2.5">
        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.iconColor}`} />
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wider">{title}</p>
          {message && <p className="font-body text-xs text-astro-text-secondary mt-0.5">{message}</p>}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-astro-text-tertiary hover:text-astro-text-primary ml-2"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'CONFIRM ACTION',
  cancelLabel = 'CANCEL',
  isDangerous = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-astro-text-primary/40 backdrop-blur-[1px]">
      <div className="bg-white border border-astro-border-hairline rounded-sm max-w-md w-full p-5 shadow-dropdown animate-in fade-in zoom-in-95 duration-150">
        <h4 className="font-display text-sm font-bold text-astro-text-primary mb-2">{title}</h4>
        <p className="font-body text-xs text-astro-text-secondary mb-6">{message}</p>
        <div className="flex items-center justify-end space-x-2">
          <SecondaryButton onClick={onCancel} size="sm">
            {cancelLabel}
          </SecondaryButton>
          <PrimaryButton
            onClick={onConfirm}
            size="sm"
            variant={isDangerous ? 'danger' : 'primary'}
          >
            {confirmLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
