"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  // ⬅️ GUARDAR CARRITO EN LOCALSTORAGE
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const iphones = [
    {
      id: 1,
      name: "iPhone 16 - 128 gb",
      image: "/iphone-16.png",
      price: "$750.00",
      description: "El último modelo con el chip A18 Pro y cámara mejorada.",
    },
    {
      id: 2,
      name: "iPhone 15 Pro - 128 gb",
      image: "/iphone-15-pro.png",
      price: "$700.00",
      description: "Titanio con cámara de 48MP y procesador ultrarrápido.",
    },
    {
      id: 3,
      name: "iPhone 15 - 128 gb",
      image: "/iphone-15.png",
      price: "$650.00",
      description: "Rendimiento potente con cámara dual avanzada.",
    },
    {
      id: 4,
      name: "iPhone 14 Pro - 128 gb",
      image: "/iPhone-14-Pro.png",
      price: "$560.00",
      description: "Pantalla Dynamic Island y zoom óptico 3x.",
    },
    {
      id: 5,
      name: "iPhone 14 - 128 gb",
      image: "/iphone-14.png",
      price: "$400.00",
      description: "Gran pantalla y batería duradera.",
    },
    {
      id: 6,
      name: "iPhone 13 Pro 128 gb",
      image: "/iphone-13-pro.png",
      price: "$350.00",
      description: "Acero inoxidable con zoom óptico 3x.",
    },
    {
      id: 7,
      name: "iPhone 13 - 126 gb",
      image: "/iphone-13.png",
      price: "$300.00",
      description: "Cámara dual y chip A15 Bionic.",
    },
    {
      id: 8,
      name: "iPhone 12 Pro - 128 gb",
      image: "/iphone-12-pro.png",
      price: "$250.00",
      description: "Primera cámara LiDAR con zoom 2.5x.",
    },
    {
      id: 9,
      name: "iPhone 12 - 128 gb",
      image: "/iphone-12.png",
      price: "$200.00",
      description: "5G y diseño minimalista.",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % iphones.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + iphones.length) % iphones.length);
  };

  const addToCart = (product: (typeof iphones)[0]) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price.replace("$", ""));
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans relative">

      {/* HEADER */}

      <header className="w-full flex items-center justify-between px-6 py-4 bg-[var(--glass-1)] backdrop-blur-xl border-b border-[var(--glass-border)] shadow-md relative z-10">
        <button
          className="glass-card h-10 w-10 flex items-center justify-center rounded-full hover:scale-105 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <h1 className="text-xl font-bold text-center flex-1">DualPhone</h1>

        <button
          onClick={() => setCartOpen(!cartOpen)}
          className="glass-card h-10 w-10 flex items-center justify-center rounded-full hover:scale-105 transition-all relative text-xl"
        >
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </header>

      {/* MENU */}
      {menuOpen && (
        <nav className="side-menu">
          <a href="#" className="glass-card">iPhone</a>
          <a href="#" className="glass-card">Samsung</a>
        </nav>
      )}

      {/* CARRITO */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-end">
          <div className="bg-[var(--background)] w-full max-w-md h-full flex flex-col border-l border-[var(--glass-border)] shadow-lg">

            <div className="flex items-center justify-between px-6 py-4 bg-[var(--glass-1)] border-b border-[var(--glass-border)]">
              <h2 className="text-xl font-bold">Tu Carrito</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="glass-card h-8 w-8 flex items-center justify-center rounded-full hover:scale-105 transition-all"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <p className="text-center opacity-60 py-8">Tu carrito está vacío</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="glass-card p-4 rounded-lg flex justify-between items-start gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{item.name}</h3>
                        <p className="text-blue-400 font-medium mb-3">{item.price}</p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="glass-card h-6 w-6 flex items-center justify-center rounded hover:scale-110 transition-all"
                          >
                            −
                          </button>

                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value) || 1)
                            }
                            className="w-10 text-center bg-[var(--glass-1)] rounded border border-[var(--glass-border)] py-1"
                            min="1"
                          />

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="glass-card h-6 w-6 flex items-center justify-center rounded hover:scale-110 transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-400 font-bold"
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TOTAL + IR AL PAGO */}
            {cartItems.length > 0 && (
              <div className="border-t border-[var(--glass-border)] px-6 py-4 space-y-4">
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-400">${calculateTotal()}</span>
                </div>

                {/* 🚀 FIX FINAL */}
                <button
                  onClick={() => router.push(`/pago?cart=1`)}
                  className="w-full glass-card py-3 rounded-lg font-semibold hover:scale-105 transition-all bg-blue-500 hover:bg-blue-600"
                >
                  Ir al pago
                </button>

              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN PRODUCT VIEW */}
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          <div className="glass-card rounded-2xl p-8 shadow-xl">

            <div className="flex justify-center items-center bg-gradient-to-b from-[var(--glass-1)] to-[var(--background)] rounded-xl p-6 mb-6 h-80">
              <Image
                src={iphones[currentSlide].image}
                alt={iphones[currentSlide].name}
                width={120}
                height={240}
                priority
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2">{iphones[currentSlide].name}</h2>
              <p className="text-xl font-semibold text-blue-400">
                {iphones[currentSlide].price}
              </p>
            </div>

            <p className="text-center opacity-80 mb-6">
              {iphones[currentSlide].description}
            </p>

            <button
              onClick={() => addToCart(iphones[currentSlide])}
              className="w-full glass-card py-3 rounded-lg font-semibold hover:scale-105 transition-all bg-blue-500 hover:bg-blue-600 mb-6"
            >
              Agregar al Carrito
            </button>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={prevSlide}
                className="glass-card h-12 w-12 flex items-center justify-center rounded-full hover:scale-110 transition-all"
              >
                ←
              </button>

              <div className="flex gap-2 justify-center flex-1">
                {iphones.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-blue-400 w-6"
                        : "bg-[var(--glass-border)] w-2 hover:bg-blue-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="glass-card h-12 w-12 flex items-center justify-center rounded-full hover:scale-110 transition-all"
              >
                →
              </button>
            </div>

            <div className="text-center mt-4 text-sm opacity-60">
              {currentSlide + 1} / {iphones.length}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
