"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  open: boolean;
  onClose: () => void;
  imageFile: File | null;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio: number;
  previewWidth: number;
  previewHeight: number;
  previewLabel: string;
}

export function ImageCropper({
  open,
  onClose,
  imageFile,
  onCropComplete,
  aspectRatio,
  previewWidth,
  previewHeight,
  previewLabel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [imageSrc, setImageSrc] = useState<string>("");
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(imageFile);

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile]);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 100,
          },
          aspectRatio,
          width,
          height
        ),
        width,
        height
      );
      setCrop(initialCrop);
      setCompletedCrop(initialCrop);
      setImageLoaded(true);
    },
    [aspectRatio]
  );

  const generateCroppedImage = async () => {
    if (!imageRef.current || !completedCrop) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = previewWidth;
    canvas.height = previewHeight;

    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      previewWidth,
      previewHeight
    );

    return new Promise<File>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Canvas is empty");
          }
          const croppedFile = new File(
            [blob],
            imageFile?.name || "cropped-image.jpg",
            {
              type: "image/jpeg",
              lastModified: Date.now(),
            }
          );

          const previewUrl = URL.createObjectURL(croppedFile);
          setPreviewUrl(previewUrl);

          resolve(croppedFile);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  useEffect(() => {
    if (completedCrop && imageLoaded) {
      generateCroppedImage().then((file) => {
        if (file) {
          const previewUrl = URL.createObjectURL(file);
          setPreviewUrl(previewUrl);
        }
      });
    }
  }, [completedCrop, imageLoaded]);

  useEffect(() => {
    if (!open) {
      setImageSrc("");
      setCrop(undefined);
      setCompletedCrop(null);
      setPreviewUrl("");
      setImageLoaded(false);
    }
  }, [open]);

  const handleSaveCrop = async () => {
    try {
      const croppedFile = await generateCroppedImage();
      if (croppedFile) {
        onCropComplete(croppedFile);
        onClose();
      }
    } catch (error) {
      console.error("Error generating cropped image:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Ajustar imagem</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="overflow-auto max-h-[60vh]">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                minWidth={100}
              >
                <img
                  ref={imageRef}
                  src={imageSrc || "/placeholder.svg"}
                  alt="Imagem para recortar"
                  style={{ maxWidth: "100%" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium">Pré-visualização</div>
            <div className="border rounded-lg p-2 bg-gray-50">
              <div className="text-xs text-muted-foreground mb-2">
                {previewLabel}
              </div>
              <div
                className="relative bg-gray-200 overflow-hidden"
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: `${previewWidth}/${previewHeight}`,
                }}
              >
                {previewUrl ? (
                  <Image
                    src={previewUrl || "/placeholder.svg"}
                    alt="Pré-visualização"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                    Ajuste a imagem para ver a pré-visualização
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Arraste para mover e redimensione para ajustar a imagem. A
              proporção será mantida automaticamente.
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSaveCrop}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
