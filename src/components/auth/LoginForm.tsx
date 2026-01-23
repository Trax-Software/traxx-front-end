'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, LoginFormData } from '@/lib/validators/loginSchema';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async ({ email, password }: LoginFormData) => {
        await login(email, password);
    };

    return (
        <div className="w-full max-w-lg mx-auto text-center">
            <div className="flex justify-center">
                {/*<Image*/}
                {/*    src={logoForm}*/}
                {/*    alt="Logo Traxx"*/}
                {/*    width={300}*/}
                {/*    height={300}*/}
                {/*    priority*/}
                {/*/>*/}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4">
                Flow+
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <input
                        type="email"
                        placeholder="E-mail"
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.email
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-[var(--color-primary)]/50'
                        }`}
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Senha"
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.password
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-[var(--color-primary)]/50'
                        }`}
                        {...register('password')}
                        disabled={isSubmitting}
                    />
                    <div className="text-right mt-2">
                        <Link
                            href="/esqueceu-sua-senha"
                            className="text-sm font-semibold text-gray-500 hover:text-[var(--color-primary)]"
                        >
                            Esqueceu sua senha?
                        </Link>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-lg !py-4 !rounded-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? 'Entrando…' : 'ENTRAR'}
                </Button>
            </form>
        </div>
    );
}
