
function pointerTo(type, value) {
    var outerPtr = interop.alloc(interop.sizeof(interop.Pointer));
    var outerRef = new interop.Reference(type, outerPtr);
    outerRef.value = value;
    return outerPtr;
}

function valueFromPointerNumber(type, value) {
    const ptr = new interop.Pointer(value);
    const ptrToPtr = pointerTo(interop.Pointer, ptr);
    const ref = new interop.Reference(type, ptrToPtr);

    return ref.value;
}

const utils = require('tns-core-modules/utils/utils');
onmessage = function(msg) {
    const dict = valueFromPointerNumber(NSDictionary, msg.data.value.dictionaryPtr);
    dict.release();
    utils.releaseNativeObject(dict);
};
