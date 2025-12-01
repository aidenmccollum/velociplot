<script>
    import { parseCSV } from "$lib/importer";
    import { computeLarexEquation, highlightEquation } from "$lib/larex";
    import Plot from "$lib/components/plot.svelte";
    import Equation from "$lib/components/equation.svelte";
    import EquationInput from "$lib/components/EquationInput.svelte";
    import Notification from "$lib/components/Notification.svelte";

    // console.log("Starting out with example data:", data);
    let data = {};

    let equations = [];
    let outputChannels = [];
    let equationColors = [];
    let currentEquation = "";
    let leftPaneWidth = 15; // percentage
    let isDragging = false;
    let dragStartX = 0;
    let dragStartWidth = 0;
    let selectedXChannel = null;
    let showXChannelMenu = false;
    let selectedYChannels = [];

    let showNotification = false;
    let notificationType = "success";
    let notificationMessage = "";

    // Define available colors for the line plots
    const availableColors = [
        "#00bfff", // cyan
        "#ff6b6b", // red
        "#4ecdc4", // teal
        "#ffd93d", // yellow
        "#a8e6cf", // mint
        "#ff8b94", // pink
        "#b4a7d6", // lavender
        "#ffb347", // orange
        "#77dd77", // pastel green
        "#aec6cf", // pastel blue
    ];

    let colorIndex = 0;

    function getNextColor() {
        const color = availableColors[colorIndex % availableColors.length];
        colorIndex++;
        return color;
    }

    // Live preview of the equation being typed
    let equationPreviewError = "";

    // Validate equation as user types
    function validateEquation(eq) {
        if (!eq) {
            equationPreviewError = "";
            return;
        }

        try {
            // Check if it's just a channel name in brackets (no equals sign)
            if (!eq.includes("=")) {
                const channelMatch = eq.trim().match(/^\{([^{}]+)\}$/);
                if (!channelMatch) {
                    equationPreviewError =
                        "Format: {channel_name} or {output} = expression";
                    return;
                }
                const channelName = channelMatch[1].trim();
                if (!Object.keys(data).includes(channelName)) {
                    equationPreviewError = `Unknown channel: ${channelName}`;
                    return;
                }
                equationPreviewError = "";
                return;
            }

            // Otherwise, validate as an equation
            const match = eq.match(/^\{([^{}]+)\}\s*=\s*(.+)$/);
            if (!match) {
                equationPreviewError =
                    "Format: {channel_name} or {output} = expression";
                return;
            }

            let expression = match[2];

            // validate channels within AVG() functions
            expression = validateAVGOperation(expression, data);

            // Check remaining referenced channels
            const channelRegex = /\{([^{}]+)\}/g;
            let channelMatch;
            const referencedChannels = [];

            while ((channelMatch = channelRegex.exec(expression)) !== null) {
                const channelName = channelMatch[1].trim();
                if (!Object.keys(data).includes(channelName)) {
                    equationPreviewError = `Unknown channel: ${channelName}`;
                    return;
                }
                referencedChannels.push(channelName);
            }

            equationPreviewError = "";
        } catch (e) {
            equationPreviewError = "Invalid equation";
        }
    }

    $: validateEquation(currentEquation);

    function validateAVGOperation(expression, data) {
        const avgRegex = /AVG\s*\((.*?)\)/gi;
        let avgMatch;
        while ((avgMatch = avgRegex.exec(expression)) !== null) {
            const avgContent = avgMatch[1];
            const avgChannelRegex = /\{([^{}]+)\}/g;
            let avgChannelMatch;

            const avgChannels = [];
            while (
                (avgChannelMatch = avgChannelRegex.exec(avgContent)) !== null
            ) {
                const channelName = avgChannelMatch[1].trim();
                console.log(data);
                if (!Object.keys(data).includes(channelName)) {
                    equationPreviewError = `Unknown channel in AVG: ${channelName}`;
                    return;
                }
                avgChannels.push(channelName);
            }

            if (avgChannels.length === 0) {
                equationPreviewError =
                    "AVG() must contain at least one channel";
                return;
            }

            expression = expression.replace(avgMatch[0], "");
        }
        return expression;
    }

    function addEquation() {
        try {
            const trimmedInput = currentEquation.trim();

            if (!trimmedInput) {
                return;
            }

            if (!trimmedInput.includes("=")) {
                const channelMatch = trimmedInput.match(/^\{([^{}]+)\}$/);

                if (!channelMatch) {
                    equationPreviewError =
                        "Format: {channel_name} or {output} = expression";
                    return;
                }

                const channelName = channelMatch[1].trim();

                if (!Object.keys(data).includes(channelName)) {
                    equationPreviewError = `Unknown channel: ${channelName}`;
                    return;
                }

                if (!selectedYChannels.includes(channelName)) {
                    selectedYChannels = [...selectedYChannels, channelName];
                    equations = [...equations, trimmedInput];
                    outputChannels = [...outputChannels, channelName];
                    equationColors = [...equationColors, getNextColor()];
                }

                currentEquation = "";
                equationPreviewError = "";
                return;
            }

            const [outputVar, updatedData] = computeLarexEquation(
                trimmedInput,
                data,
            );
            data = updatedData;

            equations = [...equations, trimmedInput];
            outputChannels = [...outputChannels, outputVar];
            equationColors = [...equationColors, getNextColor()];

            selectedYChannels = [...selectedYChannels, outputVar];
            currentEquation = "";
            equationPreviewError = "";
        } catch (error) {
            equationPreviewError = error.message;
        }
    }

    function removeEquation(index) {
        const outputChannel = outputChannels[index];
        console.log(`Removing equation at index ${index}: ${outputChannel}`);
        selectedYChannels = selectedYChannels.filter(
            (channel) => channel !== outputChannel,
        );

        equations = equations.filter((_, i) => i !== index);
        outputChannels = outputChannels.filter((_, i) => i !== index);
        equationColors = equationColors.filter((_, i) => i !== index);
    }

    function changeEquationColor(index, newColor) {
        equationColors[index] = newColor;
        equationColors = [...equationColors]; // Trigger reactivity
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

        leftPaneWidth = Math.min(50, Math.max(10, newWidth));
    }

    function stopDrag() {
        isDragging = false;
    }

    function showNotice(type, message) {
        notificationType = type;
        notificationMessage = message;
        showNotification = true;
    }
</script>

<svelte:window on:mousemove={handleDrag} on:mouseup={stopDrag} />

{#if showNotification}
    <Notification
        type={notificationType}
        message={notificationMessage}
        onClose={() => (showNotification = false)}
    />
{/if}

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
                    Equation Editor
                </label>

                <!-- Enhanced Input Field with live highlighting -->
                <div class="relative">
                    <EquationInput
                        bind:value={currentEquation}
                        {data}
                        placeholder={"{y} = {x}^2"}
                        on:submit={addEquation}
                    />
                    <button
                        on:click={addEquation}
                        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors z-20 bg-transparent backdrop-blur rounded-md"
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

                <!-- Error display -->
                {#if equationPreviewError}
                    <div class="text-red-400 text-xs mt-1">
                        {equationPreviewError}
                    </div>
                {/if}

                <!-- Equations List -->
                <div class="space-y-2 mt-4">
                    {#each equations as equation, index}
                        <Equation
                            {equation}
                            {index}
                            color={equationColors[index]}
                            {availableColors}
                            on:remove={(e) => removeEquation(e.detail.index)}
                            on:colorChange={(e) =>
                                changeEquationColor(
                                    e.detail.index,
                                    e.detail.color,
                                )}
                            on:show={(e) => {
                                selectedYChannels = [
                                    ...selectedYChannels,
                                    outputChannels[e.detail.index],
                                ];
                            }}
                            on:hide={(e) => {
                                selectedYChannels = selectedYChannels.filter(
                                    (channel) =>
                                        channel !==
                                        outputChannels[e.detail.index],
                                );
                            }}
                        ></Equation>
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
                        console.log(data);
                        if (
                            data !== null &&
                            typeof data === "object" &&
                            !Array.isArray(data)
                        ) {
                            showNotice(
                                "success",
                                "CSV file loaded successfully!",
                            );
                        } else {
                            showNotice("error", "Invalid CSV file format");
                            data = {};
                        }

                        selectedXChannel = null;
                        selectedYChannels = [];
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
                <!-- Plot Container -->
                <div class="flex-1 flex flex-col min-h-0">
                    <Plot
                        x={data[selectedXChannel] || data[0]}
                        yDatasets={selectedYChannels.length > 0
                            ? selectedYChannels.map((key) => data[key])
                            : data[1]
                              ? [data[1]]
                              : []}
                        colors={selectedYChannels.length > 0
                            ? selectedYChannels.map((channel) => {
                                  const idx = outputChannels.indexOf(channel);
                                  return idx !== -1
                                      ? equationColors[idx]
                                      : "#00bfff";
                              })
                            : ["#00bfff"]}
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
                                class="bg-gray-800/80 border border-gray-600/50 rounded p-2 space-y-1 max-h-40 overflow-y-auto"
                            >
                                {#each Object.keys(data) as key}
                                    <button
                                        on:click={() => {
                                            showXChannelMenu = false;
                                            selectedXChannel = key;
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
