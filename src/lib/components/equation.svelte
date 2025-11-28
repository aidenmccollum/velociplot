<script lang="ts">
    import { highlightEquation } from "$lib/larex";
    import { createEventDispatcher } from "svelte";

    export let equation: string = "";
    export let index: number;
    export let color: string = "#00bfff";
    export let availableColors: string[] = [];

    let equationVisible = true;
    let showColorPicker = false;

    const dispatch = createEventDispatcher();

    function removeEquation() {
        dispatch("remove", { index });
    }

    function showEquation() {
        dispatch("show", { index });
    }

    function hideEquation() {
        dispatch("hide", { index });
    }

    function selectColor(newColor: string) {
        dispatch("colorChange", { index, color: newColor });
        showColorPicker = false;
    }

    function toggleColorPicker(event: MouseEvent) {
        event.stopPropagation();
        showColorPicker = !showColorPicker;
    }

    function handleClickOutside(event: MouseEvent) {
        if (
            showColorPicker &&
            !(event.target as HTMLElement).closest(".color-picker-container")
        ) {
            showColorPicker = false;
        }
    }
</script>

<svelte:window on:click={handleClickOutside} />

<div
    class="flex items-center justify-between p-2 bg-gray-800/50 rounded-md group"
>
    <!-- Color dot and picker -->
    <div class="relative color-picker-container">
        <button
            on:click={toggleColorPicker}
            class="w-4 h-4 rounded-full border-2 border-gray-600 hover:border-gray-400 transition-all mr-2"
            style="background-color: {color}"
            aria-label="Change color"
            title="Click to change color"
        ></button>

        {#if showColorPicker}
            <div
                class="absolute left-0 top-6 z-50 bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-xl w-max"
            >
                <div class="grid grid-cols-5 gap-1" style="width: 140px;">
                    {#each availableColors as availableColor}
                        <button
                            on:click={() => selectColor(availableColor)}
                            class="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform {availableColor ===
                            color
                                ? 'border-white'
                                : 'border-gray-600'}"
                            style="background-color: {availableColor}"
                            aria-label="Select color {availableColor}"
                        ></button>
                    {/each}
                </div>
            </div>
        {/if}
    </div>

    <span class="text-sm font-mono text-gray-200 flex-1 mr-2"
        >{@html highlightEquation(equation)}</span
    >
    <button
        on:click={() => {
            equationVisible = !equationVisible;
            if (equationVisible == true) {
                showEquation();
            } else {
                hideEquation();
            }
        }}
        class="mr-2 transition-colors"
        aria-label={equationVisible ? "Hide equation" : "Show equation"}
        style="color: {equationVisible ? 'white' : '#9CA3AF'}"
    >
        {#if equationVisible}
            <!-- Eye icon from hero icons -->
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
            </svg>
        {:else}
            <!-- Eye with slash icon -->
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
            </svg>
        {/if}
    </button>
    <button
        on:click={removeEquation}
        class="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Remove equation"
        aria-label="Remove equation"
    >
        <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    </button>
</div>
