import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowLeft, UserPlus, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GAME_INFO } from '../../data/stadiumData';

interface RegisterFormProps {
  email: string;
  onBack: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ email, onBack }) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  // Calculate days until game
  const now = new Date();
  const timeUntilGame = GAME_INFO.date.getTime() - now.getTime();
  const daysUntilGame = Math.max(0, Math.ceil(timeUntilGame / (1000 * 60 * 60 * 24)));

  const formatWhatsApp = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setWhatsapp(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!whatsapp.trim()) {
      setError('WhatsApp é obrigatório');
      return;
    }

    // Validate WhatsApp format (should have at least 10 digits)
    const whatsappDigits = whatsapp.replace(/\D/g, '');
    if (whatsappDigits.length < 10) {
      setError('WhatsApp deve ter pelo menos 10 dígitos');
      return;
    }

    console.log('🚀 Starting registration process...');
    console.log('📧 Email:', email);
    console.log('👤 Name:', name.trim());
    console.log('📱 WhatsApp:', whatsapp);
    console.log('🔐 Password length:', password.length);
    
    setIsLoading(true);
    
    try {
      console.log('📝 Calling register function...');
      const result = await register(name.trim(), email, whatsapp, password);
      
      console.log('📋 Registration result:', result);
      
      if (!result.success) {
        console.error('❌ Registration failed:', result.error);
        setError(result.error || 'Erro ao criar conta. Tente novamente.');
      } else {
        console.log('✅ Registration successful!');
      }
    } catch (error) {
      console.error('❌ Unexpected registration error:', error);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Vamos criar sua conta!
            </h2>
            <p className="text-gray-600 mb-2">
              E-mail: <span className="font-semibold" style={{ color: '#de2828' }}>{email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Complete os dados abaixo para se juntar à A+BDB
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome/Apelido *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{ focusRingColor: '#de2828' }}
                  placeholder="Como quer ser chamado?"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={handleWhatsAppChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{ focusRingColor: '#de2828' }}
                  placeholder="(11) 99999-9999"
                  required
                  disabled={isLoading}
                  maxLength={15}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Para contato e organização dos grupos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
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
                  minLength={6}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{ focusRingColor: '#de2828' }}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
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
                disabled={isLoading || !name.trim() || !whatsapp.trim() || !password || !confirmPassword}
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
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              🎉 Bem-vindo à Audiência Mais Bonita do Brasil!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;