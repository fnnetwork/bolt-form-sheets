import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { GAME_INFO } from '../../data/stadiumData';
import { supabase } from '../../lib/supabase';

interface EmailFormProps {
  onEmailSubmit: (email: string, isExistingUser: boolean) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate days until game
  const now = new Date();
  const timeUntilGame = GAME_INFO.date.getTime() - now.getTime();
  const daysUntilGame = Math.max(0, Math.ceil(timeUntilGame / (1000 * 60 * 60 * 24)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const cleanEmail = email.toLowerCase().trim();
      
      // Simple check: just look in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', cleanEmail)
        .maybeSingle();

      const userExists = !!existingUser;
      
      setTimeout(() => {
        onEmailSubmit(cleanEmail, userExists);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error checking user:', error);
      // If there's an error, assume user doesn't exist to allow registration
      setTimeout(() => {
        onEmailSubmit(email.toLowerCase().trim(), false);
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#de2828' }}>
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          {/* Logo sem fundo - direto na tela */}
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

        {/* Email Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Vamos nos encontrar em São Paulo!
            </h2>
            <p className="text-gray-600">
              Digite seu e-mail para começar e ficar sabendo quem estará no mesmo setor que você dentro da NQA!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{ focusRingColor: '#de2828' }}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg flex items-center justify-center"
              style={{ 
                backgroundColor: '#de2828',
                ':hover': { backgroundColor: '#c41e1e' }
              }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#c41e1e')}
              onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#de2828')}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              💡 Sistema simples: sem verificação de e-mail! Se você já se cadastrou, pediremos sua senha. Se não, criaremos um novo cadastro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailForm;