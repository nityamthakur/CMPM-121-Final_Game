class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("MainMenuScene");
        this.saveSystem = new SaveSystem();
    }

    preload() {
        // Preload assets for the main menu
        this.load.audio("background", "./assets/background.mp3"); // Background music
        this.load.image("backgroundImage", "./assets/farm_background.png"); // Farm-themed background image
    }

    create() {
        // Add background image
        this.add.image(400, 300, "backgroundImage").setDisplaySize(800, 600);

        // Add title with a nicer font
        const title = this.add.text(400, 100, "Harvest Quest", {
            fontFamily: "Georgia, serif",
            fontSize: "64px",
            fill: "#FFD700",
            stroke: "#8B4513",
            strokeThickness: 6,
        }).setOrigin(0.5);

        // Play background music
        this.backgroundMusic = this.sound.add("background", { loop: true });
        this.backgroundMusic.play();

        // Add buttons with a farm-themed design
        const buttonStyle = {
            fontFamily: "Verdana, sans-serif",
            fontSize: "24px",
            fill: "#fff",
            backgroundColor: "#8B4513",
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        };

        // Start New Game button
        const startButton = this.add.text(400, 200, this.getText("main_menu.start_new_game"), buttonStyle)
            .setInteractive()
            .setOrigin(0.5);
        startButton.on("pointerdown", () => this.startNewGame());

        // Load Game button
        const loadButton = this.add.text(400, 250, this.getText("main_menu.load_game"), buttonStyle)
            .setInteractive()
            .setOrigin(0.5);
        loadButton.on("pointerdown", () => this.loadGameMenu());

        // Resume Auto-Save button
        if (this.saveSystem.hasAutoSave()) {
            const resumeButton = this.add.text(400, 300, this.getText("main_menu.resume_auto_save"), buttonStyle)
                .setInteractive()
                .setOrigin(0.5);
            resumeButton.on("pointerdown", () => this.resumeAutoSave());
        }

        // Instructions button
        const instructionsButton = this.add.text(400, 350, this.getText("main_menu.instructions"), buttonStyle)
            .setInteractive()
            .setOrigin(0.5);
        instructionsButton.on("pointerdown", () => this.showInstructions());

        // Instructions text
        this.instructionText = this.add.text(400, 450, "", {
            fontSize: "20px",
            fill: "#fff",
            align: "center",
            wordWrap: { width: 500 },
        }).setOrigin(0.5);
        this.instructionText.visible = false;

        // Add language selection on the right side
        const languageTitle = this.add.text(650, 200, this.getText("main_menu.select_language"), {
            fontFamily: "Verdana, sans-serif",
            fontSize: "20px",
            fill: "#fff",
        }).setOrigin(0.5);

        const languages = ["en", "zh", "ar"];
        languages.forEach((lang, index) => {
            const langButton = this.add.text(650, 230 + index * 30, lang.toUpperCase(), {
                fontFamily: "Verdana, sans-serif",
                fontSize: "20px",
                fill: "#FFD700",
                backgroundColor: "#8B4513",
                padding: { left: 10, right: 10, top: 5, bottom: 5 },
            }).setInteractive().setOrigin(0.5);

            langButton.on("pointerdown", () => {
                this.registry.set("currentLanguage", lang);
                this.scene.restart();
            });
        });
    }

    startNewGame() {
        this.saveSystem.deleteSave("auto");
        this.scene.start("GameScene", { newGame: true });
    }

    loadGameMenu() {
        const saveSlots = this.saveSystem.listSaveSlots();
        if (saveSlots.length === 0) {
            alert(this.getText("main_menu.no_saved_games"));
            return;
        }

        const slot = prompt(`${this.getText("main_menu.available_saves")}\n${saveSlots.join("\n")}\n\n${this.getText("main_menu.enter_save_slot")}`);
        if (slot && saveSlots.includes(slot)) {
            const savedState = this.saveSystem.loadFromSlot(slot);
            if (savedState) {
                this.scene.start("GameScene", { savedState });
            } else {
                alert(this.getText("main_menu.load_failed"));
            }
        }
    }

    resumeAutoSave() {
        const autoSaveState = this.saveSystem.loadAuto();
        if (autoSaveState) {
            this.scene.start("GameScene", { savedState: autoSaveState });
        }
    }

    showInstructions() {
        this.instructionText.visible = !this.instructionText.visible;
        if (this.instructionText.visible) {
            this.instructionText.setText(this.getText("main_menu.instructions_text"));
        } else {
            this.instructionText.setText("");
        }
    }

    getText(key) {
        const currentLanguage = this.registry.get("currentLanguage") || "en";
        const languages = this.registry.get("languages");
        return languages[currentLanguage][key] || key;
    }

    shutdown() {
        if (this.backgroundMusic) this.backgroundMusic.stop();
    }
}