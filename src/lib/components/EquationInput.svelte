<script lang="ts">
    import { highlightEquation } from "$lib/larex";
    import { createEventDispatcher } from "svelte";

    export let value: string = "";
    export let data: Record<string, number[]> = {};
    export let placeholder: string = "{y} = {x}^2";

    const dispatch = createEventDispatcher();

    let inputElement: HTMLInputElement;
    let showSuggestions = false;
    let suggestions: string[] = [];
    let selectedSuggestionIndex = -1;

    $: highlightedHTML = value
        ? highlightEquation(value)
        : `<span class="text-gray-400">${placeholder}</span>`;

    // Extract where the user might be typing a channel name
    function getCurrentWord(): {
        word: string;
        startPos: number;
        endPos: number;
    } | null {
        const pos = inputElement?.selectionStart || 0;
        const text = value;

        // Look for opening brace - iterating backwards
        let braceStart = -1;
        for (let i = pos - 1; i >= 0; i--) {
            if (text[i] === "{") {
                braceStart = i;
                break;
            } else if (text[i] === "}") {
                return null;
            }
        }

        if (braceStart === -1) return null;

        // determining if were still in the bracket or not
        let braceEnd = text.indexOf("}", pos);
        if (braceEnd === -1) braceEnd = text.length;

        const word = text.substring(braceStart + 1, braceEnd);
        return { word, startPos: braceStart + 1, endPos: braceEnd };
    }

    function updateSuggestions() {
        const currentWord = getCurrentWord();
        if (!currentWord) {
            showSuggestions = false;
            suggestions = [];
            return;
        }

        const channels = Object.keys(data);
        const filtered = channels.filter((channel) =>
            channel.toLowerCase().includes(currentWord.word.toLowerCase()),
        );

        suggestions = filtered;
        showSuggestions = filtered.length > 0 && currentWord.word !== "";
        selectedSuggestionIndex = showSuggestions ? 0 : -1;
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        value = target.value;
        updateSuggestions();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (showSuggestions) {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                selectedSuggestionIndex =
                    (selectedSuggestionIndex + 1) % suggestions.length;
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                selectedSuggestionIndex =
                    selectedSuggestionIndex <= 0
                        ? suggestions.length - 1
                        : selectedSuggestionIndex - 1;
            } else if (event.key === "Tab") {
                event.preventDefault();
                if (selectedSuggestionIndex >= 0) {
                    applySuggestion(suggestions[selectedSuggestionIndex]);
                }
            } else if (event.key === "Escape") {
                showSuggestions = false;
            } else if (event.key === "Enter") {
                dispatch("submit");
            }
        } else if (event.key === "Enter") {
            dispatch("submit");
        }
    }

    function applySuggestion(suggestion: string) {
        const currentWord = getCurrentWord();
        if (!currentWord) return;

        const before = value.substring(0, currentWord.startPos);
        const after = value.substring(currentWord.endPos);
        value = before + suggestion + after;

        // Set cursor position after the inserted text
        setTimeout(() => {
            const newPos = currentWord.startPos + suggestion.length;
            inputElement.setSelectionRange(newPos, newPos);
            inputElement.focus();
        }, 0);

        showSuggestions = false;
    }

    // Handle clicks outside to close suggestions
    function handleClickOutside(event: MouseEvent) {
        if (
            !event.target ||
            !(event.target as Element).closest(".equation-input-container")
        ) {
            showSuggestions = false;
        }
    }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="equation-input-container relative">
    <div
        class="absolute inset-0 px-3 py-2 pointer-events-none font-mono text-sm whitespace-nowrap overflow-hidden"
    >
        {@html highlightedHTML}
    </div>

    <input
        bind:this={inputElement}
        bind:value
        on:input={handleInput}
        on:keydown={handleKeydown}
        on:focus={updateSuggestions}
        type="text"
        {placeholder}
        class="relative w-full px-3 py-2 bg-transparent border border-gray-600/50 rounded-md text-transparent caret-gray-100 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent font-mono text-sm"
    />

    {#if showSuggestions}
        <div
            class="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
            {#each suggestions as suggestion, index}
                <button
                    on:click={() => applySuggestion(suggestion)}
                    class="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors {index ===
                    selectedSuggestionIndex
                        ? 'bg-gray-700'
                        : ''}"
                >
                    <span class="text-green-400">{suggestion}</span>
                </button>
            {/each}
        </div>
    {/if}
</div>
