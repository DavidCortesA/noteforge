<script setup lang="ts">
import { marked } from 'marked'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Start writing...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLDivElement | null>(null)
let lastEmitted = ''

marked.setOptions({ breaks: true, gfm: true })

// ── Markdown → HTML → DOM (only when switching notes) ───────────
function renderMarkdown(md: string) {
  if (!editorRef.value) return
  editorRef.value.innerHTML = md.trim() ? (marked.parse(md) as string) : ''
}

watch(
  () => props.modelValue,
  (val) => {
    if (val === lastEmitted) return
    renderMarkdown(val)
  },
)

onMounted(() => renderMarkdown(props.modelValue))

// ── DOM → Markdown ───────────────────────────────────────────────
function nodeToMd(node: Node, listDepth = 0): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? ''
  if (node.nodeType !== Node.ELEMENT_NODE) return ''

  const el = node as HTMLElement
  const tag = el.tagName.toLowerCase()
  const kids = () => Array.from(el.childNodes).map((n) => nodeToMd(n, listDepth)).join('')

  switch (tag) {
    case 'h1': return `# ${kids()}\n\n`
    case 'h2': return `## ${kids()}\n\n`
    case 'h3': return `### ${kids()}\n\n`
    case 'h4': return `#### ${kids()}\n\n`
    case 'p': {
      const t = kids()
      return t.trim() ? `${t}\n\n` : ''
    }
    case 'br': return '\n'
    case 'strong': case 'b': return `**${kids()}**`
    case 'em': case 'i': return `*${kids()}*`
    case 's': case 'del': case 'strike': return `~~${kids()}~~`
    case 'code':
      return el.closest('pre') ? kids() : `\`${kids()}\``
    case 'pre': {
      const code = el.querySelector('code')
      return `\`\`\`\n${code?.textContent ?? kids()}\n\`\`\`\n\n`
    }
    case 'blockquote': {
      return kids()
        .split('\n')
        .filter(Boolean)
        .map((l) => `> ${l}`)
        .join('\n') + '\n\n'
    }
    case 'ul': {
      const pad = '  '.repeat(listDepth)
      return Array.from(el.children)
        .map((li) => `${pad}- ${nodeToMd(li, listDepth + 1).trim()}`)
        .join('\n') + '\n\n'
    }
    case 'ol': {
      const pad = '  '.repeat(listDepth)
      return Array.from(el.children)
        .map((li, i) => `${pad}${i + 1}. ${nodeToMd(li, listDepth + 1).trim()}`)
        .join('\n') + '\n\n'
    }
    case 'li': return kids()
    case 'hr': return '---\n\n'
    case 'a': return `[${kids()}](${el.getAttribute('href') ?? ''})`
    case 'div': {
      const t = kids()
      return t.endsWith('\n') ? t : t + '\n'
    }
    default: return kids()
  }
}

function serializeToMarkdown() {
  if (!editorRef.value) return ''
  return Array.from(editorRef.value.childNodes)
    .map((n) => nodeToMd(n))
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// ── Input handler ────────────────────────────────────────────────
function onInput() {
  const md = serializeToMarkdown()
  lastEmitted = md
  emit('update:modelValue', md)
}

// ── execCommand helpers ──────────────────────────────────────────
function exec(cmd: string, value?: string) {
  editorRef.value?.focus()
  document.execCommand(cmd, false, value ?? '')
  onInput()
}

function formatBlock(tag: string) {
  exec('formatBlock', tag)
}

// ── Toolbar definition ───────────────────────────────────────────
const tools = [
  // Text format
  {
    title: 'Bold (Ctrl+B)',
    action: () => exec('bold'),
    label: 'B',
    cls: 'fw-bold',
  },
  {
    title: 'Italic (Ctrl+I)',
    action: () => exec('italic'),
    label: 'I',
    cls: 'fw-italic',
  },
  {
    title: 'Strikethrough',
    action: () => exec('strikeThrough'),
    label: 'S',
    cls: 'fw-strike',
  },
  { divider: true },
  // Headings
  { title: 'Heading 1', action: () => formatBlock('h1'), label: 'H1', cls: 'fw-mono' },
  { title: 'Heading 2', action: () => formatBlock('h2'), label: 'H2', cls: 'fw-mono' },
  { title: 'Heading 3', action: () => formatBlock('h3'), label: 'H3', cls: 'fw-mono' },
  { title: 'Normal text', action: () => formatBlock('p'), label: 'T', cls: '' },
  { divider: true },
  // Lists & block
  {
    title: 'Bullet list',
    action: () => exec('insertUnorderedList'),
    svg: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="2.5" cy="4" r="1.5" fill="currentColor"/><path d="M6 4h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="2.5" cy="7.5" r="1.5" fill="currentColor"/><path d="M6 7.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="2.5" cy="11" r="1.5" fill="currentColor"/><path d="M6 11h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  },
  {
    title: 'Numbered list',
    action: () => exec('insertOrderedList'),
    svg: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 2.5v3.5M1.5 5.5h1" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><path d="M1.5 9c0-1 1.5-1 1.5 0s-1.5 1-1.5 1H3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><path d="M6 4h7M6 7.5h7M6 11h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  },
  {
    title: 'Quote',
    action: () => formatBlock('blockquote'),
    svg: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="3" width="3" height="3.5" rx="0.5" fill="currentColor" opacity=".7"/><rect x="6.5" y="3" width="3" height="3.5" rx="0.5" fill="currentColor" opacity=".7"/><path d="M1.5 9.5h12M1.5 12.5h8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  },
  { divider: true },
  // Code
  {
    title: 'Inline code',
    action: () => {
      const sel = window.getSelection()
      const text = sel && !sel.isCollapsed ? sel.toString() : 'code'
      exec('insertHTML', `<code>${text}</code>`)
    },
    label: '`_`',
    cls: 'fw-mono',
  },
  {
    title: 'Code block',
    action: () => {
      exec('insertHTML', '<pre><code>code block</code></pre><p><br></p>')
    },
    label: '```',
    cls: 'fw-mono',
  },
  {
    title: 'Horizontal rule',
    action: () => exec('insertHorizontalRule'),
    svg: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1 7.5h13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 2"/></svg>`,
  },
]

// ── Keyboard shortcuts ───────────────────────────────────────────
function onKeydown(e: KeyboardEvent) {
  const mod = e.ctrlKey || e.metaKey
  if (mod && e.key === 'b') { e.preventDefault(); exec('bold') }
  if (mod && e.key === 'i') { e.preventDefault(); exec('italic') }
  if (mod && e.shiftKey && e.key === 'X') { e.preventDefault(); exec('strikeThrough') }
}

// ── Paste: plain text only ───────────────────────────────────────
function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') ?? ''
  document.execCommand('insertText', false, text)
  onInput()
}
</script>

<template>
  <div class="wysiwyg">
    <!-- Toolbar -->
    <div class="wysiwyg__toolbar" @mousedown.prevent>
      <template v-for="(tool, i) in tools" :key="i">
        <div v-if="'divider' in tool" class="tb-sep" />
        <button
          v-else
          class="tb-btn"
          :class="tool.cls"
          :title="tool.title"
          @click.prevent="tool.action()"
          tabindex="-1"
          type="button"
        >
          <span v-if="'svg' in tool && tool.svg" v-html="tool.svg" class="tb-icon" />
          <span v-else>{{ tool.label }}</span>
        </button>
      </template>
    </div>

    <!-- Content-editable body -->
    <div
      ref="editorRef"
      class="wysiwyg__body"
      contenteditable="true"
      :data-placeholder="placeholder"
      @input="onInput"
      @keydown="onKeydown"
      @paste="onPaste"
      spellcheck="true"
    />
  </div>
</template>

<style scoped>
.wysiwyg {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 0;
}

/* ── Toolbar ── */
.wysiwyg__toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1px;
  row-gap: 2px;
  padding: 0.45rem 0.6rem;
  background: white;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  box-shadow: 0 1px 6px rgba(14,12,10,0.06);
  margin-bottom: 1.25rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tb-sep {
  width: 1px;
  height: 20px;
  background: var(--color-line);
  margin: 0 4px;
  flex-shrink: 0;
}

.tb-btn {
  min-width: 30px;
  height: 28px;
  padding: 0 7px;
  border: 1px solid transparent;
  border-radius: 5px;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--color-mist);
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  user-select: none;
}

.tb-btn:hover {
  background: var(--color-cream);
  border-color: var(--color-line);
  color: var(--color-ink);
}

.tb-btn:active {
  background: rgba(200,136,42,0.1);
  border-color: rgba(200,136,42,0.4);
  color: var(--color-amber-dark);
}

/* Label modifiers */
.fw-bold   { font-weight: 800; }
.fw-italic { font-style: italic; font-weight: 500; }
.fw-strike { text-decoration: line-through; }
.fw-mono   { font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: -0.02em; }

.tb-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  color: currentColor;
}

/* ── Editor body ── */
.wysiwyg__body {
  flex: 1;
  outline: none;
  min-height: 440px;
  padding: 0 0 3rem;
  cursor: text;
  caret-color: var(--color-amber);
  word-break: break-word;
}

.wysiwyg__body:empty::before {
  content: attr(data-placeholder);
  color: var(--color-line-dark);
  font-family: var(--font-body);
  font-size: 0.97rem;
  pointer-events: none;
}
</style>

<!-- Unscoped: content rendered inside contenteditable -->
<style>
.wysiwyg__body p,
.wysiwyg__body div {
  font-family: var(--font-body);
  font-size: 0.97rem;
  line-height: 1.8;
  color: var(--color-ink);
  margin: 0 0 0.5em;
}

.wysiwyg__body h1,
.wysiwyg__body h2,
.wysiwyg__body h3,
.wysiwyg__body h4 {
  font-family: var(--font-display);
  color: var(--color-ink);
  line-height: 1.2;
  margin: 1.3em 0 0.35em;
}
.wysiwyg__body h1 { font-size: 1.85rem; font-weight: 900; }
.wysiwyg__body h2 { font-size: 1.4rem;  font-weight: 700; }
.wysiwyg__body h3 { font-size: 1.1rem;  font-weight: 700; }
.wysiwyg__body h4 { font-size: 1rem;    font-weight: 700; }

.wysiwyg__body strong,
.wysiwyg__body b   { font-weight: 700; }
.wysiwyg__body em,
.wysiwyg__body i   { font-style: italic; color: var(--color-amber-dark); }
.wysiwyg__body s,
.wysiwyg__body strike,
.wysiwyg__body del { text-decoration: line-through; color: var(--color-mist); }
.wysiwyg__body a   { color: var(--color-amber-dark); text-decoration: underline; text-underline-offset: 2px; }

.wysiwyg__body blockquote {
  margin: 1.1em 0;
  padding: 0.8rem 1.2rem;
  border-left: 3px solid var(--color-amber);
  background: rgba(200,136,42,0.05);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
.wysiwyg__body blockquote p {
  margin: 0;
  font-family: var(--font-display);
  font-style: italic;
  color: var(--color-amber-dark);
}

.wysiwyg__body ul,
.wysiwyg__body ol  { padding-left: 1.5rem; margin: 0 0 0.8em; }
.wysiwyg__body ul  { list-style: none; }
.wysiwyg__body ul > li {
  position: relative;
  padding-left: 1.2rem;
  font-family: var(--font-body);
  font-size: 0.97rem;
  line-height: 1.7;
  color: var(--color-ink);
  margin-bottom: 0.2em;
}
.wysiwyg__body ul > li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--color-amber);
  font-weight: 700;
  font-family: var(--font-display);
}
.wysiwyg__body ol { list-style: decimal; }
.wysiwyg__body ol > li {
  font-family: var(--font-body);
  font-size: 0.97rem;
  line-height: 1.7;
  color: var(--color-ink);
  margin-bottom: 0.2em;
}

.wysiwyg__body code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: var(--color-cream);
  border: 1px solid var(--color-line);
  padding: 0.1em 0.4em;
  border-radius: 3px;
  color: var(--color-rust);
}
.wysiwyg__body pre {
  background: var(--color-ink);
  border-radius: var(--radius-md);
  padding: 1.1rem 1.4rem;
  overflow-x: auto;
  margin: 1.1em 0;
}
.wysiwyg__body pre code {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-paper);
  font-size: 0.875rem;
  line-height: 1.7;
}

.wysiwyg__body hr {
  border: none;
  border-top: 1px solid var(--color-line);
  margin: 1.8em 0;
}

.wysiwyg__body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.2em 0;
  font-size: 0.9rem;
}
.wysiwyg__body th {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-mist);
  padding: 0.5rem 0.875rem;
  border-bottom: 2px solid var(--color-line);
  text-align: left;
}
.wysiwyg__body td {
  padding: 0.5rem 0.875rem;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-ink);
}
.wysiwyg__body tr:last-child td { border-bottom: none; }
</style>
