# evas

**Salvar é só o começo.** Uma extensão para reencontrar, organizar e conectar seus bookmarks.

O nome é **save ao contrário**. A biblioteca combina uma grid visual com um grafo de relações por tema e domínio. Importação → deduplicação → triagem → biblioteca.

## Instalar no Chrome ou Edge

1. Baixe este repositório pelo botão **Code → Download ZIP** e extraia o arquivo.
2. Abra `chrome://extensions` ou `edge://extensions`.
3. Ative **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação** e escolha a pasta que contém `manifest.json`.
5. Clique no ícone do Evas na barra de extensões para abrir sua biblioteca.

Não é necessário compilar nem instalar dependências para usar a extensão. Esta versão ainda não está nas lojas de extensões. Foco inicial: navegadores Chromium; Firefox não foi validado.

## Como usar

- **Importar favoritos:** arquivo HTML exportado pelo navegador, JSON do Evas ou leitura direta dos favoritos após conceder a permissão opcional.
- **Em triagem:** revise os temas sugeridos, selecione links e adicione à biblioteca ou arquive.
- **Editar (···):** ajuste título, URL, temas separados por vírgula e anotações.
- **Explorar:** busca por texto, tema, domínio, pasta de origem e notas; filtros por tema e ordenação.
- **Grid / grafo:** nós se conectam por temas iguais ou pelo mesmo domínio. Clique em um nó para editar e passe sobre a linha para ver a relação.
- **Exportar biblioteca:** backup JSON com biblioteca, triagem, arquivo, temas e notas. Reimportar um backup Evas preserva os estados; links já presentes são mantidos sem sobrescrita.

O filtro automático é uma heurística local de palavras-chave, sem IA externa: sugere temas e recusa URLs inválidas ou protocolos diferentes de HTTP/HTTPS. Duplicatas são removidas somente na entrada do Evas, nunca nos favoritos originais. Parâmetros `utm_*`, `fbclid` e `gclid` são ignorados; fragmentos, protocolo e demais parâmetros são preservados para evitar mesclar páginas diferentes. Nenhum link válido é aprovado automaticamente.

## Privacidade

Sem conta, servidor, telemetria, fontes remotas ou requisições de metadados. Dados ficam em `chrome.storage.local` na extensão; a prévia usa `localStorage` e tem armazenamento separado. Abrir um favorito navega para o site escolhido. A permissão `bookmarks` é opcional e solicitada apenas na importação direta. O Evas não modifica favoritos do navegador. Remover a extensão pode apagar os dados: exporte um backup antes.

As capas dos cards são composições locais, não capturas dos sites. O grafo exibe até 80 resultados por vez; use busca e filtros para explorar coleções maiores. Arquivos importados têm limite de 10 MB. Sem sincronização, crawling, detecção de links mortos ou relações manuais nesta versão.

## Desenvolvimento

Node.js 22 ou superior.

```sh
npm ci
npm run dev
npm run check
npm run package
```

Prévia em `http://127.0.0.1:4173`. `npm run package` copia os arquivos instaláveis para `dist/evas`. Na prévia, importe HTML/JSON ou adicione links; a API de favoritos só está disponível quando instalada como extensão.

JavaScript, HTML e CSS sem dependências de execução. Testes de regras de importação, segurança de URLs, restauração, estrutura HTML e relações do grafo executam com Node e jsdom.

## Identidade

Carvão `#191918`, off-white `#F6F3ED` e lilás `#CEC1DF`. Símbolo e direção visual fornecidos pelo criador do projeto. O repositório público não implica licença de uso da marca ou do código; uma licença poderá ser definida posteriormente.

## Referências técnicas

- [Chrome: permissões opcionais](https://developer.chrome.com/docs/extensions/reference/api/permissions)
- [Chrome: Bookmarks API](https://developer.chrome.com/docs/extensions/reference/api/bookmarks)

## Próximas possibilidades

Relações manuais, coleções por projeto, sugestões mais ricas e publicação nas lojas, conforme validação do uso real.
