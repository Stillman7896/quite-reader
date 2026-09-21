<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import UrlForm from './UrlForm.svelte';

  export let onsubmit: (url: string) => void;
  export let tagline = 'Privacy-first reading';
  export let titleTop = 'Just the words.';
  export let titleBottom = 'Nothing watching.';
  export let subtitle =
    'Paste any article URL. Quiet Reader strips the ads, trackers, and clutter — and hands you back a clean page.';
  export let hint = 'No account. No cookies. No client-side requests to the target site.';

  const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 3);
</script>

<section class="max-w-3xl mx-auto px-6 pt-16 pb-24 text-center">
  <p
    class="text-xs uppercase tracking-[0.2em] text-[#9a968f] mb-6"
    in:fade={{ duration: 700, delay: 100 }}
  >
    {tagline}
  </p>

  <h1
    class="text-4xl md:text-6xl font-semibold leading-[1.1] tracking-tight mb-6"
    in:fly={{ y: 16, duration: 700, delay: 200, easing: easeOutQuint }}
  >
    {titleTop}
    <br />
    <span class="text-[#7a8b6f]">{titleBottom}</span>
  </h1>

  <p
    class="text-lg md:text-xl text-[#6b6862] max-w-xl mx-auto mb-12 leading-relaxed"
    in:fly={{ y: 12, duration: 700, delay: 400, easing: easeOutQuint }}
  >
    {subtitle}
  </p>

  <div in:fly={{ y: 10, duration: 700, delay: 600, easing: easeOutQuint }}>
    <UrlForm {onsubmit} />
  </div>

  <p class="mt-6 text-xs text-[#9a968f]" in:fade={{ duration: 800, delay: 900 }}>
    {hint}
  </p>
</section>
