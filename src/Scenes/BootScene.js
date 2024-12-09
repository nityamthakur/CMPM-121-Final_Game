class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Set the path for all assets
        this.load.setPath('./assets/');

        this.load.json("languages", "./languages.json");

        // List of plant types and their growth stages
        const plantTypes = ['cabbage', 'carrot', 'corn'];
        const growthStages = [1, 2, 3];

        // Load plant images dynamically
        plantTypes.forEach((type) => {
            growthStages.forEach((stage) => {
                this.load.image(`${type}_${stage}`, `${type}_${stage}.png`);
            });
        });

        // Load other game assets
        this.load.image('character', 'Character.png');
        this.load.image('grass', 'grass.png');

        // Display loading progress
        const loadingText = this.add.text(20, 20, 'Loading...', { fontSize: '20px', fill: '#FFFFFF' });
        this.load.on('progress', (progress) => {
            loadingText.setText(`Loading: ${Math.round(progress * 100)}%`);
        });
    }

    create() {
        const languages = {
            en: {
                "main_menu.title": "Main Menu",
                "main_menu.start_new_game": "Start New Game",
                "main_menu.load_game": "Load Game",
                "main_menu.resume_auto_save": "Resume Auto-Save",
                "main_menu.instructions": "Instructions",
                "main_menu.select_language": "Select Language",
                "main_menu.no_saved_games": "No saved games available.",
                "main_menu.available_saves": "Available saves",
                "main_menu.enter_save_slot": "Enter the save slot to load:",
                "main_menu.load_failed": "Failed to load the game.",
                "main_menu.instructions_text": "Use the arrow keys to move and spacebar to advance time.",
            },
            zh: {
                "main_menu.title": "主菜单",
                "main_menu.start_new_game": "开始新游戏",
                "main_menu.load_game": "加载游戏",
                "main_menu.resume_auto_save": "继续自动保存",
                "main_menu.instructions": "说明",
                "main_menu.select_language": "选择语言",
                "main_menu.no_saved_games": "没有可用的保存。",
                "main_menu.available_saves": "可用的保存",
                "main_menu.enter_save_slot": "输入要加载的保存槽:",
                "main_menu.load_failed": "加载游戏失败。",
                "main_menu.instructions_text": "使用方向键移动，空格键推进时间。",
            },
            ar: {
                "main_menu.title": "القائمة الرئيسية",
                "main_menu.start_new_game": "بدء لعبة جديدة",
                "main_menu.load_game": "تحميل اللعبة",
                "main_menu.resume_auto_save": "استئناف الحفظ التلقائي",
                "main_menu.instructions": "تعليمات",
                "main_menu.select_language": "اختر اللغة",
                "main_menu.no_saved_games": "لا توجد ألعاب محفوظة.",
                "main_menu.available_saves": "الحفظات المتاحة",
                "main_menu.enter_save_slot": "أدخل خانة الحفظ للتحميل:",
                "main_menu.load_failed": "فشل في تحميل اللعبة.",
                "main_menu.instructions_text": "استخدم مفاتيح الأسهم للتحرك وشريط المسافة للتقدم بالوقت.",
            },
        };

        // Default language
        
        this.registry.set("languages", languages)
        this.registry.set("currentLanguage", "en");

        this.scene.start("MainMenuScene");

        function getText(key) {
            const currentLanguage = this.registry.get("currentLanguage");
            const languages = this.registry.get("languages");
            return languages[currentLanguage][key] || key; // Return key as fallback
          }

    }
}

