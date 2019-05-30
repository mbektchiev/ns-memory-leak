const Observable = require("tns-core-modules/data/observable").Observable;
const utils = require('tns-core-modules/utils/utils');

function getMessage(counter) {
    if (counter <= 0) {
        return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
    } else {
        return `${counter} taps left`;
    }
}


function createViewModel() {
    const viewModel = new Observable();
    viewModel.cycleMinutes = 5;
    viewModel.counter = 42;
    viewModel.message = 'press to start';

    let worker = new Worker("./worker.js");
    let currentInterval = null;
    let startTime = null;

    viewModel.onGc = () => {
        console.log("GC");
        __collect();
    };
    viewModel.onTap = () => {
        console.log("Starting interval for ", viewModel.cycleMinutes, "minutes.");
        viewModel.set("message", `${new Date()}: Running...`);
        startTime = new Date();
        const inter = setInterval(() => {
            var nativeDict = NSDictionary.dictionaryWithObjectForKey("value", "key".repeat(1000));
            var message = {
                value: { dictionaryPtr: interop.handleof(nativeDict).toNumber() }
            };
            // increase reference count to account for `dictionaryPtr`
            nativeDict.retain();
            worker.postMessage(message);
        });

        setTimeout(() => {
            clearInterval(inter);
            viewModel.set("message", `finished: ${startTime} - ${new Date()}`);
        }, viewModel.cycleMinutes * 60 * 1000);

        currentInterval = inter;
    };

    viewModel.onTerminate = () => {
        clearInterval(currentInterval);
        viewModel.set("message", `Terminated: ${startTime} - ${new Date()}`);
    }

    return viewModel;
}

exports.createViewModel = createViewModel;
