<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";

    export let type: "success" | "error" = "success";
    export let message: string = "";
    export let duration: number = 3000;
    export let onClose: () => void = () => {};

    let visible = true;

    onMount(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                visible = false;
                setTimeout(onClose, 300);
            }, duration);

            return () => clearTimeout(timer);
        }
    });
</script>

{#if visible}
    <div
        class="fixed top-5 left-1/2 -translate-x-1/2 z-[1000]"
        in:fly={{ y: -50, duration: 300 }}
        out:fade={{ duration: 300 }}
    >
        <div
            class="px-5 py-3 rounded-lg bg-gray-900/90 backdrop-blur-[10px] border-2 shadow-2xl shadow-black/30 {type ===
            'success'
                ? 'border-green-500'
                : 'border-red-500'}"
            role="alert"
        >
            <div class="flex items-center gap-3">
                {#if type === "success"}
                    <svg
                        class="w-5 h-5 flex-shrink-0 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                        />
                    </svg>
                {:else}
                    <svg
                        class="w-5 h-5 flex-shrink-0 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd"
                        />
                    </svg>
                {/if}
                <span class="text-gray-100 text-sm font-medium">{message}</span>
            </div>
        </div>
    </div>
{/if}
