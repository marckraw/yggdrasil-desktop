// types/form.ts
import type { KeyboardEvent } from 'react'
import { z } from 'zod'
import { useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'

export const chatFormSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    // .max(2000, 'Message cannot exceed 2000 characters')
})

export type ChatFormData = z.infer<typeof chatFormSchema>

interface ChatFormProps {
  onStartStreaming: (message: string) => Promise<void>
  isStreaming: boolean
}

export const ChatForm = ({ onStartStreaming, isStreaming }: ChatFormProps) => {
    const {
      register,
      handleSubmit,
      reset,
      getValues,
      formState: { errors, isSubmitting }
    } = useForm<ChatFormData>({
      resolver: zodResolver(chatFormSchema),
      defaultValues: {
        message: ''
      }
    })
  
    const onSubmit = useCallback(async (data: ChatFormData) => {
      try {
        await onStartStreaming(data.message)
        reset() // Clear the form after successful submission
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }, [onStartStreaming, reset])
  
    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
      // Check for Cmd/Ctrl + Enter
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault() // Prevent default to avoid newline
        
        const currentMessage = getValues('message')
        if (currentMessage.trim()) {
          handleSubmit(onSubmit)()
        }
      }
    }, [getValues, handleSubmit, onSubmit])
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <textarea
            {...register('message')}
            onKeyDown={handleKeyDown}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.message 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            } focus:border-transparent focus:ring-2 transition min-h-[100px] resize-y`}
            placeholder="Type your message here... (Cmd/Ctrl + Enter to send)"
            disabled={isStreaming || isSubmitting}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
          <div className="absolute right-2 bottom-2 text-xs text-gray-400">
            Press Cmd/Ctrl + Enter to send
          </div>
        </div>
  
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isStreaming || isSubmitting}
            className={`
              px-6 py-2 rounded-lg font-medium text-white
              ${isStreaming || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
              }
              transition-colors
              flex items-center space-x-2
            `}
          >
            {isStreaming || isSubmitting ? (
              <>
                <Spinner className="w-4 h-4" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Send Message</span>
            )}
          </button>
        </div>
      </form>
    )
  }
  
  // Keep the Spinner component as is
  export const Spinner = ({ className = "w-5 h-5" }) => (
    <svg 
      className={`animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )