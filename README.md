# A+BDB no SP Game - Plataforma de Mapeamento

Uma plataforma para conectar fãs da Audiência Mais Bonita do Brasil (A+BDB) que estarão no jogo da NFL em São Paulo.

## Configuração

### Google Sheets API

Este projeto usa Google Sheets como banco de dados. Para configurar:

1. **Criar uma planilha no Google Sheets**:
   - Crie uma nova planilha no Google Sheets
   - Configure as colunas na primeira linha (cabeçalho):
     - A: ID
     - B: Nome
     - C: Email
     - D: WhatsApp
     - E: Setor
     - F: Bio
     - G: Avatar
     - H: IsAdmin
     - I: CreatedAt
     - J: UpdatedAt

2. **Configurar Google Sheets API**:
   - Vá para o [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um novo projeto ou selecione um existente
   - Ative a Google Sheets API
   - Crie credenciais (API Key)
   - Torne a planilha pública para leitura ou configure as permissões adequadas

3. **Configurar variáveis de ambiente**:
   - Copie o arquivo `.env.example` para `.env`
   - Preencha as variáveis:
     ```
     VITE_GOOGLE_SHEETS_API_KEY=sua_api_key_aqui
     VITE_GOOGLE_SHEETS_SPREADSHEET_ID=id_da_sua_planilha
     VITE_GOOGLE_SHEETS_RANGE=Sheet1!A:J
     ```

4. **Obter o ID da planilha**:
   - O ID está na URL da planilha: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Funcionalidades

- ✅ Autenticação com email/senha
- ✅ Cadastro de usuários
- ✅ Mapeamento de setores do estádio
- ✅ Visualização de fãs por setor
- ✅ Interface responsiva
- ✅ Integração com Google Sheets

## Tecnologias

- React + TypeScript
- Tailwind CSS
- Google Sheets API
- Vite

## Estrutura do Projeto

- `src/lib/googleSheets.ts` - Cliente da API do Google Sheets
- `src/lib/auth.ts` - Sistema de autenticação
- `src/context/AuthContext.tsx` - Contexto de autenticação
- `src/hooks/useUsers.ts` - Hook para gerenciar usuários
- `src/components/` - Componentes React
- `src/data/stadiumData.ts` - Dados dos setores do estádio