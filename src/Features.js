import { interpolateCool, interpolateInferno, interpolateMagma, interpolateWarm, interpolateViridis } from 'd3-scale-chromatic'
import { rgb, hsl, color } from 'd3-color';

class Features {
    constructor() {

        //color palette 
        this.color = {
            name: "",
            background: {},
            uno: {},
            dos: {},
            tres: {}
        };
        this.setColorPalette();
        this.setColors();

        //scale of vertex wigglers
        this.scale = {
            tag: "",
            value: 0.0,
            dispValue: 0.0
        }
        this.setScale();

        //drives how fast the wiggle and wave speeds roll
        this.speed = {
            tag: "",
            vertexValue: 1.0,
            fragmentValue: 1.0
        }
        this.setSpeed();

        //drives brightness uniform in fragment shader
        this.brightness = {
            tag: "",
            value: 1.0
        }
        this.setBrightness();

        //permutations in fragment shader
        this.permutations = {
            tag: "",
            value: 4.0
        }
        this.setPermutations();
    }

    //map function logic from processing <3
    map(n, start1, stop1, start2, stop2) {
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        return newval;
    }

    //color palette interpolation
    interpolateFn(val) {
        switch (this.color.name) {
            case "Cool": return rgb(interpolateCool(val));
            case "Warm": return rgb(interpolateWarm(val));
            case "Viridis": return rgb(interpolateViridis(val));
            case "Magma": return rgb(interpolateMagma(val));
            case "Inferno": return rgb(interpolateInferno(val));
            default:
                return "high"
        }
    }

    //color inverter
    invertColor(rgb, bw) {
        let hex = color(rgb).formatHex()
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        var r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        if (bw) {
            // https://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
        // invert color components
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
        // pad each with zeros and return
        let inverted = color("#" + padZero(r) + padZero(g) + padZero(b)).rgb();
        return inverted;

        function padZero(str, len) {
            len = len || 2;
            var zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        }
    }

    //set color palette globally
    setColorPalette() {
        let c = fxrand();

        if (c < 0.15) {
            this.color.name = "Warm"
        }
        else if (c < 0.25) {
            this.color.name = "Cool"
        }
        else if (c < 0.5) {
            this.color.name = "Viridis"
        }
        else if (c < 0.7) {
            this.color.name = "Magma"
        }
        else {
            this.color.name = "Inferno"
        }
    }

    //set individual colors for background and shader
    setColors() {
        this.color.background = this.interpolateFn(fxrand());
        this.color.uno = this.interpolateFn(this.map(fxrand(),0,1,0,0.25));
        this.color.dos = this.interpolateFn(this.map(fxrand(),0,1,0.25,0.75));
        this.color.tres = this.interpolateFn(this.map(fxrand(),0,1,0.75,1));

        //invert 33%
        if (fxrand() > 0.666) {
            this.color.background = this.invertColor(this.color.background);
            this.color.uno = this.invertColor(this.color.uno);
            this.color.dos = this.invertColor(this.color.dos);
            this.color.tres = this.invertColor(this.color.tres);
            this.color.name += " Invert";
        }
    }

    //set bump and texture scale
    setScale() {
        let s = fxrand();
        if (s < 0.23) {
            this.scale.tag = "Smooth";
        }
        else if (s < 0.57) {
            this.scale.tag = "Low";
        }
        else {
            this.scale.tag = "High";
        }
        this.scale.value = this.map(s, 0, 1, 1.0, 3.0);
        this.scale.dispValue = this.map(s, 0, 1, 0.005, 0.02);
    }

    //set vertex and ragment speeds
    setSpeed(){
        let s = fxrand();
        if (s < 0.44) {
            this.speed.tag = "Slow";
        }
        else if (s < 0.61) {
            this.speed.tag = "Steady";
        }
        else if (s < 0.88) {
            this.speed.tag = "Fast";
        }
        else{
            this.speed.tag = "Zippy"
        }
        this.speed.vertexValue = this.map(s, 0, 1, 0.25, 0.75);
        this.speed.fragmentValue = this.map(s, 0, 1, 0.25, 1.75);
    }

    //set fragment brightness
    setBrightness(){
        let b = fxrand();
        if (b < 0.41) {
            this.brightness.tag = "Dark";
        }
        else if (b < 0.63) {
            this.brightness.tag = "Even";
        }
        else{
            this.brightness.tag = "Bright";
        }
        this.brightness.value = this.map(b, 0, 1, 0.75, 2.0);
    }

    //set fragment permutations
    setPermutations(){
        let p = fxrand();
        if (p < 0.19) {
            this.permutations.tag = "Sunlight";
        }
        else if (p < 0.39) {
            this.permutations.tag = "Twilight";
        }
        else if (p < 0.73) {
            this.permutations.tag = "Midnight";
        }
        else {
            this.permutations.tag = "Abyssal";
        }
        this.permutations.value = this.map(p, 0, 1, 3, 5);
    }
}

export { Features }