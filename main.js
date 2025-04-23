import fs from "fs/promises"
import PromptSync from "prompt-sync"
const prompt = PromptSync()
const caminhoDoArquivo = "./tarefas.json"



async function lerTarefas() {

    try {
         //ler as tarefas dentro do arquivo tarefas.json
        const dadosLidos = await fs.readFile(caminhoDoArquivo, "utf-8")
        return JSON.parse(dadosLidos)
    } catch (error) {
        console.error(`Erro ao ler o arquivo! ${error.message}`)
        return undefined
    }
   
}

async function escreverNoArquivo(listaTarefas){

    const listaTarefasString = JSON.stringify(listaTarefas, null, 2)

    try {
        await fs.writeFile(caminhoDoArquivo, listaTarefasString, "utf-8")
        console.log("Arquivo Atualizado!")
    } catch (error) {
        console.error(`Erro ao escrever no arquivo! ${error.message}`)
    }

}

async function criarTarefas() {
    const titulo = prompt("Digite o título: ");
    const descricao = prompt("Digite a descrição: ");
    const tarefas = await lerTarefas();
    const novaTarefa = {
      id: tarefas.length + 1,
      titulo,
      descricao,
      concluida: false,
    };
    tarefas.push(novaTarefa);
    await escreverNoArquivo(tarefas);
  }
  
  async function mostrarTodasTarefas() {
    const todasTarefas = await lerTarefas();
    console.log(todasTarefas);
  }
  
  async function mostrarTarefasConcluidas() {
    const tarefasConluidas = await lerTarefas();
    const concluidas = tarefasConluidas.filter(
      (tarefa) => tarefa.concluida === true
    );
  
    console.log(concluidas);
  }
  async function tarefasNãoconcluidas() {
    const tarefas = await lerTarefas()
    const tarefasNãoconcluidas = tarefas.filter(t => t.concluida === false)

    if(tarefasNãoconcluidas.length > 0){
        console.log("Tarefas não concluidas")
        tarefasNãoconcluidas.forEach((item, index) => {
            console.log(`${index + 1}. Titulo: ${item.titulo}, Descrição: ${item.descricao}, Concluida:
                ${item.concluida}
                    
            `)
        })
    }
}

  async function concluirTarefa() {
    const tarefas = await lerTarefas()
    if (tarefas.length === 0) {
        console.log("Nenhuma tarefa encontrada.")
        return
    }

    console.log("\n Tarefas disponíveis:")
    tarefas.forEach(t => {
        console.log(`ID: ${t.id} | Título: ${t.titulo} | Concluída: ${t.concluida ? 'Sim' : 'Não'}`)
    })

    const concluirT = +prompt('Digite o ID da tarefa que deseja concluir: ')

    const tarefa = tarefas.find(t => t.id === concluirT)

    if (!tarefa) {
        console.log("Tarefa não encontrada.")
        return
    }

    tarefa.concluida = true
    await escreverNoArquivo(tarefas)
    console.log(`Tarefa ${tarefa.titulo} foi concluída com sucesso!`)
}

async function menu() {
    let opcao = ''

    do {
        console.log('\n=== MENU ===')
        console.log('1 - Criar uma nova tarefa')
        console.log('2 - Vizualizar todas as tarefas')
        console.log('3 - Visualizar apenas tarefas concluídas')
        console.log('4 - Visualizar apenas tarefas não concluídas')
        console.log('5 - Concluir uma tarefa')
        console.log('6 - Sair')

        opcao = prompt('Escolha a sua opção: ')
        switch (opcao) {
            case '1':
                await criarTarefas()
                break;
            case '2':
                await mostrarTodasTarefas() 
                break
            case '3':
                await mostrarTarefasConcluidas()
                break
            case '4':
                await tarefasNãoconcluidas()
                break
            case '5':
                await concluirTarefa()
                break 
            case '6':
                return            
            default:
                console.log('Opção invalida. Tente novamnete!')
        }
    } while (opcao !== '7')
}

await menu()  
















