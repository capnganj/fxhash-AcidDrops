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
        this.width = 128;
        this._p5 = new p5();
        this.canvas = createCanvas(this.width,this.width);
        noStroke();
        this.canvas.hide();

        
        //call the draw function
        //this should be done in a loop that handles color generation and coordination
        this.draw();
    }

    //big long draw function..  running in a line to keep all of the colors and names in order
    draw(){

        //background
        let bc = this.feet.color.background;

        //px
        background(bc.r, bc.g, bc.b);
        this.radialGradient(0, 0, this.feet.color.uno, bc);
        this.radialGradient(0, this.width, this.feet.color.cinco, bc);
        this.radialGradient(this.width, 0, this.feet.color.dos, bc);
        this.radialGradient(this.width, this.width, this.feet.color.sies, bc);
        this.pX = this.canvas.elt.toDataURL();

        //nX
        background(bc.r, bc.g, bc.b);
        this.radialGradient(0, 0, this.feet.color.tres, bc);
        this.radialGradient(0, this.width, this.feet.color.siete, bc);
        this.radialGradient(this.width, 0, this.feet.color.cero, bc);
        this.radialGradient(this.width, this.width, this.feet.color.quatro, bc);
        this.nX = this.canvas.elt.toDataURL();

        //pY
        background(bc.r, bc.g, bc.b);
        this.radialGradient(0, 0, this.feet.color.tres, bc);
        this.radialGradient(0, this.width, this.feet.color.cero, bc);
        this.radialGradient(this.width, 0, this.feet.color.dos, bc);
        this.radialGradient(this.width, this.width, this.feet.color.uno, bc);
        this.pY = this.canvas.elt.toDataURL();

        //nY
        background(bc.r, bc.g, bc.b);
        this.radialGradient(0, 0, this.feet.color.quatro, bc);
        this.radialGradient(0, this.width, this.feet.color.siete, bc);
        this.radialGradient(this.width, 0, this.feet.color.cinco, bc);
        this.radialGradient(this.width, this.width, this.feet.color.sies, bc);
        this.nY = this.canvas.elt.toDataURL();

        //pZ
        background(bc.r, bc.g, bc.b);
        this.radialGradient(0, 0, this.feet.color.cero, bc);
        this.radialGradient(0, this.width, this.feet.color.quatro, bc);
        this.radialGradient(this.width, 0, this.feet.color.uno, bc);
        this.radialGradient(this.width, this.width, this.feet.color.cinco, bc);
        this.pZ = this.canvas.elt.toDataURL();

        //nZ
        background(bc.r, bc.g, bc.b);
        this.radialGradient(0, 0, this.feet.color.dos, bc);
        this.radialGradient(0, this.width, this.feet.color.sies, bc);
        this.radialGradient(this.width, 0, this.feet.color.tres, bc);
        this.radialGradient(this.width, this.width, this.feet.color.siete, bc);
        this.nZ = this.canvas.elt.toDataURL();

        //console.log(this.imageUrl);
        this.loaded([this.pX, this.nX, this.pY, this.nY, this.pZ, this.nZ]);
    }

    //draw radial gradient function.  called to generate radial gradients from corners of the cube
    radialGradient(x, y, centerColor, edgeColor){
        let radius = this.width;
        for (let r = radius; r > 0; --r) {
            fill(
                lerpColor(
                    color(centerColor.r, centerColor.g, centerColor.b), 
                    color(edgeColor.r, edgeColor.g, edgeColor.b), 
                    r/radius
                    )
                );
            ellipse(x, y, r, r);
        }
    }
}

export { Textures } 

