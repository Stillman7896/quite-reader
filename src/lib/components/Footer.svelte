<script lang="ts">
  export let left = 'Quiet Reader · Built with SvelteKit & Readability.js';
  export let right = 'No cookies were set in the making of this page.';
</script>

<footer class="border-t border-[#e8e3db]">
  <div
    class="max-w-5xl mx-auto px-6 py-8 text-sm text-[#9a968f]
           flex flex-col md:flex-row justify-between gap-3"
  >
    <p>{left}</p>
    <p>{right}</p>
  </div>
</footer>
