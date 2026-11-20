# Artes de redes sociais da INTEGRA

Gera posts estáticos 1080x1350 na identidade v1.0 e salva em `public/social/` (servidos em
https://www.integrasolucoesinteligentes.com/social/<arquivo>.png após o deploy).

Uso: `cd tools/social && npm install && node generate.mjs posts/AAAA-MM-DD.json`

Layouts: `lista` (label, head[3], rows[3][num,titulo,apoio]), `gancho` (label, head[3], support[2], cta1, cta2),
`manifesto` (head[3], support[2]). Cada item tem `file` (nome sem .png). Linhas curtas: o script avisa se o texto passar da margem.
