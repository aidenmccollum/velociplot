<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";

    export let x: number[] = [];
    export let yDatasets: Array<number[]> = [];
    export let title: string = "My XY Plot";
    export let xAxisTitle: string = "X Axis";
    export let yAxisTitle: string = "Y Axis";
    export let lineColor: string = "#00bfff";
    export let colors: string[] = [];
    export let mode: string = "lines+markers";
    export let annotations: Array<{ x: number; text: string }> = [];
    export let annotationMode: boolean = false;

    const dispatch = createEventDispatcher();
    let plotDiv: HTMLDivElement;
    let Plotly: any;
    let showAnnotationInput = false;
    let annotationInputValue = "";
    let pendingAnnotationX: number | null = null;
    let inputPosition = { x: 0, y: 0 };

    async function createOrUpdatePlot() {
        if (!plotDiv || !Plotly) return;

        const plotAnnotations = annotations.map((ann) => ({
            x: ann.x,
            y: 0,
            yref: "paper",
            text: ann.text,
            showarrow: true,
            arrowhead: 2,
            ax: 0,
            ay: -30,
            bgcolor: "rgba(255, 215, 0, 0.9)",
            bordercolor: "#ffd700",
            borderwidth: 1,
            font: { color: "#000", size: 11 },
        }));

        // plot line
        const shapes = annotations.map((ann) => ({
            type: "line",
            x0: ann.x,
            x1: ann.x,
            y0: 0,
            y1: 1,
            yref: "paper", //sets range to absolute
            line: { color: "#ffd700", width: 1, dash: "dashdot" },
        }));

        const layout = {
            title: title,
            plot_bgcolor: "#0E121B",
            paper_bgcolor: "#0E121B",
            font: { color: "#fff" },
            xaxis: { title: xAxisTitle, gridcolor: "#222", color: "#aaa" },
            yaxis: { title: yAxisTitle, gridcolor: "#222", color: "#aaa" },
            autosize: true,
            margin: { l: 50, r: 30, t: 30, b: 50 },
            annotations: plotAnnotations,
            shapes: shapes,
            dragmode: annotationMode ? "zoom" : "pan",
        };
        let dataset = [];

        for (const index in yDatasets) {
            const y = yDatasets[index];
            const color = colors[index] || lineColor;
            const data = {
                x: x,
                y: y,
                mode: mode, // lines with clickable points
                type: "scatter",
                marker: { color: color },
                line: { color: color },
            };
            dataset.push(data);
        }

        const config = {
            responsive: true,
            displayModebar: true,
            showlegend: false,
        };

        Plotly.newPlot(plotDiv, dataset, layout, config);

        if (annotationMode) {
            (plotDiv as any).on("plotly_click", (data: any) => {
                if (data.points && data.points.length > 0) {
                    const point = data.points[0];
                    const bbox = plotDiv.getBoundingClientRect();
                    pendingAnnotationX = point.x;
                    inputPosition = {
                        x: data.event.layerX,
                        y: data.event.layerY,
                    };
                    showAnnotationInput = true;
                    annotationInputValue = "";
                }
            });
        }
    }

    function handleAnnotationSubmit() {
        if (annotationInputValue.trim() && pendingAnnotationX !== null) {
            dispatch("addAnnotation", {
                x: pendingAnnotationX,
                text: annotationInputValue.trim(),
            });
            closeAnnotationInput();
        }
    }

    function closeAnnotationInput() {
        showAnnotationInput = false;
        annotationInputValue = "";
        pendingAnnotationX = null;
    }

    function focusInput(node: HTMLInputElement) {
        node.focus();
    }

    onMount(async () => {
        Plotly = (await import("plotly.js-dist-min")).default;
        createOrUpdatePlot();
    });

    $: if (Plotly && plotDiv) {
        (x, yDatasets, colors, annotations, annotationMode);
        createOrUpdatePlot();
    }
</script>

<div class="relative w-full h-full">
    <div
        bind:this={plotDiv}
        class="w-full h-full rounded-2xl overflow-hidden border border-gray-400"
        class:cursor-crosshair={annotationMode}
    ></div>

    <!-- code to show the annotation input -->
    {#if showAnnotationInput}
        <div
            class="absolute bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl z-50"
            style="left: {inputPosition.x}px; top: {inputPosition.y}px; transform: translate(-50%, -100%);"
        >
            <input
                type="text"
                bind:value={annotationInputValue}
                placeholder="Event name..."
                class="w-48 px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-yellow-500"
                on:keydown={(e) => {
                    if (e.key === "Enter") handleAnnotationSubmit();
                    if (e.key === "Escape") closeAnnotationInput();
                }}
                use:focusInput
            />
            <div class="flex gap-2 mt-2">
                <button
                    on:click={handleAnnotationSubmit}
                    class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-black text-sm rounded"
                >
                    Add
                </button>
                <button
                    on:click={closeAnnotationInput}
                    class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    {/if}
</div>
