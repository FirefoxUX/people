(function() {    
    //Global Variables
    var CLICK_INTERVAL = 50;
  	var HOLD_INTERVAL = 150;
	var MOVE_THRESHOLD = 5;
    var ICONS = {
      "menu":     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAONJREFUeNrs2cENwjAMheEEcYcN6CiMEiYhI7ABHaWjwAbdILhS7tiHSI78W/Kth3xKG7+2ubWWItUpBSvAgAEDBgwYMGDAgAEDVtXZeH2RXpwZPtLrCHCVfjrduKWv729lwweAXfriFPzV3nmWZ3iPdmhVxw712rLxm9a9t6faeg8BM4cBAwYM2HOWnn4spWMsKbs2v1W1DsscPt5KbpGydLhDa3XsUK+NLM0tDRgwYMBk6TnGUpF+O924hzZ8kKUnrWu0LP0aFS1LmvxnGlkaMGDAgAEDBgwYMGDAgAFL/QQYAE6RFZclzfQUAAAAAElFTkSuQmCC',
      "close":    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNrs2kEKgzAQBVDjWrBH8QKCRy/0Ah4lgvuphRSyaJOqfyYpfmHoopLmkTTJt3Ui0lzpapuLXQQTTDDBBBNMMMEEE0wwwQRrgSUqv9UA7N8Q2ow/o6oR7re6g9BDaKuvfUoj0CpYFHgBo1PYpQbwBETnsNP5FUcEUcNWXj5fPrxv0Ua2UOCzHTbBosFHO26G1QDvBZhiX+WUHsT/uvjk7pnRHXOKvzyk0Gt47Syx2uAjBwhVrEV4mBP7tDnWYoTjkX58mcLvKT5qYxkPlb/HXeKeDpiyioL3LFq9BbothF2jrckU3RbALmGBGhWipVla+pujJcMD4yEfAKh2VB2NOFp6cMTLrfC30mdpUQgCKbSrbR9GpJ49KasoGBnxVNCO/7UkmGCCCSaYYIIJJphgggkm+ILgpwADADMCLTTGdtXoAAAAAElFTkSuQmCC', 
      "home":     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAd1JREFUeNrsmtFthDAMQDkWIBuQEdgAugEjpBt0hG5SRmCDchswAt2Am4AGyR9VZSAEx+EOW/LHRcj4KXZsnLtN05RcSW4CLMACLMACLMACLMACLMDPB1xZ1aB/ZQDtXgHYWK0BNtt49gHQrdUmmEczcAA1VofJXwawQe4b9Q5r2J2SyN4domQ4Y0jXAJsRB+EDoNszAc8OfTnuWG91hN/KauEYEe8kuU2QF/VGPnaO+Wjg2TWpj/p7FFZbHRecGz0dNBs2dUzgpR3pDzqmwcZSxEQBNiuwiiBV1Aq0iVGW5lKRIydqQVhGNBxy/0/+H6Rjc5L0QAnKkfUPypoJtgyynoMPbKd0S51bHmdF62PLd4crZC1c/4vbrrgaj/lF35itwB86mKNve7+yUs+DBOugQsvd0RcW4J4BuI8FjMnIAEzyjjS5mFABKwZfVSxgrLEoGIALR19YgEsG4DIWcAc9MzYECDkMXBr6seRwdwLgjiuHl1q90ruh34YtqVpZ+TzcIZ/IWgbTRYoSosBW5vhuliHepUY8LkM84zkFPe0Q7+nGtJcbxMtVC0EZaZITX6bJdWmALmnvhXhDFb4cIb01/NPJi//l4XQiwAIswAIswAIswAIswAJMJL8CDAACjE2rhI+pzAAAAABJRU5ErkJggg==',
      "back":     ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA9CAYAAADxoArXAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAf5JREFUeNrsmtFtwjAQhgPinWxAmACYgDAB7QZ0AtIJmk7QMEHLBNAJIBukEzTdIEyQnqXfUh4gF2gA272T/qecBJ/t/+5w6JRl6f2n6AiwAAuwAAuwAAuwAAuwAAuwADeJrmHfJyYVpBL6cHWHH0gJaXDk2YSUubLDAWlP2pyA1Yth/ZH2saPfpKnrHo5IOWl5j5Xu3fCzQhShgetVWvl0S9oxsAfSl83APtqM8umcyV1VFsbKI71AUeozeSlyc1s9HAJ0xOT9AHRvq4cDFKQdA6t8+lrpv9ZVaR9tJmpwfNfIK+5ZpXt/9GncoM2kAM08A+IS4DF8Om3g0+gWlfeawD6812d8mkCFZ1icC8y1mjWOee4ZGt0LdrhuZ3OTYS8BjmqeqZ1/AXDoCrCCecRunooB+vEe/dZqYA9VN8AAURdTzNEJYwUrJq0CxWlI+mRylzgZkc3A1SOurmBm6Lt1/n7D8BHaDKxD+/WZ8fcI/t7ey99t/x5OALJi8ubwd3xrf1/jAqCAX4eYo+tCt7GFzcBVf4doY5y/32GLsc3Ax9rYgWljcxeAdcQAX7tQpc/xt/LrpIG/nQDWofvxE+Pv1sOEl2ncNdHMa/H+y6T3wwH6eLVwpW1PZia+EB9XhpGs7VsT+cuDAAuwAAuwAAuwAAuwAAuwAAvwsfgVYAB+6r4GEmQDFgAAAABJRU5ErkJggg==',
      "task":     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA9CAYAAADxoArXAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAO1JREFUeNrs2l0RwjAQRtG0g4BIKAqwgAQcUAlIQULjoA7AAgqIhDoIu4MCQv4gNzPfY5M9bdqHbIcQgulpDIABAwYMGDBgwIABAy4OtpKTZC5c8yJZJVtpsC58rvSgXOyNjgVPkmfl3bmX+E8vGiMXmxp4HaNqGE1nY5dwrofkkqnOq+TQGli/mvdM4C3VRN1tacCAAQMGDBgwYMCAAQMGDBgwYMA/P1Ie4mnr5ZipTtsiWI9Rb2zpPwH7Bmr3pcGuItbFgr9tiM/m3SO2haDagdDe8BI7AX8AAAYMGDBgwIABAwYMGDBgGS8BBgCwdHTzL2qX5QAAAABJRU5ErkJggg==',
      "favorite": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAexJREFUeNrsmjFPwkAUxwuSyGY/gANuJDJ0Y+nQ2YHNL8Hkx3BwIE5+DgfDZEz0AzhoUl10cCXBDQK1/i95JAQrNOTduyu8S35Jk14f9+u/XO8ItTzPg31q9WDPmgqrsAqrsAqrsAqrsAqrcMWFh4R4qznYLbXABx2fgM9dT/jmn+OdTHg53cBFynWH6TpJWTLhonTFU5ZM+HrLc5VMeF26oilLJXzF1KcSCZdJVyzluifpiqXMlXAEQpCADmiDY3AE5qBRss6i7zf4Ail4AQ9gDJ5dCF+AeEVqQgNtWApmTjRXbsYTGNgWNnf81JPNzys9UVa/wybdd5A5FM1oDLHEpGW+S13w6Eg6o8/u0lhEJ61bcAYOBGXvQM/Va6lHA8iqIMv1HpaQZpHlXHjYlGaT5V5p2ZBmlbWxtFxIczVWWVtr6XtPa1kTjj2tZU2442kta/ths5E4ZKo1pQ2DtwmHjLIB1Qp9Fo4oYc6nJfJdeNMjaPa1b8R8Q9+m78LrZtUfMALn9ONBm45HdE5mpjaTFiNp/rfNwBj011zXpz6zgutTzjFyC6+KTjaIFolPCsS9FG4tDXAKLkG4RZ2Qrp0u1Wv5KJxQOoMtRYvEB1Qz4RpnTf8+rMIqrMIqrMIqrMIqrMIqrMJl2q8AAwDTp2kGA8ahVwAAAABJRU5ErkJggg==',
      "share":    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfZJREFUeNrsmj1Ow0AQhW3kPuYEuKBEwogCOnKEtFSYG+QIoaA3N3Bu4CMYLgCWKCg3VJSmR1pmpbGwIgL7Z3s3npFeY3mdfJrJ7ptxQs55MKU4CCYWBEzABEzABEzABEzABEzAEwBOQAWIgUSH8wJagWKjp4puyUFloIb/HgyU6j47dLA9TDCbsz/uqUHpvpT08h9YEaegbF+ALxUqwWvgdpO66PNDIkdAxe57M8SHRR6Dlr4A28joA+7kTp/DCajg8vGx43pu8j0iBzO6xvsZnrULvN5gGTNXnZZKRoWrWuGaXivNRoYzzELrcZ9Ax6BribWfoBzVDLGBmFhLAVih61GNwUFt7NKlBuxooKbAooSvfAI1BZbtVL5A9y6AmgLLGvcajxjvJx6yZ+E5NgSp78CVwr3CcDzjmsXoxAaHeMn1guEIZ5Txkcni2AC6667iIYFtzLTmWKop/rZfQSd4bSb5jK5/dtZpyTixpeSMqo1HBK86x583zcP22JUplPs76K2P9nDoTWMOqrh55L7NpW1MPc50ph5jTS0ZtpWHoDv02jp+3rsxbRP8vC+6BW1cdVp9RIGlXk8FWNW2ah1P9DLNgWBoVnZtZJtA80WaqxnePrqEdT3CrJamw4SQ/j5MwARMwARMwARMwARMwARMwDLxLcAA1iC2eHLL98cAAAAASUVORK5CYII='
    };
    var OPTIONS = {
        "home":     ["task", "back", "home"],
        "website":     ["task", "back", "home"]
    };
    var FUNCTIONS = {
        "task":      function(){
                        window.dispatchEvent(new CustomEvent("holdhome")); 
                        return true;
                    },
        "back":     function(){
                         var oldApp = window.wrappedJSObject.StackManager.getCurrent();
                         window.wrappedJSObject.StackManager.goPrev();
                         var newApp = window.wrappedJSObject.StackManager.getCurrent();
                         if (newApp == oldApp) window.dispatchEvent(new CustomEvent("home"));
                        return true;
                    },
        "home":     function(){
                        window.dispatchEvent(new CustomEvent("home")); 
                        return true;
                    },
        "favorite": function(){
                        return true;
                    },
        "share":    function(){
                        window.dispatchEvent(new CustomEvent("sleep")); 
                        return true;
                    }
    }
    
    var stage = 0;

    //Float Button
    function FloatButton(stage){
        this.stage = stage;
        this.button = document.createElement("div");
        this.container = document.createElement("div");
        this.background = document.createElement("div");
        this.description = document.createElement("p");
        this.init();
    }
    
    FloatButton.prototype = {
        container: null,
        button: null,
        background: null,
        description: null,
        
        init: function(){
            this.render("home");
            this.registerEvents();
        },
        
        render: function(opt){
            var button = this.button;
            var container = this.container;
            var background = this.background;
            var description = this.description;

                button.id = "button";
                button.className = "circle";
                background.id = "background";
                background.className = "circle background";
                container.className = "container origin";

                description.id = "description";
                description.className = "description";
                description.textContent = "";

                container.appendChild(background);
                this.stage.appendChild(container);
            
                button.innerHTML = '<img src="' + ICONS["menu"] + '">';
               	container.appendChild(button);
              	container.appendChild(description);

            this.menu = new MenuOptions(container);
            var menu = this.menu;
            for (var i = 0; i < OPTIONS[opt].length; i++){
                menu.addItem(OPTIONS[opt][i], '');
            }
            menu.render();
        },
        registerEvents: function(){
            var button = this.button;
            var background = this.background;
            var timerID;
            var touchStartTimeStamp;
            var touchPosition;
            var moved = false;
            var longPressed = false;
            var mouseover = false;
            
            //Touch Start
            button.addEventListener('touchstart', (evt) => {
                longPressed = false;
                touchStartTimeStamp = new Date();
                evt.target.className += " hovering";
                this.container.classList.add('move');
                button.innerHTML = '<img src="' + ICONS["close"] + '">';
                
                var app = window.wrappedJSObject.StackManager.getCurrent();
                var opt = "";
                if(app == null) {
                    opt = "home";
                }
                else if(app[Object.keys(app)[0]].includes('http')) {
                    opt = "website";
                }
                else {
                    opt = app[Object.keys(app)[0]].split('app://')[1].split('.')[0];
                    if(OPTIONS[opt] == null) opt = "home";
                }
                
                this.menu.removeItemAll();
                this.menu = new MenuOptions(this.container);
                for (var i = 0; i < OPTIONS[opt].length; i++){
                    this.menu.addItem(OPTIONS[opt][i], '');
                }
                console.log(this.menu);
                this.menu.render();
                
                timerID = setTimeout(() => {
                  if (! moved) {
                      //navigator.vibrate(50);
                      background.className += " scale";
                      longPressed = true;
                      this.menu.open();
                      stage = 1;
                  }
                }, HOLD_INTERVAL);
            });
            //Touch End
            button.addEventListener('touchend', (evt) => {
                var time = new Date() - touchStartTimeStamp;
                
                this.container.classList.remove('move');
				        evt.target.className = "circle";
                background.className = "circle background";
                
                this.menu.close();
                stage = 0;
                button.innerHTML = '<img src="' + ICONS["menu"] + '">';
                
                clearTimeout(timerID);
                timerID = -1;
            });
            
             //Touch Move
            var body = document.querySelector('body');
	 		          body.addEventListener('touchmove', (evt) => {
                var xpos = evt.touches[0].clientX;
                var ypos = evt.touches[0].clientY;
                var dist = Math.sqrt(Math.pow(xpos-321,2)+Math.pow(ypos-330,2));
                 
                if(dist < 39 && !mouseover) {
                    mouseover = true;
                    if(stage == 1){
                        button.classList.add('hovering');
                 	  }
                }
                else if(dist > 39 && mouseover) {
                    mouseover = false;
                    if(stage == 1){
                        button.classList.remove('hovering');
                 	  }
                }
            });            
        }
    }

    //Menu Options
    function MenuOptions(container){
    	this.container = container;
        this.items = [];
        this.startAngle = 0;
        this.addAngle = 0;
        this.renderIndex = 0;
        this._xpos = [];
        this._ypos = [];
    }
    
    Object.defineProperty(MenuOptions.prototype, 'opened', {
        get: function() {
      		return this.container.classList.contains('opened');
        }
  	});
    
    MenuOptions.prototype = {
        addItem: function(id, text, classLists){
            this.items.push({
                'id': id,
                'text': text,
                'classLists': classLists || [],
                'index': "0"
            });
        },
        removeItem: function(id) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].id === id) {
                  this.items.splice(i, 1);
                  break;
                }
            }
        },
        removeItemAll: function() {
            this.items = [];
            var elements = document.getElementsByClassName('circle-item');
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
            this.startAngle = 0;
            this.addAngle = 0;
            this.renderIndex = 0;
            this._xpos = [];
            this._ypos = [];
        },
        render: function(){
            this.renderedCount = this.items.length;
    		    this.items.forEach(this.renderItem.bind(this));
            this.items.forEach(this.registerEvents.bind(this));
		    },
        renderItem: function(item) {
            if(this.renderedCount<3){
                this.startAngle = 180/(this.renderedCount+1)-90;
                this.addAngle = 180/(this.renderedCount+1);
            } 
            else {
                this.startAngle = -90;
                this.addAngle = 180/(this.renderedCount-1);
            }

            var menu = document.createElement('div');	
            menu.role = 'menu';
            menu.classList.add('circle-item');
            menu.classList.add('origin');
            item.classLists.forEach((cls) => {
                menu.classList.add(cls);
            });
            menu.id = item.id;
            menu.innerHTML = '<img src="' + ICONS[item.id] + '">';
            this.container.appendChild(menu);
            item.index = this.renderIndex;
            
            this._xpos[this.renderIndex] = 175*Math.cos((Math.PI/180)*(this.startAngle-this.renderIndex*this.addAngle));
            this._ypos[this.renderIndex] = 175*Math.sin((Math.PI/180)*(this.startAngle-this.renderIndex*this.addAngle));
            menu.style.transform = "translate3d("+this._xpos[this.renderIndex]+"px, "+this._ypos[this.renderIndex]+"px, 0)";
            menu.style.transitionDelay = 50*this.renderIndex+"ms";
            this.renderIndex++;
        },
        open: function(){
            setTimeout(() => {
            this.container.classList.remove('origin');
                setTimeout(() => {
                    this.container.classList.add('open');
                }, 350);
            }, 50);
        },
        close: function(){
            setTimeout(() => {
  	            this.container.classList.remove('open');
            }, 350);
            this.container.classList.add('origin');
        },
        registerEvents: function(item){
            var mouseover = false;
            var currentId = -1;
            var body = document.querySelector('body');

            //Touch Move
	 		      body.addEventListener('touchmove', (evt) => {
                var xpos = evt.touches[0].clientX;
                var ypos = evt.touches[0].clientY;
                var _x = parseInt(this._xpos[item.index])+321;
                var _y = parseInt(this._ypos[item.index])+330;
                var dist = Math.sqrt(Math.pow(xpos-_x,2)+Math.pow(ypos-_y,2));
                 
                if(dist < 39 && !mouseover) {
                    if(stage == 1){
                        mouseover = true;
                        document.getElementById("description").style.opacity = 1;
                        document.getElementById("description").textContent = item.id;
                        
                       	document.getElementById(item.id).className +=' hovering';
                        document.getElementById(item.id).style.transform += " scale3d(1.3,1.3,1.3)";
                        currentId = item.id;
                 	  }
                }
                else if(dist > 39 && mouseover) {
                    if(stage == 1){
                        mouseover = false;
                        document.getElementById("description").style.opacity = 0;
                  	    document.getElementById(item.id).className = document.getElementById(item.id).className.split('hover')[0];
                        document.getElementById(item.id).style.transform = document.getElementById(item.id).style.transform.split('scale')[0];
                        currentId = -1;
               	    }
                }
             });

            //Touch End
            body.addEventListener('touchend', (evt) => {
                document.getElementById("description").textContent = "";
                if(mouseover){
                    console.log(currentId);
                    navigator.vibrate(50);
                    FUNCTIONS[currentId]();

                    setTimeout(function(){
                        document.getElementById(currentId).className = document.getElementById(currentId).className.split('hover')[0];
                        document.getElementById(currentId).style.transform = document.getElementById(currentId).style.transform.split('scale')[0];
                        currentId = -1;
                        mouseover = false;
                    },100);
                }
            });
        }
    }
    
    // If injecting into an app that was already running at the time
    // the app was enabled, simply initialize it.  
    var floatButton;
      //Initialize HTML
    if (document.readyState !== 'loading') {
        init();
    } 
    else {
        document.addEventListener('readystatechange', function() {
            document.readyState === 'interactive' && init();
        });
    }

    function init() {
        var body = document.querySelector('body');
        floatButton = new FloatButton(body);
        
    }
})(window);