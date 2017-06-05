
//array to track current state of each box
//and check against valid states
var register = [0,0,0,0,0];

// holds array of indexes to be shown
var currentDisplayState = [0,0,0,0];

//jQuery object holding all show/hide divs;
var fields = $("#fields");
//array of first four boxes
var boxes = [];
// array to hold error states
var errors = [
	"You must have at least one option selected"
];


//HELPER PROTOTYPE FUNC FOR CHECKING MATCHES TO REGISTER
Array.prototype.compareLike = function(array) {
	for(var i = 0; i < this.length; i++) {
		if (this[i] !== array[i]) {
			return false
		}
	}
	return true;
}

Array.prototype.clone = function() {
	return this.slice(0);
}


/*=====CHECKER OBJECT for 1st 4 boxes======*/
function Checker(state,checkbox,index,conflicts) {
	this.state = state;
	this.name = checkbox;
	this.index = index;
	this.conflicts = conflicts;
	this.checkbox = document.getElementById(checkbox);
	this.parent = this.checkbox.parentNode;
	this.stateSettings();
	this.checkbox.addEventListener("click",this.bang.bind(this));
}

//RECORDS A CLICK AND (possibly) TOGGLES STATE
Checker.prototype.bang = function() {

	var specState = this.iCanHazToggle(); 
	var specRegister = register.clone();
	if (this.conflicts !== null) specRegister = updateForConflicts(specRegister,this.conflicts);
	specRegister[this.index] = specState; 
	var newStateIndex = setDisplayState(specRegister)
	if (newStateIndex >= 0 && !register.compareLike(specRegister)) {
		console.log(register);
		console.log(specRegister);
		this.state = specState;
		register = validStates[newStateIndex].stateSet.clone();
		currentDisplayState = validStates[newStateIndex].displays.clone();
		showNewRegisterState();
		this.stateSettings();

	} else if (newStateIndex >= 0 && register.compareLike(specRegister)) {
		this.checkbox.checked = true;
	}
	else {
		if (this.checkbox.checked) {
			this.checkbox.checked = true;
		} else {
			this.checkbox.checked = false;
		}
		this.parent.style.backgroundColor = "#daa";
		console.log("DANGER DANGER/HIGH VOLTAGE!");
	}

}

//Checks to see if this toggle is the last man standing
//if so disallows state change.
Checker.prototype.iCanHazToggle = function() {
	var canChange = false;
	if (this.checkbox.checked === false) {
		for (var i = 0; i < boxes.length;i++) {
			if (i === this.index) continue;
			else {
				if (register[i] === 1) {
					canChange = true;
					break;
				}
			}
		}
		if(canChange) return 0;
		else return 1;
	} else {
		return 1;
	}
}

//HANDLES STATE SWITCHING
Checker.prototype.stateSettings = function () {
	if (this.state === 1) {
		this.checkbox.checked = true;
		this.parent.className+=" checked";
	} else {
		this.checkbox.checked = false;
		this.parent.className="checkbox";
	}
}

function setDisplayState(specRegister) {
	for(var i = 0; i < validStates.length; i++) {
		if (validStates[i].stateSet.compareLike(specRegister)) {
			return i;
		}
	}
	return -1
}

function setInitDisplayState() {
	for(var i = 0; i < validStates.length; i++) {
		if (validStates[i].stateSet.compareLike(register)) {
			return validStates[i].displays;
		}
	}
	return("something's gone wrong")
}

//FUNC TO INIT REGISTER
function initRegister() {
	for(var i = 0; i < boxes.length;i++) {
		register[i] = boxes[i].state;
	}
	currentDisplayState = setInitDisplayState(register);
	fields.find(">div>div").hide();
	for(var i = 0; i < 4 ; i++) {
		fields.find(">div:eq("+i+")>div:eq("+currentDisplayState[i]+")").slideDown(00);
	}
}

//SHOW NEW REGISTER STATE
function showNewRegisterState() {
	fields.find(">div>div").hide();
	for(var i = 0; i < 4 ; i++) {
		fields.find(">div:eq("+i+")>div:eq("+currentDisplayState[i]+")").slideDown(500);
	}
}
function updateForConflicts(specRegister,i) {
	
	if(specRegister[i] === 1) {
		console.log("a conflict");
		specRegister[i] = 0;
		boxes[i].state = 0;
		boxes[i].stateSettings();

	}
	return specRegister;
}

//Fill up Boxes Array
boxes.push(new Checker(1,"persona",0,null));
boxes.push(new Checker(0,"traditional",1,null));
boxes.push(new Checker(0,"one_social",2,3));
boxes.push(new Checker(0,"mult_social",3,2));
boxes.push(new Checker(0,"add_info",4,null));

initRegister();



