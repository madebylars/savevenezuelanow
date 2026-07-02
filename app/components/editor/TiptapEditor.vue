<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

const props = withDefaults(defineProps<{
  modelValue: string
  lang?: 'en' | 'es'
  showCharCount?: boolean
}>(), {
  lang: 'en',
  showCharCount: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const placeholder = computed(() =>
  props.lang === 'es' ? 'Escribe tu actualización aquí...' : 'Write your update here...'
)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    CharacterCount,
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: placeholder.value })
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val, false)
  }
})

onBeforeUnmount(() => editor.value?.destroy())

const charCount = computed(() => editor.value?.storage.characterCount?.characters() ?? 0)
const charCountClass = computed(() => {
  if (charCount.value >= 270) return 'text-primary'
  if (charCount.value >= 240) return 'text-accent'
  return 'text-white/40'
})

function toggleBold() { editor.value?.chain().focus().toggleBold().run() }
function toggleItalic() { editor.value?.chain().focus().toggleItalic().run() }
function toggleH2() { editor.value?.chain().focus().toggleHeading({ level: 2 }).run() }
function toggleH3() { editor.value?.chain().focus().toggleHeading({ level: 3 }).run() }
function toggleBullet() { editor.value?.chain().focus().toggleBulletList().run() }
function toggleBlockquote() { editor.value?.chain().focus().toggleBlockquote().run() }
function setLink() {
  const url = window.prompt('URL')
  if (url) editor.value?.chain().focus().setLink({ href: url }).run()
}
function clearFormatting() { editor.value?.chain().focus().clearNodes().unsetAllMarks().run() }

function isActive(name: string, attrs?: Record<string, unknown>) {
  return editor.value?.isActive(name, attrs)
}
</script>

<template>
  <div class="border border-white/20 bg-white/5">
    <!-- Toolbar -->
    <div class="flex flex-wrap gap-0 border-b border-white/10 p-1">
      <button
        v-for="btn in [
          { label: 'B', action: toggleBold, check: 'bold', title: 'Bold' },
          { label: 'I', action: toggleItalic, check: 'italic', title: 'Italic' },
          { label: 'H2', action: toggleH2, check: 'heading', checkAttrs: { level: 2 }, title: 'Heading 2' },
          { label: 'H3', action: toggleH3, check: 'heading', checkAttrs: { level: 3 }, title: 'Heading 3' },
          { label: '• List', action: toggleBullet, check: 'bulletList', title: 'Bullet list' },
          { label: '❝', action: toggleBlockquote, check: 'blockquote', title: 'Blockquote' },
        ]"
        :key="btn.label"
        @click="btn.action"
        :class="[
          'px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer border-0',
          isActive(btn.check, btn.checkAttrs)
            ? 'bg-primary text-white'
            : 'text-white/60 hover:text-white hover:bg-white/10 bg-transparent'
        ]"
        :title="btn.title"
        type="button"
      >{{ btn.label }}</button>
      <button @click="setLink" type="button" class="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 bg-transparent border-0 cursor-pointer transition-colors" title="Add link">🔗</button>
      <button @click="clearFormatting" type="button" class="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 bg-transparent border-0 cursor-pointer transition-colors" title="Clear formatting">✕ Clear</button>
    </div>

    <!-- Editor -->
    <EditorContent
      :editor="editor"
      class="min-h-45 p-4 text-white/90 focus-within:outline-none tiptap-content"
    />

    <!-- Char count -->
    <div v-if="showCharCount" class="px-4 py-2 border-t border-white/10 text-xs text-right" :class="charCountClass">
      {{ charCount }} / 280
    </div>
  </div>
</template>

<style>
.tiptap-content .ProseMirror { outline: none; min-height: 160px; }
.tiptap-content .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: rgba(255,255,255,0.25);
  pointer-events: none;
  height: 0;
}
.tiptap-content .ProseMirror h2 { font-family: 'Libre Baskerville', serif; font-size: 1.4rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #fff; }
.tiptap-content .ProseMirror h3 { font-family: 'Libre Baskerville', serif; font-size: 1.1rem; font-weight: 700; margin: 0.75rem 0 0.4rem; color: #fff; }
.tiptap-content .ProseMirror p { margin-bottom: 0.75rem; }
.tiptap-content .ProseMirror ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.tiptap-content .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.tiptap-content .ProseMirror blockquote { border-left: 3px solid #C8293A; padding-left: 1rem; margin: 1rem 0; color: rgba(255,255,255,0.65); font-style: italic; }
.tiptap-content .ProseMirror strong { font-weight: 600; }
.tiptap-content .ProseMirror a { color: #D4A847; text-decoration: underline; }
</style>
