import { toast } from 'sonner';

type ToastOptions = {
    duration?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    action?: {
        label: string;
        onClick: () => void;
    };
};

export function useToast() {
    const showToast = (message: string, options?: ToastOptions) => {
        return toast(message, options);
    };

    const showSuccess = (message: string, options?: ToastOptions) => {
        return toast.success(message, options);
    };

    const showError = (message: string, options?: ToastOptions) => {
        return toast.error(message, options);
    };

    const showWarning = (message: string, options?: ToastOptions) => {
        return toast.warning ? toast.warning(message, options) :
            toast(message, { ...options, className: 'bg-amber-100 border-amber-500 text-amber-800' });
    };

    const showInfo = (message: string, options?: ToastOptions) => {
        return toast.info ? toast.info(message, options) :
            toast(message, { ...options, className: 'bg-blue-100 border-blue-500 text-blue-800' });
    };

    const showLoading = (message: string, options?: ToastOptions) => {
        return toast.loading(message, options);
    };

    const dismiss = (toastId: string | number) => {
        toast.dismiss(toastId);
    };

    return {
        toast: showToast,
        success: showSuccess,
        error: showError,
        warning: showWarning,
        info: showInfo,
        loading: showLoading,
        dismiss
    };
}