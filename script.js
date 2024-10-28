// Constants and Settings
const CANVAS_SETTINGS = {
    WIDTH: window.innerWidth * 0.7,  // 70% от ширины окна
    HEIGHT: window.innerHeight * 0.7, // 70% от высоты окна
    PADDING: 50,
    EXON_HEIGHT: 30,
    DOMAIN_HEIGHT: 20,
    MIN_ZOOM: 0.5,
    MAX_ZOOM: 3,
    DNA_RADIUS: 100,
    DNA_VERTICAL_SPACING: 20,
    ANIMATION_SPEED: 0.02
};

const COLORS = {
    EXON: '#3498db',
    INTRON: '#95a5a6',
    MUTATION: '#e74c3c',
    BACKGROUND: '#ffffff',
    TEXT: '#2c3e50',
    DOMAIN: {
        SIGNAL: '#FF6B6B',
        IG: '#4ECDC4',
        ZINC: '#45B7D1'
    },
    DNA: {
        A: '#ff4081',
        T: '#4caf50',
        G: '#2196f3',
        C: '#ffc107'
    }
};

// Application state with proper typing
const state = {
    currentGene: 'NPHS1',
    currentView: '2D Structure',
    zoomLevel: 1,
    panOffset: { x: 0, y: 0 },
    isDragging: false,
    lastMousePos: { x: 0, y: 0 },
    showGrid: false,
    showBases: true,
    isAnimating: false,
    isTranscribing: false,
    animationSpeed: 1,
    showMutations: true,
    highlightExons: false,
    animationFrameId: null,
    dnaRotation: 0,
    transcriptionProgress: 0
};

// Extended gene data structure
const geneData = {
    NPHS1: {
        name: "Нефрин (NPHS1)",
        location: "19q13.12",
        function: "Ключевой компонент щелевой диафрагмы подоцитов",
        size: "26 экзонов",
        protein: "1241 аминокислот",
        description: `NPHS1 кодирует белок нефрин, который является критическим компонентом 
            щелевой диафрагмы подоцитов и играет ключевую роль в работе фильтрационного 
            барьера почек.`,
        structure: {
            exons: [
                { id: 1, start: 50, length: 40, sequence: "ATGGCCCTGGGGCTGCTGCTGCT", type: "coding" },
                { id: 2, start: 120, length: 35, sequence: "GCCTGTGGATGCTGGTGGTGCTG", type: "coding" },
                { id: 3, start: 185, length: 45, sequence: "CTGGAGCTGGTGCTGCTGCTGCT", type: "coding" },
                { id: 4, start: 260, length: 38, sequence: "GCTGCTGCTGCTGGTGCTGCTGG", type: "coding" },
                { id: 5, start: 328, length: 42, sequence: "CTGCTGGTGCTGCTGCTGCTGCT", type: "coding" }
            ],
            domains: [
                {
                    name: "Сигнальный пептид",
                    start: 1,
                    end: 22,
                    color: COLORS.DOMAIN.SIGNAL,
                    function: "Направляет белок в клеточную мембрану",
                    conservation: 0.95
                },
                {
                    name: "Ig-подобный домен 1",
                    start: 23,
                    end: 105,
                    color: COLORS.DOMAIN.IG,
                    function: "Участвует в белок-белковых взаимодействиях",
                    conservation: 0.88
                },
                {
                    name: "Ig-подобный домен 2",
                    start: 106,
                    end: 200,
                    color: COLORS.DOMAIN.IG,
                    function: "Структурная организация",
                    conservation: 0.85
                }
            ],
            mutations: [
                {
                    id: "Fin-major",
                    position: 121,
                    type: "deletion",
                    nucleotide: "delCT",
                    effect: "Преждевременный стоп-кодон",
                    pathogenicity: "Патогенная",
                    frequency: "Частая в финской популяции",
                    impact: "high",
                    description: "Приводит к полной потере функции белка"
                },
                {
                    id: "R138Q",
                    position: 138,
                    type: "missense",
                    nucleotide: "G>A",
                    effect: "Замена аргинина на глутамин",
                    pathogenicity: "Вероятно патогенная",
                    frequency: "Редкая",
                    impact: "moderate",
                    description: "Нарушает фолдинг белка"
                }
            ],
            conservation: [
                { start: 1, end: 22, score: 0.95 },
                { start: 23, end: 105, score: 0.88 },
                { start: 106, end: 200, score: 0.85 }
            ]
        },
        pathways: [
            {
                name: "Фильтрационный барьер",
                components: ["Нефрин", "Подоцин", "CD2AP"],
                description: "Формирование щелевой диафрагмы"
            }
        ]
    },
    WT1: {
        name: "Опухоль Вильмса 1 (WT1)",
        location: "11p13",
        function: "Транскрипционный фактор, развитие почек",
        size: "10 экзонов",
        protein: "449 аминокислот",
        description: `WT1 является важным регулятором развития почек и гонад. 
            Функционирует как транскрипционный фактор.`,
        structure: {
            exons: [
                { id: 1, start: 50, length: 35, sequence: "ATGGCTCCGACGTGCGGGACCTG", type: "coding" },
                { id: 2, start: 115, length: 40, sequence: "ACCGTGCGTGTGTGTGTGTGTGT", type: "coding" },
                { id: 3, start: 185, length: 38, sequence: "CTGCTGCTGGTGCTGCTGCTGCT", type: "coding" },
                { id: 4, start: 253, length: 42, sequence: "GCTGGTGCTGCTGCTGCTGCTGG", type: "coding" }
            ],
            domains: [
                {
                    name: "Цинковый палец 1",
                    start: 318,
                    end: 342,
                    color: COLORS.DOMAIN.ZINC,
                    function: "ДНК-связывающий домен",
                    conservation: 0.92
                },
                {
                    name: "Цинковый палец 2",
                    start: 348,
                    end: 372,
                    color: COLORS.DOMAIN.ZINC,
                    function: "ДНК-связывающий домен",
                    conservation: 0.94
                }
            ],
            mutations: [
                {
                    id: "R394W",
                    position: 394,
                    type: "missense",
                    nucleotide: "C>T",
                    effect: "Замена аргинина на триптофан",
                    pathogenicity: "Патогенная",
                    frequency: "Редкая",
                    impact: "high",
                    description: "Нарушает ДНК-связывающую способность"
                }
            ],
            conservation: [
                { start: 318, end: 342, score: 0.92 },
                { start: 348, end: 372, score: 0.94 }
            ]
        },
        pathways: [
            {
                name: "Развитие почек",
                components: ["WT1", "PAX2", "GDNF"],
                description: "Регуляция нефрогенеза"
            }
        ]
    }
};

// DOM Elements
let canvas2D, ctx2D, canvas3D, gl3D, canvasDNA, ctxDNA, canvasTranscription, ctxTranscription;
let renderer3D, scene3D, camera3D, controls3D;

// Вспомогательные функции для работы с последовательностями
const SequenceUtils = {
    getComplementaryBase(base) {
        const pairs = { 'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G' };
        return pairs[base] || 'N';
    },

    getRNAComplement(dnaBase) {
        const pairs = { 'A': 'U', 'T': 'A', 'G': 'C', 'C': 'G' };
        return pairs[dnaBase] || 'N';
    },

    calculateGCContent(sequence) {
        const gcCount = (sequence.match(/[GC]/g) || []).length;
        return (gcCount / sequence.length) * 100;
    },

    getAminoAcid(codon) {
        const geneticCode = {
            'AUA': 'I', 'AUC': 'I', 'AUU': 'I', 'AUG': 'M',
            'ACA': 'T', 'ACC': 'T', 'ACG': 'T', 'ACU': 'T',
            // ... добавьте остальной генетический код
        };
        return geneticCode[codon] || 'X';
    }
};
// Инициализация приложения
function initializeApp() {
    console.log("Initializing GeneViz Pro...");
    
    try {
        initializeCanvases();
        setupEventListeners();
        initThreeJS();
        loadGeneInfo(state.currentGene);
        updateVisualization();
        showNotification("GeneViz Pro успешно инициализирован");
    } catch (error) {
        console.error("Error during initialization:", error);
        showNotification("Ошибка инициализации", "error");
    }
}

function initializeCanvases() {
    // 2D Structure Canvas
    const container2D = document.querySelector('#structure2D .canvas-container');
    if (container2D) {
        canvas2D = document.createElement('canvas');
        canvas2D.width = container2D.clientWidth || CANVAS_SETTINGS.WIDTH;
        canvas2D.height = container2D.clientHeight || CANVAS_SETTINGS.HEIGHT;
        container2D.innerHTML = ''; // Clear container
        container2D.appendChild(canvas2D);
        ctx2D = canvas2D.getContext('2d');
        
        // Enable antialiasing
        ctx2D.imageSmoothingEnabled = true;
        ctx2D.imageSmoothingQuality = 'high';
    }

    // DNA Helix Canvas
    const containerDNA = document.querySelector('#structureDNA .canvas-container');
    if (containerDNA) {
        canvasDNA = document.createElement('canvas');
        canvasDNA.width = containerDNA.clientWidth || CANVAS_SETTINGS.WIDTH;
        canvasDNA.height = containerDNA.clientHeight || CANVAS_SETTINGS.HEIGHT;
        containerDNA.innerHTML = '';
        containerDNA.appendChild(canvasDNA);
        ctxDNA = canvasDNA.getContext('2d');
        ctxDNA.imageSmoothingEnabled = true;
    }

    // Transcription Canvas
    const containerTranscription = document.querySelector('#transcriptionView .canvas-container');
    if (containerTranscription) {
        canvasTranscription = document.createElement('canvas');
        canvasTranscription.width = containerTranscription.clientWidth || CANVAS_SETTINGS.WIDTH;
        canvasTranscription.height = containerTranscription.clientHeight || CANVAS_SETTINGS.HEIGHT;
        containerTranscription.innerHTML = '';
        containerTranscription.appendChild(canvasTranscription);
        ctxTranscription = canvasTranscription.getContext('2d');
        ctxTranscription.imageSmoothingEnabled = true;
    }
}

function initThreeJS() {
    // Initialize Three.js for 3D visualization
    const container3D = document.querySelector('#structure3D .canvas-container');
    if (!container3D) return;

    try {
        // Create scene
        scene3D = new THREE.Scene();
        scene3D.background = new THREE.Color(0xffffff);

        // Create camera
        camera3D = new THREE.PerspectiveCamera(
            75,
            container3D.clientWidth / container3D.clientHeight,
            0.1,
            1000
        );
        camera3D.position.z = 5;

        // Create renderer
        renderer3D = new THREE.WebGLRenderer({ antialias: true });
        renderer3D.setSize(container3D.clientWidth, container3D.clientHeight);
        container3D.innerHTML = '';
        container3D.appendChild(renderer3D.domElement);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene3D.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene3D.add(directionalLight);

        // Add controls
        controls3D = new THREE.OrbitControls(camera3D, renderer3D.domElement);
        controls3D.enableDamping = true;
        controls3D.dampingFactor = 0.05;
        controls3D.rotateSpeed = 0.5;
        controls3D.zoomSpeed = 0.7;

        // Start animation loop
        animate3D();

    } catch (error) {
        console.error("Error initializing Three.js:", error);
        showNotification("Ошибка инициализации 3D визуализации", "error");
    }
}

function setupEventListeners() {
    // Gene selector
    const geneSelector = document.querySelector('.gene-selector');
    if (geneSelector) {
        geneSelector.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.textContent.trim() in geneData) {
                switchGene(e.target.textContent.trim());
            }
        });
    }

    // View selector
    const viewSelector = document.querySelector('.view-selector');
    if (viewSelector) {
        viewSelector.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.textContent.trim()) {
                switchView(e.target.textContent.trim());
            }
        });
    }

    // Canvas interactions
    if (canvas2D) {
        canvas2D.addEventListener('mousedown', handleMouseDown);
        canvas2D.addEventListener('mousemove', handleMouseMove);
        canvas2D.addEventListener('mouseup', handleMouseUp);
        canvas2D.addEventListener('mouseleave', handleMouseLeave);
        canvas2D.addEventListener('wheel', handleWheel);
    }

    // Analysis tools
    const analysisTools = document.querySelector('.analysis-tools');
    if (analysisTools) {
        analysisTools.addEventListener('click', (e) => {
            const toolType = e.target.textContent.trim();
            handleAnalysisTool(toolType);
        });
    }

    // Modal close buttons
    document.querySelectorAll('.modal .modal-header').forEach(header => {
        const closeBtn = header.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const modal = header.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        }
    });

    // Sequence controls
    const sequenceControls = document.querySelector('.sequence-controls');
    if (sequenceControls) {
        const highlightExons = sequenceControls.querySelector('button:nth-child(1)');
        const showMutations = sequenceControls.querySelector('button:nth-child(2)');

        if (highlightExons) {
            highlightExons.addEventListener('click', () => {
                state.highlightExons = !state.highlightExons;
                updateSequenceViewer(geneData[state.currentGene]);
            });
        }

        if (showMutations) {
            showMutations.addEventListener('click', () => {
                state.showMutations = !state.showMutations;
                updateVisualization();
            });
        }
    }

    // View controls
    setupViewControls();

    // Window resize
    window.addEventListener('resize', handleResize);
}

function setupViewControls() {
    const viewControls = document.querySelector('.view-controls');
    if (!viewControls) return;

    // Zoom controls
    const zoomIn = viewControls.querySelector('.zoom-controls button:first-child');
    const zoomOut = viewControls.querySelector('.zoom-controls button:last-child');

    if (zoomIn) zoomIn.addEventListener('click', () => zoom(1.1));
    if (zoomOut) zoomOut.addEventListener('click', () => zoom(0.9));

    // View options
    const resetBtn = viewControls.querySelector('.view-options button:first-child');
    const gridBtn = viewControls.querySelector('.view-options button:last-child');

    if (resetBtn) {
        resetBtn.addEventListener('click', resetVisualization);
    }

    if (gridBtn) {
        gridBtn.addEventListener('click', () => {
            state.showGrid = !state.showGrid;
            updateVisualization();
        });
    }
}

function handleResize() {
    // Update canvas dimensions
    const updateCanvasSize = (canvas, container) => {
        if (canvas && container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
    };

    updateCanvasSize(canvas2D, canvas2D?.parentElement);
    updateCanvasSize(canvasDNA, canvasDNA?.parentElement);
    updateCanvasSize(canvasTranscription, canvasTranscription?.parentElement);

    // Update Three.js renderer
    if (renderer3D && camera3D) {
        const container = renderer3D.domElement.parentElement;
        if (container) {
            renderer3D.setSize(container.clientWidth, container.clientHeight);
            camera3D.aspect = container.clientWidth / container.clientHeight;
            camera3D.updateProjectionMatrix();
        }
    }

    updateVisualization();
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Animation loop for 3D visualization
function animate3D() {
    if (!renderer3D || !scene3D || !camera3D || !controls3D) return;

    requestAnimationFrame(animate3D);
    controls3D.update();
    renderer3D.render(scene3D, camera3D);
}
// Функции переключения и обновления
function switchGene(geneName) {
    if (!geneData[geneName]) {
        console.error(`Gene ${geneName} not found in database`);
        return;
    }

    state.currentGene = geneName;
    
    // Обновляем UI
    document.querySelectorAll('.gene-selector').forEach(btn => {
        if (btn.textContent.trim() === geneName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Обновляем информацию и визуализацию
    loadGeneInfo(geneName);
    updateVisualization();
    showNotification(`Загружен ген ${geneName}`);
}

function switchView(viewType) {
    state.currentView = viewType;
    
    // Скрываем все view
    document.querySelectorAll('.structure-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Показываем выбранный view
    let viewElement;
    switch(viewType) {
        case '2D Structure':
            viewElement = document.getElementById('structure2D');
            break;
        case '3D Model':
            viewElement = document.getElementById('structure3D');
            create3DModel(); // Пересоздаем 3D модель при переключении
            break;
        case 'DNA Helix':
            viewElement = document.getElementById('structureDNA');
            startDNAAnimation();
            break;
        case 'Transcription':
            viewElement = document.getElementById('transcriptionView');
            startTranscription();
            break;
    }
    
    if (viewElement) {
        viewElement.classList.add('active');
    }
    
    updateVisualization();
}

function updateVisualization() {
    switch(state.currentView) {
        case '2D Structure':
            draw2DStructure();
            break;
        case '3D Model':
            update3DModel();
            break;
        case 'DNA Helix':
            updateDNAHelix();
            break;
        case 'Transcription':
            updateTranscription();
            break;
    }
}

// 2D Structure Visualization
function draw2DStructure() {
    if (!ctx2D || !canvas2D) return;

    const gene = geneData[state.currentGene];
    if (!gene) return;

    // Clear canvas
    ctx2D.clearRect(0, 0, canvas2D.width, canvas2D.height);
    
    // Apply transformations
    ctx2D.save();
    ctx2D.translate(state.panOffset.x, state.panOffset.y);
    ctx2D.scale(state.zoomLevel, state.zoomLevel);

    // Draw grid if enabled
    if (state.showGrid) {
        drawGrid();
    }

    const baseY = canvas2D.height / 2;
    const startX = CANVAS_SETTINGS.PADDING;
    const geneLength = canvas2D.width - (CANVAS_SETTINGS.PADDING * 2);

    // Draw intron line with gradient
    const gradient = ctx2D.createLinearGradient(startX, baseY, startX + geneLength, baseY);
    gradient.addColorStop(0, COLORS.INTRON);
    gradient.addColorStop(1, COLORS.INTRON);
    
    ctx2D.beginPath();
    ctx2D.strokeStyle = gradient;
    ctx2D.lineWidth = 2;
    ctx2D.moveTo(startX, baseY);
    ctx2D.lineTo(startX + geneLength, baseY);
    ctx2D.stroke();

    // Draw exons with enhanced styling
    gene.structure.exons.forEach((exon, index) => {
        drawEnhancedExon(exon, index, startX, baseY, geneLength);
    });

    // Draw domains with enhanced styling
    gene.structure.domains.forEach(domain => {
        drawEnhancedDomain(domain, startX, baseY, geneLength);
    });

    // Draw mutations if enabled
    if (state.showMutations) {
        gene.structure.mutations.forEach(mutation => {
            drawEnhancedMutation(mutation, startX, baseY, geneLength);
        });
    }

    // Draw conservation scores
    drawConservationGraph(gene, startX, baseY + 100, geneLength);

    ctx2D.restore();
}

function drawEnhancedExon(exon, index, startX, baseY, geneLength) {
    const exonX = startX + (geneLength * (exon.start / 400));
    const exonWidth = (geneLength * (exon.length / 400));
    
    // Create gradient for exon
    const gradient = ctx2D.createLinearGradient(
        exonX, baseY - CANVAS_SETTINGS.EXON_HEIGHT/2,
        exonX, baseY + CANVAS_SETTINGS.EXON_HEIGHT/2
    );
    gradient.addColorStop(0, COLORS.EXON);
    gradient.addColorStop(1, '#2980b9');
    
    // Draw exon box with shadow
    ctx2D.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx2D.shadowBlur = 5;
    ctx2D.shadowOffsetY = 2;
    ctx2D.fillStyle = gradient;
    ctx2D.fillRect(
        exonX,
        baseY - CANVAS_SETTINGS.EXON_HEIGHT/2,
        exonWidth,
        CANVAS_SETTINGS.EXON_HEIGHT
    );
    ctx2D.shadowColor = 'transparent';

    // Draw exon border
    ctx2D.strokeStyle = '#2980b9';
    ctx2D.lineWidth = 1;
    ctx2D.strokeRect(
        exonX,
        baseY - CANVAS_SETTINGS.EXON_HEIGHT/2,
        exonWidth,
        CANVAS_SETTINGS.EXON_HEIGHT
    );

    // Draw exon label
    ctx2D.fillStyle = COLORS.TEXT;
    ctx2D.font = '12px Arial';
    ctx2D.textAlign = 'center';
    ctx2D.fillText(
        `E${exon.id}`,
        exonX + exonWidth/2,
        baseY - CANVAS_SETTINGS.EXON_HEIGHT/2 - 5
    );

    // Draw sequence length
    ctx2D.font = '10px Arial';
    ctx2D.fillText(
        `${exon.length}bp`,
        exonX + exonWidth/2,
        baseY + CANVAS_SETTINGS.EXON_HEIGHT/2 + 15
    );
}

function drawEnhancedDomain(domain, startX, baseY, geneLength) {
    const domainStart = startX + (geneLength * (domain.start / 400));
    const domainWidth = (geneLength * ((domain.end - domain.start) / 400));
    
    // Create gradient for domain
    const gradient = ctx2D.createLinearGradient(
        domainStart, baseY + CANVAS_SETTINGS.EXON_HEIGHT/2 + 10,
        domainStart, baseY + CANVAS_SETTINGS.EXON_HEIGHT/2 + 10 + CANVAS_SETTINGS.DOMAIN_HEIGHT
    );
    gradient.addColorStop(0, domain.color);
    gradient.addColorStop(1, adjustColor(domain.color, -20));
    
    // Draw domain with shadow
    ctx2D.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx2D.shadowBlur = 3;
    ctx2D.shadowOffsetY = 1;
    ctx2D.fillStyle = gradient;
    
    // Draw rounded rectangle for domain
    const radius = 5;
    ctx2D.beginPath();
    ctx2D.roundRect(
        domainStart,
        baseY + CANVAS_SETTINGS.EXON_HEIGHT/2 + 10,
        domainWidth,
        CANVAS_SETTINGS.DOMAIN_HEIGHT,
        radius
    );
    ctx2D.fill();
    
    // Remove shadow for text
    ctx2D.shadowColor = 'transparent';

    // Draw domain name with rotation
    ctx2D.save();
    ctx2D.fillStyle = COLORS.TEXT;
    ctx2D.font = 'bold 10px Arial';
    ctx2D.translate(
        domainStart + domainWidth/2,
        baseY + CANVAS_SETTINGS.EXON_HEIGHT/2 + CANVAS_SETTINGS.DOMAIN_HEIGHT + 25
    );
    ctx2D.rotate(-Math.PI/6);
    ctx2D.textAlign = 'left';
    ctx2D.fillText(domain.name, 0, 0);
    
    // Draw conservation score
    if (domain.conservation) {
        ctx2D.fillStyle = '#666';
        ctx2D.font = '9px Arial';
        ctx2D.fillText(`Conservation: ${(domain.conservation * 100).toFixed(1)}%`, 0, 12);
    }
    
    ctx2D.restore();
}

// Вспомогательная функция для корректировки цвета
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function drawEnhancedMutation(mutation, startX, baseY, geneLength) {
    const mutationX = startX + (geneLength * (mutation.position / 400));
    
    // Draw mutation marker with glow effect
    ctx2D.shadowColor = 'rgba(231, 76, 60, 0.5)';
    ctx2D.shadowBlur = 10;
    ctx2D.beginPath();
    ctx2D.moveTo(mutationX, baseY - 8);
    ctx2D.lineTo(mutationX + 8, baseY);
    ctx2D.lineTo(mutationX, baseY + 8);
    ctx2D.lineTo(mutationX - 8, baseY);
    ctx2D.closePath();
    
    // Create gradient for mutation marker
    const gradient = ctx2D.createRadialGradient(
        mutationX, baseY, 0,
        mutationX, baseY, 8
    );
    gradient.addColorStop(0, '#e74c3c');
    gradient.addColorStop(1, '#c0392b');
    
    ctx2D.fillStyle = gradient;
    ctx2D.fill();
    
    // Remove shadow for text
    ctx2D.shadowColor = 'transparent';

    // Draw mutation label with background
    const label = `${mutation.id} (${mutation.type})`;
    ctx2D.font = '10px Arial';
    const textWidth = ctx2D.measureText(label).width;
    
    // Draw label background
    ctx2D.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx2D.fillRect(
        mutationX - textWidth/2 - 2,
        baseY - 25,
        textWidth + 4,
        14
    );

    // Draw label text
    ctx2D.fillStyle = mutation.impact === 'high' ? '#e74c3c' : '#2c3e50';
    ctx2D.textAlign = 'center';
    ctx2D.fillText(label, mutationX, baseY - 15);
}

function drawGrid() {
    const gridSize = 50;
    const gridColor = 'rgba(200, 200, 200, 0.2)';
    
    ctx2D.beginPath();
    ctx2D.strokeStyle = gridColor;
    ctx2D.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x < canvas2D.width; x += gridSize) {
        ctx2D.moveTo(x, 0);
        ctx2D.lineTo(x, canvas2D.height);
    }

    // Horizontal lines
    for (let y = 0; y < canvas2D.height; y += gridSize) {
        ctx2D.moveTo(0, y);
        ctx2D.lineTo(canvas2D.width, y);
    }

    ctx2D.stroke();
}

function drawConservationGraph(gene, startX, baseY, geneLength) {
    if (!gene.structure.conservation) return;

    ctx2D.beginPath();
    ctx2D.strokeStyle = '#3498db';
    ctx2D.lineWidth = 2;

    gene.structure.conservation.forEach((cons, index) => {
        const x = startX + (geneLength * (cons.start / 400));
        const y = baseY - (cons.score * 50); // Scale conservation score

        if (index === 0) {
            ctx2D.moveTo(x, y);
        } else {
            ctx2D.lineTo(x, y);
        }
    });

    ctx2D.stroke();
}
// 3D Model Visualization
function create3DModel() {
    if (!scene3D) return;
    
    // Clear existing objects
    while(scene3D.children.length > 0) {
        scene3D.remove(scene3D.children[0]);
    }

    const gene = geneData[state.currentGene];
    if (!gene) return;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene3D.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene3D.add(directionalLight);

    // Create protein domains
    gene.structure.domains.forEach((domain, index) => {
        // Create domain geometry
        const geometry = new THREE.BoxGeometry(
            (domain.end - domain.start) / 20,
            0.3,
            0.3
        );

        // Create materials with custom shaders
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(domain.color) },
                time: { value: 0 },
                conservation: { value: domain.conservation || 0.5 }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                void main() {
                    vUv = uv;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float time;
                uniform float conservation;
                varying vec2 vUv;
                varying vec3 vNormal;
                
                void main() {
                    float pulse = sin(time * 2.0) * 0.1 + 0.9;
                    vec3 finalColor = color * pulse * conservation;
                    float fresnel = pow(1.0 + dot(vNormal, normalize(vec3(0, 0, 1))), 2.0);
                    gl_FragColor = vec4(finalColor * fresnel, 1.0);
                }
            `
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = index * 1.2 - (gene.structure.domains.length * 1.2) / 2;
        mesh.userData = domain; // Store domain data for interaction

        // Add interaction highlight
        mesh.onBeforeRender = function(renderer, scene, camera) {
            mesh.material.uniforms.time.value += 0.016;
        };

        scene3D.add(mesh);

        // Add domain connections
        if (index > 0) {
            const connection = createDomainConnection(
                mesh.position,
                scene3D.children[scene3D.children.length - 2].position
            );
            scene3D.add(connection);
        }
    });

    // Add mutations visualization
    gene.structure.mutations.forEach(mutation => {
        const mutationSphere = createMutationMarker(mutation);
        scene3D.add(mutationSphere);
    });

    // Add conservation visualization
    if (gene.structure.conservation) {
        const conservationMesh = createConservationVisualization(gene.structure.conservation);
        scene3D.add(conservationMesh);
    }
}

function createDomainConnection(start, end) {
    const points = [];
    points.push(new THREE.Vector3(start.x, start.y, start.z));
    points.push(new THREE.Vector3(end.x, end.y, end.z));

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
    const material = new THREE.MeshPhongMaterial({
        color: 0x808080,
        transparent: true,
        opacity: 0.6
    });

    return new THREE.Mesh(geometry, material);
}

function createMutationMarker(mutation) {
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: mutation.impact === 'high' ? 0xe74c3c : 0xf1c40f,
        emissive: 0x111111,
        shininess: 100
    });

    const sphere = new THREE.Mesh(geometry, material);
    // Position based on mutation location
    sphere.position.set(
        (mutation.position / 200) - 1,
        0.5,
        0
    );

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: mutation.impact === 'high' ? 0xe74c3c : 0xf1c40f,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sphere.add(glow);

    return sphere;
}

function createConservationVisualization(conservation) {
    const points = conservation.map((cons, i) => {
        return new THREE.Vector3(
            (i / conservation.length) * 4 - 2,
            cons.score - 0.5,
            -0.5
        );
    });

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 50, 0.05, 8, false);
    const material = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        transparent: true,
        opacity: 0.7
    });

    return new THREE.Mesh(geometry, material);
}

function update3DModel() {
    if (!renderer3D || !scene3D || !camera3D) return;

    // Update animations and effects
    scene3D.traverse(object => {
        if (object.material && object.material.uniforms) {
            object.material.uniforms.time.value += 0.016;
        }
    });

    renderer3D.render(scene3D, camera3D);
}

// DNA Helix Visualization
function startDNAAnimation() {
    if (!canvasDNA || !ctxDNA) return;
    
    const gene = geneData[state.currentGene];
    if (!gene) return;

    state.isAnimating = true;
    animateDNAHelix();
}

function animateDNAHelix() {
    if (!state.isAnimating || !canvasDNA || !ctxDNA) return;

    const gene = geneData[state.currentGene];
    if (!gene) return;

    ctxDNA.clearRect(0, 0, canvasDNA.width, canvasDNA.height);
    
    const sequence = gene.structure.exons[0].sequence;
    const centerX = canvasDNA.width / 2;
    const centerY = canvasDNA.height / 2;
    
    // Update rotation
    state.dnaRotation += 0.02 * state.animationSpeed;

    sequence.split('').forEach((base, i) => {
        const y = centerY + (i - sequence.length/2) * CANVAS_SETTINGS.DNA_VERTICAL_SPACING;
        const angle = i * 0.5 + state.dnaRotation;
        
        // Calculate positions with perspective
        const x1 = centerX + Math.cos(angle) * CANVAS_SETTINGS.DNA_RADIUS;
        const x2 = centerX + Math.cos(angle + Math.PI) * CANVAS_SETTINGS.DNA_RADIUS;
        const z1 = Math.sin(angle) * CANVAS_SETTINGS.DNA_RADIUS * 0.3;
        const z2 = Math.sin(angle + Math.PI) * CANVAS_SETTINGS.DNA_RADIUS * 0.3;

        // Draw base pairs with enhanced styling
        drawDNABasePair(base, x1, x2, y, z1, z2);
    });

    // Request next frame
    state.animationFrameId = requestAnimationFrame(animateDNAHelix);
}

function drawDNABasePair(base, x1, x2, y, z1, z2) {
    if (!ctxDNA) return;

    const complement = SequenceUtils.getComplementaryBase(base);
    
    // Draw connecting line with gradient
    const gradient = ctxDNA.createLinearGradient(x1, y, x2, y);
    gradient.addColorStop(0, COLORS.DNA[base]);
    gradient.addColorStop(1, COLORS.DNA[complement]);
    
    ctxDNA.beginPath();
    ctxDNA.strokeStyle = gradient;
    ctxDNA.lineWidth = 2 + Math.abs(z1) * 0.1;
    ctxDNA.moveTo(x1, y);
    ctxDNA.lineTo(x2, y);
    ctxDNA.stroke();

    // Draw bases if enabled
    if (state.showBases) {
        ctxDNA.font = `${12 + Math.abs(z1) * 2}px Arial`;
        ctxDNA.textAlign = 'center';
        ctxDNA.textBaseline = 'middle';

        // First base
        ctxDNA.fillStyle = COLORS.DNA[base];
        ctxDNA.fillText(base, x1, y);
        
        // Complementary base
        ctxDNA.fillStyle = COLORS.DNA[complement];
        ctxDNA.fillText(complement, x2, y);

        // Add base pair indication
        if (base === 'A' || base === 'T') {
            // Draw double lines for A-T pairs
            drawBasePairBonds(x1, x2, y, 2);
        } else {
            // Draw triple lines for G-C pairs
            drawBasePairBonds(x1, x2, y, 3);
        }
    }
}

function drawBasePairBonds(x1, x2, y, count) {
    if (!ctxDNA) return;

    const spacing = 4;
    const startY = y - ((count - 1) * spacing) / 2;

    for (let i = 0; i < count; i++) {
        const bondY = startY + i * spacing;
        ctxDNA.beginPath();
        ctxDNA.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctxDNA.setLineDash([2, 2]);
        ctxDNA.moveTo(x1, bondY);
        ctxDNA.lineTo(x2, bondY);
        ctxDNA.stroke();
        ctxDNA.setLineDash([]);
    }
}

// Transcription Visualization
function startTranscription() {
    state.isTranscribing = true;
    state.transcriptionProgress = 0;
    animateTranscription();
}

function animateTranscription() {
    if (!state.isTranscribing || !canvasTranscription || !ctxTranscription) return;

    const gene = geneData[state.currentGene];
    if (!gene) return;

    ctxTranscription.clearRect(0, 0, canvasTranscription.width, canvasTranscription.height);
    
    const sequence = gene.structure.exons[0].sequence;
    const baseY = canvasTranscription.height * 0.4;
    const startX = 50;
    const baseWidth = 30;

    // Draw DNA template
    drawTranscriptionTemplate(sequence, startX, baseY, baseWidth);

    // Draw RNA polymerase
    drawRNAPolymerase(startX, baseY, baseWidth);

    // Draw growing RNA chain
    drawRNAChain(sequence, startX, baseY, baseWidth);

    // Update progress
    if (state.transcriptionProgress < sequence.length) {
        state.transcriptionProgress += 0.1 * state.animationSpeed;
        requestAnimationFrame(animateTranscription);
    }
}
// Event Handlers
function handleMouseDown(e) {
    if (!canvas2D) return;

    state.isDragging = true;
    state.lastMousePos = {
        x: e.offsetX,
        y: e.offsetY
    };

    // Check for clickable elements
    const clickedElement = findClickableElement(e.offsetX, e.offsetY);
    if (clickedElement) {
        handleElementClick(clickedElement);
    }

    canvas2D.style.cursor = 'grabbing';
}

function handleMouseMove(e) {
    if (!canvas2D) return;

    // Hover effects
    const hoveredElement = findClickableElement(e.offsetX, e.offsetY);
    if (hoveredElement) {
        showTooltip(hoveredElement, e.pageX, e.pageY);
        canvas2D.style.cursor = 'pointer';
    } else {
        hideTooltip();
        canvas2D.style.cursor = state.isDragging ? 'grabbing' : 'default';
    }

    if (state.isDragging) {
        const deltaX = e.offsetX - state.lastMousePos.x;
        const deltaY = e.offsetY - state.lastMousePos.y;
        
        state.panOffset.x += deltaX;
        state.panOffset.y += deltaY;
        
        state.lastMousePos = {
            x: e.offsetX,
            y: e.offsetY
        };
        
        updateVisualization();
    }
}

function findClickableElement(x, y) {
    if (!ctx2D || !canvas2D) return null;

    const gene = geneData[state.currentGene];
    if (!gene) return null;

    // Transform coordinates based on current pan and zoom
    const transformedX = (x - state.panOffset.x) / state.zoomLevel;
    const transformedY = (y - state.panOffset.y) / state.zoomLevel;

    const baseY = canvas2D.height / 2;
    const startX = CANVAS_SETTINGS.PADDING;
    const geneLength = canvas2D.width - (CANVAS_SETTINGS.PADDING * 2);

    // Check exons
    for (const exon of gene.structure.exons) {
        const exonX = startX + (geneLength * (exon.start / 400));
        const exonWidth = (geneLength * (exon.length / 400));
        
        if (isPointInRect(
            transformedX,
            transformedY,
            exonX,
            baseY - CANVAS_SETTINGS.EXON_HEIGHT/2,
            exonWidth,
            CANVAS_SETTINGS.EXON_HEIGHT
        )) {
            return { type: 'exon', data: exon };
        }
    }

    // Check domains
    for (const domain of gene.structure.domains) {
        const domainStart = startX + (geneLength * (domain.start / 400));
        const domainWidth = (geneLength * ((domain.end - domain.start) / 400));
        
        if (isPointInRect(
            transformedX,
            transformedY,
            domainStart,
            baseY + CANVAS_SETTINGS.EXON_HEIGHT/2 + 10,
            domainWidth,
            CANVAS_SETTINGS.DOMAIN_HEIGHT
        )) {
            return { type: 'domain', data: domain };
        }
    }

    // Check mutations
    for (const mutation of gene.structure.mutations) {
        const mutationX = startX + (geneLength * (mutation.position / 400));
        
        if (isPointInCircle(
            transformedX,
            transformedY,
            mutationX,
            baseY,
            8
        )) {
            return { type: 'mutation', data: mutation };
        }
    }

    return null;
}

function handleElementClick(element) {
    switch(element.type) {
        case 'exon':
            showExonDetails(element.data);
            break;
        case 'domain':
            showDomainDetails(element.data);
            break;
        case 'mutation':
            showMutationDetails(element.data);
            break;
    }
}

// Information Display Functions
function showExonDetails(exon) {
    const modal = document.getElementById('analysisModal');
    const results = document.getElementById('analysisResults');
    if (!modal || !results) return;

    const gcContent = SequenceUtils.calculateGCContent(exon.sequence);
    
    results.innerHTML = `
        <div class="details-card">
            <h4>Exon ${exon.id} Details</h4>
            <div class="details-content">
                <p><strong>Length:</strong> ${exon.length}bp</p>
                <p><strong>GC Content:</strong> ${gcContent.toFixed(1)}%</p>
                <p><strong>Sequence:</strong></p>
                <div class="sequence-display">
                    ${formatSequence(exon.sequence)}
                </div>
                <div class="codon-analysis">
                    ${analyzeExonCodons(exon.sequence)}
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

function showDomainDetails(domain) {
    const modal = document.getElementById('analysisModal');
    const results = document.getElementById('analysisResults');
    if (!modal || !results) return;

    results.innerHTML = `
        <div class="details-card">
            <h4>${domain.name}</h4>
            <div class="details-content">
                <p><strong>Position:</strong> ${domain.start}-${domain.end}</p>
                <p><strong>Length:</strong> ${domain.end - domain.start + 1}aa</p>
                <p><strong>Function:</strong> ${domain.function}</p>
                ${domain.conservation ? `
                    <div class="conservation-meter">
                        <p><strong>Conservation Score:</strong> ${(domain.conservation * 100).toFixed(1)}%</p>
                        <div class="meter">
                            <div class="meter-fill" style="width: ${domain.conservation * 100}%"></div>
                        </div>
                    </div>
                ` : ''}
                <div class="domain-structure">
                    ${generateDomainStructureVisualization(domain)}
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

function showMutationDetails(mutation) {
    const modal = document.getElementById('analysisModal');
    const results = document.getElementById('analysisResults');
    if (!modal || !results) return;

    results.innerHTML = `
        <div class="details-card mutation-details ${mutation.impact}">
            <h4>${mutation.id}</h4>
            <div class="details-content">
                <div class="mutation-type-badge ${mutation.type}">
                    ${mutation.type.toUpperCase()}
                </div>
                <p><strong>Position:</strong> ${mutation.position}</p>
                <p><strong>Nucleotide Change:</strong> ${mutation.nucleotide}</p>
                <p><strong>Effect:</strong> ${mutation.effect}</p>
                <p><strong>Pathogenicity:</strong> ${mutation.pathogenicity}</p>
                <p><strong>Frequency:</strong> ${mutation.frequency}</p>
                <div class="impact-assessment">
                    <p><strong>Impact Assessment:</strong></p>
                    ${generateImpactAssessment(mutation)}
                </div>
                <div class="mutation-description">
                    <p>${mutation.description}</p>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Helper Functions for Analysis
function formatSequence(sequence) {
    const codons = sequence.match(/.{1,3}/g) || [];
    return codons.map((codon, i) => `
        <span class="codon" data-index="${i}" style="background-color: ${getCodonBackgroundColor(codon)}">
            ${codon}
        </span>
    `).join('');
}

function getCodonBackgroundColor(codon) {
    const colors = {
        'ATG': '#ff9999', // Start codon
        'TAA': '#99ff99', // Stop codons
        'TAG': '#99ff99',
        'TGA': '#99ff99'
    };
    return colors[codon] || 'transparent';
}

function analyzeExonCodons(sequence) {
    const codons = sequence.match(/.{1,3}/g) || [];
    const analysis = {
        startCodons: 0,
        stopCodons: 0,
        aminoAcids: {}
    };

    codons.forEach(codon => {
        if (codon === 'ATG') analysis.startCodons++;
        if (['TAA', 'TAG', 'TGA'].includes(codon)) analysis.stopCodons++;
        
        const aa = SequenceUtils.getAminoAcid(codon);
        analysis.aminoAcids[aa] = (analysis.aminoAcids[aa] || 0) + 1;
    });

    return `
        <div class="codon-statistics">
            <p><strong>Start Codons:</strong> ${analysis.startCodons}</p>
            <p><strong>Stop Codons:</strong> ${analysis.stopCodons}</p>
            <div class="amino-acid-distribution">
                <h5>Amino Acid Distribution:</h5>
                ${generateAminoAcidChart(analysis.aminoAcids)}
            </div>
        </div>
    `;
}

function generateDomainStructureVisualization(domain) {
    // Create a simplified visual representation of the domain structure
    const width = 300;
    const height = 100;
    
    return `
        <svg width="${width}" height="${height}" class="domain-structure-svg">
            <defs>
                <linearGradient id="domainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:${domain.color};stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:${domain.color};stop-opacity:0.4" />
                </linearGradient>
            </defs>
            <rect
                x="10"
                y="40"
                width="${width - 20}"
                height="20"
                fill="url(#domainGradient)"
                rx="5"
                ry="5"
            />
            ${generateConservationMarkers(domain, width, height)}
        </svg>
    `;
}

function generateImpactAssessment(mutation) {
    const impactScores = {
        structural: calculateStructuralImpact(mutation),
        functional: calculateFunctionalImpact(mutation),
        conservation: calculateConservationImpact(mutation)
    };

    return `
        <div class="impact-scores">
            <div class="impact-score">
                <label>Structural Impact:</label>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${impactScores.structural}%"></div>
                </div>
                <span>${impactScores.structural}%</span>
            </div>
            <div class="impact-score">
                <label>Functional Impact:</label>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${impactScores.functional}%"></div>
                </div>
                <span>${impactScores.functional}%</span>
            </div>
            <div class="impact-score">
                <label>Conservation Impact:</label>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${impactScores.conservation}%"></div>
                </div>
                <span>${impactScores.conservation}%</span>
            </div>
        </div>
    `;
}

// Impact Calculation Functions
function calculateStructuralImpact(mutation) {
    // Implement structural impact calculation logic
    return Math.min(100, Math.max(0, mutation.type === 'deletion' ? 90 : 70));
}

function calculateFunctionalImpact(mutation) {
    // Implement functional impact calculation logic
    return Math.min(100, Math.max(0, mutation.impact === 'high' ? 95 : 60));
}

function calculateConservationImpact(mutation) {
    // Implement conservation impact calculation logic
    return Math.min(100, Math.max(0, mutation.pathogenicity === 'Патогенная' ? 85 : 50));
}
// Data Visualization Functions
function generateAminoAcidChart(aminoAcids) {
    const maxCount = Math.max(...Object.values(aminoAcids));
    const barHeight = 20;
    const barSpacing = 25;
    const width = 300;
    const height = Object.keys(aminoAcids).length * barSpacing + 20;

    return `
        <svg width="${width}" height="${height}" class="amino-acid-chart">
            ${Object.entries(aminoAcids).map((entry, index) => {
                const [aa, count] = entry;
                const barWidth = (count / maxCount) * (width - 60);
                const y = index * barSpacing + 10;
                return `
                    <g class="bar-group">
                        <text x="20" y="${y + 15}" class="aa-label">${aa}</text>
                        <rect
                            x="45"
                            y="${y}"
                            width="${barWidth}"
                            height="${barHeight}"
                            fill="#3498db"
                            opacity="0.8"
                            rx="3"
                            ry="3"
                        >
                            <title>${aa}: ${count}</title>
                        </rect>
                        <text x="${barWidth + 55}" y="${y + 15}" class="count-label">${count}</text>
                    </g>
                `;
            }).join('')}
        </svg>
    `;
}

function generateConservationMarkers(domain, width, height) {
    if (!domain.conservation) return '';

    const markers = [];
    const markerCount = 10;
    const markerWidth = (width - 20) / markerCount;

    for (let i = 0; i < markerCount; i++) {
        const x = 10 + i * markerWidth;
        const opacity = domain.conservation;
        markers.push(`
            <rect
                x="${x}"
                y="65"
                width="${markerWidth - 2}"
                height="5"
                fill="#2ecc71"
                opacity="${opacity}"
            />
        `);
    }

    return markers.join('');
}

function drawTranscriptionTemplate(sequence, startX, baseY, baseWidth) {
    if (!ctxTranscription) return;

    sequence.split('').forEach((base, i) => {
        const x = startX + i * baseWidth;
        
        // Draw DNA strand
        ctxTranscription.fillStyle = COLORS.DNA[base];
        ctxTranscription.font = '14px Arial';
        ctxTranscription.textAlign = 'center';
        ctxTranscription.fillText(base, x, baseY);
        
        // Draw complementary strand with animation effect
        const complement = SequenceUtils.getComplementaryBase(base);
        const yOffset = Math.sin(Date.now() * 0.002 + i * 0.5) * 2;
        ctxTranscription.fillStyle = COLORS.DNA[complement];
        ctxTranscription.fillText(complement, x, baseY + 20 + yOffset);

        // Draw hydrogen bonds
        drawHydrogenBonds(x, baseY, base === 'A' || base === 'T' ? 2 : 3);
    });
}

function drawRNAPolymerase(startX, baseY, baseWidth) {
    if (!ctxTranscription) return;

    const x = startX + state.transcriptionProgress * baseWidth;
    
    // Create gradient for RNA polymerase
    const gradient = ctxTranscription.createRadialGradient(x, baseY + 10, 0, x, baseY + 10, 20);
    gradient.addColorStop(0, '#2ecc71');
    gradient.addColorStop(1, '#27ae60');

    // Draw RNA polymerase body
    ctxTranscription.beginPath();
    ctxTranscription.fillStyle = gradient;
    ctxTranscription.arc(x, baseY + 10, 15, 0, Math.PI * 2);
    ctxTranscription.fill();

    // Add detail to RNA polymerase
    ctxTranscription.beginPath();
    ctxTranscription.strokeStyle = '#ffffff';
    ctxTranscription.lineWidth = 2;
    ctxTranscription.arc(x, baseY + 10, 10, 0, Math.PI * 2);
    ctxTranscription.stroke();

    // Add active site indicator
    const time = Date.now() * 0.002;
    const glowSize = Math.sin(time) * 2 + 5;
    
    ctxTranscription.beginPath();
    ctxTranscription.fillStyle = '#f1c40f';
    ctxTranscription.arc(x + 5, baseY + 5, glowSize, 0, Math.PI * 2);
    ctxTranscription.fill();
}

function drawRNAChain(sequence, startX, baseY, baseWidth) {
    if (!ctxTranscription) return;

    const rnaY = baseY + 50;
    const progress = Math.floor(state.transcriptionProgress);
    
    for (let i = 0; i < progress && i < sequence.length; i++) {
        const base = sequence[i];
        const rnaBase = SequenceUtils.getRNAComplement(base);
        const x = startX + i * baseWidth;
        
        // Draw RNA nucleotide
        ctxTranscription.fillStyle = COLORS.DNA[rnaBase];
        ctxTranscription.font = 'bold 14px Arial';
        ctxTranscription.textAlign = 'center';
        
        // Add wobble effect
        const wobble = Math.sin(Date.now() * 0.002 + i * 0.3) * 2;
        ctxTranscription.fillText(rnaBase, x, rnaY + wobble);

        // Add connecting line with gradient
        const gradient = ctxTranscription.createLinearGradient(x, baseY + 20, x, rnaY + wobble);
        gradient.addColorStop(0, `rgba(${hexToRgb(COLORS.DNA[base])}, 0.2)`);
        gradient.addColorStop(1, `rgba(${hexToRgb(COLORS.DNA[rnaBase])}, 0.2)`);
        
        ctxTranscription.beginPath();
        ctxTranscription.strokeStyle = gradient;
        ctxTranscription.moveTo(x, baseY + 20);
        ctxTranscription.lineTo(x, rnaY + wobble);
        ctxTranscription.stroke();
    }
}

// Utility Functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '0, 0, 0';
}

function drawHydrogenBonds(x, baseY, count) {
    if (!ctxTranscription) return;

    const spacing = 4;
    const startY = baseY + 5;
    
    ctxTranscription.beginPath();
    ctxTranscription.strokeStyle = 'rgba(150, 150, 150, 0.5)';
    ctxTranscription.setLineDash([2, 2]);
    
    for (let i = 0; i < count; i++) {
        const bondY = startY + i * spacing;
        ctxTranscription.moveTo(x - 3, bondY);
        ctxTranscription.lineTo(x + 3, bondY);
    }
    
    ctxTranscription.stroke();
    ctxTranscription.setLineDash([]);
}

function showTooltip(element, x, y) {
    const tooltip = document.querySelector('.tooltip');
    if (!tooltip) return;

    let content = '';
    switch(element.type) {
        case 'exon':
            content = `
                <div class="tooltip-content">
                    <strong>Exon ${element.data.id}</strong><br>
                    Length: ${element.data.length}bp<br>
                    GC Content: ${SequenceUtils.calculateGCContent(element.data.sequence).toFixed(1)}%
                </div>
            `;
            break;
        case 'domain':
            content = `
                <div class="tooltip-content">
                    <strong>${element.data.name}</strong><br>
                    Position: ${element.data.start}-${element.data.end}<br>
                    Function: ${element.data.function}
                </div>
            `;
            break;
        case 'mutation':
            content = `
                <div class="tooltip-content">
                    <strong>${element.data.id}</strong><br>
                    Type: ${element.data.type}<br>
                    Effect: ${element.data.effect}
                </div>
            `;
            break;
    }

    tooltip.innerHTML = content;
    tooltip.style.display = 'block';
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y + 10}px`;
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

function isPointInRect(x, y, rectX, rectY, width, height) {
    return x >= rectX && x <= rectX + width && y >= rectY && y <= rectY + height;
}

function isPointInCircle(x, y, circleX, circleY, radius) {
    const dx = x - circleX;
    const dy = y - circleY;
    return (dx * dx + dy * dy) <= radius * radius;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SequenceUtils,
        generateAminoAcidChart,
        generateConservationMarkers,
        calculateStructuralImpact,
        calculateFunctionalImpact,
        calculateConservationImpact
    };
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Clean up on page unload
window.addEventListener('unload', () => {
    if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
    }
});