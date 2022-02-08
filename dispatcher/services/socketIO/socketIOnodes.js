// Socket reference to api server - NOTE: only caters to a single api server for now
let server = undefined;
// Map of socket references to tools
let tools = {};

exports.addServer = (socketId) => {
    if (server != undefined) { return false; }
    else { server = socketId; return true; }
}

exports.removeServer = () => {
    if (server == undefined) { return false; }
    else { server = undefined; return true; }
}

exports.fetchServer = () => {
    return server;
}

exports.addTool = (socketId, toolId) => {
    if (tools[toolId] != undefined) { return false; }
    else { tools[toolId] = socketId; return true; }
}

exports.removeTool = (toolId) => {
    if (tools[toolId] == undefined) { return false; }
    else { tools[toolId] = undefined; return true; }
}

exports.fetchTool = (toolId) => {
    return tools[toolId];
}