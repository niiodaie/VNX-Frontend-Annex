import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Bot, Send, History, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ConversationItem {
  prompt: string
  answer: string
  timestamp: string
}

interface AIHelperProps {
  currentProject?: any
  onClose?: () => void
}

export function AIHelper({ currentProject, onClose }: AIHelperProps) {
  const { user, isPremium } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<ConversationItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/ai/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.slice(-10)) // Show last 10 conversations
      }
    } catch (error) {
      console.error('Failed to load AI history:', error)
    }
  }

  const sendPrompt = async () => {
    if (!prompt.trim()) return

    if (!isPremium) {
      toast({
        title: 'Premium Feature',
        description: 'AI Helper is available for Pro and Premium users only',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const context = currentProject ? {
        projectName: currentProject.name,
        projectDescription: currentProject.description,
        projectId: currentProject.id
      } : undefined

      const res = await fetch('/api/ai/helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          context,
          userId: user?.id
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await res.json()
      const newItem: ConversationItem = {
        prompt,
        answer: data.answer,
        timestamp: new Date().toISOString()
      }

      setResponse(data.answer)
      setHistory((prev) => [...prev.slice(-9), newItem]) // Keep last 10 items
      setPrompt('')

      toast({
        title: 'AI Response Generated',
        description: 'Check the response below',
      })
    } catch (error) {
      console.error('AI Helper error:', error)
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      sendPrompt()
    }
  }

  if (!isPremium) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Helper
            <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <Sparkles className="h-12 w-12 mx-auto text-purple-500" />
            <div>
              <p className="font-medium">AI Helper is a Premium Feature</p>
              <p className="text-sm text-muted-foreground mt-1">
                Get intelligent project assistance, task suggestions, and productivity insights with Pro or Premium plans.
              </p>
            </div>
            <Button className="w-full" onClick={() => window.location.href = '/upgrade'}>
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Helper
            <Badge className="bg-green-100 text-green-700">Active</Badge>
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
        {currentProject && (
          <p className="text-sm text-muted-foreground">
            Context: {currentProject.name}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask AI for help with your project... (Ctrl+Enter to send)"
            className="min-h-[100px] resize-none"
            disabled={loading}
          />
          <Button
            onClick={sendPrompt}
            disabled={loading || !prompt.trim()}
            className="w-full mt-2"
          >
            {loading ? (
              <>
                <Bot className="h-4 w-4 mr-2 animate-pulse" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>

        {response && (
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI Response
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm whitespace-pre-wrap">{response}</p>
            </CardContent>
          </Card>
        )}

        {history.length > 0 && (
          <div>
            <Separator className="my-4" />
            <div className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4" />
              <span className="text-sm font-medium">Recent Conversations</span>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {history.slice().reverse().map((item, i) => (
                  <div key={i} className="text-xs space-y-1 p-2 bg-muted/30 rounded">
                    <p className="text-muted-foreground">
                      <strong>You:</strong> {item.prompt}
                    </p>
                    <p className="text-foreground">
                      <strong>AI:</strong> {item.answer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Pro tip: Use Ctrl+Enter to send quickly
        </div>
      </CardContent>
    </Card>
  )
}

export default AIHelper