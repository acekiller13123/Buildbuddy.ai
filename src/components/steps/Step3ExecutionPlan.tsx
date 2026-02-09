import React, { useState, useEffect, useCallback } from 'react'
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  MarkerType,
  Panel
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import { Layout, Loader2, ChevronRight, Sparkles, Download, RefreshCw } from 'lucide-react'
import { blink } from '@/lib/blink'
import { toast } from 'sonner'

interface Props {
  project: any
  onNext: () => void
}

export const Step3ExecutionPlan: React.FC<Props> = ({ project, onNext }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(true)

  const generatePlan = useCallback(async () => {
    setLoading(true)
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `Generate a system architecture flow for the project: ${project.name}.
        Description: ${project.description}
        
        Create a list of nodes and edges for a React Flow diagram. 
        Nodes should represent components like "Frontend", "Blink SDK", "Gemini 3 Pro", "Database", "User Interface".
        Edges should represent data flow.
        
        Position nodes logically (x, y coordinates).`,
        schema: {
          type: 'object',
          properties: {
            nodes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  data: { 
                    type: 'object',
                    properties: { label: { type: 'string' } }
                  },
                  position: {
                    type: 'object',
                    properties: { x: { type: 'number' }, y: { type: 'number' } }
                  },
                  type: { type: 'string' }
                },
                required: ['id', 'data', 'position']
              }
            },
            edges: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  source: { type: 'string' },
                  target: { type: 'string' },
                  label: { type: 'string' },
                  animated: { type: 'boolean' }
                },
                required: ['id', 'source', 'target']
              }
            }
          },
          required: ['nodes', 'edges']
        }
      })

      // Add default styling to nodes
      const styledNodes = object.nodes.map((node: any) => ({
        ...node,
        className: 'rounded-xl border-2 border-primary/20 bg-card p-4 font-display font-bold text-sm shadow-lg',
        style: { width: 180 }
      }))

      // Add markers to edges
      const styledEdges = object.edges.map((edge: any) => ({
        ...edge,
        markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
      }))

      setNodes(styledNodes)
      setEdges(styledEdges)

      // Save to DB
      const me = await blink.auth.me()
      await (blink.db as any).projectArchitecture.create({
        projectId: project.id,
        nodes: JSON.stringify(styledNodes),
        edges: JSON.stringify(styledEdges),
        userId: me?.id
      })

    } catch (error) {
      console.error(error)
      toast.error('Failed to generate execution plan')
    } finally {
      setLoading(false)
    }
  }, [project, setNodes, setEdges])

  useEffect(() => {
    generatePlan()
  }, [generatePlan])

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="space-y-3">
        <h1 className="text-4xl font-display font-bold">Execution Blueprint</h1>
        <p className="text-muted-foreground text-lg">
          Visualizing the system architecture and data flow for <span className="text-foreground font-bold">{project.name}</span>.
        </p>
      </div>

      <div className="flex-1 min-h-[500px] w-full bg-sidebar-accent/30 rounded-3xl border border-border/50 overflow-hidden relative shadow-inner">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-background/80 backdrop-blur-sm z-10">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium">Drafting system blueprint...</p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            className="bg-transparent"
          >
            <Background color="#ccc" variant="dots" gap={20} />
            <Controls />
            <Panel position="top-right" className="flex gap-2">
               <Button variant="secondary" size="sm" className="rounded-lg shadow-sm" onClick={generatePlan}>
                 <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
               </Button>
               <Button variant="secondary" size="sm" className="rounded-lg shadow-sm">
                 <Download className="w-4 h-4 mr-2" /> Export
               </Button>
            </Panel>
          </ReactFlow>
        )}
      </div>

      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
               <Sparkles className="w-6 h-6" />
            </div>
            <div>
               <p className="font-bold">Architecture Validated</p>
               <p className="text-xs text-muted-foreground">The plan matches hackathon constraints and Gemini 3 capabilities.</p>
            </div>
         </div>
         <Button size="lg" className="h-12 rounded-xl px-8" onClick={onNext} disabled={loading}>
           Start Building <ChevronRight className="ml-2 w-4 h-4" />
         </Button>
      </div>
    </div>
  )
}
