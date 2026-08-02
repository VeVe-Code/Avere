import { Extension, Mark, mergeAttributes } from '@tiptap/core'
import TextStyle from '@tiptap/extension-text-style'

/**
 * Minimal Color extension (same idea as @tiptap/extension-color)
 * so paste keeps style="color: …" without an extra npm package.
 */
const Color = Extension.create({
  name: 'color',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          color: {
            default: null,
            parseHTML: (element) => {
              const value = element.style?.color
              return value ? value.replace(/['"]+/g, '') : null
            },
            renderHTML: (attributes) => {
              if (!attributes.color) return {}
              return { style: `color: ${attributes.color}` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setColor:
        (color) =>
        ({ chain }) =>
          chain().setMark('textStyle', { color }).run(),
      unsetColor:
        () =>
        ({ chain }) =>
          chain().setMark('textStyle', { color: null }).removeEmptyTextStyle().run(),
    }
  },
})

/** Multicolor highlight for pasted background colors / marks. */
const Highlight = Mark.create({
  name: 'highlight',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute('data-color') || element.style?.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.color) return {}
          return {
            'data-color': attributes.color,
            style: `background-color: ${attributes.color}`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      { tag: 'mark' },
      {
        style: 'background-color',
        getAttrs: (value) => (value ? { color: value } : false),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setHighlight:
        (attributes) =>
        ({ commands }) =>
          commands.setMark(this.name, attributes),
      toggleHighlight:
        (attributes) =>
        ({ commands }) =>
          commands.toggleMark(this.name, attributes),
      unsetHighlight:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    }
  },
})

export { TextStyle, Color, Highlight }
