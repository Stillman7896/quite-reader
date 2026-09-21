<script lang="ts">
  import { goto } from '$app/navigation';
  import TopBar from '$lib/components/TopBar.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import FeatureGrid from '$lib/components/FeatureGrid.svelte';
  import Footer from '$lib/components/Footer.svelte';

  function handleSubmit(url: string) {
    goto(`/read?url=${encodeURIComponent(url)}`);
  }
</script>

<svelte:head>
  <title>Quiet Reader — Just the words. Nothing watching.</title>
  <meta
    name="description"
    content="A calm, privacy-focused article reader. Paste a link, get the text."
  />
</svelte:head>

<div class="min-h-screen bg-[#faf8f5] text-[#2b2a28]">
  <TopBar githubUrl="https://github.com/" />
  <Hero onsubmit={handleSubmit} />
  <FeatureGrid />
  <Footer />
</div>
