export default function getLimitedArray(length) {
    var array = new Array();

    array.queue = function () {
        Array.prototype.concat.apply(this,arguments);
        if(this.length > length){
            return this.slice(1);
        }
        return this;
    }
}