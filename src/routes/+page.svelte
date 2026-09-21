<script lang="ts">
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';
  import { BookOpen, ShieldCheck, Zap, Server, ExternalLink } from 'lucide-svelte';
  import UrlForm from '$lib/components/UrlForm.svelte';

  function handleSubmit(url: string) {
    goto(`/read?url=${encodeURIComponent(url)}`);
  }
</script>

<svelte:head>
  <title>Quiet Reader — Just the words. Nothing watching.</title>
  <meta name="description" content="A calm, privacy-focused article reader. Paste a link, get the text." />
</svelte:head>

<div class="min-h-screen bg-[#faf8f5] text-[#2b2a28]">
  <!-- Top bar -->
  <nav class="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between"
       in:fade={{ duration: 600 }}>
    <div class="flex items-center gap-2 font-medium">
      <BookOpen size={20} class="text-[#7a8b6f]" />
      <span>Quiet Reader</span>
    </div>
    <a href="https://github.com/" target="_blank" rel="noopener noreferrer"
       class="text-sm text-[#6b6862] hover:text-[#2b2a28] transition flex items-center gap-1">
      Source <ExternalLink size={13} />
    </a>
  </nav>

  <!-- Hero -->
  <section class="max-w-3xl mx-auto px-6 pt-16 pb-24 text-center">
    <p class="text-xs uppercase tracking-[0.2em] text-[#9a968f] mb-6"
       in:fade={{ duration: 700, delay: 100 }}>
      Privacy-first reading
    </p>

    <h1 class="text-4xl md:text-6xl font-semibold leading-[1.1] tracking-tight mb-6"
        in:fly={{ y: 16, duration: 700, delay: 200, easing: (t) => 1 - Math.pow(1 - t, 3) }}>
      Just the words.
      <br />
      <span class="text-[#7a8b6f]">Nothing watching.</span>
    </h1>

    <p class="text-lg md:text-xl text-[#6b6862] max-w-xl mx-auto mb-12 leading-relaxed"
       in:fly={{ y: 12, duration: 700, delay: 400, easing: (t) => 1 - Math.pow(1 - t, 3) }}>
      Paste any article URL. Quiet Reader strips the ads, trackers, and clutter —
      and hands you back a clean page.
    </p>

    <div in:fly={{ y: 10, duration: 700, delay: 600, easing: (t) => 1 - Math.pow(1 - t, 3) }}>
      <UrlForm onsubmit={handleSubmit} />
    </div>

    <p class="mt-6 text-xs text-[#9a968f]" in:fade={{ duration: 800, delay: 900 }}>
      No account. No cookies. No client-side requests to the target site.
    </p>
  </section>

  <!-- Features -->
  <section class="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
    {#each [
      { icon: ShieldCheck, title: 'Server-side proxy',
        body: 'Your browser only talks to our Cloudflare Worker. The target site never sees you.' },
      { icon: Zap, title: 'Powered by Firefox',
        body: 'Uses Mozilla Readability, the same engine behind Reader View, running at the edge.' },
      { icon: Server, title: 'Zero tracking',
        body: 'No analytics, no third-party fonts, no ads. Just HTML in, HTML out.' },
    ] as f}
      <div class="p-6 rounded-2xl bg-white/60 border border-[#e8e3db]"
           in:fly={{ y: 12, duration: 600, delay: 800, easing: (t) => 1 - Math.pow(1 - t, 3) }}>
        <f.icon size={20} class="text-[#7a8b6f] mb-4" />
        <h3 class="font-medium mb-2">{f.title}</h3>
        <p class="text-sm text-[#6b6862] leading-relaxed">{f.body}</p>
      </div>
    {/each}
  </section>

  <!-- Footer -->
  <footer class="border-t border-[#e8e3db]">
    <div class="max-w-5xl mx-auto px-6 py-8 text-sm text-[#9a968f] flex flex-col md:flex-row justify-between gap-3">
      <p>Quiet Reader · Built with SvelteKit &amp; Readability.js</p>
      <p>No cookies were set in the making of this page.</p>
    </div>
  </footer>
</div>
