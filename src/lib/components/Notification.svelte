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
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-green-500"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                        />
                    </svg>
                {:else}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5 text-red-500"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        />
                    </svg>
                {/if}
                <span class="text-gray-100 text-sm font-medium">{message}</span>
            </div>
        </div>
    </div>
{/if}
