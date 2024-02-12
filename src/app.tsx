// Importando a logo
import logo from './assets/logo-nlw-expert.svg'

// Importando o hook useState e o tipo ChangeEvent da biblioteca React
import { useState } from 'react'
import { ChangeEvent } from 'react'

// Importando os componentes NoteCard e NewNoteCard
import { NoteCard } from './components/note-card'
import { NewNoteCard } from './components/new-note-card'

// Definindo a interface Note para descrever a estrutura de uma nota
interface Note {
  id: string
  date: Date
  content: string
}

// Definindo o componente principal da aplicação
export function App() {
  // Definindo estados para a busca e as notas
  const [search, setSearch] = useState('')
  const [notes, setNote] = useState<Note[]>(() => {
    // Recuperando as notas do localStorage se estiverem disponíveis
    const notesOnStorage = localStorage.getItem('notes')

    // Se ouver nota, ele vai transforma as notas em um objeto javascript
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }

    return [] // Retornando um array vazio se não houver notas no localStorage
  })

  // Função chamada ao criar uma nova nota
  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(), // Gerando um ID único para a nova nota
      date: new Date(), // Capturando a data atual
      content, // Conteúdo da nota fornecido pelo usuário
    }

    const notesArray = [newNote, ...notes] // Adicionando a nova nota ao array de notas

    setNote(notesArray) // Atualizando o estado das notas

    localStorage.setItem('notes', JSON.stringify(notesArray)) // Salvando as notas atualizadas no localStorage
  }

  // Função chamada ao excluir uma nota
  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id // Filtrando as notas para remover a nota com o ID correspondente
    })

    setNote(notesArray) // Atualizando o estado das notas

    localStorage.setItem('notes', JSON.stringify(notesArray)) // Salvando as notas atualizadas no localStorage
  }

  // Função chamada ao digitar na barra de pesquisa
  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query) // Atualizando o estado da busca com o texto digitado
  }

  /**
   * toLocaleLowerCase() é usado para garantir que a comparação entre strings seja feita sem considerar maiúsculas ou minúsculas
   * includes() é usado para verificar se uma determinada string (neste caso, a search termo de busca) está contida no conteúdo da nota
   */
  // Filtrando as notas com base no texto de pesquisa
  const filteredNotes =
    search !== ''
      ? notes.filter(note =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes

  // Retornando a estrutura da aplicação
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW Expert" /> {/* Exibindo o logo da aplicação */}
      {/* Formulário para busca de notas */}
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>
      {/* Linha horizontal de separação */}
      <div className="h-px bg-slate-700" />
      {/* Grade de notas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        {/* Componente para criar novas notas */}
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {/* Mapeando e renderizando as notas filtradas */}
        {filteredNotes.map(note => {
          return (
            <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} /> // Componente para exibir notas existentes
          )
        })}
      </div>
    </div>
  )
}
