class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("MainMenuScene");
        this.saveSystem = new SaveSystem();
    }

    create() {
        // Display title
        this.add.text(400, 100, this.getText("main_menu.title"), {
            fontSize: "32px",
            fill: "#fff",
        }).setOrigin(0.5);

        // Add "Start New Game" button
        const startButton = this.add.text(400, 200, this.getText("main_menu.start_new_game"), {
            fontSize: "24px",
            fill: "#fff",
        })
            .setInteractive()
            .setOrigin(0.5);
        startButton.on("pointerdown", () => this.startNewGame());

        // Add "Load Game" button
        const loadButton = this.add.text(400, 250, this.getText("main_menu.load_game"), {
            fontSize: "24px",
            fill: "#fff",
        })
            .setInteractive()
            .setOrigin(0.5);
        loadButton.on("pointerdown", () => this.loadGameMenu());

        // Add "Resume Auto-Save" button (only if an auto-save exists)
        if (this.saveSystem.hasAutoSave()) {
            const resumeButton = this.add.text(400, 300, this.getText("main_menu.resume_auto_save"), {
                fontSize: "24px",
                fill: "#fff",
            })
                .setInteractive()
                .setOrigin(0.5);
            resumeButton.on("pointerdown", () => this.resumeAutoSave());
        }

        // Add "Instructions" button
        const instructionsButton = this.add.text(400, 350, this.getText("main_menu.instructions"), {
            fontSize: "24px",
            fill: "#fff",
        })
            .setInteractive()
            .setOrigin(0.5);
        instructionsButton.on("pointerdown", () => this.showInstructions());

        // Instructions text
        this.instructionText = this.add.text(400, 450, "", {
            fontSize: "20px",
            fill: "#fff",
            align: "center",
        }).setOrigin(0.5);
        this.instructionText.visible = false;

        // Add language selection dropdown
        this.add.text(400, 400, this.getText("main_menu.select_language"), {
            fontSize: "20px",
            fill: "#fff",
        }).setOrigin(0.5);

        const languages = ["en", "zh", "ar"]; // Supported languages
        languages.forEach((lang, index) => {
            const langButton = this.add.text(400, 430 + index * 30, lang.toUpperCase(), {
                fontSize: "20px",
                fill: "#fff",
            })
                .setInteractive()
                .setOrigin(0.5);

            langButton.on("pointerdown", () => {
                this.registry.set("currentLanguage", lang);
                this.scene.restart(); // Restart scene to apply new language
            });
        });
    }

    startNewGame() {
        const saveSystem = new SaveSystem();
        saveSystem.deleteSave("auto"); // Clear auto-save data
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

    // Helper function to fetch localized text
    getText(key) {
        const currentLanguage = this.registry.get("currentLanguage") || "en";
        const languages = this.registry.get("languages");
        return languages[currentLanguage][key] || key;
    }
}