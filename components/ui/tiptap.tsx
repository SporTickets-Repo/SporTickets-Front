"use client";

import Document from "@tiptap/extension-document";
import Highlight from "@tiptap/extension-highlight";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";

interface TiptapProps {
  onChange: (content: string) => void;
  initialContent?: string;
  enableLinks?: boolean;
}

export const Tiptap = ({
  onChange,
  initialContent = "",
  enableLinks = true,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      Document,
      StarterKit.configure({ document: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Placeholder.configure({ placeholder: "Digite aqui..." }),
      ...(enableLinks
        ? [
            LinkExtension.configure({
              openOnClick: false,
              HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
            }),
          ]
        : []),
    ],
    content: initialContent,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== initialContent) {
      editor.commands.setContent(initialContent, false);
    }
  }, [initialContent, editor]);

  const handleBlur = () => {
    if (!editor) return;
    onChange(editor.getHTML());
  };

  return (
    <div className="tiptap-container border rounded-lg p-2">
      <MenuBar editor={editor} enableLinks={enableLinks} />
      <EditorContent
        editor={editor}
        onBlur={handleBlur}
        className="max-h-[300px] overflow-auto rounded-b-lg focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
      />
    </div>
  );
};

interface MenuBarProps {
  editor: Editor | null;
  enableLinks: boolean;
}

const MenuBar = ({ editor, enableLinks }: MenuBarProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) return null;

  const applyLink = () => {
    if (!linkUrl) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    if (selectedText) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${
            linkText || linkUrl
          }</a>`
        )
        .run();
    }
    setLinkText("");
    setLinkUrl("");
    setDialogOpen(false);
  };

  return (
    <div className="button-group mb-2 flex flex-wrap gap-1">
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

      {enableLinks && (
        <>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className={editor.isActive("link") ? "is-active" : ""}
              >
                <Link size={18} />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Inserir/Editar Link
                </DialogTitle>
                <DialogDescription className="text-center">
                  Informe o texto do link (opcional) e a URL.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-1">
                  <label className="text-sm font-medium">Texto do Link</label>
                  <Input
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="ex: Página do Evento"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm font-medium">URL do Link</label>
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button onClick={applyLink}>Inserir</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};
