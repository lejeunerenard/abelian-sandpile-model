'use strict';

var Cell = require('./models/cell.js');

function Game ( options ) {
   options = options || {};
   var self = this;

   // Dimensions etc
   self.canvas = options.canvas || document.querySelector('canvas');
   self.width = self.canvas.width;
   self.height = self.canvas.height;
   self.screen = self.canvas.getContext('2d');

   self.cell = {
      width: 2,
      height: 2,
      colors: [
         '#ffffff',
         '#a3bbc7',
         '#ff3e2d',
         '#2f2d30'
      ]
   };

   self.cells = [];
   self.populate();

   self.maxCellStack = 3; // A.K.A. 4 is too much

   self.fountains = [];

   self.loadEvents();

   var tick = function tick() {
      self.update();

      self.draw();

      requestAnimationFrame(tick);
   };

   tick();
}

Game.prototype = {
   populate: function populate() {
      this.cells = [];
      for ( var i = 0; i < Math.floor( this.width / this.cell.width ); i ++  ) {
         this.cells[i] = [];
         for ( var j = 0; j < Math.floor( this.height / this.cell.height ); j ++  ) {
            this.cells[i].push( new Cell(this, { x: i * this.cell.width, y: j * this.cell.height }, { width: this.cell.width, height: this.cell.height, stack: 0 }) );
         }
      }
      console.log('cells', this.cells.length * this.cells[0].length);
   },
   update: function update() {
      var i = this.fountains.length;
      while ( i -- ) {
         this.addToStack(this.fountains[i], 1);
      }
   },
   draw: function draw() {
      var i = this.cells.length;
      var j;
      while ( i -- ) {
         j = this.cells[i].length;
         while ( j -- ) {
            this.cells[i][j].draw();
         }
      }
   },
   loadEvents: function loadEvents() {
      var self = this;
      self.canvas.addEventListener('click', function canvasClick(e) {
         var x = e.clientX - self.canvas.offsetLeft;
         var y = e.clientY - self.canvas.offsetTop;

         var gridPosition = self.getGridPosition({ x: x, y: y });
         self.fountains.push(self.cells[gridPosition.i][gridPosition.j]);

         e.preventDefault();
      });
   },

   // Cell specific functions. The Game will be the puppet master.
   addToStack: function addToStack(cell, amount) {
      amount = amount || 1;

      cell.stack += amount;

      // Avalanche the stack out if big enough
      if ( cell.stack > this.maxCellStack ) {
         cell.stack -= this.maxCellStack + 1;

         var position = this.getGridPosition(cell.position);

         if ( position.i - 1 >= 0 ) {
            this.addToStack(this.cells[position.i - 1][position.j], 1);
         }
         if ( Math.floor( this.width / this.cell.width ) > position.i + 1 ) {
            this.addToStack(this.cells[position.i + 1][position.j], 1);
         }
         if ( position.j - 1 >= 0 ) {
            this.addToStack(this.cells[position.i][position.j - 1], 1);
         }
         if ( Math.floor( this.height / this.cell.height ) > position.j + 1 ) {
            this.addToStack(this.cells[position.i][position.j + 1], 1);
         }
      }
   },
   getGridPosition: function getGridPosition(position) {
      return {
         i: Math.floor( position.x / this.cell.width ),
         j: Math.floor( position.y / this.cell.height )
      };
   }
};

window.addEventListener('load', function winOnLoad() {
   new Game();
});
