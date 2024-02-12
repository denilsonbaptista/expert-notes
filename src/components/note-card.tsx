// Importando os componentes necessários do Radix UI para o diálogo
import * as Dialog from '@radix-ui/react-dialog'

// Importando a função formatDistanceToNow do date-fns para formatar a data da nota
import { formatDistanceToNow } from 'date-fns'

// Importando o idioma pt-BR do date-fns para localizar a formatação da data
import { ptBR } from 'date-fns/locale'

// Importando o ícone 'X' de lucide-react para o botão de fechar
import { X } from 'lucide-react'

// Definindo a interface para as props do componente NoteCard
interface NoteCardProps {
  note: {
    id: string
    date: Date
    content: string
  }
  onNoteDeleted: (id: string) => void
}

// Definindo o componente NoteCard
export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  return (
    <Dialog.Root>
      {/* Botão para acionar o diálogo */}
      <Dialog.Trigger className="rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        {/* Exibindo a data da nota formatada */}
        <span className="text-sm font-medium text-slate-200">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>
        {/* Exibindo o conteúdo da nota */}
        <p className="text-sm leading-6 text-slate-400 ">{note.content}</p>

        {/* Gradiente para efeito visual */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      {/* Portal para renderizar o diálogo */}
      <Dialog.Portal>
        {/* Overlay do diálogo */}
        <Dialog.Overlay className="inset-0 fixed bg-black/60" />
        {/* Conteúdo do diálogo */}
        <Dialog.Content className="fixed overflow-hidden  inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          {/* Botão para fechar o diálogo */}
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          {/* Conteúdo do diálogo */}
          <div className="flex flex-1 flex-col gap-3 p-5">
            {/* Exibindo a data da nota formatada */}
            <span className="text-sm font-medium text-slate-200">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
            {/* Exibindo o conteúdo da nota */}
            <p className="text-sm leading-6 text-slate-400 ">{note.content}</p>
          </div>

          {/* Botão para deletar a nota */}
          <button
            type="button"
            onClick={() => onNoteDeleted(note.id)}
            className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
          >
            Deseja{' '}
            {/* Parte do texto que pode ser clicado para deletar a nota */}
            <span className="text-red-400 group-hover:underline">
              apagar esse nota
            </span>
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
