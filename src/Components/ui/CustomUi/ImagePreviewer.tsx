import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Eye, X } from "lucide-react";

interface ImagePreviewerProps {
    src: string;
    alt?: string;
    className?: string;
    containerClassName?: string;
}

const ImagePreviewer = ({ src, alt = "Image", className, containerClassName }: ImagePreviewerProps) => {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);

    const handleOpen = () => setOpen(true);

    const handleClose = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, handleClose]);

    return (
        <>
            {/* Thumbnail */}
            <div
                className={`relative overflow-hidden cursor-pointer ${containerClassName ?? "w-full h-full"}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={handleOpen}
            >
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-transform duration-300 ${hovered ? "scale-105" : "scale-100"} ${className ?? ""}`}
                />
                <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5">
                        <Eye className="size-5 text-white" />
                    </div>
                </div>
            </div>

            {/* Preview Portal */}
            {open && createPortal(
                <div
                    className="fixed inset-0 z-9999 flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.85)" }}
                    onClick={handleClose}
                >
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                        <X className="size-5" />
                    </button>

                    {/* Image */}
                    <img
                        src={src}
                        alt={alt}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            objectFit: "contain",
                            borderRadius: 8,
                        }}
                    />
                </div>,
                document.body
            )}
        </>
    );
};

export default ImagePreviewer;
