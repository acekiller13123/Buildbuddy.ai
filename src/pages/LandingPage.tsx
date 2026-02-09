import React from 'react'
import { Button } from '@/components/ui/button'
import { Rocket, Brain, Layout, Code, Ship, ArrowRight, Github } from 'lucide-react'
import { blink } from '@/lib/blink'

export const LandingPage: React.FC = () => {
  const handleLogin = () => {
    blink.auth.login(window.location.origin)
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Hero Section */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/40 px-6 py-4 flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Rocket className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-display font-bold">BuildBuddy <span className="text-primary">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex" onClick={handleLogin}>Log In</Button>
          <Button onClick={handleLogin} className="rounded-full shadow-lg shadow-primary/20">
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Hackathon Co-founder Agent
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight max-w-4xl mx-auto">
            Build Your Hackathon Project <br />
            <span className="text-gradient">With AI-Driven Clarity.</span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Stop wasting hours planning. BuildBuddy analyzes rules, recommends feasible ideas, 
            visualizes plans, and teaches you to build and deploy—step-by-step.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button size="lg" onClick={handleLogin} className="h-14 px-8 text-lg rounded-xl shadow-xl shadow-primary/20">
              Start Building Now
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl">
              View Example Project
            </Button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-24 text-left">
            <FeatureCard 
              icon={<Brain className="w-6 h-6" />}
              title="Rule Analysis"
              description="Upload hackathon rules. AI analyzes theme, judging criteria, and time limits to ensure compliance."
              delay="0.2s"
            />
            <FeatureCard 
              icon={<Layout className="w-6 h-6" />}
              title="Visual Execution"
              description="Transform abstract ideas into structured flowcharts. Visualize architecture before you write code."
              delay="0.3s"
            />
            <FeatureCard 
              icon={<Code className="w-6 h-6" />}
              title="Guided Teaching"
              description="Step-by-step build guidance. AI explains every file and function like a senior dev mentor."
              delay="0.4s"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Rocket className="text-white w-4 h-4" />
            </div>
            <span className="font-display font-bold text-lg">BuildBuddy</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 BuildBuddy AI. Built for hackathons.</p>
          <div className="flex items-center gap-6 text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, delay: string }> = ({ icon, title, description, delay }) => (
  <div 
    className="p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group animate-fade-in"
    style={{ animationDelay: delay }}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
    <p className="text-muted-foreground font-medium leading-relaxed">{description}</p>
  </div>
)
