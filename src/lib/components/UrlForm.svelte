<script lang="ts">
  import { ArrowRight, Link as LinkIcon } from 'lucide-svelte';
  export let onsubmit: (url: string) => void;

  let value = '';
  let error = '';

  function submit(e: SubmitEvent) {
    e.preventDefault();
    const v = value.trim();
    if (!v) { error = 'Paste a URL first.'; return; }
    try {
      const u = new URL(v);
      if (!/^https?:$/.test(u.protocol)) throw new Error();
    } catch {
      error = 'That doesn\'t look like a valid http(s) URL.';
      return;
    }
    error = '';
    onsubmit(v);
  }
</script>

<form on:submit={submit} class="max-w-xl mx-auto">
  <div class="flex items-center gap-2 p-2 pl-4 rounded-2xl bg-white border border-[#e8e3db]
              focus-within:border-[#c9c2b6] focus-within:shadow-sm transition">
    <LinkIcon size={18} class="text-[#9a968f] shrink-0" />
    <input
      type="url"
      bind:value
      placeholder="https://example.com/article"
      class="flex-1 bg-transparent outline-none text-base py-2 placeholder:text-[#b8b4ad]"
      autocomplete="off"
      spellcheck="false"
    />
    <button
      type="submit"
      class="shrink-0 px-4 py-2 rounded-xl bg-[#7a8b6f] hover:bg-[#6b7c60]
             text-white text-sm font-medium flex items-center gap-1.5 transition"
    >
      Read <ArrowRight size={15} />
    </button>
  </div>
  {#if error}
    <p class="mt-2 text-xs text-[#b56b5a] text-left pl-4">{error}</p>
  {/if}
</form>
