"use strict";
function colorfulLog(...args) {
    const predefinedColors = new Map([
        ['red', '#ff0000'],
        ['lightred', '#ff5454'],
        ['green', '#069326'],
        ['lightgreen', '#09ff41'],
        ['blue', '#305fe4'],
        ['lightblue', '#54f7ff'],
        ['yellow', '#e4e130'],
        ['orange', '#ffb82b'],
        ['white', '#ffffff'],
        ['purple', '#b845b3'],
        ['grey', '#808080'],
        ['black', '#000000'],
        ['pink', '#ff00ff'],
    ]);
    const lastElement = args[args.length - 1];
    let defaultColor = 'f5f208';
    let backgroundColor = '000000';
    let textOpacity = 1.0;
    let backgroundOpacity = 1.0;
    if (typeof lastElement === 'string' && lastElement.startsWith('#')) {
        args.pop();
        const lastElementArray = lastElement.split('#');
        if (lastElementArray.length > 1) {
            const predefinedColor = predefinedColors.get(lastElementArray[1].trim());
            if (predefinedColor) {
                defaultColor = predefinedColor.slice(1);
            }
            else {
                defaultColor = lastElementArray[1].trim();
            }
        }
        if (lastElementArray.length > 2) {
            const predefinedBackgroundColor = predefinedColors.get(lastElementArray[2].trim());
            if (predefinedBackgroundColor) {
                backgroundColor = predefinedBackgroundColor.slice(1);
            }
            else {
                backgroundColor = lastElementArray[2].trim();
            }
        }
        if (lastElementArray.length > 3) {
            textOpacity = parseFloat(lastElementArray[3].trim());
        }
        if (lastElementArray.length > 4) {
            backgroundOpacity = parseFloat(lastElementArray[4].trim());
        }
    }
    const label = args.shift();
    if (!label) {
        return;
    }
    // biome-ignore lint/suspicious/noConsole: <explanation>
    window.console.log('%c' + label, `background-color: rgba(${parseInt(backgroundColor.slice(0, 2), 16)}, ${parseInt(backgroundColor.slice(2, 4), 16)}, ${parseInt(backgroundColor.slice(4, 6), 16)}, ${backgroundOpacity}); padding:5px 2px; color: rgba(${parseInt(defaultColor.slice(0, 2), 16)}, ${parseInt(defaultColor.slice(2, 4), 16)}, ${parseInt(defaultColor.slice(4, 6), 16)}, ${textOpacity});`, ...args);
}
