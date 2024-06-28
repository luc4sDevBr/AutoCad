document.addEventListener("DOMContentLoaded", function () {
  const caixa = document.getElementById("caixadetexto");
  const submitbutton = document.getElementById("salvar");

  submitbutton.addEventListener("click", async function() {
    try {
      // Log para garantir que o evento de clique está sendo registrado
      console.log("Botão salvar clicado");

      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        const tabInfo = {
          id: activeTab.id,
          url: activeTab.url,
        };

        // Log da URL da aba ativa
        console.log("Aba ativa:", tabInfo);

        if (tabInfo.url.includes("ComprovanteCadastro")) {
          await chrome.scripting.executeScript({
            target: { tabId: tabInfo.id },
            function: async function () {
              console.log("Script executado na aba ativa");
            },
          });
        } else {
          caixa.value += " | A URL da aba ativa não contém 'ComprovanteCadastro'.";
        }
      } else {
        caixa.value += " | Nenhuma guia ativa encontrada.";
      }
    } catch (error) {
      console.error(error);
    }
  });
});
