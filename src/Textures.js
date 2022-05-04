import p5 from 'p5';

class Textures {
    constructor ( features, loaded ) {

        //expand scope of arguments passed in from main.js
        //Features object for handles color stuff (including which scheme to use)
        this.feet = features;
        //loaded callback function -- call this after all textures are generated and encoded
        this.loaded = loaded;
        

        //canvas used for p5 texture generation
        this.canvas = {};

        //base64 encoded images that three.js can load as a cubemapppp
        this.imageUrl = "";
        this.nX = "";
        this.nY = "";
        this.nZ = "";
        this.pX = "";
        this.pY = "";
        this.pZ = "";

        

        //p5js instantiation and setup
        this.width = 512;
        this._p5 = new p5();
        this.canvas = createCanvas(this.width,this.width);
        noStroke();
        this.canvas.hide();
        this.bubbleColors = [
            this.feet.color.cero, this.feet.color.uno, this.feet.color.dos, this.feet.color.tres, this.feet.color.quatro, this.feet.color.cinco, this.feet.color.sies, this.feet.color.siete
        ];
        this.bubbleDensity = this.feet.density.value;
        
        //call the draw function
        //this should be done in a loop that handles color generation and coordination
        this.draw();
    }

    //big long draw function..  running in a line to keep all of the colors and names in order
    draw(){

        //background
        let bc = this.feet.color.background;

        //corner gradient color widths
        let cornerWidths = [];
        for (let i = 0; i < 8; i++) {
            cornerWidths.push( this.feet.map(fxrand(), 0, 1, this.width, this.width * 1.5));
        }

        //px
        background(bc.r, bc.g, bc.b);
        this.radialGradient(0, 0, this.feet.color.uno, bc, cornerWidths[1]);
        this.radialGradient(this.width, 0, this.feet.color.dos, bc, cornerWidths[2]);
        this.radialGradient(0, this.width, this.feet.color.cinco, bc, cornerWidths[5]);
        this.radialGradient(this.width, this.width, this.feet.color.sies, bc, cornerWidths[6]);

        this.drawBubbles(this.bubbleDensity);
        this.pX = this.canvas.elt.toDataURL();

        //nX
        background(bc.r, bc.g, bc.b);
        this.radialGradient(this.width, 0, this.feet.color.cero, bc, cornerWidths[0]);
        this.radialGradient(0, 0, this.feet.color.tres, bc, cornerWidths[3]);
        this.radialGradient(this.width, this.width, this.feet.color.quatro, bc, cornerWidths[4]);
        this.radialGradient(0, this.width, this.feet.color.siete, bc, cornerWidths[7]);
        
        this.drawBubbles(this.bubbleDensity);
        this.nX = this.canvas.elt.toDataURL();

        //pY
        background(bc.r, bc.g, bc.b);
        this.radialGradient(0, this.width, this.feet.color.cero, bc, cornerWidths[0]);
        this.radialGradient(this.width, this.width, this.feet.color.uno, bc, cornerWidths[1]);
        this.radialGradient(this.width, 0, this.feet.color.dos, bc, cornerWidths[2]);
        this.radialGradient(0, 0, this.feet.color.tres, bc, cornerWidths[3]);

        this.drawBubbles(this.bubbleDensity/3);
        this.pY = this.canvas.elt.toDataURL();

        //nY
        background(bc.r, bc.g, bc.b);
        this.radialGradient(0, 0, this.feet.color.quatro, bc, cornerWidths[4]);
        this.radialGradient(this.width, 0, this.feet.color.cinco, bc, cornerWidths[5]);
        this.radialGradient(this.width, this.width, this.feet.color.sies, bc, cornerWidths[6]);
        this.radialGradient(0, this.width, this.feet.color.siete, bc, cornerWidths[7]);

        this.drawBubbles(this.bubbleDensity/3);
        this.nY = this.canvas.elt.toDataURL();

        //pZ
        background(bc.r, bc.g, bc.b);
        this.radialGradient(0, 0, this.feet.color.cero, bc, cornerWidths[0]);
        this.radialGradient(this.width, 0, this.feet.color.uno, bc,cornerWidths[1]);
        this.radialGradient(0, this.width, this.feet.color.quatro, bc, cornerWidths[4]);
        this.radialGradient(this.width, this.width, this.feet.color.cinco, bc, cornerWidths[5]);

        this.drawBubbles(this.bubbleDensity);
        this.pZ = this.canvas.elt.toDataURL();

        //nZ
        background(bc.r, bc.g, bc.b);
        this.radialGradient(0, 0, this.feet.color.dos, bc, cornerWidths[2]);
        this.radialGradient(this.width, 0, this.feet.color.tres, bc, cornerWidths[3]);
        this.radialGradient(0, this.width, this.feet.color.sies, bc, cornerWidths[6]);
        this.radialGradient(this.width, this.width, this.feet.color.siete, bc, cornerWidths[7]);

        this.drawBubbles(this.bubbleDensity);
        this.nZ = this.canvas.elt.toDataURL();

        
        //callback to main - these are the data urls that get loaded in threejs <3
        this.loaded([this.pX, this.nX, this.pY, this.nY, this.pZ, this.nZ]);
    }

    //draw radial gradient function - draws from outside to in, transparent at the edge, opaque in the middle
    radialGradient(x, y, centerColor, edgeColor, rad){
        let radius = rad;
        for (let r = radius; r > 0; --r) {
            fill(
                lerpColor(
                    color(centerColor.r, centerColor.g, centerColor.b, 255), 
                    color(edgeColor.r, edgeColor.g, edgeColor.b, 0), 
                    r/radius
                    )
                );
            ellipse(x, y, r, r);
        }
    }

    //draws other bubbles on top of the gradient backgrounds
    drawBubbles(number){

        for (let i = 0; i < number; i++) {
            
            //generate a random xy position
            let x = this.feet.map(fxrand(), 0, 1, this.width * 0.125, this.width * 0.875);
            let y = this.feet.map(fxrand(), 0, 1, this.width * 0.125, this.width * 0.875);

            //random size
            let r = this.feet.map(fxrand(), 0, 1, this.width/10, this.width/3);

            //draw a bubble using one of the 8 colors
            let col = this.bubbleColors[parseInt(this.feet.map(fxrand(), 0, 1, 0, 7))];
            this.radialGradient(x, y, col, this.feet.color.background, r);
        }
    }
}

export { Textures } 

