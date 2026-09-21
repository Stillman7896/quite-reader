<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade, fly } from 'svelte/transition';
  import { ArrowLeft, Loader2, AlertCircle, ExternalLink } from 'lucide-svelte';
  import type { Article } from '$lib/types';

  let article: Article | null = null;
  let loading = true;
  let errMsg = '';

  onMount(async () => {
    const url = $page.url.searchParams.get('url');
    if (!url) { errMsg = 'No URL provided.'; loading = false; return; }
    try {
      const res = await fetch(`/api/read?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || `Request failed (${res.status})`);
      }
      article = await res.json();
    } catch (e: any) {
      errMsg = e.message ?? 'Something went wrong.';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{article?.title ?? 'Reading…'} — Quiet Reader</title>
</svelte:head>

<div class="min-h-screen bg-[#faf8f5] text-[#2b2a28]">
  <header class="sticky top-0 z-10 backdrop-blur bg-[#faf8f5]/80 border-b border-[#e8e3db]">
    <div class="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 text-sm text-[#6b6862] hover:text-[#2b2a28] transition">
        <ArrowLeft size={16} /> Back
      </a>
      {#if article}
        <a href={article.url} target="_blank" rel="noopener noreferrer"
           class="flex items-center gap-1.5 text-sm text-[#6b6862] hover:text-[#2b2a28] transition">
          Original <ExternalLink size={14} />
        </a>
      {/if}
    </div>
  </header>

  <main class="max-w-2xl mx-auto px-6 py-16">
    {#if loading}
      <div class="flex flex-col items-center justify-center py-32 text-[#9a968f]"
           in:fade={{ duration: 300 }}>
        <Loader2 class="animate-spin mb-4" size={28} />
        <p class="text-sm">Extracting the article…</p>
      </div>
    {:else if errMsg}
      <div class="text-center py-24" in:fade>
        <AlertCircle class="mx-auto mb-4 text-[#b56b5a]" size={32} />
        <h1 class="text-xl font-medium mb-2">Couldn't read that page</h1>
        <p class="text-sm text-[#6b6862] max-w-md mx-auto">{errMsg}</p>
        <a href="/" class="inline-block mt-8 text-sm underline underline-offset-4 text-[#6b6862]">
          Try another URL
        </a>
      </div>
    {:else if article}
      <article in:fly={{ y: 12, duration: 500, easing: (t) => 1 - Math.pow(1 - t, 3) }}>
        <header class="mb-12">
          {#if article.siteName}
            <p class="text-xs uppercase tracking-widest text-[#9a968f] mb-4">
              {article.siteName}
            </p>
          {/if}
          <h1 class="text-3xl md:text-4xl font-semibold leading-tight mb-4">
            {article.title}
          </h1>
          {#if article.byline}
            <p class="text-sm text-[#6b6862]">{article.byline}</p>
          {/if}
          {#if article.publishedTime}
            <p class="text-sm text-[#9a968f] mt-1">
              {new Date(article.publishedTime).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          {/if}
        </header>

        <div class="prose-reader" dir={article.dir || 'ltr'} lang={article.lang || undefined}>
          {@html article.content}
        </div>
      </article>
    {/if}
  </main>
</div>
