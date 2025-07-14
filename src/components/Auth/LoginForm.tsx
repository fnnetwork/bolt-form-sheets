import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GAME_INFO } from '../../data/stadiumData';

interface LoginFormProps {
  email: string;
  onBack: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ email, onBack }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const { login, resetPassword } = useAuth();

  // Calculate days until game
  const now = new Date();
  const timeUntilGame = GAME_INFO.date.getTime() - now.getTime();
  const daysUntilGame = Math.max(0, Math.ceil(timeUntilGame / (1000 * 60 * 60 * 24)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (!success) {
        setError('E-mail não encontrado ou senha incorreta');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setResetMessage('');
    setIsLoading(true);

    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setResetMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        setShowForgotPassword(false);
      } else {
        setError(result.error || 'Erro ao enviar e-mail de recuperação');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Erro ao enviar e-mail de recuperação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#de2828' }}>
        <div className="max-w-md w-full">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <img 
                src="/SemTag_08.png" 
                alt="Zona Neutra" 
                className="w-40 h-24 mx-auto object-contain"
              />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">A+BDB no SP Game!</h1>
            <p className="text-red-100 mb-4">Faltam {daysUntilGame} dias para nosso encontro!</p>
            <div className="text-red-200 text-sm">
              Chargers vs Chiefs • 05/09/2025 • Neo Química Arena
            </div>
          </div>

          {/* Forgot Password Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Esqueceu sua senha?
              </h2>
              <p className="text-gray-600 mb-2">
                E-mail: <span className="font-semibold" style={{ color: '#de2828' }}>{email}</span>
              </p>
              <p className="text-sm text-gray-500">
                Enviaremos um link de recuperação para seu e-mail
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {resetMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-600 text-sm">{resetMessage}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </button>
              
              <button
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="flex-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: '#de2828'
                }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#c41e1e')}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#de2828')}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar E-mail
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#de2828' }}>
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <img 
              src="/SemTag_08.png" 
              alt="Zona Neutra" 
              className="w-40 h-24 mx-auto object-contain"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">A+BDB no SP Game!</h1>
          <p className="text-red-100 mb-4">Faltam {daysUntilGame} dias para nosso encontro!</p>
          <div className="text-red-200 text-sm">
            Chargers vs Chiefs • 05/09/2025 • Neo Química Arena
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta!
            </h2>
            <p className="text-gray-600 mb-2">
              E-mail: <span className="font-semibold" style={{ color: '#de2828' }}>{email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Digite sua senha para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{ focusRingColor: '#de2828' }}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {resetMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-600 text-sm">{resetMessage}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </button>
              
              <button
                type="submit"
                disabled={isLoading || !password}
                className="flex-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: '#de2828'
                }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#c41e1e')}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#de2828')}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm hover:underline transition-colors duration-200"
                style={{ color: '#de2828' }}
                disabled={isLoading}
              >
                Esqueceu sua senha?
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              🔐 Sistema seguro com recuperação de senha por e-mail
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;