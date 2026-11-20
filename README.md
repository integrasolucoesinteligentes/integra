# Site INTEGRA (Astro, estatico)

Sem backend e sem custo. Contato = botao WhatsApp + mailto.

## Rodar
    npm install
    npm run dev        # http://localhost:4321
    npm run build      # gera dist/
    npm run preview

## Editar conteudo (sem mexer no layout)
Todos os textos estao em `src/content/content.pt-BR.json`.
- Blocos com `"_status": "RASCUNHO"` sao copy provisoria; troque pelo posicionamento oficial mantendo as mesmas chaves.
- Contato (WhatsApp, e-mail, Instagram, LinkedIn) fica em `contact`. `linkedinCompany` e `linkedinFounder` estao vazios: ao preencher com a URL, os links aparecem no rodape e em "Sobre".
- Pilares, etapas, sinais e diferenciais sao listas: adicione ou remova itens no JSON.
- Nao ha secao de logos, cases, depoimentos ou numeros, de proposito. Nao adicionar sem autorizacao escrita (Brognoli ou qualquer cliente).
- Pagina de privacidade: bloco `privacy` (texto provisorio; revisar juridicamente).

## Marca
`src/styles/tokens.css` (tokens v1.0), `src/styles/global.css` (estilos), `DESIGN.md` (decisoes). Imagens e fontes em `public/`.

## SEO
Title/description/OG em `site` no JSON; JSON-LD Organization em `src/layouts/Base.astro`; `sitemap.xml` e `robots.txt` sao gerados no build a partir do dominio.
- `SITE_URL` (opcional) muda o dominio usado em canonical/OG/sitemap. Padrao: https://integrasolucoesinteligentes.com
- `PUBLIC_NOINDEX=1` no build gera `noindex` e robots bloqueando tudo (use em previas).

## Deploy (Vercel)
Previa: importe a pasta/zip como projeto Vercel NOVO (framework Astro, build `npm run build`, saida `dist`). Use `PUBLIC_NOINDEX=1` nas variaveis de ambiente da previa.
Producao (so quando aprovado): adicionar o dominio integrasolucoesinteligentes.com ao projeto novo e ajustar DNS. NAO faca isso antes de a copy oficial e as pendencias abaixo estarem resolvidas.

## Checklist antes de ir ao ar
- [ ] Copy oficial no JSON (hoje RASCUNHO)
- [ ] Confirmar cargo/sobrenome da Tais e fotos reais (se houver)
- [ ] URLs de LinkedIn; CNPJ no rodape (opcional)
- [ ] Revisao juridica da pagina de privacidade
- [ ] Confirmar HEX oficiais da marca
- [ ] Remover PUBLIC_NOINDEX; apontar dominio; testar OG (WhatsApp/LinkedIn)
- [ ] Redirecionar URLs antigas, se existirem, para evitar 404
