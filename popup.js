document.getElementById('file-upload').addEventListener('change', async function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = async function(event) {
    const data = new Uint8Array(event.target.result);

    try {
      const informacoes = await getInfoAtendimento();
      await parseExcel(data, informacoes);
    } catch (error) {
      console.error("Erro ao processar o arquivo Excel:", error);
    }
  };

  reader.readAsArrayBuffer(file);
});

async function parseExcel(data, informacoes) {
  // Lendo o arquivo Excel com a formatação
  const workbook = XLSX.read(data, { type: 'array', cellStyles: true, raw: true,bookVBA: true, cellFormula: true, cellNF: true });
  const firstSheet = workbook.Sheets[workbook.SheetNames[2]];

  
  let rowCount = 0;
  let rowIndex = 9; 
  let celulaAtual;

  while (true) {
    const cell = firstSheet['A' + rowIndex];
    if (!cell || !cell.v) {
      break; 
    }
    rowCount++;
    rowIndex++;
  }

 
  XLSX.utils.sheet_add_aoa(firstSheet, [[informacoes.data]], { origin: 'A'+rowIndex });
  XLSX.utils.sheet_add_aoa(firstSheet, [[informacoes.nome]], { origin: 'D'+rowIndex });
  XLSX.utils.sheet_add_aoa(firstSheet, [[informacoes.cpf]], { origin: 'G'+rowIndex });
  XLSX.utils.sheet_add_aoa(firstSheet, [[informacoes.modalidade]], { origin: 'K'+rowIndex });



  const newData = XLSX.write(workbook, { bookType: 'xlsx',type: 'array', cellStyles: true, raw: true,bookVBA: true, cellFormula: true, cellNF: true });
  const blob = new Blob([newData], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "Controle Atualizado 2024.xlsx";
  a.click();
  URL.revokeObjectURL(url);
}

async function getInfoAtendimento(){
  try {
    let infoAtendimento = {
      modalidade: '',
      data: '',
      nome: '',
      cpf: ''
    };

    console.log("Botão salvar clicado");

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      const activeTab = tabs[0];
      const tabInfo = {
        id: activeTab.id,
        url: activeTab.url,
      };

      console.log("Aba ativa:", tabInfo);
      if (tabInfo.url !== "") {
        if (tabInfo.url.includes("https://www.cadastrounico.caixa.gov.br/cadun/abrirAplicacao.do#")) {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tabInfo.id },
            func: () => {
              try {
                const modalidade = document.querySelectorAll('dd')[1].textContent;
                const data = document.querySelectorAll('dd')[4].textContent;
                const nome = document.querySelector('tbody').childNodes[1].innerText;
                const cpf = document.querySelector('tbody').childNodes[3].innerText;

                return { modalidade, data, nome, cpf };
              } catch (error) {
                console.error(error);
                return null;
              }
            },
          });

          if (results && results[0]) {
            const info = results[0].result;
            if (info) {
              Object.assign(infoAtendimento, info);
              console.log("Informações do atendimento:", infoAtendimento);
              alert("Agora faça o upload do arquivo Excel para salvar as informações.");
            } else {
              console.error("Erro ao executar script na página.");
            }
          }
        } else {
          console.error("A URL da aba ativa não contém 'ComprovanteCadastro'.");
        }
      } else {
        alert('Nenhum PDF encontrado na página.');
      }
    } else {
      console.error("Nenhuma guia ativa encontrada.");
    }

    return infoAtendimento;
  } catch (error) {
    console.error("Erro ao obter informações de atendimento:", error);
    throw error;
  }
}
