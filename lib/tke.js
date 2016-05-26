function TokenizerError(y) {
                            
        this.name = 'TokenizerError';
        this.message = y;
        this.stack = Error(y).stack;
        this.framesToPop = 2;
        
        return this;
}

TokenizerError.prototype = Object.create(Error.prototype);
TokenizerError.prototype.constructor = TokenizerError;


module.exports = TokenizerError;