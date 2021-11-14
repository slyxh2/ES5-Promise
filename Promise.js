(function () {
    function Promise(executor) {
        var self = this;
        self.PromiseState = 'pending';
        self.PromiseResult = undefined;
        self.fulfilledCallbacks = [];
        self.rejectedCallbacks = [];
        function run(state, result) {
            if (self.PromiseState === 'pending') {
                self.PromiseState = state;
                self.PromiseResult = result;
                callbacks = state === 'fulfilled' ? self.fulfilledCallbacks : self.rejectedCallbacks;
                for (var i = 0; i < callbacks.length; i++) {
                    callbacks[i](result);
                }
            }
        }
        var resolve = function resolve(result) {
            setTimeout(() => {
                run('fulfilled', result);
            })
        };
        var reject = function reject(result) {
            setTimeout(() => {
                run('rejected', result);
            })
        };
        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }
    Promise.prototype = {
        isNative: false,
        constructor: Promise,
        then: function (onfuifilled, onrejected) {
            var self = this;
            if (self.PromiseState === 'fulfilled') {
                onfuifilled(self.PromiseResult);
            } else if (self.PromiseState === 'rejected') {
                onrejected(self.PromiseResult);
            } else {
                self.fulfilledCallbacks.push(onfuifilled);
                self.rejectedCallbacks.push(onrejected);
            }
        },
    }
    window.Promise = Promise;
})()