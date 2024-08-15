// Função para injetar o script se a URL corresponder ao padrão
function injectScript(details) {
  if (details.url.includes("cadun/abrirAplicacao")) {
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["content.js"]
      });
    }, 1000); // Aguardar 1000ms (1 segundo) antes de injetar o script
  }
}

// Adicionar ouvintes para quando a navegação é concluída
chrome.webNavigation.onCompleted.addListener(injectScript, {url: [{urlMatches: 'https://www.cadastrounico.caixa.gov.br/'}]});

// Adicionar ouvintes para quando o fragmento de referência é atualizado
chrome.webNavigation.onReferenceFragmentUpdated.addListener(injectScript, {url: [{urlMatches: 'https://www.cadastrounico.caixa.gov.br/'}]});
