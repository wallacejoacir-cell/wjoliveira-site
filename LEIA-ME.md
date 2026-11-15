# Site wjoliveira.com.br (sem WordPress)

Site em HTML puro, publicado no Cloudflare (Worker "empty-fire-2082").

- `public/`: o site em si (páginas, imagens, `style.css`, `main.js`)
- `public/main.js`: número do WhatsApp e chave do formulário (Web3Forms)
- `public/_redirects`: leva os endereços antigos (/contato, /blog...) para os novos
- `wrangler.jsonc`: diz ao Cloudflare para publicar a pasta `public/`

## Como atualizar
Qualquer alteração enviada (push) para a branch `main` é publicada automaticamente pelo Cloudflare em 1 a 2 minutos.
