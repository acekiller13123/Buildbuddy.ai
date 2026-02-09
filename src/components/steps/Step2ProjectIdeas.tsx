import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Brain, Loader2, Sparkles, ChevronRight, Clock, Award, Cpu } from 'lucide-react'
import { blink } from '@/lib/blink'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Props {
  hackathon: any
  onSelect: (project: any) => void
}

export const Step2ProjectIdeas: React.FC<Props> = ({ hackathon, onSelect }) => {
  const [ideas, setIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const { object } = await blink.ai.generateObject({
          prompt: `Based on the following hackathon analysis, recommend 5 realistic and high-impact project ideas that can be completed in a hackathon timeline (24-72 hours).
          Hackathon Name: ${hackathon.name}
          Theme: ${hackathon.theme}
          Judging Criteria: ${hackathon.judgingCriteria}
          Deadline/Constraints: ${hackathon.deadline}
          
          For each project, include:
          - Name
          - Description
          - Difficulty (Beginner, Intermediate, Advanced)
          - Estimated Time (e.g. 18 hours)
          - Judging Value (why judges will like it)
          - Tech Stack (Gemini 3 Pro capabilities it uses)`,
          schema: {
            type: 'object',
            properties: {
              projects: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    difficulty: { type: 'string' },
                    estimatedTime: { type: 'string' },
                    judgingValue: { type: 'string' },
                    techStack: { type: 'string' }
                  },
                  required: ['name', 'description', 'difficulty', 'estimatedTime', 'judgingValue', 'techStack']
                }
              }
            },
            required: ['projects']
          }
        })
        setIdeas(object.projects)
      } catch (error) {
        console.error(error)
        toast.error('Failed to generate project ideas')
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [hackathon])

  const handleSelect = async (project: any) => {
    try {
      const me = await blink.auth.me()
      const projectData = {
        ...project,
        hackathonId: hackathon.id,
        userId: me?.id
      }
      const created = await (blink.db as any).projects.create(projectData)
      onSelect(created)
    } catch (error) {
      console.error(error)
      toast.error('Failed to select project')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">BuildBuddy is brainstorming high-impact ideas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-display font-bold">Project Recommendations</h1>
        <p className="text-muted-foreground text-lg">
          Based on the constraints of <span className="text-foreground font-bold">{hackathon.name}</span>, here are 5 strategic directions.
        </p>
      </div>

      <div className="grid gap-6">
        {ideas.map((project, idx) => (
          <div 
            key={idx}
            onClick={() => handleSelect(project)}
            className="group p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <ChevronRight className="w-8 h-8 text-primary" />
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-display font-bold">{project.name}</h3>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    project.difficulty === 'Beginner' ? "bg-green-100 text-green-700" :
                    project.difficulty === 'Intermediate' ? "bg-blue-100 text-blue-700" :
                    "bg-orange-100 text-orange-700"
                  )}>
                    {project.difficulty}
                  </div>
                </div>
                
                <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-2xl">
                  {project.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                   <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                        <Clock className="w-4 h-4" />
                      </div>
                      {project.estimatedTime}
                   </div>
                   <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                        <Award className="w-4 h-4" />
                      </div>
                      Strategic Value
                   </div>
                   <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                        <Cpu className="w-4 h-4" />
                      </div>
                      {project.techStack.split(',')[0]}
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/40">
               <p className="text-sm font-medium text-muted-foreground italic">
                 "BuildBuddy reasoning: {project.judgingValue}"
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
