# 💕 Camila, Você Quer Sair Comigo?

Um site responsivo e interativo para fazer um convite especial! 🎉

## ✨ Features

- ✅ Página inicial com pergunta e dois botões (SIM/NÃO)
- ✅ Botão "NÃO" que muda de tamanho e posição quando tenta clicar
- ✅ Modal para selecionar entre 3 restaurantes
- ✅ Calendário com horários disponíveis (19h-22h) para próximos 7 dias
- ✅ Envio automático de email com os detalhes do encontro
- ✅ Animação com a imagem polo.png após confirmar
- ✅ Design responsivo (mobile, tablet, desktop)
- ✅ Animações suaves e agradáveis

### Sem Backend (Versão Simplificada)
1. Abra o arquivo `index.html` diretamente no navegador
2. Clique em "SIM" para começar
3. Selecione um restaurante
4. Escolha a data e hora
5. Veja a animação especial!

⚠️ **Nota:** Nesta versão, os dados não serão enviados por email.

### Com Backend (Versão Completa com Email)

#### Pré-requisitos
- Node.js instalado
- Uma conta Google com "Senha de App" configurada

#### Instalação

1. **Instale as dependências:**
```bash
npm install
```

2. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto (copie de `.env.example`):

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione:
```
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-app-google
RECIPIENT_EMAIL=regisscamargo@hotmail.com
PORT=3000
```

#### Como Obter Senha de App do Gmail

1. Acesse: https://myaccount.google.com/security
2. Ative a verificação em duas etapas
3. Vá para "Senhas de aplicativo"
4. Selecione "Mail" e "Windows Computer"
5. Copie a senha gerada (16 caracteres)
6. Cole em `EMAIL_PASSWORD` no arquivo `.env`

#### Executar o Servidor

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Ou modo produção
npm start
```

O servidor rodará em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
camila-convite/
├── index.html          # Estrutura HTML com EmailJS
├── style.css           # Estilos responsivos
├── script.js           # Lógica interativa + EmailJS
├── README.md           # Esta documentação
└── img/
    └── polo.png        # Imagem especial
```

## 🎨 Personalizações

### Alterar Pergunta
Edite em `index.html`:
```html
<h1 class="title">Camila, você quer sair comigo?</h1>
```

### Alterar Restaurantes
Edite em `index.html` a seção `.restaurants-grid`

### Alterar Cores
Edite em `style.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Alterar Horários
Edite em `script.js` na função `generateCalendar()`:
```javascript
for (let hour = 19; hour <= 22; hour++) {
```

### Alterar Imagem
Substitua `img/polo.png` por sua imagem (mantenha o mesmo nome)

## ✉️ Troubleshooting

**Email não está sendo enviado:**
- Verifique se a Public Key está correta
- Verifique se o Service ID está correto
- Verifique se o Template ID está correto
- Abra o console (F12) para ver a mensagem de erro

**Erro de CORS:**
- EmailJS funciona diretamente do navegador, não deve ter erro de CORS
- Se tiver, verifique sua Public Key no EmailJS

**Vercel não funciona:**
- Certifique-se de que o `script.js` tem as configurações do EmailJS
- Qualquer arquivo estático (.html, .css, .js) funciona na Vercel sem problemas

## 📱 Compatibilidade

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iPhone, Android phones)
- ✅ Vercel (qualquer navegador com suporte a JavaScript)

## 💡 Dicas

- Teste o email primeiro antes de enviar o link para Camila
- A Public Key é pública, não há problema em compartilhá-la no código
- EmailJS tem limite de 200 emails/mês na versão gratuita (mais que suficiente!)

## 🎁 Bom sorte!

Boa sorte com seu convite! 💕✨

---

**Feito com ❤️ para Camila** 🎉
