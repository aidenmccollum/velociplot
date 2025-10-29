<script lang="ts">
    import { onMount } from "svelte";

    // Props for x and y data
    export let x: number[] = [];
    export let y: number[] = [];
    export let title: string = "My XY Plot";
    export let xAxisTitle: string = "X Axis";
    export let yAxisTitle: string = "Y Axis";
    export let lineColor: string = "#00bfff";
    export let mode: string = "lines+markers";

    let plotDiv: HTMLDivElement;
    let Plotly: any;

    async function createOrUpdatePlot() {
        if (!plotDiv || !Plotly) return;

        const layout = {
            title: title,
            plot_bgcolor: "#0E121B",
            paper_bgcolor: "#0E121B",
            font: { color: "#fff" },
            xaxis: { title: xAxisTitle, gridcolor: "#222", color: "#aaa" },
            yaxis: { title: yAxisTitle, gridcolor: "#222", color: "#aaa" },
            autosize: true,
            margin: { l: 50, r: 30, t: 30, b: 50 },
        };

        const data = [
            {
                x: x,
                y: y,
                mode: mode, // lines with clickable points
                type: "scatter",
                marker: { color: lineColor },
                line: { color: lineColor },
            },
        ];

        const config = {
            responsive: true,
            displayModeBar: false,
        };

        Plotly.newPlot(plotDiv, data, layout, config);
    }

    onMount(async () => {
        Plotly = (await import("plotly.js-dist-min")).default;
        createOrUpdatePlot();
    });

    // React to prop changes
    $: if (Plotly && plotDiv && x && y) {
        createOrUpdatePlot();
    }
</script>

<div
    bind:this={plotDiv}
    class="w-full h-full rounded-2xl overflow-hidden border border-gray-400"
></div>
