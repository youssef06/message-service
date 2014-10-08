MessageService!
===================

A simple javascript library for Cross-window messaging, internally it uses window.postMessage which is supported by all modern browsers including IE8. It allows windows/frames from multiple domains to communicate with each other.
It's intended use is for when a parent page creates an iframe and wants to communicate with it.

----------
Install
-------------
You will need to install this JS on the parent page as well as on the iframe page.
```
<script type="text/javascript" src="path/to/message-service.js"></script>
```
----------
Usage
-------------
Parent page:
```javascript
var node = document.createElement('iframe');
node.id = 'child_iframe';
/**  this could be generated on server side as well as on the client  **/
var token = "randomToken"; 
node.src = "CHILD_URL?token=" + token;
document.getElementsByTagName('body')[0].appendChild(node);
/**
   Once the iframe is loaded we create our messageService Object 
   that will allow us to send/receive messages to/from the created iframe
 **/
node.onload = function() {
  var messageService = new MessageService(token, node.contentWindow);
  messageService.registerMessageListener('childToParent', function(params) {
    console.log("message received from child");
	if(params) {
	  console.log("with params : "+params);
	}
  });
  messageService.sendMessage('parentToChild', [1, "2nd arg"]);
};
```

Iframe page:
```javascript
var messageService = new MessageService(urlParams['token'], parent);
messageService.registerMessageListener('parentToChild', function(params) {
  console.log("message received from parent");
  if(params) {
    console.log("with params : "+params);
  }
});
messageService.sendMessage('childToParent');
```