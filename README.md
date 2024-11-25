## Introducing the Team

Since I am working individually(after recieving permission from the professor over discord), I will fulfill all the roles required for the project:

- **Tools Lead**: I am responsible for choosing and setting up tools like the IDE, art/sound editors, source control (GitHub), and deployment platforms, as well as maintaining consistent coding and formatting standards.
- **Engine Lead**: I will select the primary engine, ensure its proper configuration, and organize the project structure to streamline engine usage. I will also handle software design patterns to shield other parts of the game from engine-specific details.
- **Design Lead**: I will define the creative direction, including the look, feel, and gameplay mechanics of the project. I am also responsible for creating necessary game assets such as art, sound, and any code that defines the game’s thematic and visual tone.

## Tools and Materials

### Engines, Libraries, Frameworks, and Platforms
The primary platform is **TypeScript + HTML5** using the **Phaser framework**. Phaser is an excellent choice for this project since it supports 2D grid-based mechanics and offers tools like tilemaps, state handling, and event systems. It aligns with the tools and concepts learned in this course (e.g., D2), making development faster and more efficient. Additionally, deploying through HTML5 ensures the game is easily accessible in web browsers via GitHub Pages.

### Programming Languages and Data Formats
The game will use **TypeScript** as the primary programming language. TypeScript's strong typing helps prevent bugs in the game’s core systems, such as grid state management and undo/redo functionality. For data storage, **JSON** will be used to serialize and deserialize the game state, as it's lightweight and integrates seamlessly with web platforms. This language pair was chosen for its clarity and compatibility with Phaser.

### Tools for Authoring
The project will use **Visual Studio Code (VS Code)** as the IDE due to its built-in support for TypeScript and GitHub integration, making it easy to write, debug, and version-control the game. For visual assets like 2D sprites, tools such as **Aseprite** or **GIMP** will be used to create pixel art characters, tiles, and plants. Sound effects will be generated using **Bfxr**, which is simple and effective for producing game-appropriate audio. These tools are lightweight, easy to learn, and well-suited for solo development.

### Alternate Platform
The alternate platform will use **TypeScript + Three.js** instead of Phaser. Three.js allows for rendering the gameplay in 3D while maintaining the same game mechanics. This provides a visually distinct experience with colored cubes and minimalist aesthetics, making it a creative departure from the 2D style. Three.js offers an opportunity to explore new techniques and experiment with depth while keeping the core logic consistent.

## Outlook

Working individually on this project, I aim to develop a concise but polished grid-based farming simulation that demonstrates creativity and mastery of game programming patterns. Without a team, my approach prioritizes simplicity in visuals and mechanics while focusing on delivering a seamless, fully functional experience with robust features like save/load systems and undo/redo functionality—elements that larger teams might find logistically challenging.

The riskiest part of the project will likely be implementing complex state management within a single byte array (as required by F1.a) while ensuring features like undo/redo and save/load systems remain bug-free. Balancing this technical challenge with the need for clear gameplay feedback and a satisfying user experience will require disciplined planning and testing.

By approaching the project with **TypeScript**, **Phaser**, and lightweight authoring tools, I hope to strengthen my ability to manage the entire development pipeline, from writing efficient, modular code to integrating art and audio assets. I also look forward to deepening my understanding of game programming patterns (e.g., ECS, State Pattern) and exploring how to optimize memory and state in grid-based simulations.
