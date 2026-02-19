<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
}

const notes = ref<Note[]>([])
const selectedNote = ref<Note | null>(null)
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const showNewNoteModal = ref(false)
const newNoteTitle = ref('')

// Fetch notes
async function fetchNotes() {
  loading.value = true
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false })

  if (!error && data) {
    notes.value = data as Note[]
    if (notes.value.length > 0 && !selectedNote.value) {
      selectedNote.value = notes.value[0]
    }
  }
  loading.value = false
}

// Create note
async function createNote() {
  if (!newNoteTitle.value.trim()) return
  saving.value = true

  const { data, error } = await supabase.from('notes').insert({
    title: newNoteTitle.value,
    content: '',
    user_id: user.value?.id,
  }).select().single()

  saving.value = false
  showNewNoteModal.value = false
  newNoteTitle.value = ''

  if (!error && data) {
    notes.value.unshift(data as Note)
    selectedNote.value = data as Note
  }
}

// Auto-save note content
const saveTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

async function handleContentChange() {
  if (!selectedNote.value) return
  if (saveTimeout.value) clearTimeout(saveTimeout.value)

  saveTimeout.value = setTimeout(async () => {
    saving.value = true
    await supabase.from('notes').update({
      content: selectedNote.value!.content,
      title: selectedNote.value!.title,
      updated_at: new Date().toISOString(),
    }).eq('id', selectedNote.value!.id)
    saving.value = false

    // Update in list
    const idx = notes.value.findIndex(n => n.id === selectedNote.value!.id)
    if (idx !== -1) {
      notes.value[idx] = { ...selectedNote.value! }
    }
  }, 1000)
}

// Delete note
async function deleteNote(id: string) {
  await supabase.from('notes').delete().eq('id', id)
  notes.value = notes.value.filter(n => n.id !== id)
  if (selectedNote.value?.id === id) {
    selectedNote.value = notes.value[0] || null
  }
}

// Sign out
async function signOut() {
  await supabase.auth.signOut()
  navigateTo('/')
}

// Filtered notes
const filteredNotes = computed(() => {
  if (!searchQuery.value) return notes.value
  const q = searchQuery.value.toLowerCase()
  return notes.value.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.content.toLowerCase().includes(q)
  )
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function notePreview(content: string) {
  // Strip markdown symbols for clean preview in sidebar
  return content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^[-*+]\s/gm, '')
    .replace(/^\d+\.\s/gm, '')
    .replace(/^>\s/gm, '')
    .trim()
    .substring(0, 80) || 'Empty note...'
}

onMounted(fetchNotes)
</script>

<template>
  <div class="notes-app">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar__header">
        <div class="sidebar__brand">
          <div class="sidebar__logo">NF</div>
          <span>NoteForge</span>
        </div>
        <button class="sidebar__new-btn" @click="showNewNoteModal = true" title="New note">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 4v10M4 9h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="sidebar__search">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="sidebar__search-icon">
          <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10 10l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          v-model="searchQuery"
          placeholder="Search notes..."
          class="sidebar__search-input"
        />
      </div>

      <div class="sidebar__notes">
        <div v-if="loading" class="sidebar__loading">
          <div v-for="i in 4" :key="i" class="sidebar__skeleton" :style="`animation-delay: ${i * 0.1}s`" />
        </div>

        <template v-else>
          <p v-if="filteredNotes.length === 0" class="sidebar__empty">
            {{ searchQuery ? 'No notes found.' : 'No notes yet. Create your first!' }}
          </p>

          <button
            v-for="note in filteredNotes"
            :key="note.id"
            class="note-item"
            :class="{ 'note-item--active': selectedNote?.id === note.id }"
            @click="selectedNote = note"
          >
            <div class="note-item__title">{{ note.title || 'Untitled' }}</div>
            <div class="note-item__preview">{{ notePreview(note.content) }}</div>
            <div class="note-item__date">{{ formatDate(note.updated_at) }}</div>
          </button>
        </template>
      </div>

      <div class="sidebar__footer">
        <div class="sidebar__user">
          <div class="sidebar__avatar">
            {{ user?.email?.charAt(0).toUpperCase() }}
          </div>
          <div class="sidebar__user-info">
            <span class="sidebar__user-name">{{ user?.user_metadata?.full_name || 'Writer' }}</span>
            <span class="sidebar__user-email">{{ user?.email }}</span>
          </div>
        </div>
        <button class="sidebar__signout" @click="signOut" title="Sign out">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 2h3a1 1 0 011 1v10a1 1 0 01-1 1h-3M7 11l3-3-3-3M10 8H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Editor -->
    <div class="editor">
      <template v-if="selectedNote">
        <div class="editor__toolbar">
          <div class="editor__meta">
            <span class="editor__date">{{ formatDate(selectedNote.updated_at) }}</span>
            <span class="editor__status" :class="{ 'editor__status--saving': saving }">
              <span class="editor__status-dot" />
              {{ saving ? 'Saving...' : 'Saved' }}
            </span>
          </div>
          <div class="editor__actions">
            <button class="editor__delete-btn" @click="deleteNote(selectedNote!.id)" title="Delete note">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 4h11M5 4V2.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5V4M6 7v4M9 7v4M3 4l.8 9.5a.5.5 0 00.5.5h6.4a.5.5 0 00.5-.5L12 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Delete
            </button>
          </div>
        </div>

        <div class="editor__content">
          <!-- Title -->
          <textarea
            class="editor__title"
            v-model="selectedNote.title"
            @input="handleContentChange"
            placeholder="Untitled"
            rows="1"
          />

          <!-- ✨ Markdown Editor component -->
          <AppMarkdownEditor
            v-model="selectedNote.content"
            @update:modelValue="handleContentChange"
          />
        </div>
      </template>

      <div v-else class="editor__empty">
        <div class="editor__empty-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="6" width="32" height="36" rx="3" stroke="currentColor" stroke-width="1.8"/>
            <path d="M16 16h16M16 22h12M16 28h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <h3>Select a note or create one</h3>
        <p>Your thoughts are waiting to be written.</p>
        <button class="btn btn--primary" @click="showNewNoteModal = true">
          Create your first note
        </button>
      </div>
    </div>

    <!-- New Note Modal -->
    <Teleport to="body">
      <div v-if="showNewNoteModal" class="modal-overlay" @click.self="showNewNoteModal = false">
        <div class="modal">
          <h3 class="modal__title">New note</h3>
          <div class="form-field">
            <label>Note title</label>
            <input
              v-model="newNoteTitle"
              placeholder="e.g. Meeting notes, Ideas for project..."
              @keyup.enter="createNote"
              autofocus
            />
          </div>
          <div class="modal__actions">
            <button class="btn btn--ghost" @click="showNewNoteModal = false">Cancel</button>
            <button class="btn btn--primary" @click="createNote" :disabled="!newNoteTitle.trim() || saving">
              <span v-if="saving" class="spinner" />
              <span v-else>Create</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.notes-app {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--color-cream);
}

/* Sidebar */
.sidebar {
  width: 280px;
  min-width: 280px;
  background: var(--color-paper);
  border-right: 1px solid var(--color-line);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid var(--color-line);
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-ink);
}

.sidebar__logo {
  width: 28px;
  height: 28px;
  background: var(--color-ink);
  color: var(--color-amber);
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
}

.sidebar__new-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--color-line-dark);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-mist);
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar__new-btn:hover {
  border-color: var(--color-amber);
  color: var(--color-amber);
  background: rgba(200, 136, 42, 0.05);
}

.sidebar__search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: var(--color-cream);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
}

.sidebar__search-icon {
  color: var(--color-mist);
  flex-shrink: 0;
}

.sidebar__search-input {
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--color-ink);
  outline: none;
  width: 100%;
}

.sidebar__search-input::placeholder {
  color: var(--color-mist);
}

.sidebar__notes {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.sidebar__loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem;
}

.sidebar__skeleton {
  height: 68px;
  background: linear-gradient(90deg, var(--color-cream) 0%, var(--color-line) 50%, var(--color-cream) 100%);
  background-size: 200%;
  border-radius: var(--radius-sm);
  animation: shimmer 1.5s ease infinite;
}

.sidebar__empty {
  text-align: center;
  color: var(--color-mist);
  font-size: 0.85rem;
  padding: 2rem 1rem;
  font-style: italic;
}

.note-item {
  width: 100%;
  text-align: left;
  padding: 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 2px;
}

.note-item:hover {
  background: var(--color-cream);
  border-color: var(--color-line);
}

.note-item--active {
  background: white;
  border-color: var(--color-line-dark);
  box-shadow: var(--shadow-card);
}

.note-item--active .note-item__title {
  color: var(--color-amber-dark);
}

.note-item__title {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-ink);
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-item__preview {
  font-size: 0.78rem;
  color: var(--color-mist);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.4rem;
}

.note-item__date {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-line-dark);
}

.sidebar__footer {
  border-top: 1px solid var(--color-line);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  min-width: 0;
}

.sidebar__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-ink);
  color: var(--color-amber);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar__user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar__user-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--color-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__user-email {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-mist);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__signout {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--color-mist);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  flex-shrink: 0;
}

.sidebar__signout:hover {
  color: var(--color-rust);
  background: rgba(139, 58, 42, 0.08);
}

/* Editor */
.editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-paper);
}

.editor__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--color-line);
  background: white;
}

.editor__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.editor__date {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-mist);
}

.editor__status {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-sage);
}

.editor__status--saving .editor__status-dot {
  background: var(--color-amber) !important;
  animation: pulse 1s ease infinite;
}

.editor__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-sage);
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.editor__actions {
  display: flex;
  gap: 0.5rem;
}

.editor__delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-mist);
  cursor: pointer;
  transition: all 0.2s;
}

.editor__delete-btn:hover {
  border-color: var(--color-rust);
  color: var(--color-rust);
  background: rgba(139, 58, 42, 0.06);
}

.editor__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 3rem 3rem 1.5rem;
  max-width: 780px;
  margin: 0 auto;
  width: 100%;
}

.editor__title {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--color-ink);
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  width: 100%;
  line-height: 1.2;
  margin-bottom: 1rem;
  overflow: hidden;
}

.editor__title::placeholder {
  color: var(--color-line-dark);
}

.editor__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--color-mist);
  text-align: center;
  padding: 2rem;
}

.editor__empty-icon {
  color: var(--color-line-dark);
  margin-bottom: 0.5rem;
}

.editor__empty h3 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-ink);
}

.editor__empty p {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  text-decoration: none;
}

.btn--primary {
  background: var(--color-ink);
  color: var(--color-paper);
  border-color: var(--color-ink);
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-amber);
  border-color: var(--color-amber);
}

.btn--primary:disabled { opacity: 0.7; cursor: not-allowed; }

.btn--ghost {
  background: transparent;
  color: var(--color-ink);
  border-color: var(--color-line-dark);
}

.btn--ghost:hover { border-color: var(--color-ink); }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(14, 12, 10, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.15s ease;
}

.modal {
  background: white;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  animation: fadeUp 0.25s ease;
  box-shadow: var(--shadow-card-hover);
}

.modal__title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-ink);
  margin-bottom: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-field label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-ink);
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
}

.form-field input {
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--color-line);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-ink);
  background: var(--color-paper);
  outline: none;
  transition: border-color 0.2s;
}

.form-field input:focus { border-color: var(--color-amber); }

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(245, 240, 232, 0.3);
  border-top-color: var(--color-paper);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
