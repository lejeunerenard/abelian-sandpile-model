function Cell ( game, position, options ) {
   options = options || {};

   this.game = game;
   this.position = position;
   this.width = options.width || 5;
   this.height = options.height || 5;

   this.stack = options.stack;
   if ( typeof this.stack === 'undefined' ){
      this.stack = Math.floor( Math.random() * 4 );
   }
   this.previousStack;
}

Cell.prototype = {
   update: function() {
   },
   draw: function() {
      // Bail out of rendering if we can
      if ( this.previousStack === this.stack ) {
         return;
      }

      // Set the color of the cell from the game's colors
      this.game.screen.fillStyle = this.game.cell.colors[this.stack];
      // Draw the square
      this.game.screen.fillRect(this.position.x, this.position.y, this.width, this.height );

      // update the previous stack
      this.previousStack = this.stack;
   }
};

module.exports = Cell;
