import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Rocket, 
  Brain, 
  Layout, 
  Code, 
  Ship, 
  Settings, 
  LogOut, 
  Plus, 
  ChevronRight,
  Home,
  FileText
} from 'lucide-react'
import { blink } from '@/lib/blink'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Step1HackathonInfo } from '@/components/steps/Step1HackathonInfo'
import { Step2ProjectIdeas } from '@/components/steps/Step2ProjectIdeas'
import { Step3ExecutionPlan } from '@/components/steps/Step3ExecutionPlan'
import { Step4BuildGuide } from '@/components/steps/Step4BuildGuide'
import { Step5Deployment } from '@/components/steps/Step5Deployment'

export const DashboardPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1)
  const [hackathon, setHackathon] = useState<any>(null)
  const [project, setProject] = useState<any>(null)

  const steps = [
    { id: 1, title: 'Hackathon Info', icon: <FileText className="w-4 h-4" />, description: 'Analyze rules & constraints' },
    { id: 2, title: 'Project Ideas', icon: <Brain className="w-4 h-4" />, description: 'Recommend feasible projects' },
    { id: 3, title: 'Execution Plan', icon: <Layout className="w-4 h-4" />, description: 'Visualize architecture' },
    { id: 4, title: 'Build Guide', icon: <Code className="w-4 h-4" />, description: 'Step-by-step instructions' },
    { id: 5, title: 'Deployment', icon: <Ship className="w-4 h-4" />, description: 'Go live instructions' },
  ]

  const handleLogout = () => {
    blink.auth.logout()
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border/40 flex flex-col bg-sidebar text-sidebar-foreground">
        <div className="p-6 border-b border-sidebar-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Rocket className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold">BuildBuddy</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-2 text-xs font-bold text-sidebar-foreground/40 uppercase tracking-widest">
            Hackathon Agent
          </div>
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              disabled={step.id > 1 && !hackathon}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-left",
                activeStep === step.id 
                  ? "bg-sidebar-primary text-white shadow-lg shadow-primary/20" 
                  : "hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground",
                step.id > 1 && !hackathon && "opacity-40 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                activeStep === step.id ? "bg-white/20" : "bg-sidebar-accent group-hover:bg-sidebar-border"
              )}>
                {step.icon}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-bold truncate">{step.title}</div>
                <div className={cn(
                  "text-[10px] truncate opacity-70",
                  activeStep === step.id ? "text-white" : "text-sidebar-foreground/40"
                )}>
                  {step.description}
                </div>
              </div>
              {activeStep === step.id && <ChevronRight className="w-4 h-4 opacity-70" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border/50 space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-border/40 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold font-display">
              {steps.find(s => s.id === activeStep)?.title}
            </h2>
            {hackathon && (
              <>
                <div className="w-px h-4 bg-border/60" />
                <span className="text-sm font-medium text-muted-foreground">{hackathon.name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" size="sm" className="rounded-full h-9">
              <Settings className="w-4 h-4 mr-2" /> Settings
             </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto animate-fade-in">
             {/* Step rendering will go here */}
             <div className="space-y-8">
                {activeStep === 1 && <Step1HackathonInfo onAnalyze={(h: any) => { setHackathon(h); setActiveStep(2); }} />}
                {activeStep === 2 && <Step2ProjectIdeas hackathon={hackathon} onSelect={(p: any) => { setProject(p); setActiveStep(3); }} />}
                {activeStep === 3 && <Step3ExecutionPlan project={project} onNext={() => setActiveStep(4)} />}
                {activeStep === 4 && <Step4BuildGuide project={project} onNext={() => setActiveStep(5)} />}
                {activeStep === 5 && <Step5Deployment project={project} />}
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
