"use client";

import Document from "@tiptap/extension-document";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

interface TiptapProps {
  onChange: (content: string) => void;
  initialContent?: string;
}

export const Tiptap = ({ onChange, initialContent = "" }: TiptapProps) => {
  const [html, setHtml] = useState(initialContent);
  const debouncedHtml = useDebounce(html, 150);

  const editor = useEditor({
    extensions: [
      Document,

      StarterKit.configure({ document: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Placeholder.configure({
        placeholder: "Digite aqui...",
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    onChange(debouncedHtml);
  }, [debouncedHtml]);

  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent, false);
      setHtml(initialContent);
    }
  }, [initialContent]);

  return (
    <div className="tiptap-container">
      <MenuBar editor={editor} />
      <EditorContent className="max-h-[300px] overflow-auto" editor={editor} />
    </div>
  );
};

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  return (
    <div className="button-group">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        T1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        T2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <b>B</b>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive("highlight") ? "is-active" : ""}
      >
        D
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        UL
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        OL
      </button>
    </div>
  );
};
