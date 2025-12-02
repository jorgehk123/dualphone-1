import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] font-sans">
      <main className="liquid-glass floaty min-h-[80vh] w-full max-w-3xl flex flex-col items-center justify-between py-20 px-10 sm:items-start shadow-xl">
        
        {/* Logo Next.js con shimmer */}
        <div className="flex items-center justify-center">
          <Image
            className="shimmer"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
        </div>

        {/* Títulos y textos dentro de un card cristal */}
        <div className="glass-card mt-10 flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight shimmer">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 opacity-80">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates"
              className="font-medium underline hover:opacity-80"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn"
              className="font-medium underline hover:opacity-80"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>

        {/* Botones con efecto cristal */}
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-10 w-full sm:w-auto">
          
          <a
            className="glass-card flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 transition-all hover:scale-105"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>

          <a
            className="glass-card flex h-12 w-full items-center justify-center rounded-full px-5 transition-all hover:scale-105"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>

        </div>
      </main>
    </div>
  );
}

