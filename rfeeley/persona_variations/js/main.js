/*========CLASS FOR EACH CHECKBOX========*/
function Checker(state,checkbox,fields,conflicts) {
	this.state  = state;
	this.name = checkbox;
	this.conflicts = conflicts;
	this.checkbox = document.getElementById(checkbox);
	this.parent = this.checkbox.parentNode;
	console.log(this.parent);
	this.fields = $("." + fields);
	this.stateSettings();
	this.checkbox.addEventListener("click",this.bang.bind(this));

}

//Handles State switch
Checker.prototype.bang = function() {
	if (this.checkbox.checked) {
		this.state = 1;
		checkForConflicts(this.conflicts);
	} else {
		this.state = 0;
	}
	this.stateSettings();
	console.log("bang!");
}

//Handles state switch for conflicts
Checker.prototype.resolveConflicts = function() {
	//console.log(this.state);
	this.state = 0;
	this.stateSettings();
}

//Handles State Switch actions;
Checker.prototype.stateSettings = function () {
	if (this.state === 1) {
		this.checkbox.checked = true;
		this.fields.show(Math.random()*1000)
		this.parent.className+=" checked"
	} else {
		this.fields.hide(100);
		this.parent.className="checkbox"
	}
}

/*==========RESOLVES ALL CONFLICTS============*/
function checkForConflicts(conflictsList) {
	if (conflictsList != undefined) {
		for(var i = 0; i < conflictsList.length; i++) {
			for(var j = 0; j < boxes.length; j++) {
				if (conflictsList[i] === boxes[j].name) {
					console.log('current box: ' + boxes[i].name);
					boxes[j].checkbox.checked = false;
					boxes[j].resolveConflicts();
					
				}		
			}
		}
	} 
		else console.log("undef!");
}


/*=========OBJECT DEFS===============*/

var boxes = [];


//boxes.push(new Checker(1,"ic1","s1",["ic2","ic3"]));
// 

//params are 
// state (0 or 1)
// id of checkbox
// class name of stuff to show
// array of id names of stuff to hide (conflicts)


// boxes.push(new Checker(1,"traditional","traditional",[]));
// boxes.push(new Checker(0,"persona","persona",[]));



console.log("!!!!");



