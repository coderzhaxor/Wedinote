import React, { useState, useCallback } from 'react';

// Impor inti dari Lexical
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

// Impor node dan command dari Lexical
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  TextNode
} from 'lexical';

// Konfigurasi awal untuk editor
const theme = {
  // Anda bisa menambahkan styling di sini jika perlu
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'editor-paragraph',
};

function onError(error) {
  console.error(error);
}

// Komponen untuk Toolbar
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const onClick = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="toolbar" style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
      <button onClick={() => onClick('bold')} style={{ marginRight: '5px' }}><b>B</b></button>
      <button onClick={() => onClick('italic')} style={{ marginRight: '5px' }}><i>I</i></button>
      <button onClick={() => onClick('strikethrough')} style={{ marginRight: '5px' }}><s>S</s></button>
      <button onClick={() => onClick('code')}>`Code`</button>
      <button onClick={() => onClick('undo')}>Undo</button>
    </div>
  );
}

// <<< INI BAGIAN UTAMANYA: FUNGSI SERIALIZER >>>
function serializeToWhatsappMarkdown(editorState) {
  let markdownString = '';
  // Baca editor state di dalam transaksi read-only untuk keamanan
  editorState.read(() => {
    const root = $getRoot();
    const children = root.getChildren();

    children.forEach((paragraphNode, index) => {
      let line = '';
      const textNodes = paragraphNode.getChildren();

      textNodes.forEach(node => {
        // Pastikan kita hanya memproses TextNode
        if (node instanceof TextNode) {
          let text = node.getTextContent();

          // Terapkan format secara berurutan
          if (node.hasFormat('code')) {
            text = '```' + text + '```';
          }
          if (node.hasFormat('strikethrough')) {
            text = '~' + text + '~';
          }
          if (node.hasFormat('italic')) {
            text = '_' + text + '_';
          }
          if (node.hasFormat('bold')) {
            text = '*' + text + '*';
          }
          line += text;
        }
      });

      markdownString += line;
      // Tambahkan baris baru jika bukan paragraf terakhir
      if (index < children.length - 1) {
        markdownString += '\n';
      }
    });
  });

  return markdownString;
}


// Komponen Editor Utama
export default function WhatsappEditor() {
  const [markdownOutput, setMarkdownOutput] = useState('');

  const initialConfig = {
    namespace: 'WhatsappEditor',
    theme,
    onError,
  };

  // Callback yang akan dipanggil setiap kali konten editor berubah
  const onChange = useCallback((editorState) => {
    const markdown = serializeToWhatsappMarkdown(editorState);
    setMarkdownOutput(markdown);
    // Anda juga bisa memanggil fungsi lain di sini, misalnya untuk menyimpan ke database
    console.log(markdown);
  }, []);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable style={{ minHeight: '150px', outline: 'none' }} />}
          placeholder={<div style={{ color: '#aaa', position: 'absolute', top: '50px', left: '10px' }}>Ketik sesuatu...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Output Markdown WhatsApp:</h3>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
          {markdownOutput || '(Output akan muncul di sini)'}
        </pre>
      </div>
    </LexicalComposer>
  );
}