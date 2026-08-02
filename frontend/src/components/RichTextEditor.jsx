import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { Fragment } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import { useEffect } from 'react'
import { TextStyle, Color, Highlight } from '../helper/tiptapColor'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  Code,
  Quote,
  Highlighter,
} from 'lucide-react'

function ToolbarButton({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={
        active
          ? 'rounded-md bg-slate-900 px-2 py-1.5 text-xs font-medium text-white'
          : 'rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100'
      }
    >
      {children}
    </button>
  )
}

/** Turn <br> inside paragraphs into separate <p> blocks so headings apply per line. */
function normalizeBrToParagraphs(html) {
  if (!html || typeof html !== 'string') return html || ''
  return html.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (full, attrs, inner) => {
    if (!/<br\s*\/?>/i.test(inner)) return full
    const parts = inner.split(/<br\s*\/?>/i)
    return parts.map((part) => `<p${attrs}>${part.trim() ? part : '<br>'}</p>`).join('')
  })
}

/** Word/legacy HTML often uses <font color="…"> — map to span for TipTap Color. */
function normalizePastedHtml(html) {
  if (!html || typeof html !== 'string') return html || ''
  let next = html.replace(/<font\b([^>]*)>/gi, (_full, attrs) => {
    const colorMatch = String(attrs).match(/\bcolor\s*=\s*["']?([^"'\s>]+)/i)
    if (colorMatch) return `<span style="color: ${colorMatch[1]}">`
    return '<span>'
  })
  next = next.replace(/<\/font>/gi, '</span>')
  return normalizeBrToParagraphs(next)
}

function blockHasHardBreak(block) {
  let found = false
  block.content.forEach((node) => {
    if (node.type.name === 'hardBreak') found = true
  })
  return found
}

function lineIndexAtOffset(block, parentOffset) {
  let line = 0
  let offset = 0
  let at = 0
  block.content.forEach((node) => {
    if (node.type.name === 'hardBreak') {
      if (parentOffset > offset) at = line + 1
      line += 1
      offset += node.nodeSize
      return
    }
    const end = offset + node.nodeSize
    if (parentOffset >= offset && parentOffset <= end) at = line
    offset = end
  })
  return at
}

/**
 * Split the textblock at the cursor into separate paragraphs on hard breaks,
 * then place the caret in the same visual line.
 */
function splitHardBreaksAtCursor(editor) {
  const { state } = editor
  const { $from } = state.selection
  const block = $from.parent
  if (block.type.name !== 'paragraph' && block.type.name !== 'heading') return false
  if (!blockHasHardBreak(block)) return false

  const cursorLine = lineIndexAtOffset(block, $from.parentOffset)
  const blockPos = $from.before()
  const lines = []
  let current = []

  block.content.forEach((node) => {
    if (node.type.name === 'hardBreak') {
      lines.push(current)
      current = []
    } else {
      current.push(node)
    }
  })
  lines.push(current)

  const paragraphType = state.schema.nodes.paragraph
  const nodes = lines.map((line) =>
    paragraphType.create(null, line.length ? Fragment.from(line) : undefined)
  )

  let tr = state.tr.replaceWith(blockPos, blockPos + block.nodeSize, Fragment.from(nodes))

  let pos = blockPos + 1
  for (let i = 0; i < nodes.length; i += 1) {
    if (i === cursorLine) {
      const target = Math.min(pos, tr.doc.content.size)
      tr = tr.setSelection(TextSelection.near(tr.doc.resolve(target)))
      break
    }
    pos += nodes[i].nodeSize
  }

  editor.view.dispatch(tr)
  return true
}

/**
 * Apply heading only to the current paragraph/line (not every selected block).
 */
function applyHeading(editor, level) {
  splitHardBreaksAtCursor(editor)

  const { $from } = editor.state.selection
  const pos = $from.pos
  editor.chain().focus().setTextSelection(pos).toggleHeading({ level }).run()
}

function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write here...',
  minHeightClass = 'min-h-[180px]',
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        hardBreak: false,
      }),
      TextStyle,
      Color,
      Highlight,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline underline-offset-2',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: normalizePastedHtml(value || ''),
    editorProps: {
      attributes: {
        class: `prose prose-slate max-w-none px-3 py-2.5 focus:outline-none ${minHeightClass} text-slate-700`,
      },
      transformPastedHTML: (html) => normalizePastedHtml(html),
    },
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        handleKeyDown: (_view, event) => {
          if (event.key === 'Enter' && event.shiftKey) {
            editor.commands.splitBlock()
            return true
          }
          return false
        },
      },
    })
  }, [editor])

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = normalizePastedHtml(value || '')
    if (next !== current) {
      editor.commands.setContent(next, false)
    }
  }, [value, editor])

  if (!editor) return null

  const setLink = () => {
    const prev = editor.getAttributes('link').href
    const url = window.prompt('Link URL', prev || 'https://')
    if (url === null) return
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/30">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50 px-2 py-1.5">
        <ToolbarButton
          title="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>

        <label
          title="Text color"
          className="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 hover:bg-slate-100"
          onMouseDown={(e) => e.preventDefault()}
        >
          <span
            className="h-3.5 w-3.5 rounded-sm border border-slate-300"
            style={{ backgroundColor: editor.getAttributes('textStyle').color || '#334155' }}
          />
          <input
            type="color"
            className="h-0 w-0 overflow-hidden opacity-0"
            value={editor.getAttributes('textStyle').color || '#334155'}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>
        <ToolbarButton
          title="Highlight"
          active={editor.isActive('highlight')}
          onClick={() => {
            if (editor.isActive('highlight')) {
              editor.chain().focus().unsetHighlight().run()
            } else {
              editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()
            }
          }}
        >
          <Highlighter className="h-3.5 w-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-slate-200" />

        <ToolbarButton
          title="Heading 1 (current line only)"
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => applyHeading(editor, 1)}
        >
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2 (current line only)"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => applyHeading(editor, 2)}
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3 (current line only)"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => applyHeading(editor, 3)}
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-slate-200" />

        <ToolbarButton title="Link" active={editor.isActive('link')} onClick={setLink}>
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-slate-200" />

        <ToolbarButton
          title="Code"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      <p className="border-b border-slate-100 bg-slate-50/80 px-3 py-1 text-[11px] text-slate-400">
        H1–H3 apply to the current line only. Paste keeps headings, colors, and highlights. Press Enter
        for a new line.
      </p>

      <EditorContent editor={editor} />

      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #94a3b8;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror h1 { font-size: 1.5rem; font-weight: 600; margin: 0.5rem 0; }
        .ProseMirror h2 { font-size: 1.25rem; font-weight: 600; margin: 0.4rem 0; }
        .ProseMirror h3 { font-size: 1.125rem; font-weight: 600; margin: 0.35rem 0; }
        .ProseMirror ul { list-style: disc; padding-left: 1.25rem; margin: 0.35rem 0; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.25rem; margin: 0.35rem 0; }
        .ProseMirror blockquote {
          border-left: 3px solid #cbd5e1;
          padding-left: 0.75rem;
          color: #64748b;
          margin: 0.5rem 0;
        }
        .ProseMirror code {
          background: #f1f5f9;
          border-radius: 0.25rem;
          padding: 0.1rem 0.3rem;
          font-size: 0.875em;
        }
        .ProseMirror pre {
          background: #0f172a;
          color: #e2e8f0;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          overflow-x: auto;
          margin: 0.5rem 0;
        }
        .ProseMirror pre code { background: transparent; color: inherit; padding: 0; }
      `}</style>
    </div>
  )
}

export default RichTextEditor
