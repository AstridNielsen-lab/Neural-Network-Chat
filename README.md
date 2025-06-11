# Neural Network Chat

Uma interface de chat interativa que simula uma rede neural composta por múltiplas inteligências artificiais trabalhando em colaboração. O projeto integra a API Gemini 1.5 Flash para gerar respostas inteligentes.

## 🚀 Características

- **Interface Cyberpunk**: Design futurista com estilo terminal e cores neon
- **Rede Neural Simulada**: 5 módulos de IA que processam em sequência
- **Chat Interativo**: Comunicação em tempo real com a IA Central
- **Logs em Tempo Real**: Visualização da atividade dos módulos neurais
- **Integração Gemini**: Respostas geradas pela API Gemini 1.5 Flash
- **Animações Suaves**: Efeitos de digitação e transições fluidas
- **Responsivo**: Funciona em desktop e dispositivos móveis

## 🧠 Módulos da Rede Neural

1. **IA_Linguagem** - Análise linguística e processamento semântico
2. **IA_Lógica** - Raciocínio lógico e inferência
3. **IA_Memória** - Gerenciamento de contexto e histórico
4. **IA_Contexto** - Análise situacional e contextual
5. **IA_Processamento** - Síntese final e geração de resposta

## 📁 Estrutura do Projeto

```
neural-network-chat/
├── index.html          # Estrutura HTML principal
├── styles.css          # Estilos CSS cyberpunk
├── script.js           # Lógica JavaScript e integração API
└── README.md           # Este arquivo
```

## 🛠️ Como Usar

### Método 1: Executar Localmente

1. Faça o download ou clone todos os arquivos
2. Abra o arquivo `index.html` diretamente no seu navegador
3. A aplicação carregará automaticamente

### Método 2: Servidor Local (Recomendado)

Para evitar problemas de CORS com a API, recomenda-se usar um servidor local:

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (se tiver http-server instalado)
npx http-server .

# Com PHP
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

## ⚙️ Configuração da API

O projeto já vem configurado com uma chave API do Gemini. Se necessário, você pode alterar as configurações no arquivo `script.js`:

```javascript
const CONFIG = {
    API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
    API_KEY: "SUA_CHAVE_API_AQUI",
    TYPING_SPEED: 50,
    LOG_DELAY: 300
};
```

## 🎮 Funcionalidades

### Chat Principal
- Digite mensagens para a IA Central
- Pressione Enter para enviar
- Shift+Enter para nova linha
- Respostas com animação de digitação

### Painel de Logs
- Visualização em tempo real da atividade neural
- Status dos módulos (ativo/processando)
- Controles para pausar/limpar logs
- Logs automáticos do sistema

### Módulos Neurais
- Indicadores visuais de status
- Animações durante processamento
- Mensagens específicas por módulo
- Processamento sequencial simulado

## 🎨 Personalização

### Cores e Tema
As cores podem ser alteradas no arquivo `styles.css` através das variáveis CSS:

```css
:root {
    --neon-green: #00ff41;
    --neon-blue: #00d4ff;
    --neon-purple: #bf00ff;
    --neon-yellow: #ffff00;
    /* ... outras cores */
}
```

### Módulos Neurais
Novos módulos podem ser adicionados no arquivo `script.js`:

```javascript
const NEURAL_MODULES = [
    {
        name: "IA_NovoModulo",
        id: "novomodulo",
        messages: [
            "Processando nova funcionalidade...",
            "Executando algoritmo específico..."
        ]
    }
    // ... outros módulos
];
```

## 🔧 Solução de Problemas

### Erro de CORS
Se encontrar erros de CORS, use um servidor local conforme indicado acima.

### API não responde
Verifique:
1. Conexão com internet
2. Chave API válida
3. Limites de uso da API não excedidos

### Interface não carrega
Verifique:
1. Todos os arquivos estão no mesmo diretório
2. JavaScript está habilitado no navegador
3. Console do navegador para erros específicos

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões recentes)
- **Dispositivos**: Desktop, tablet, mobile
- **Resolução**: Responsivo para todas as telas

## 🚀 Possíveis Melhorias

- [ ] Salvamento de conversas
- [ ] Temas personalizáveis
- [ ] Comandos especiais
- [ ] Exportação de logs
- [ ] Múltiplos perfis de IA
- [ ] Integração com outras APIs
- [ ] Mode de voz
- [ ] Análise de sentimentos

## 📄 Licença

Este projeto está disponível para uso pessoal e educacional. Para uso comercial, entre em contato.

## 🤖 Sobre

Criado como uma demonstração de interface neural interativa, combinando design futurista com funcionalidade prática. O projeto simula o funcionamento de uma rede neural distribuída onde diferentes módulos de IA colaboram para processar e responder às mensagens do usuário.

---

**Desenvolvido com ❤️ usando HTML, CSS e JavaScript puro + API Gemini**

