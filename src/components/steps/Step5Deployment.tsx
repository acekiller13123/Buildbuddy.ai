import React from 'react'
import { Button } from '@/components/ui/button'
import { Rocket, Ship, Globe, Terminal, Shield, CheckCircle2, ArrowRight, Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  project: any
}

export const Step5Deployment: React.FC<Props> = ({ project }) => {
  const handleDeploy = () => {
    toast.success('Project published successfully!')
  }

  return (
    <div className="space-y-12 max-w-3xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 animate-fade-in">
          <Ship className="w-10 h-10" />
        </div>
        <h1 className="text-5xl font-display font-bold">Launch {project?.name}</h1>
        <p className="text-muted-foreground text-xl max-w-lg mx-auto">
          Your hackathon journey is almost complete. Let's get your project live for the judges.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Recommended Platforms
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DeploymentOption 
              title="Blink Hosting"
              description="Deploy in one click with built-in SSL and custom domain support."
              isRecommended
            />
            <DeploymentOption 
              title="Vercel"
              description="Perfect for React apps. Just connect your GitHub repository."
            />
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Environment Configuration
          </h3>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            Ensure you have configured your environment variables on the deployment platform.
          </p>
          <div className="space-y-3">
             <div className="p-4 rounded-xl bg-muted font-mono text-xs flex justify-between items-center group">
                <span className="opacity-70">VITE_BLINK_PROJECT_ID=...</span>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">Copy</Button>
             </div>
             <div className="p-4 rounded-xl bg-muted font-mono text-xs flex justify-between items-center group">
                <span className="opacity-70">VITE_BLINK_PUBLISHABLE_KEY=...</span>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">Copy</Button>
             </div>
          </div>
        </div>
      </div>

      <div className="p-12 rounded-[2.5rem] bg-sidebar text-sidebar-foreground text-center space-y-8 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         
         <div className="relative space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold">The Hackathon Finish Line</h2>
            <p className="text-sidebar-foreground/60 max-w-md mx-auto font-medium">
              You've built a project that matches judging criteria and leverages Gemini 3. Ready to submit?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Button size="lg" className="h-16 rounded-2xl px-10 text-lg font-bold w-full sm:w-auto" onClick={handleDeploy}>
                 Publish Now <ArrowRight className="ml-2 w-5 h-5" />
               </Button>
               <Button variant="outline" size="lg" className="h-16 rounded-2xl px-10 text-lg font-bold w-full sm:w-auto text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent">
                 <Share2 className="mr-2 w-5 h-5" /> Share Report
               </Button>
            </div>
         </div>
      </div>

      <div className="flex items-center justify-center gap-8 py-10 opacity-50 grayscale hover:grayscale-0 transition-all">
         <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold">AI Reasoning Validated</span>
         </div>
         <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold">Judges Checklist Clear</span>
         </div>
      </div>
    </div>
  )
}

const DeploymentOption: React.FC<{ title: string, description: string, isRecommended?: boolean }> = ({ title, description, isRecommended }) => (
  <div className={cn(
    "p-6 rounded-2xl border transition-all cursor-pointer group",
    isRecommended ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-border/50 hover:border-primary/20 bg-background"
  )}>
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-bold text-lg">{title}</h4>
      {isRecommended && <span className="px-2 py-0.5 rounded bg-primary text-white text-[8px] font-bold uppercase tracking-wider">Best Choice</span>}
    </div>
    <p className="text-sm text-muted-foreground font-medium leading-relaxed">{description}</p>
  </div>
)
