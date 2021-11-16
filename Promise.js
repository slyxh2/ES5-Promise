(function () {
    function Promise(executor) {
        if (typeof executor !== 'function') {
            throw new TypeError('Promise resolver ' + executor + ' is not a function');
        }
        var self = this;
        self.PromiseState = 'pending';
        self.PromiseResult = undefined;
        self.fulfilledCallbacks = [];
        self.rejectedCallbacks = [];
        function run(state, result) {
            if (self.PromiseState === 'pending') {
                self.PromiseState = state;
                self.PromiseResult = result;
                setTimeout(function () {
                    callbacks = state === 'fulfilled' ? self.fulfilledCallbacks : self.rejectedCallbacks;
                    for (var i = 0; i < callbacks.length; i++) {
                        callbacks[i](result);
                    }
                })
            }
        }
        var resolve = function resolve(result) {
            run('fulfilled', result);
        };
        var reject = function reject(result) {
            run('rejected', result);
        };
        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }
    function handlePromise(x, promise, resolve, reject) {
        if (x === promise) throw new TypeError('Chaining cycle detected for promise #<Promise>');
        if (x !== null && typeof x === 'function' || typeof x === 'object') {
            try {
                var then = x.then;
                if (typeof then === 'function') {
                    then.call(x, function (y) {
                        resolve(y)
                    }, function (r) {
                        reject(r);
                    })
                } else {
                    resolve(x);
                }
            } catch (err) {
                reject(err);
            }
        } else {
            resolve(x);
        }
    }
    Promise.prototype = {
        isNative: false,
        constructor: Promise,
        then: function (onfuifilled, onrejected) {
            var self = this;
            var promise = new Promise(function (resolve, reject) {
                if (self.PromiseState === 'fulfilled') {
                    setTimeout(function () {
                        var x = onfuifilled(self.PromiseResult);
                        handlePromise(x, promise, resolve, reject);
                    })
                } else if (self.PromiseState === 'rejected') {
                    setTimeout(function () {
                        var x = onrejected(self.PromiseResult);
                        handlePromise(x, promise, resolve, reject);
                    })
                } else {
                    self.fulfilledCallbacks.push(function () {
                        try {
                            var x = onfuifilled(self.PromiseResult);
                            handlePromise(x, promise, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    });
                    self.rejectedCallbacks.push(function () {
                        try {
                            var x = onrejected(self.PromiseResult);
                            handlePromise(x, promise, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    });
                }
            })
            return promise;

        }
    };
    Promise.resolve = function (value) {
        return new Promise(function (resolve) {
            resolve(value);
        })
    };
    Promise.reject = function (reason) {
        return new Promise(function (_, reject) {
            reject(reason);
        })
    }
    window.Promise = Promise;
})()