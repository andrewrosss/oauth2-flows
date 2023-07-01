import Home from "~/routes/index";

export default function NotFound() {
  return (
    <main class="min-h-full grid place-content-center font-mono bg-slate-900">
      <section class="flex flex-col items-center gap-4 rounded-3xl p-8 md:p-12 bg-slate-800">
        <h1 class="text-5xl text-green-400 font-light uppercase">Not Found</h1>
        <p>
          <a
            href={Home.path()}
            class="font-medium text-green-400 shadow-green-600 text-shadow hover:text-shadow-lg hover:underline"
          >
            ← Back to home
          </a>
        </p>
      </section>
    </main>
  );
}
