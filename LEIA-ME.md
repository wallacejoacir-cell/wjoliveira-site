# Site wjoliveira.com.br (sem WordPress)

Site em HTML puro. Não precisa de banco de dados, PHP nem plugins.

- `index.html`: página inicial (com o formulário de agendamento em #agendar)
- `direito-desportivo/`: página de Direito Desportivo (mesmo endereço do site antigo)
- `privacidade/`: política de privacidade
- `style.css`: todo o visual
- `main.js`: número do WhatsApp e chave do formulário
- `_redirects`: leva os endereços antigos (/contato, /blog...) para os novos (Cloudflare Pages)
- `img/`: imagens já otimizadas

## Formulário
Enquanto `WEB3FORMS_KEY` em `main.js` estiver vazio, o formulário abre o WhatsApp com a mensagem pronta.
Para receber por e-mail: crie uma chave grátis em https://web3forms.com com wallacejoacir@adv.oabrj.org.br e cole em `main.js`.

## Publicar (grátis)
Cloudflare Pages: crie um projeto, envie esta pasta inteira ("Upload assets"), depois adicione o domínio wjoliveira.com.br.
