<script lang="ts">
  import { fly } from 'svelte/transition';
  import { ShieldCheck, Zap, Server } from 'lucide-svelte';
  import type { ComponentType } from 'svelte';

  interface Feature {
    icon: ComponentType;
    title: string;
    body: string;
  }

  export let features: Feature[] = [
    {
      icon: ShieldCheck,
      title: 'Server-side proxy',
      body: 'Your browser only talks to our Cloudflare Worker. The target site never sees you.'
    },
    {
      icon: Zap,
      title: 'Powered by Firefox',
      body: 'Uses Mozilla Readability, the same engine behind Reader View, running at the edge.'
    },
    {
      icon: Server,
      title: 'Zero tracking',
      body: 'No analytics, no third-party fonts, no ads. Just HTML in, HTML out.'
    }
  ];

  export let baseDelay = 800;
  const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 3);
</script>

<section class="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
  {#each features as f, i (f.title)}
    <div
      class="p-6 rounded-2xl bg-white/60 border border-[#e8e3db]"
      in:fly={{
        y: 12,
        duration: 600,
        delay: baseDelay + i * 120,
        easing: easeOutQuint
      }}
    >
      <svelte:component this={f.icon} size={20} class="text-[#7a8b6f] mb-4" />
      <h3 class="font-medium mb-2">{f.title}</h3>
      <p class="text-sm text-[#6b6862] leading-relaxed">{f.body}</p>
    </div>
  {/each}
</section>
