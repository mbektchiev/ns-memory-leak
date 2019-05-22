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
    viewModel.counter = 42;
    viewModel.message = 'press to start';

    var worker = new Worker("./worker.js");

    viewModel.onGc = () => {
        console.log("GC");
        __collect();
    };
    viewModel.onTap = () => {
        viewModel.set("message", 'running...');
        const inter = setInterval(() => {
            var message = {
                value: {  }
            };
            worker.postMessage(message);
        });

        setTimeout(() => {
            clearInterval(inter);
            viewModel.set("message", 'finished');
        }, 30 * 1000);
    };

    return viewModel;
}

exports.createViewModel = createViewModel;
