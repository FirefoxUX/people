(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
/** @jsx React.DOM */

// Main views.
var Desktop = require('./views/Desktop.jsx');

moment.lang('en', {
  calendar : {
    lastDay : '[Yesterday at] LT',
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    lastWeek : 'l [at] LT',
    nextWeek : 'l [at] LT',
    sameElse : 'L'
  }
});

setTimeout(function(){
  var screenEl = $('<div/>', {
    class: 'component-wrapper'
  })[0];

  $('#wrapper').append(screenEl);

  React.renderComponent(Desktop(null), screenEl);

  $('.tip').tipr({
    mode: 'top',
    speed: 200
  });

  window.addEventListener("message", function (event) {
    if (event.data === 'whimsy:enabled') {
      document.querySelector('body').classList.add('whimsical');
    }
  }, false);
}, 100);

},{"./views/Desktop.jsx":6}],3:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter;
module.exports = Dispatcher = new EventEmitter();

},{"events":1}],4:[function(require,module,exports){
module.exports = {
  animation: {
    duration: 200,
    easing: "easeInSine",
    queue: false
  }
}


},{}],5:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    var icon, chevron, dropdown;
    if (this.props.icon) {
      icon = React.DOM.i({className: "fa fa-" + this.props.icon});
    }
    if (this.props.hasRightChevron) {
      chevron = React.DOM.span({className: "chevron"}, " ▾ ");
    }
    if (this.props.children) {
      dropdownClass = "Dropdown " + (this.props.showDropdown ? "show" : "hide");
      dropdown = React.DOM.div({className: dropdownClass }, 
         this.props.children
      );
    }
    return (
      React.DOM.div({className: "ButtonContainer"}, 
        React.DOM.div({id: this.props.id, onClick: this.props.onClick, className: "Button " + this.props.style},  this.props.text, icon, chevron), 
        dropdown 
      )
    )
  }
});

},{}],6:[function(require,module,exports){
/** @jsx React.DOM */
var Button = require('./Button.jsx');
var Dispatcher = require('../utils/Dispatcher');
var GlobalSharing = require('./GlobalSharing.jsx');
var UrlbarSharing = require('./UrlbarSharing.jsx');

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    // status: "none", "requested", "enabled", "muted" ?
    var devices = [
      {name: 'Camera', type: 'camera', status: "none",
       values: ['Don’t share my camera', 'Facetime HD Camera', 'External Camera'],
       selected: 1},
      {name: 'Audio', type: 'microphone', typeExt: 'gif', status: "none",
       values: ['Don’t share my microphone', 'Built-in Microphone', 'External Microphone'],
       selected: 1},
     {name: 'Screen', type: 'screen', status: "none",
      values: ['Don’t share my screen', 'Entire Screen', 'Firefox - Start Page', 'Firefox - CloudApp'],
      selected: -1}
    ]

    return {
      highlight: '',
      sharing: 'requested',
      isSharingVisible: false,
      isUrlbarDropdownVisible: false,
      isGlobalDropdownVisible: false,
      devices: devices
    };
  },

  selectDevice: function (deviceIndex, itemIndex) {
    this.state.devices[deviceIndex].selected = itemIndex;
    this.setState(this.state);
  },

  muteDevice: function (deviceIndex, itemIndex) {
    var status = this.state.devices[deviceIndex].status;
    if (status === 'enabled') {
      this.state.devices[deviceIndex].status = 'muted';
    } else if (status === 'muted') {
      this.state.devices[deviceIndex].status = 'enabled';
    }
    this.setState(this.state);
  },

  setHighlight: function (highlightIndex) {
    this.setState({highlight: 'highlight-' + highlightIndex});
  },

  clearHighlight: function (highlightIndex) {
    this.setState({highlight: ''});
  },

  requestSharing: function() {
    var sharing = this.state.sharing;
    if (!this.state.isSharingVisible) {
      sharing = 'requested';
      this.state.devices[0].status = 'requested';
      this.state.devices[1].status = 'requested';
      this.state.devices[2].status = 'none';
    } else {
      this.state.devices[2].status = 'requested';
      this.state.devices[2].selected = 0;
    }
    this.setState({
      sharing: sharing,
      isSharingVisible: true,
      isUrlbarDropdownVisible: true,
      isGlobalDropdownVisible: false,
      devices: this.state.devices
    });
  },
  stopSharing: function() {
    this.state.devices.forEach(function (device) {
      device.status = "none";
    });
    this.setState({
      sharing: 'requested',
      isSharingVisible: false,
      isUrlbarDropdownVisible: false,
      isGlobalDropdownVisible: false,
      devices: this.state.devices
    });
  },

  toggleGlobalDropdown: function(e) {
    var globalVisible = !this.state.isGlobalDropdownVisible;
    var urlbarVisible = globalVisible ? false : this.state.isUrlbarDropdownVisible;
    this.setState({
      isGlobalDropdownVisible: globalVisible,
      isUrlbarDropdownVisible: urlbarVisible
    });
  },
  toggleUrlbarDropdown: function(e) {
    var urlbarVisible = !this.state.isUrlbarDropdownVisible;
    var globalVisible = urlbarVisible ? false : this.state.isGlobalDropdownVisible;
    this.setState({
      isUrlbarDropdownVisible: urlbarVisible,
      isGlobalDropdownVisible: globalVisible
    });
  },
  shareDevices: function(e) {
    var urlbarVisible = !this.state.isUrlbarDropdownVisible;
    var globalVisible = urlbarVisible ? false : this.state.isGlobalDropdownVisible;
    var devices = this.state.devices;
    devices.forEach(function (device) {
      if (device.selected > 0) {
        device.status = "enabled";
      }
    });
    this.setState({
      sharing: 'enabled',
      isUrlbarDropdownVisible: false,
      isGlobalDropdownVisible: false,
      devices: devices
    });
  },

  componentWillMount: function(){
    this.listeners = {
      'device:select': this.selectDevice,
      'device:mute': this.muteDevice,
      'highlight:set': this.setHighlight,
      'highlight:clear': this.clearHighlight,
    };

    for (var event in this.listeners) {
      Dispatcher.on(event, this.listeners[event]);
    }
  },
  componentWillUnmount: function(){
    for (var event in this.listeners) {
      Dispatcher.off(event, this.listeners[event]);
    }
  },

  render: function() {
    var requestText = "Request sharing";
    var stopSharingButton = "";
    if (this.state.isSharingVisible) {
      requestText = "Request more sharing";
      stopSharingButton = Button({text: "Stop sharing", style: "default", id: "stopSharing", onClick:  this.stopSharing})
    }
    return (
      React.DOM.div(null, 
        React.DOM.div({className:  "FullImage full-screen " + this.state.highlight}, 
          GlobalSharing({
            sharing:  this.state.sharing, 
            isSharingVisible:  this.state.sharing == 'enabled', 
            isDropdownVisible:  this.state.isGlobalDropdownVisible, 
            toggleDropdown:  this.toggleGlobalDropdown, 
            devices:  this.state.devices, 
            shareDevices:  this.shareDevices}), 
          UrlbarSharing({
            sharing:  this.state.sharing, 
            isSharingVisible:  this.state.isSharingVisible, 
            isDropdownVisible:  this.state.isUrlbarDropdownVisible, 
            toggleDropdown:  this.toggleUrlbarDropdown, 
            devices:  this.state.devices, 
            shareDevices:  this.shareDevices}), 
          React.DOM.div({id: "shareButtons"}, 
            Button({text: requestText, style: "default", id: "requestSharing", 
              onClick:  this.requestSharing}), 
            stopSharingButton 
          )
        )
      )
    );
  }
});

},{"../utils/Dispatcher":3,"./Button.jsx":5,"./GlobalSharing.jsx":8,"./UrlbarSharing.jsx":13}],7:[function(require,module,exports){
/** @jsx React.DOM */
var Button = require('./Button.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function () {
    return (
      React.DOM.div({className: "Footer"}, 
        Button({text: "Share selected devices", 
          hasRightChevron: true, style: "default", 
          onClick:  this.props.shareDevices})
      )
    )
  }
});

},{"./Button.jsx":5}],8:[function(require,module,exports){
/** @jsx React.DOM */
var SharingDoorhanger = require('./SharingDoorhanger.jsx');
var SharingIndicator = require('./SharingIndicator.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div(null, 
        SharingIndicator({id: "global-indicator", 
          sharing:  this.props.sharing, 
          isSharingVisible:  this.props.isSharingVisible, 
          toggleDropdown:  this.props.toggleDropdown, 
          devices:  this.props.devices}), 
        SharingDoorhanger(Object.assign({}, this.props))
      )
    )
  }
});

},{"./SharingDoorhanger.jsx":11,"./SharingIndicator.jsx":12}],9:[function(require,module,exports){
/** @jsx React.DOM */
var Button = require('./Button.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.DOM.div({className: "Panel " + (this.props.extraClass || "")}, 
        React.DOM.div({className: "title"}, 
          React.DOM.span(null, "mozilla.org"), 
          Button({style: "minimal", icon: "times", 
            onClick: this.props.toggleDropdown})
        ), 
         this.props.children
      )
    )
  }
});

},{"./Button.jsx":5}],10:[function(require,module,exports){
/** @jsx React.DOM */

_animationDefaults = require('../utils/defaults.js').animation;

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    return {
      isMoved: false
    }
  },
  slideTo: function(loc) {
    $(this.refs.slider.getDOMNode()).velocity({
      translateX: loc
    }, _animationDefaults);
  },
  toggle: function() {
    if(this.state.isMoved)
    {
      this.slideTo(0);
    }
    else {
      this.slideTo('-48%');
    }
    this.setState({
      isMoved: !this.state.isMoved
    });
  },
  componentDidMount: function() {
    var group = this;
    $(this.getDOMNode()).on('PanelGroup', function(event, data){
      switch(data.type) {
        case "toggle":
          group.toggle();
          break;

        case "back":
          group.slideTo(0);
          group.setState({
            isMoved: false
          });
          break;
      }
    });
  },
  componentWillUnmount: function() {
    $(this.getDOMNode()).off('PanelGroup::toggle');
  },
  render: function(){
    var isMoved = this.state.isMoved ? 'moved' : null;
    var classname = ["PanelGroup", isMoved].join(' ');
    return (
      React.DOM.div({className: classname}, 
        React.DOM.div({ref: "slider", className: "PanelGroupInner"}, 
          this.props.children
        )
      )
    )
  }
})
},{"../utils/defaults.js":4}],11:[function(require,module,exports){
/** @jsx React.DOM */
var Button = require('./Button.jsx');
var Dispatcher = require('../utils/Dispatcher');
var Footer = require('./Footer.jsx');
var Panel = require('./Panel.jsx');
var PanelGroup = require('./PanelGroup.jsx');

module.exports = React.createClass({displayName: 'exports',
  // doesn't fire, because we're being hidden.  Move up to grandparent class?
  showPanel: function (device) {
    device.panel = !device.panel;
    this.forceUpdate();
  },

  selectDevice: function (deviceIndex, itemIndex) {
    Dispatcher.emit('device:select', deviceIndex, itemIndex);
    this.showPanel(this.props.devices[deviceIndex]);
  },

  muteDevice: function (deviceIndex) {
    Dispatcher.emit('device:mute', deviceIndex);
  },

  onItemOver: function (deviceIndex, itemIndex) {
    var device = this.props.devices[deviceIndex]
    if (device.type === 'screen') {
      Dispatcher.emit('highlight:set', itemIndex);
    }
  },
  onItemOut: function (deviceIndex, itemIndex) {
    var device = this.props.devices[deviceIndex]
    if (device.type === 'screen') {
      Dispatcher.emit('highlight:clear', itemIndex);
    }
  },

  itemForDevice: function (deviceIndex, item, itemIndex) {
    return React.DOM.div({className: "dropdownItem", 
      onMouseOver:  this.onItemOver.bind(this, deviceIndex, itemIndex), 
      onMouseOut:  this.onItemOut.bind(this, deviceIndex, itemIndex), 
      onClick:  this.selectDevice.bind(this, deviceIndex, itemIndex) }, item)
  },

  getDeviceClass: function (device) {
    return 'Device ' + device.status;
  },

  requestForDevice: function (device, index) {
    var imageName = 'images/device-icon-' + device.type +
                        '.' + (device.typeExt || 'png');
    if (device.status != 'requested') {
      return "";
    }
    return React.DOM.div({className:  this.getDeviceClass(device), key:  device.name}, 
      React.DOM.div({className: "group"},  device.name), 
      React.DOM.img({src: imageName }), 
      Button({text:  device.values[device.selected], 
        hasRightChevron: "true", style: "default", 
        showDropdown:  device.panel, 
        onClick:  this.showPanel.bind(this, device) }, 
        React.DOM.div(null, device.values.map(this.itemForDevice.bind(this, index)))
      )
    );
  },

  shareForDevice: function (device, index) {
    var imageName = 'images/device-icon-' + device.type +
                        '.' + (device.typeExt || 'png');
    return React.DOM.div({className:  this.getDeviceClass(device), key:  device.name}, 
      React.DOM.img({src: imageName }), 
      React.DOM.div({className: "name"},  device.values[device.selected] ), 
      Button({text:  (device.status === "muted") ? "Unmute" : "Mute", 
        hasRightChevron: "true", style: "default", 
        // showDropdown={ device.panel }
        onClick:  this.muteDevice.bind(this, index) 
        }, 
        "// ", React.DOM.div(null, device.values.map(this.itemForDevice.bind(this, index)))
      )
    );
  },

  render: function() {
    var info = "";
    var devices = "";
    var footer = "";
    if (this.props.sharing === 'requested') {
      info = React.DOM.span(null, "This site would like to access:");
      devices = this.props.devices.map(this.requestForDevice);
      footer = Footer({shareDevices:  this.props.shareDevices});
    } else {
      info = React.DOM.span(null, "This site is currently using these devices:")
      devices = this.props.devices.map(this.shareForDevice);
    }
    return (
      React.DOM.div({className:  "PanelWrapper " + (this.props.isDropdownVisible ? "shown" : "hidden") }, 
        PanelGroup(null, 
          Panel({toggleDropdown:  this.props.toggleDropdown}, 
            info, 
            devices, 
            footer 
          )
        )
      )
    )
  }
});
},{"../utils/Dispatcher":3,"./Button.jsx":5,"./Footer.jsx":7,"./Panel.jsx":9,"./PanelGroup.jsx":10}],12:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  viewForDevice: function (device) {
    var deviceClass = "device " + device.status;

    var imageName = "images/icons/FX_" + device.type;
    if (device.status === 'muted') {
      imageName += '-mute';
    }
    imageName += "-16x16.svg"

    return React.DOM.img({src: imageName, className: deviceClass })
  },

  render: function () {
    var sharingClass = "sharing " + this.props.sharing +
      (this.props.isSharingVisible ? " shown" : " hidden");
    return (
      React.DOM.div({id:  this.props.id, 
        className: sharingClass, 
        onClick:  this.props.toggleDropdown}, 
         this.props.devices.map(this.viewForDevice) 
      )
    );
  }
});

},{}],13:[function(require,module,exports){
/** @jsx React.DOM */
var SharingDoorhanger = require('./SharingDoorhanger.jsx');
var SharingIndicator = require('./SharingIndicator.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div({className: "BrowserWindow"}, 
        React.DOM.div({className: "Toolbar"}, SharingIndicator({id: "urlbar-indicator", 
          sharing:  this.props.sharing, 
          isSharingVisible:  this.props.isSharingVisible, 
          toggleDropdown:  this.props.toggleDropdown, 
          devices:  this.props.devices}), React.DOM.div({className: "end"
        })), 
          SharingDoorhanger(Object.assign({}, this.props))
      )
    )
  }
});

},{"./SharingDoorhanger.jsx":11,"./SharingIndicator.jsx":12}]},{},[2]);