"use client"

import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownProps {
  children: string
  className?: string
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:mt-6 prose-headings:mb-4 prose-headings:font-semibold",
        "prose-h1:text-xl prose-h2:text-lg prose-h3:text-base",
        "prose-p:my-2 prose-p:leading-relaxed",
        "prose-ul:my-2 prose-ul:pl-4",
        "prose-ol:my-2 prose-ol:pl-4",
        "prose-li:my-1",
        "prose-strong:font-semibold",
        "prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
        "prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-table:table-auto prose-table:border-collapse",
        "prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-th:bg-gray-50",
        "prose-td:border prose-td:border-gray-300 prose-td:p-2",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // カスタマイズされたコンポーネント
          h1: ({ children }) => (
            <h1 className="text-xl font-semibold mt-6 mb-4 text-gray-900">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mt-5 mb-3 text-gray-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mt-4 mb-2 text-gray-900">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-2 leading-relaxed text-gray-700">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-2 pl-4 list-disc">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 pl-4 list-decimal">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="my-1 text-gray-700">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 px-1 rounded text-sm font-mono text-gray-800">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 my-4">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-300">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-3 py-2 bg-gray-50 text-left font-semibold text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-3 py-2 text-gray-700">
              {children}
            </td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
