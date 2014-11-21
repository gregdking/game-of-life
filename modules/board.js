define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore');

    var mainLoop = undefined;

    function Board(options) {
        this.stepCount = 0;
        this.maxSteps = 0;
        this.i = 0;
        this.j = 0;
        this.sum = 0;
        this.t0 = 0;
        this.rects = [];

        this.options = options || {};
        this.init();
        
        mainLoop = delayedTick.bind(this);
    }

    Board.prototype.init = function init() {
        if (this.options.cells && this.options.cells.length) {
            this.height = this.options.cells.length;
            this.width = this.options.cells[0].length;
            this.grid = this.options.cells;
        } else {
            this.height = Math.min(Math.max(this.options.height || 100, 10), 768);
            this.width = Math.min(Math.max(this.options.width || 100, 10), 1024);
            this.grid = createGrid(this.height, this.width, this.options.ratio || 0);
            this.targetGrid = createGrid(this.height, this.width, 0);
            this.bufferGrid = this.targetGrid
        }
        initSvg(this);
        initRects(this);
    };

    Board.prototype.tick = function tick() {
        initTargetGrid(this);
        evaluateCells(this);
        saveGrid(this);
        updateRects(this);
    };

    Board.prototype.runGenerations = function runGenerations(count) {
        this.stepCount = 0;
        this.maxSteps = count;
        this.t0 = performance.now();
        mainLoop();
    };

    Board.prototype.run10Generations = function run10Generations() {
        this.runGenerations(10);
    };

    Board.prototype.run100Generations = function run100Generations() {
        this.runGenerations(100);
    };

    Board.prototype.run1000Generations = function run1000Generations() {
        this.runGenerations(1000);
    };

    Board.prototype.reset = function reset() {
        this.init();
    };

    function initSvg(self) {
        var i, j, rect, x, y,
            cellWidth = 5,
            cellHeight = 5,
            cellSpacing = 2,
            width = self.width * (cellWidth + cellSpacing),
            height = self.height * (cellHeight + cellSpacing);

        var board = document.getElementById('gameboard');
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', width.toString());
        svg.setAttribute('height', height.toString());

        for (i = 0; i != self.width; i++) {
            self.rects[i] = [];
            x = i * (cellWidth + cellSpacing);
            for (j = 0; j != self.height; j++) {
                y = j * (cellWidth + cellSpacing);
                rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute('width', cellWidth.toString());
                rect.setAttribute('height', cellHeight.toString());
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('class', 'alive');
                svg.appendChild(rect);
                self.rects[i][j] = rect;
            }
        }
        $(board).empty();
        board.appendChild(svg);
    };

    function createGrid(height, width, ratio) {
        ratio = ratio || 0;

        var gridList = _(_(height * width).times(function (n) {
            return (n < Math.floor(height * width * ratio)) ? 1 : 0;
        })).shuffle();

        return _(height).times(function (n) {
            return gridList.splice(0, width);
        });
    }

    function initTargetGrid(self) {
        for (self.i = 0; self.i !== self.height; self.i++) {
            for (self.j = 0; self.j !== self.width; self.j++) {
                self.targetGrid[self.i][self.j] = 0;
            }
        }
    }

    function evaluateCells(self) {
        for (self.i = 0; self.i !== self.height; self.i++) {
            for (self.j = 0; self.j !== self.width; self.j++) {
                self.sum = getSum(self);
                sameState(self);
                born(self);
            }
        }
    }

    function saveGrid(self) {
        self.bufferGrid = self.grid;
        self.grid = self.targetGrid;
        self.targetGrid = self.bufferGrid;
    }

    function sameState(self) {
        if (self.sum >= 2 && self.sum <= 3) {
            self.targetGrid[self.i][self.j] = self.grid[self.i][self.j] === 1 ? 1 : 0;
        }
    }

    function born(self) {
        if (self.sum === 3 && (self.grid[self.i][self.j] === 0)) {
            self.targetGrid[self.i][self.j] = 1;
        }
    }

    function getSum(self) {
        return getValue(self.grid, self.i - 1, self.j - 1) +
               getValue(self.grid, self.i - 1, self.j) +
               getValue(self.grid, self.i - 1, self.j + 1) +
               getValue(self.grid, self.i, self.j - 1) +
               getValue(self.grid, self.i, self.j + 1) +
               getValue(self.grid, self.i + 1, self.j - 1) +
               getValue(self.grid, self.i + 1, self.j) +
               getValue(self.grid, self.i + 1, self.j + 1);
    }

    function delayedTick() {
        if (this.stepCount === this.maxSteps) {
            console.log(performance.now() - this.t0);
            return;
        }
        this.tick();
        this.stepCount++;
        requestAnimationFrame(mainLoop);
    }
    
    function initRects(self) {
        var i, j, value;
        for (i = 0; i != self.width; i++) {
            for (j = 0; j != self.height; j++) {
                value = self.grid[i][j];
                self.rects[i][j].setAttribute('class', calculateClass(value));
            }
        }
    }

    function updateRects(self) {
        var i, j, oldValue, newValue;
        for (i = 0; i != self.width; i++) {
            for (j = 0; j != self.height; j++) {
                oldValue = self.targetGrid[i][j];
                newValue = self.grid[i][j];
                if (newValue !== oldValue) {
                    self.rects[i][j].setAttribute('class', calculateClass(newValue));
                }
            }
        }
    }

    function calculateClass(value) {
        return value ? 'alive' : 'dead';
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               

    function getValue(grid, y, x) {
        if (y < 0) return 0;
        if (x < 0) return 0;
        if (y >= grid.length) return 0;
        if (x >= grid[0].length) return 0;
        return grid[y][x];
    }

    return Board;
});