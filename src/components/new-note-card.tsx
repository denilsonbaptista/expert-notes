// Importando os componentes necessários do Radix UI para o diálogo
import * as Dialog from '@radix-ui/react-dialog'

// Importando o ícone 'X' de lucide-react para o botão de fechar
import { X } from 'lucide-react'

// Importando o módulo 'toast' de sonner para exibir mensagens de notificação
import { toast } from 'sonner'

// Importando os tipos ChangeEvent da biblioteca React
import { ChangeEvent } from 'react'
import { FormEvent, useState } from 'react' // Importando FormEvent do React para lidar com eventos de formulário e o hook useState

// Definindo a interface para as props do componente NewNoteCard
interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

// Verificando se a API de Reconhecimento de Voz está disponível no navegador
const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition

// Criando uma instância da API de Reconhecimento de Voz
const speechRecognition = new SpeechRecognitionAPI()

// Definindo o componente NewNoteCard
export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  // Definindo estados para o status da gravação, exibição do tutorial e conteúdo da nota
  const [isRecording, setIsRecording] = useState(false)

  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')

  // Função para começar a edição da nota
  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  // Função que me permite escrever uma nota
  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if (event.target.value === '') {
      setShouldShowOnboarding(true)
    }
  }

  // Função para salvar a nota
  function handleSaveNote(event: FormEvent) {
    event.preventDefault() // Não fazer o padrão formulário que é enviar quando eu clico no botão

    if (content === '') {
      return
    }

    onNoteCreated(content)

    setContent('')
    setShouldShowOnboarding(true)

    // Exibindo uma mensagem de sucesso ao salvar a nota
    toast.success('Nota criada com sucesso!')
  }

  // Função para começar a gravação da nota por voz
  function handleStartRecording() {
    // Verificando se a API de Reconhecimento de Voz está disponível
    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a API de gravação!')
      return
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)

    // Configurando a instância de Reconhecimento de Voz
    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    // Lidando com os resultados do Reconhecimento de Voz
    speechRecognition.onresult = event => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    // Lidando com erros do Reconhecimento de Voz
    speechRecognition.onerror = event => {
      console.error(event)
    }

    // Iniciando a gravação
    speechRecognition.start()
  }

  // Função para parar a gravação da nota por voz
  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  // Retornando a estrutura do componente NewNoteCard
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400 ">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400 ">
                  {' '}
                  Comece{' '}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    {' '}
                    gravando uma nota{' '}
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    {' '}
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="tex-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
