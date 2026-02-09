import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Code, Loader2, ChevronRight, CheckCircle2, Terminal, FileCode, Info } from 'lucide-react'
import { blink } from '@/lib/blink'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Props {
  project: any
  onNext: () => void
}

export const Step4BuildGuide: React.FC<Props> = ({ project, onNext }) => {
  const [steps, setSteps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const { object } = await blink.ai.generateObject({
          prompt: `Break down the hackathon project "${project.name}" into 6-8 manageable, sequential coding steps.
          Project Description: ${project.description}
          
          For each step, provide:
          - Title
          - Concise objective
          - Simple explanation (written like teaching a beginner)
          - Code snippet or command
          - Key file involved`,
          schema: {
            type: 'object',
            properties: {
              steps: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    objective: { type: 'string' },
                    explanation: { type: 'string' },
                    code: { type: 'string' },
                    file: { type: 'string' }
                  },
                  required: ['title', 'objective', 'explanation', 'code', 'file']
                }
              }
            },
            required: ['steps']
          }
        })
        setSteps(object.steps)

        // Save steps to DB
        const me = await blink.auth.me()
        const stepsData = object.steps.map((step: any, idx: number) => ({
          projectId: project.id,
          title: step.title,
          content: JSON.stringify(step),
          orderIndex: idx,
          userId: me?.id
        }))
        await (blink.db as any).projectSteps.createMany(stepsData)
      } catch (error) {
        console.error(error)
        toast.error('Failed to generate build guide')
      } finally {
        setLoading(false)
      }
    }

    fetchSteps()
  }, [project])

  const toggleStep = (idx: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(idx)) {
      newCompleted.delete(idx)
    } else {
      newCompleted.add(idx)
    }
    setCompletedSteps(newCompleted)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">BuildBuddy is drafting your step-by-step roadmap...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-3">
        <h1 className="text-4xl font-display font-bold">Guided Execution</h1>
        <p className="text-muted-foreground text-lg">
          Follow these structured steps to build <span className="text-foreground font-bold">{project.name}</span>.
        </p>
      </div>

      <div className="grid gap-8">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className={cn(
              "group p-8 rounded-3xl bg-card border transition-all duration-300 relative",
              completedSteps.has(idx) ? "border-green-200 bg-green-50/30" : "border-border/50 shadow-sm"
            )}
          >
            <div className="flex items-start gap-6">
              <button 
                onClick={() => toggleStep(idx)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  completedSteps.has(idx) ? "bg-green-500 text-white shadow-lg shadow-green-200" : "bg-primary/10 text-primary hover:scale-110"
                )}
              >
                {completedSteps.has(idx) ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-display font-bold">{idx + 1}</span>}
              </button>

              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-primary/70 font-bold text-sm uppercase tracking-widest">{step.objective}</p>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                   <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                   <p className="text-sm font-medium leading-relaxed">{step.explanation}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <FileCode className="w-4 h-4" /> {step.file}
                    </span>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase rounded-md" onClick={() => {
                      navigator.clipboard.writeText(step.code)
                      toast.success('Code copied!')
                    }}>Copy Code</Button>
                  </div>
                  <div className="bg-sidebar p-6 rounded-2xl font-mono text-xs text-sidebar-foreground/90 overflow-x-auto shadow-inner relative group/code">
                    <pre><code>{step.code}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50">
         <Button 
           size="lg" 
           className="h-16 rounded-2xl px-12 shadow-2xl shadow-primary/20 text-lg font-bold animate-fade-in"
           onClick={onNext}
           disabled={completedSteps.size < steps.length / 2}
         >
           Finish Strong <ChevronRight className="ml-2 w-5 h-5" />
         </Button>
      </div>
    </div>
  )
}
