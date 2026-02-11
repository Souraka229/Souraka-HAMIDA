'use client'

import Link from 'next/link'
import { Code, BarChart3, Presentation, MoreVertical } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const typeIcons = {
  code: <Code size={20} />,
  visualization: <BarChart3 size={20} />,
  presentation: <Presentation size={20} />,
}

const typeLabels = {
  code: 'Code Generator',
  visualization: 'Visualization',
  presentation: 'Presentation',
}

export default function ProjectCard({ project }: { project: any }) {
  return (
    <Link href={`/editor/${project.type}/${project.id}`}>
      <div className="p-6 rounded-xl border border-dark-surface-alt bg-dark-surface hover:border-primary/50 hover:bg-dark-surface-alt transition cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="text-primary p-3 bg-dark-surface-alt rounded-lg group-hover:bg-primary/10 transition">
            {typeIcons[project.type as keyof typeof typeIcons]}
          </div>
          <button className="p-2 hover:bg-dark-surface-alt rounded-lg transition opacity-0 group-hover:opacity-100">
            <MoreVertical size={18} />
          </button>
        </div>

        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition">{project.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{typeLabels[project.type as keyof typeof typeLabels]}</p>

        {project.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-dark-surface-alt">
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            project.status === 'active' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {project.status}
          </span>
        </div>
      </div>
    </Link>
  )
}
