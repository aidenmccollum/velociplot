<script>
    let features = [
        {
            title: "CSV Data Import",
            description:
                "Upload and parse CSV files instantly with automatic validation and error handling",
            icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
        },
        {
            title: "Interactive Visualization",
            description:
                "Pan, zoom, and explore your data with smooth 2D cartesian graphs",
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        },
        {
            title: "Mathematical Operations",
            description:
                "Apply equations to derive new datasets with LaTeX-style syntax highlighting",
            icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
        },
        {
            title: "Annotations & Markers",
            description:
                "Mark critical events and add notes directly to your graphs for better collaboration",
            icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
        },
        {
            title: "Team Collaboration",
            description:
                "Share sessions, datasets, and analyses with your team members effortlessly",
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        },
        {
            title: "Export & Share",
            description:
                "Export high-quality plots and annotated graphs for reports and presentations",
            icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
        },
    ];

    let stats = [
        { value: "Free", label: "No Barriers" },
        { value: "Web-Based", label: "No Installation" },
        { value: "Fast", label: "Client-Side Processing" },
    ];
</script>

<div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900/95 to-green-950/20 text-gray-100"
>
    <!-- Header -->
    <header
        class="border-b border-gray-700/50 bg-gray-900/90 shadow-xl shadow-black/50"
    >
        <div class="container mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <h1 class="text-3xl font-bold text-green-400">velociplot</h1>
                <nav class="flex gap-6 items-center">
                    <a
                        href="/plot"
                        class="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-md text-green-400 transition-colors"
                    >
                        Get Started
                    </a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="container mx-auto px-6 py-20">
        <div class="max-w-4xl mx-auto text-center">
            <h2
                class="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent"
            >
                Data Analysis Made Simple
            </h2>
            <p class="text-xl text-gray-300 mb-8 leading-relaxed">
                A powerful, free web application designed for engineering teams
                to analyze test data, perform calculations, and visualize
                results without barriers to entry.
            </p>
            <div class="flex gap-4 justify-center">
                <a
                    href="/plot"
                    class="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-md text-white font-medium transition-colors shadow-lg shadow-green-500/30"
                >
                    Launch Application
                </a>
                <a
                    href="#features"
                    class="px-8 py-3 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-600/50 rounded-md text-gray-200 font-medium transition-colors"
                >
                    Learn More
                </a>
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
            {#each stats as stat}
                <div
                    class="text-center p-6 bg-gray-800/30 border border-gray-700/50 rounded-lg"
                >
                    <div class="text-3xl font-bold text-green-400 mb-2">
                        {stat.value}
                    </div>
                    <div class="text-sm text-gray-400">{stat.label}</div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="container mx-auto px-6 py-20">
        <div class="text-center mb-16">
            <h3 class="text-3xl font-bold mb-4 text-gray-100">
                Powerful Features
            </h3>
            <p class="text-gray-400 max-w-2xl mx-auto">
                Built specifically for rocket propulsion teams and engineering
                disciplines that need fast, reliable data analysis tools
            </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {#each features as feature}
                <div
                    class="p-6 bg-gray-800/30 border border-gray-700/50 rounded-lg hover:border-green-500/50 transition-all group"
                >
                    <div
                        class="w-12 h-12 mb-4 text-green-400 group-hover:text-green-300 transition-colors"
                    >
                        <svg
                            class="w-full h-full"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d={feature.icon}
                            />
                        </svg>
                    </div>
                    <h4 class="text-xl font-semibold mb-3 text-gray-100">
                        {feature.title}
                    </h4>
                    <p class="text-gray-400 leading-relaxed">
                        {feature.description}
                    </p>
                </div>
            {/each}
        </div>
    </section>

    <!-- Use Case Section -->
    <section class="container mx-auto px-6 py-20">
        <div
            class="max-w-4xl mx-auto bg-gray-800/30 border border-gray-700/50 rounded-lg p-8"
        >
            <h3 class="text-2xl font-bold mb-6 text-gray-100">
                Built for Engineering Teams
            </h3>
            <div class="space-y-4 text-gray-300">
                <p>
                    Velociplot was created to solve a critical problem:
                    engineering teams need to process large amounts of test data
                    quickly, but existing tools are either too expensive, too
                    complex, or not designed for collaborative workflows.
                </p>
                <p>
                    Originally developed for the <span
                        class="text-green-400 font-medium"
                        >Embry-Riddle Experimental Rocket Propulsion Lab (ERPL)</span
                    >, Velociplot provides a zero-installation, browser-based
                    solution that works anywhere, anytime.
                </p>
                <div
                    class="mt-6 p-4 bg-gray-900/50 border-l-4 border-green-500 rounded"
                >
                    <p class="text-sm text-gray-400 italic">
                        "No more expensive licenses or complex software
                        installations. Just upload your CSV and start
                        analyzing."
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="container mx-auto px-6 py-20">
        <div class="max-w-3xl mx-auto text-center">
            <h3 class="text-3xl font-bold mb-6 text-gray-100">
                Ready to Get Started?
            </h3>
            <p class="text-xl text-gray-300 mb-8">
                No sign-up required. Start analyzing your data in seconds.
            </p>
            <a
                href="/plot"
                class="inline-block px-10 py-4 bg-green-500 hover:bg-green-600 rounded-md text-white font-medium text-lg transition-colors shadow-lg shadow-green-500/30"
            >
                Launch Velociplot
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-700/50 bg-gray-900/90 mt-20">
        <div class="container mx-auto px-6 py-8">
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                    © 2025 Velociplot. Built for engineering excellence.
                </div>
                <div class="text-sm text-gray-500">
                    Developed by Team Argentavis
                </div>
            </div>
        </div>
    </footer>
</div>
