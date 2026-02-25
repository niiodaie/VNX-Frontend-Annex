import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bot, X } from 'lucide-react'
import { AIHelper } from '@/components/AIHelper'
import { useAuth } from '@/components/AuthProvider'

interface FloatingAIButtonProps {
  currentProject?: any
}

export function FloatingAIButton({ currentProject }: FloatingAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { isPremium } = useAuth()

  if (!isPremium) {
    return null // Only show for premium users
  }

  return (
    <>
      {/* Floating AI Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Bot className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* AI Helper Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-h-[70vh] overflow-hidden">
          <div className="bg-white rounded-lg shadow-2xl border">
            <AIHelper 
              currentProject={currentProject} 
              onClose={() => setIsOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingAIButton