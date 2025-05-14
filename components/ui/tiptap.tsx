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
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as LinkIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
              HTMLAttributes: {
                target: "_blank",
                rel: "noopener noreferrer",
              },
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

const linkSchema = z.object({
  linkText: z
    .string()
    .max(100, "Texto do link deve ter no máximo 100 caracteres")
    .optional(),
  linkUrl: z
    .string()
    .nonempty("URL é obrigatória")
    .url("Informe uma URL válida (ex: https://...)"),
});

type LinkForm = z.infer<typeof linkSchema>;

interface MenuBarProps {
  editor: Editor | null;
  enableLinks: boolean;
}

const MenuBar = ({ editor, enableLinks }: MenuBarProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LinkForm>({
    resolver: zodResolver(linkSchema),
    defaultValues: { linkText: "", linkUrl: "" },
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  if (!editor) return null;

  const onSubmit = (data: LinkForm) => {
    const { linkText, linkUrl } = data;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    editor.chain().focus();
    if (selectedText) {
      editor.chain().setLink({ href: linkUrl }).insertContent(" ").run();
    } else {
      editor
        .chain()
        .insertContent(
          `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${
            linkText || linkUrl
          }</a>&nbsp;`
        )
        .run();
    }

    reset();
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button type="button">
              <LinkIcon size={16} />
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

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
              <div className="grid gap-1">
                <label className="text-sm font-medium">Texto do Link</label>
                <Input
                  {...register("linkText")}
                  placeholder="ex: Página do Evento"
                />
                {errors.linkText && (
                  <p className="text-xs text-red-600">
                    {errors.linkText.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">URL do Link</label>
                <Input {...register("linkUrl")} placeholder="https://..." />
                {errors.linkUrl && (
                  <p className="text-xs text-red-600">
                    {errors.linkUrl.message}
                  </p>
                )}
              </div>

              <DialogFooter className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  Inserir
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
