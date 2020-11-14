
process.on('uncaughtException', function (err) {
    if (err.message.indexOf("EADDRINUSE") > 0) {
        console.log("A Superalgos Backend Server cannot be started. Reason: the port " + port + " is already in use by another application.")
        return
    }
    console.log('[ERROR] Backend Server -> server -> uncaughtException -> err.message = ' + err.message)
    console.log('[ERROR] Backend Server -> server -> uncaughtException -> err.stack = ' + err.stack)
    process.exit(1)
})

process.on('unhandledRejection', (reason, p) => {
    console.log('[ERROR] Backend Server -> server -> unhandledRejection -> reason = ' + JSON.stringify(reason))
    console.log('[ERROR] Backend Server -> server -> unhandledRejection -> p = ' + JSON.stringify(p))
    process.exit(1)
})

/* Callbacks default responses. */

global.DEFAULT_OK_RESPONSE = {
    result: "Ok",
    message: "Operation Succeeded"
};

global.DEFAULT_FAIL_RESPONSE = {
    result: "Fail",
    message: "Operation Failed"
};

global.DEFAULT_RETRY_RESPONSE = {
    result: 'Retry',
    message: 'Retry Later'
}

global.CUSTOM_OK_RESPONSE = {
    result: 'Ok, but check Message',
    message: 'Custom Message'
}

global.CUSTOM_FAIL_RESPONSE = {
    result: 'Fail Because',
    message: 'Custom Message'
}


let EVENTS_SERVER = require('./eventsServer.js')
let TASK_MANAGER_SERVER = require('./taskManagerServer.js')
let WEB_SOCKETS_INTERFACE = require('./webSocketsServer.js')
let HTTP_INTERFACE = require('./httpInterface.js')

try {
    EVENTS_SERVER = EVENTS_SERVER.newEventsServer()
    EVENTS_SERVER.initialize()
    EVENTS_SERVER.run()

    TASK_MANAGER_SERVER = TASK_MANAGER_SERVER.newTaskManagerServer(WEB_SOCKETS_INTERFACE, EVENTS_SERVER)
    TASK_MANAGER_SERVER.initialize()
    TASK_MANAGER_SERVER.run()

    WEB_SOCKETS_INTERFACE = WEB_SOCKETS_INTERFACE.newWebSocketsInterface(EVENTS_SERVER)
    WEB_SOCKETS_INTERFACE.initialize()
    WEB_SOCKETS_INTERFACE.run()

    HTTP_INTERFACE = HTTP_INTERFACE.newHttpInterface(EVENTS_SERVER)
    HTTP_INTERFACE.initialize()
    HTTP_INTERFACE.run()

    //console.log("You are running Superalgos Beta 6 SP4: What's new? Some bugs fixed and improved performance.")

    console.log("You are running Superalgos Beta 7: What's new? Multi-Project & Machine Learning Infrastructure is being implemented here.")

} catch (err) {
    console.log('[ERROR] BackendServers -> Task Manager -> server -> Error = ' + err.stack)
}

