import type { ReactNode } from "react"
import Link from "next/link"

interface DashboardCardProps {
  title: string
  description: string
  icon: ReactNode
  href: string
}

export default function DashboardCard({ title, description, icon, href }: DashboardCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <div className="mr-4 text-blue-600 dark:text-blue-400">{icon}</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 flex-grow">{description}</p>
        <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium flex items-center hover:text-blue-700 dark:hover:text-blue-300">
          Learn more
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}

