'use client';
// Zengin metin editörü (Tiptap). Çıktı HTML'dir; mevcut sayfa içerikleriyle uyumlu kalması için
// h1–h4, liste, alıntı, bağlantı, görsel ve başlıklardaki `id` öznitelikleri korunur.
// Görsel yükleme yönetim panelinin depolama ucunu kullanır. Başka projelere taşınabilir:
// yalnız `onUploadImage` ve stil sınıfları projeye göre verilir.
import './rich-text-editor.css';
import { useEffect, useRef, useState } from 'react';
import { Extension } from '@tiptap/core';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Code2, Heading2, Heading3, Image as ImageIcon, Italic, Link as LinkIcon, List, ListOrdered,
  Loader2, Minus, Quote, Redo2, Underline, Undo2,
} from 'lucide-react';

export type RichTextEditorProps = {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  /** Görseli yükleyip herkese açık adresini döndürür; verilmezse görsel düğmesi gizlenir. */
  onUploadImage?: (file: File) => Promise<string>;
  'aria-label'?: string;
};

/** Var olan içerikteki başlık/paragraf `id` değerlerini korur (sayfa içi bağlantılar bozulmasın). */
const PreserveId = Extension.create({
  name: 'preserveId',
  addGlobalAttributes() {
    return [{
      types: ['heading', 'paragraph'],
      attributes: {
        id: {
          default: null,
          parseHTML: (el: HTMLElement) => el.getAttribute('id'),
          renderHTML: (attrs: { id?: string | null }) => (attrs.id ? { id: attrs.id } : {}),
        },
      },
    }];
  },
});

export function RichTextEditor({ id, value, onChange, placeholder, minHeight = 320, onUploadImage, ...rest }: RichTextEditorProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState(false);
  const [sourceText, setSourceText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } },
      }),
      Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
      Placeholder.configure({ placeholder: placeholder ?? '' }),
      PreserveId,
    ],
    content: value || '',
    editorProps: { attributes: { class: 'rte-content', ...(id ? { id } : {}), 'aria-label': rest['aria-label'] ?? 'İçerik', role: 'textbox', 'aria-multiline': 'true' } },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML()),
  });

  // Dışarıdan gelen değer değişirse (başka kayıt seçildi, kaynak görünümünde düzenlendi) editörü eşitle.
  useEffect(() => {
    if (!editor || source) return;
    if ((value || '') !== (editor.isEmpty ? '' : editor.getHTML())) editor.commands.setContent(value || '', { emitUpdate: false });
  }, [value, editor, source]);

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editor || !onUploadImage) return;
    if (!file.type.startsWith('image/')) { setUploadError('Lütfen bir görsel dosyası seçin.'); return; }
    setUploading(true); setUploadError('');
    try {
      const src = await onUploadImage(file);
      const alt = window.prompt('Görsel açıklaması (erişilebilirlik ve SEO için)', '') ?? '';
      editor.chain().focus().setImage({ src, alt: alt.trim() }).run();
    } catch {
      setUploadError('Görsel yüklenemedi. Dosya boyutunu ve biçimini kontrol edip tekrar deneyin.');
    } finally { setUploading(false); }
  }

  // Kaynak görünümündeki HTML editör şemasından geçirilerek kaydedilir: izin verilmeyen etiket ve
  // öznitelikler (script, olay işleyicileri vb.) içeriğe giremez.
  function applySource(raw: string) {
    setSourceText(raw);
    if (!editor) return;
    editor.commands.setContent(raw, { emitUpdate: false });
    onChange(editor.isEmpty ? '' : editor.getHTML());
  }

  function editLink(ed: Editor) {
    const prev = ed.getAttributes('link').href as string | undefined;
    const input = window.prompt('Bağlantı adresi (boş bırakırsan bağlantı kaldırılır)', prev ?? 'https://');
    if (input === null) return;
    const href = input.trim();
    if (!href) ed.chain().focus().extendMarkRange('link').unsetLink().run();
    else ed.chain().focus().extendMarkRange('link').setLink({ href }).run();
  }

  if (!editor) return <div className="rte-shell rte-loading" style={{ minHeight }}>Editör yükleniyor…</div>;

  const tool = (label: string, icon: React.ReactNode, run: () => void, active = false, disabled = false) => (
    <button type="button" className="rte-btn" data-active={active || undefined} aria-pressed={active} aria-label={label} title={label}
      disabled={disabled || source} onMouseDown={(e) => e.preventDefault()} onClick={run}>{icon}</button>
  );
  const c = () => editor.chain().focus();

  return (
    <div className="rte-shell">
      <div className="rte-toolbar" role="toolbar" aria-label="Biçimlendirme">
        {tool('Kalın', <Bold size={16} />, () => c().toggleBold().run(), editor.isActive('bold'))}
        {tool('İtalik', <Italic size={16} />, () => c().toggleItalic().run(), editor.isActive('italic'))}
        {tool('Altı çizili', <Underline size={16} />, () => c().toggleUnderline().run(), editor.isActive('underline'))}
        <span className="rte-sep" aria-hidden />
        {tool('Başlık (H2)', <Heading2 size={16} />, () => c().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
        {tool('Alt başlık (H3)', <Heading3 size={16} />, () => c().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }))}
        <span className="rte-sep" aria-hidden />
        {tool('Madde listesi', <List size={16} />, () => c().toggleBulletList().run(), editor.isActive('bulletList'))}
        {tool('Numaralı liste', <ListOrdered size={16} />, () => c().toggleOrderedList().run(), editor.isActive('orderedList'))}
        {tool('Alıntı', <Quote size={16} />, () => c().toggleBlockquote().run(), editor.isActive('blockquote'))}
        {tool('Ayırıcı çizgi', <Minus size={16} />, () => c().setHorizontalRule().run())}
        <span className="rte-sep" aria-hidden />
        {tool('Bağlantı', <LinkIcon size={16} />, () => editLink(editor), editor.isActive('link'))}
        {onUploadImage && tool('Görsel yükle', uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />, () => fileInput.current?.click(), false, uploading)}
        <span className="rte-sep" aria-hidden />
        {tool('Geri al', <Undo2 size={16} />, () => c().undo().run(), false, !editor.can().undo())}
        {tool('Yinele', <Redo2 size={16} />, () => c().redo().run(), false, !editor.can().redo())}
        <button type="button" className="rte-btn rte-source" data-active={source || undefined} aria-pressed={source} onClick={() => { if (!source) setSourceText(value); setSource((s) => !s); }} title="HTML kaynağını göster">
          <Code2 size={16} /> <span>HTML</span>
        </button>
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={pickImage} />
      </div>
      {uploadError && <p role="alert" className="rte-error">{uploadError}</p>}
      {source
        ? <textarea className="rte-source-input" style={{ minHeight }} value={sourceText} spellCheck={false} aria-label="HTML kaynağı" onChange={(e) => applySource(e.target.value)} />
        : <EditorContent editor={editor} style={{ minHeight }} />}
    </div>
  );
}
