import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    login,
    register,
    validateEmail,
    validatePassword,
    validateName,
    splitFullName,
} from "@/services/auth";
import type { AxiosError } from "axios";

// ============================================
// Types
// ============================================

export interface LoginFormState {
    email: string;
    password: string;
}

export interface SignupFormState {
    name: string;
    email: string;
    password: string;
}

export interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
}

// ============================================
// Constants
// ============================================

const LOGIN_PASSWORD_MIN = 6;
const SIGNUP_PASSWORD_MIN = 8;

const MESSAGES = {
    loginSuccess: "Giriş başarılı!",
    loginError: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
    signupSuccess: "Hesap oluşturuldu!",
    signupError: "Kayıt başarısız. Lütfen tekrar deneyin.",
    githubSoon: "GitHub login coming soon!",
    resetSoon: "Password reset coming soon!",
} as const;

// ============================================
// Error Handling
// ============================================

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || defaultMessage;
};

// ============================================
// Login Hook
// ============================================

export const useLoginForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validate = useCallback((): boolean => {
        const newErrors: FormErrors = {};
        const emailError = validateEmail(form.email);
        const passwordError = validatePassword(form.password, LOGIN_PASSWORD_MIN);

        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await login({ email: form.email, password: form.password });
            toast.success(MESSAGES.loginSuccess);
            navigate("/");
        } catch (error) {
            toast.error(getErrorMessage(error, MESSAGES.loginError));
        } finally {
            setIsLoading(false);
        }
    }, [form, validate, navigate]);

    const updateField = useCallback(<K extends keyof LoginFormState>(
        field: K,
        value: LoginFormState[K]
    ) => {
        setForm((f) => ({ ...f, [field]: value }));
    }, []);

    const togglePassword = useCallback(() => {
        setShowPassword((p) => !p);
    }, []);

    const handleGithubLogin = useCallback(() => {
        toast.info(MESSAGES.githubSoon);
    }, []);

    const handleForgotPassword = useCallback(() => {
        toast.info(MESSAGES.resetSoon);
    }, []);

    return {
        form,
        errors,
        isLoading,
        showPassword,
        updateField,
        togglePassword,
        handleSubmit,
        handleGithubLogin,
        handleForgotPassword,
    };
};

// ============================================
// Signup Hook
// ============================================

export const useSignupForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<SignupFormState>({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validate = useCallback((): boolean => {
        const newErrors: FormErrors = {};
        const nameError = validateName(form.name);
        const emailError = validateEmail(form.email);
        const passwordError = validatePassword(form.password, SIGNUP_PASSWORD_MIN);

        if (nameError) newErrors.name = nameError;
        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            const { firstName, lastName } = splitFullName(form.name);
            await register({ email: form.email, password: form.password, firstName, lastName });
            toast.success(MESSAGES.signupSuccess);
            navigate("/");
        } catch (error) {
            toast.error(getErrorMessage(error, MESSAGES.signupError));
        } finally {
            setIsLoading(false);
        }
    }, [form, validate, navigate]);

    const updateField = useCallback(<K extends keyof SignupFormState>(
        field: K,
        value: SignupFormState[K]
    ) => {
        setForm((f) => ({ ...f, [field]: value }));
    }, []);

    const togglePassword = useCallback(() => {
        setShowPassword((p) => !p);
    }, []);

    return {
        form,
        errors,
        isLoading,
        showPassword,
        updateField,
        togglePassword,
        handleSubmit,
    };
};
