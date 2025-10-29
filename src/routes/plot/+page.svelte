<script>
    import { updated } from "$app/state";
    import { parseCSV } from "$lib/importer";
    import { computeLarexEquation, highlightEquation } from "$lib/larex";
    import { onMount } from "svelte";
    import Plot from "$lib/components/plot.svelte";

    // let data = {
    //     load0: [0, 10, 20, 30, 5, 40, 1, 25],
    //     load1: [5, 3, 10, 40, 20, 10, 25, 17],
    //     load2: [2, 13, 20, 32, 19, 21, 34, 35],
    //     time: [0, 1, 2, 3, 4, 5, 6, 7],
    // };

    // console.log("Starting out with example data:", data);
    let data = {};

    let equations = [];
    let currentEquation = "";
    let leftPaneWidth = 15; // percentage
    let isDragging = false;
    let dragStartX = 0;
    let dragStartWidth = 0;
    let selectedXChannel = null;
    let showXChannelMenu = false;
    let selectedYChannel = null;
    let showYChannelMenu = false;

    function addEquation() {
        const [outputVar, updatedData] = computeLarexEquation(
            currentEquation.trim(),
            data,
        );
        data = updatedData;

        console.log(`resulting data: ${outputVar}=[${data[outputVar]}]`);

        //adding the equation in text form to the product
        if (currentEquation.trim()) {
            equations = [...equations, currentEquation.trim()];
            currentEquation = "";
        }
    }

    function removeEquation(index) {
        equations = equations.filter((_, i) => i !== index);
    }

    function handleKeypress(event) {
        if (event.key === "Enter") {
            addEquation();
        }
    }

    function startDrag(event) {
        isDragging = true;
        dragStartX = event.clientX;
        dragStartWidth = leftPaneWidth;
        event.preventDefault();
    }

    function handleDrag(event) {
        if (!isDragging) return;

        const windowWidth = window.innerWidth;
        const deltaX = event.clientX - dragStartX;
        const deltaPercent = (deltaX / windowWidth) * 100;
        const newWidth = dragStartWidth + deltaPercent;

        // Constrain between 10% and 50%
        leftPaneWidth = Math.min(50, Math.max(10, newWidth));
    }

    function stopDrag() {
        isDragging = false;
    }
</script>

<svelte:window on:mousemove={handleDrag} on:mouseup={stopDrag} />

<div class="flex h-screen bg-gray-900/95 text-gray-100">
    <!-- Sidebar -->
    <div
        class="h-full bg-gray-900/90 border-r border-gray-700/50 flex flex-col shadow-xl shadow-black/50 relative"
        style="width: {leftPaneWidth}%"
    >
        <div class="border-b border-gray-700/50">
            <a
                href="/"
                class="text-2xl font-bold text-green-400 px-3 py-2 bg-gray-900/50 hover:bg-gray-800/70 rounded-md transition-colors inline-block"
            >
                velociplot
            </a>
        </div>

        <!-- Equation Input Section -->
        <div class="flex-1 p-4 overflow-y-auto">
            <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-300">
                    Enter Equations
                </label>

                <!-- Input Field -->
                <div class="relative">
                    <input
                        type="text"
                        bind:value={currentEquation}
                        on:keypress={handleKeypress}
                        placeholder="y = x^2"
                        class="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                    />
                    <button
                        on:click={addEquation}
                        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                        title="Add equation"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </button>
                </div>

                <!-- Equations List -->
                <div class="space-y-2 mt-4">
                    {#each equations as equation, index}
                        <div
                            class="flex items-center justify-between p-2 bg-gray-800/50 rounded-md group"
                        >
                            <span
                                class="text-sm font-mono text-gray-200 flex-1 mr-2"
                                >{@html highlightEquation(equation)}</span
                            >
                            <button
                                on:click={() => removeEquation(index)}
                                class="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove equation"
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
                    {/each}

                    {#if equations.length === 0}
                        <p class="text-sm text-gray-500 italic">
                            No equations added yet
                        </p>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Footer Info -->
        <div class="p-4 border-t border-gray-700/50 text-xs text-gray-500">
            <input
                type="file"
                accept=".csv,text/csv"
                style="display: none;"
                id="fileInput"
                on:change={async () => {
                    const file = event.target.files && event.target.files[0];
                    if (file) {
                        const text = await file.text();
                        data = await parseCSV(text);
                        // Optionally reset selected channels
                        selectedXChannel = null;
                        selectedYChannel = null;
                    }
                }}
            />
            <button
                class=" hover:bg-green-600 text-white font-bold py-2 px-4 rounded border-green-600 border-2"
                on:click={() => {
                    let input = document.getElementById("fileInput");
                    input.click();
                }}>Import CSV Data</button
            >
        </div>

        <!-- Drag Handle -->
        <div
            class="absolute right-0 top-0 h-full w-1 hover:w-2 bg-transparent hover:bg-green-500/20 cursor-col-resize flex items-center justify-center transition-all"
            on:mousedown={startDrag}
            role="separator"
            aria-label="Resize panel"
        >
            <div
                class="flex flex-col gap-3 opacity-0 hover:opacity-100 transition-opacity"
            >
                <div class="w-0.5 h-8 bg-gray-500 rounded-full"></div>
                <div class="w-0.5 h-8 bg-gray-500 rounded-full"></div>
            </div>
        </div>
    </div>

    <!-- Main Plotting Area -->
    <div
        class="flex-1 bg-gradient-to-br from-gray-950 via-gray-900/95 to-green-950/20 flex min-h-0"
    >
        <div class="flex-1 p-5 flex min-h-0">
            <div class="flex flex-1 min-h-0">
                <!-- Y Axis Button -->
                <div class="flex items-center pr-2">
                    {#if !showYChannelMenu}
                        <button
                            on:click={() => (showYChannelMenu = true)}
                            class="bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 font-medium py-1 px-2 rounded border border-gray-600/50 hover:border-green-500/50 transition-all"
                            style="writing-mode: vertical-rl; transform: rotate(180deg);"
                        >
                            {selectedYChannel || "select Y channel"}
                        </button>
                    {:else}
                        <div
                            class="bg-gray-800/80 border border-gray-600/50 rounded p-2 space-y-1"
                        >
                            {#each Object.keys(data) as key}
                                <button
                                    on:click={() => {
                                        selectedYChannel = key;
                                        showYChannelMenu = false;
                                    }}
                                    class="block w-full text-left px-2 py-1 text-gray-200 hover:bg-gray-700/80 rounded text-sm"
                                >
                                    {key}
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>

                <!-- Plot Container -->
                <div class="flex-1 flex flex-col min-h-0">
                    <Plot
                        x={data[selectedXChannel] || data[0]}
                        y={data[selectedYChannel] || data[1]}
                    ></Plot>

                    <!-- X Axis Button -->
                    <div class="flex justify-center mt-2">
                        {#if !showXChannelMenu}
                            <button
                                on:click={() => (showXChannelMenu = true)}
                                class="bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 font-medium py-1 px-2 rounded border border-gray-600/50 hover:border-green-500/50 transition-all"
                            >
                                {selectedXChannel || "select X channel"}
                            </button>
                        {:else}
                            <div
                                class="bg-gray-800/80 border border-gray-600/50 rounded p-2 space-y-1"
                            >
                                {#each Object.keys(data) as key}
                                    <button
                                        on:click={() => {
                                            selectedXChannel = key;
                                            showXChannelMenu = false;
                                        }}
                                        class="block w-full text-left px-2 py-1 text-gray-200 hover:bg-gray-700/80 rounded text-sm"
                                    >
                                        {key}
                                    </button>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
