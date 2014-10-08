/**
 * Created by youssef on 23/07/14.
 */

function MessageService(randomToken, target) {
    /*
     * we use a token to identify the source/target of any message
     */
    this.randomToken = randomToken; 
    this.target = target;
    this.messageSeparator = "|";
    this.paramSeparator = "-";

    this.setTarget = function(target) {
        this.target = target;
    };
    this.listen = function() {
        var myself = this;
        //we listen for messages that are sent from parent/child frames
        if(typeof window.addEventListener !== "undefined")
        {
            // Opera/Mozilla/Webkit
            window.addEventListener("message", function(event) { myself.receiveMessage(event.data); }, false);
        } else {
            // Internet Explorer
            window.attachEvent('onmessage', function(event) { myself.receiveMessage(event.data); });
        }
    };

    /*
     * Sends a message to the target frame
     */
    this.sendMessage = function(messageName, params) {
        var message = this.randomToken + this.messageSeparator + messageName; 
        if(typeof params !== "undefined") {
            message += this.messageSeparator + params.join(this.paramSeparator);
        }
        this.target.postMessage(message, '*');
    };

    this.messageListeners = {};
    /*
     * Registers a listener for the specified messageName
     */
    this.registerMessageListener = function(messageName, listener) {
        this.messageListeners[messageName] = listener;
    };

    this.receiveMessage = function(message) {
        var parts = message.split(this.messageSeparator);
        //Checking if this message comes from an authorized source
        if (parts.length >= 1 && parts[0] == this.randomToken) {
            var messageName = parts[1];
            var params = typeof parts[2] !== "undefined" ? parts[2].split(this.paramSeparator) : null;
            if(typeof this.messageListeners[messageName] !== "undefined") {
                this.messageListeners[messageName](params);
            }
        }
    };

    this.listen();

}

