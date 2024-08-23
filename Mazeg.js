document.addEventListener('DOMContentLoaded', () => {
    const mazeContainer = document.getElementById('maze-container');
    const generateButton = document.getElementById('generate-maze');
    const solveButton = document.getElementById('solve-maze');
    let maze = [];
    const size = 20;

    // Initialize maze with walls
    const initializeMaze = () => {
        maze = Array.from({ length: size }, () => Array(size).fill(1));
        mazeContainer.style.gridTemplateColumns = `repeat(${size}, 20px)`;
        mazeContainer.innerHTML = '';
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cell = document.createElement('div');
                cell.id = `${row}-${col}`;
                cell.className = 'wall';
                cell.addEventListener('click', () => toggleWallPath(row, col));
                mazeContainer.appendChild(cell);
            }
        }
    };

    // Toggle between wall and path on cell click, with red highlight
    const toggleWallPath = (row, col) => {
        const cell = document.getElementById(`${row}-${col}`);
        if (maze[row][col] === 1) {
            maze[row][col] = 0;
            cell.className = 'path';
        } else if (maze[row][col] === 0) {
            maze[row][col] = 2;
            cell.className = 'highlight';
        } else {
            maze[row][col] = 1;
            cell.className = 'wall';
        }
    };

    // Maze generation using Recursive Backtracking
    const generateMaze = (x, y) => {
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0]
        ].sort(() => Math.random() - 0.5);

        maze[x][y] = 0;
        document.getElementById(`${x}-${y}`).className = 'path';

        for (const [dx, dy] of directions) {
            const nx = x + dx * 2, ny = y + dy * 2;
            if (nx >= 0 && nx < size && ny >= 0 && ny < size && maze[nx][ny] === 1) {
                maze[x + dx][y + dy] = 0;
                document.getElementById(`${x + dx}-${y + dy}`).className = 'path';
                generateMaze(nx, ny);
            }
        }
    };

    // Check if the user's solution is valid
    const checkSolution = () => {
        const visited = Array.from({ length: size }, () => Array(size).fill(false));
        const start = [0, 0];
        const end = [size - 1, size - 1];

        const isValidPath = (x, y) => {
            if (x < 0 || x >= size || y < 0 || y >= size || maze[x][y] === 1 || visited[x][y]) {
                return false;
            }
            if (x === end[0] && y === end[1]) {
                return true;
            }

            visited[x][y] = true;

            // Check all four possible directions
            return isValidPath(x + 1, y) || isValidPath(x - 1, y) ||
                   isValidPath(x, y + 1) || isValidPath(x, y - 1);
        };

        const result = isValidPath(start[0], start[1]);
        if (result) {
            alert("Congratulations! Your solution is correct.");
        } else {
            alert("Your solution is incorrect. Please try again.");
        }
    };

    // Event listeners
    generateButton.addEventListener('click', () => {
        initializeMaze();
        generateMaze(0, 0);
        document.getElementById('0-0').className = 'start';
        document.getElementById(`${size - 1}-${size - 1}`).className = 'end';
    });

    solveButton.addEventListener('click', checkSolution);

    // Initialize the maze at the beginning
    initializeMaze();
});
