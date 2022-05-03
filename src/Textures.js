import p5 from 'p5';

class Textures {
    constructor ( loaded ) {
        this.canvas = {};
        this.imageUrl = "";

        new p5();

        this.setup = function() {
            this.canvas = createCanvas(128,128);
            this.canvas.hide();
        }

        this.draw = function() {
            background(0);
            ellipse(64,64,64,64);
            this.imageUrl = this.canvas.elt.toDataURL();
            //console.log(this.imageUrl);
            loaded(this.imageUrl);
        }
        this.setup();
        this.draw();
    }

    image(){
        return this.imageUrl;
    }
}

export { Textures } 

