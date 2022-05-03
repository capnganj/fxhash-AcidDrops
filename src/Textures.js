import p5 from 'p5';

class Textures {
    constructor () {
        this.canvas = {};
        this.imageUrl = "";
        const s = ( sk ) => {

            sk.setup = () => {
                this.canvas = sk.createCanvas(128,128);
            
            }

            sk.draw = () => {
                sk.background(0);
                sk.ellipse(64,64,64,64);
                this.imageUrl = this.canvas.elt.toDataURL();
                sk.noLoop();
                console.log(this.imageUrl);
            }
        } 
        let p5p5p5 = new p5(s);
    }

    image(){
        return this.imageUrl;
    }
}

export { Textures } 

