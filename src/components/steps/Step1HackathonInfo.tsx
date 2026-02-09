import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, Sparkles, FileText } from 'lucide-react'
import { blink } from '@/lib/blink'
import { toast } from 'sonner'

interface Props {
  onAnalyze: (hackathon: any) => void
}

export const Step1HackathonInfo: React.FC<Props> = ({ onAnalyze }) => {
  const [name, setName] = useState('')
  const [rules, setRules] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!name || !rules) {
      toast.error('Please fill in both hackathon name and rules')
      return
    }

    setAnalyzing(true)
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `Analyze the following hackathon details:
        Name: ${name}
        Rules/Theme: ${rules}
        
        Extract the core theme, judging criteria, and time constraints.`,
        schema: {
          type: 'object',
          properties: {
            theme: { type: 'string' },
            judgingCriteria: { type: 'array', items: { type: 'string' } },
            timeConstraints: { type: 'string' },
            allowedTech: { type: 'array', items: { type: 'string' } }
          },
          required: ['theme', 'judgingCriteria', 'timeConstraints']
        }
      })

      const me = await blink.auth.me()
      if (!me) {
        toast.error('You must be logged in to analyze hackathons')
        return
      }

      const hackathonData = {
        name,
        theme: object.theme,
        rules,
        judgingCriteria: JSON.stringify(object.judgingCriteria),
        deadline: object.timeConstraints,
        userId: me.id
      }

      const created = await (blink.db as any).hackathons.create(hackathonData)
      toast.success('Hackathon analyzed successfully!')
      onAnalyze(created)
    } catch (error) {
      console.error(error)
      toast.error('Failed to analyze hackathon. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="space-y-3">
        <h1 className="text-4xl font-display font-bold">Hackathon Intelligence</h1>
        <p className="text-muted-foreground text-lg">
          Upload rules or describe the theme. BuildBuddy analyzes the constraints so you can focus on building.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-xl shadow-primary/5 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <FileText className="w-24 h-24" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Hackathon Name
            </label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-lg" 
              placeholder="e.g. Gemini AI Hackathon 2026" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Rules, Theme & Constraints</label>
            <textarea 
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full h-48 p-5 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-medium leading-relaxed" 
              placeholder="Paste the hackathon description, problem statement, and judging criteria here..." 
            />
          </div>

          <Button 
            size="lg" 
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" 
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Hackathon...
              </>
            ) : (
              <>
                Analyze Rules & Start Planning <ChevronRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
