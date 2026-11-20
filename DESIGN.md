# DESIGN.md — INTEGRA (site) v1.0

Fonte de verdade: kit de marca v1.0 (tokens.css em src/styles/tokens.css). Nota: o arquivo claude/DESIGN-integra-marca.md do Projeto nao estava acessivel nesta sessao; este documento foi derivado do tokens.css e do kit. Comparacao com sites reais via UXKIN nao foi feita (conector nao disponivel); direcao baseada na marca existente.

## Direcao
Escuro, sobrio e tecnico: fundo marinho, acento azul, tipografia leve (Outfit 300) com a palavra-chave em 600 + azul. Arco luminoso (hero-bg) como elemento de assinatura. Secoes de leitura em claro para ritmo.

## Cores (papel)
- --integra-bg #060D1A: fundo base / hero
- --integra-bg-2 #0B1628: secoes escuras alternadas, cards
- --integra-bg-3 #101E36: cards sobre bg-2
- --integra-blue #4DA3FF: acento, destaques, icones, links em fundo escuro
- --integra-blue-ink #1565D8: botao primario (texto branco ~5,6:1) e azul em fundo claro
- --integra-blue-deep #1E7BFF: apenas hover (branco sobre ele ~3,9:1, nao usar como fundo de texto pequeno)
- --integra-text #F4F7FB / --integra-text-mute #8FA0B8: texto em escuro
- --integra-light-bg #F4F7FB / light-text #0B1628 / light-mute #4A5B75: secoes claras

## Tipografia
Outfit self-hosted (300, 400, 600). Display clamp(2.5rem,5.2vw,4.75rem) no hero; H2 var(--fs-h2); corpo 1.0625rem/1.6; eyebrow 0.8125rem caixa alta, tracking .3em, azul.

## Espaco, forma
Base 8px; container 1180px; secoes com padding vertical clamp(72px,10vw,128px). Raios 8/12/20.

## Componentes
Botao primario (azul-ink, hover blue-deep + glow), botao ghost (borda azul 55%), card (bg-2/3 + borda 10%), foco visivel (anel branco + halo azul).

## Decisao do Uriel
Cores sao estimadas a partir de imagem (LEIA-ME do kit): confirmar HEX oficiais.
