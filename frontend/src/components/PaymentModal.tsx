"use client";
import { useEffect, useRef } from "react";

function injectIyzicoScript(html: string, containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = html;
  container.querySelectorAll("script").forEach((oldScript) => {
    const newScript = document.createElement("script");
    if (oldScript.src) {
      newScript.src = oldScript.src;
      newScript.async = true;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.replaceWith(newScript);
  });
}

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  checkoutFormContent?: string;
  iframeUrl?: string; // PayTR
  title?: string;
}

const CONTAINER_ID = "payment-checkout-form";

export default function PaymentModal({ show, onClose, checkoutFormContent, iframeUrl, title = "Güvenli Ödeme" }: PaymentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show || !checkoutFormContent) return;
    setTimeout(() => injectIyzicoScript(checkoutFormContent, CONTAINER_ID), 100);
  }, [show, checkoutFormContent]);

  useEffect(() => {
    if (!show) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div ref={modalRef} className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl font-bold z-10" aria-label="Kapat">
          ✕
        </button>
        <div className="p-6 pt-10">
          <p className="text-sm font-semibold text-gray-800 mb-4 text-center">{title}</p>
          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              style={{ width: "100%", height: "600px" }}
              frameBorder="0"
              scrolling="yes"
            />
          ) : (
            <div id={CONTAINER_ID} />
          )}
        </div>
      </div>
    </div>
  );
}
