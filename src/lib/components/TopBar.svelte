<script lang="ts">
  import { fade } from 'svelte/transition';
  import { BookOpen, ExternalLink } from 'lucide-svelte';

  export let githubUrl = 'https://github.com/';
</script>

<nav
  class="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between"
  in:fade={{ duration: 600 }}
>
  <a href="/" class="flex items-center gap-2 font-medium hover:opacity-80 transition">
    <BookOpen size={20} class="text-[#7a8b6f]" />
    <span>Quiet Reader</span>
  </a>
  <a
    href={githubUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="text-sm text-[#6b6862] hover:text-[#2b2a28] transition flex items-center gap-1"
  >
    Source <ExternalLink size={13} />
  </a>
</nav>
