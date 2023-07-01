import type { Page } from "~/lib/types";

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import "reveal.js/plugin/highlight/monokai.css";

import Reveal from "reveal.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown";
import RevealNotes from "reveal.js/plugin/notes/notes";
import { onMount } from "solid-js";

export const Home: Page = () => {
  onMount(() => {
    // We use onMount here because we need to wait for the DOM to be loaded so
    // that the reveal.js plugins can find the elements they need to work with.
    const deck = new Reveal({
      plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
    });
    deck.initialize();
  });

  return (
    <main class="reveal">
      <div class="slides">
        <section>OAuth 2.0</section>
      </div>
    </main>
  );
};

Home.template = () => "/";
Home.path = () => "/";

export default Home;
