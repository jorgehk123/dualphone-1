"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";

export default function PagoPage() {
  const { cartItems, setCartItems, clearCart, totalPrice } = useCart();

  const paypalRef = useRef<HTMLDivElement | null>(null);

  const [loadingPayPal, setLoadingPayPal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🔥 FIX del hydration mismatch
  const [clientTotal, setClientTotal] = useState<number | null>(null);

  useEffect(() => {
    setClientTotal(totalPrice());
  }, [totalPrice]);

  // ⬅️ Cargar carrito desde localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cart")) {
      const saved = localStorage.getItem("cart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    }
  }, [setCartItems]);

  // ⬅️ Inicializar PayPal
  useEffect(() => {
    if (!paypalRef.current || cartItems.length === 0) return;

    const existing = document.querySelector(
      "script[src*='paypal.com/sdk/js']"
    );

    if (existing) {
      renderPayPal();
      return;
    }

    setLoadingPayPal(true);

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;

    script.onload = () => {
      setLoadingPayPal(false);
      renderPayPal();
    };

    script.onerror = () => {
      setLoadingPayPal(false);
      setMessage("Error cargando PayPal");
    };

    document.body.appendChild(script);

    function renderPayPal() {
      const paypal = (window as any).paypal;

      if (!paypal || !paypalRef.current) return;

      paypalRef.current.innerHTML = "";

      paypal
        .Buttons({
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: totalPrice() },
                },
              ],
            });
          },

          onApprove: async (_data: any, actions: any) => {
            const details = await actions.order.capture();
            setMessage(
              `Pago completado ✔ — Gracias ${details.payer.name.given_name}`
            );
            clearCart();
          },

          onError: (err: any) => {
            setMessage("Error en PayPal: " + String(err));
          },
        })
        .render(paypalRef.current);
    }
  }, [cartItems, totalPrice, clearCart]);

  // ➤ VISA simulada
  const payWithVisa = async () => {
    setMessage(null);
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice(),
          items: cartItems,
        }),
      });

      const json = await res.json();

      if (json?.status === "success") {
        setMessage("Pago con Visa simulado ✓");
        clearCart();
      } else {
        setMessage("Error en el pago");
      }
    } catch {
      setMessage("Error del servidor");
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <header className="w-full flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pago</h1>

        {/* 🔥 FIX: Mostrar total solo después del montaje del cliente */}
        <div className="text-sm opacity-80">
          Total:{" "}
          <span className="font-semibold">
            {clientTotal === null ? "..." : `$${clientTotal}`}
          </span>
        </div>
      </header>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>

        {cartItems.length === 0 ? (
          <p className="opacity-60">Carrito vacío.</p>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-blue-400">
                    {item.price} × {item.quantity}
                  </div>
                </div>

                <div>
                  $
                  {(
                    parseFloat(item.price.replace("$", "")) * item.quantity
                  ).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>
                {clientTotal === null ? "..." : `$${clientTotal}`}
              </span>
            </div>
          </div>
        )}

        {/* PAYPAL */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Pagar con PayPal</h3>
          <div ref={paypalRef}></div>
          {loadingPayPal && (
            <p className="text-sm opacity-70">Cargando PayPal...</p>
          )}
        </div>

        {/* VISA */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Pagar con Visa (Simulado)</h3>
          <button
            onClick={payWithVisa}
            className="w-full py-3 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Pagar con Visa
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
