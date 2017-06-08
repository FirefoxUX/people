# This imports all the layers for "Alopex Mockup" into alopexMockupLayers7
sketch = Framer.Importer.load "imported/Alopex Mockup"
sketch.Screen.x = 0
sketch.Screen.y = 47

sketch.NavBar.x = 0
sketch.NavBar.y = 1220
sketch.statusBar.x = 0
sketch.statusBar.y = 0

sketch.Notification.x = 0
sketch.Notification.y = 47
sketch.Notification.sendToBack()

sketch.Notification.draggable.enabled = true
sketch.Notification.draggable.speedX = 0
sketch.Notification.draggable.speedY = 0

# Drag Notification
sketch.statusBar.draggable.enabled = true
sketch.statusBar.draggable.speedX = 0
sketch.statusBar.draggable.speedY = 0

# Interaction Stages
stage = "home"

# page swipes
pager = new PageComponent
	width: Screen.width
	height: Screen.height
	backgroundColor: null
	scrollVertical: false
	
pager.addPage sketch.Screen
pager.placeBehind sketch.statusBar

pager.on "change:currentPage", ->
    current = pager.currentPage
    i = pager.horizontalPageIndex(current)
    if i == 0
    	stage = "home"

# background
background = new Layer
	width: Screen.width
	height: Screen.height
	backgroundColor: "#000"
background.placeBehind pager

pager.states.add
    stateA:
        y: 0
    stateB:
    	y: Screen.height

sketch.statusBar.on Events.DragStart, (e) ->
	pager.states.switch("stateB", time: .6, curve: "ease-in")
	sketch.Notification.placeBefore background
    
sketch.Notification.on Events.DragStart, (e) ->
	pager.states.switch("stateA", time: 1, curve: "spring(200,35,0)")
	pager.scrollHorizontal = false

pager.on Events.StateDidSwitch, (previousState, newState) ->
	return if previousState == newState
	if newState == "stateA"
		sketch.Notification.placeBehind background
		pager.scrollHorizontal = true


	

# App information
appObjs = {
    App1:{"color":"df5786", "icon": sketch.Icon1, "name": "The Verge", "content": sketch.Verge},
    App2:{"color":"5d30af", "icon": sketch.Icon2, "name": "Yahoo", "content": sketch.Yahoo},
    App3:{"color":"21a891", "icon": sketch.Icon3, "name": "Contacts", "content": sketch.Contacts},
    App4:{"color":"1279b9", "icon": sketch.Icon4, "name": "Camera", "content": sketch.Camera},
    App5:{"color":"FFFFFF", "icon": sketch.Icon5, "name": "Google Drive", "content": sketch.Drive},
    App6:{"color":"f4573b", "icon": sketch.Icon6, "name": "CBC.ca", "content": sketch.CBC},
    App7:{"color":"522b2d", "icon": sketch.Icon7, "name": "Kotaku", "content": sketch.Kotaku},
    App8:{"color":"000000", "icon": sketch.Icon8, "name": "The New York Times", "content": sketch.NYT},
    App9:{"color":"ffe032", "icon": sketch.Icon9, "name": "Maker Party", "content": sketch.Maker},
    App10:{"color":"527bb3", "icon": sketch.Icon10, "name": "Facebook", "content": sketch.Facebook},
    App11:{"color":"FFFFFF", "icon": sketch.Icon11, "name": "Codepen", "content": sketch.Codepen},
    App12:{"color":"87c1e9", "icon": sketch.Icon12, "name": "Team Liquid", "content": sketch.TL},
}

# Scroll Events
# NYTscroll = ScrollComponent.wrap sketch.NYTscroll
# NYTscroll.scrollHorizontal = false
# NYTscroll.on Events.Scroll, ->
#     if NYTscroll.scrollY <=0 then NYTscroll.scrollY = 0
# 
# Yahooscroll = ScrollComponent.wrap sketch.Yahooscroll
# Yahooscroll.scrollHorizontal = false
# Yahooscroll.on Events.Scroll, ->
#     if Yahooscroll.scrollY <=0 then Yahooscroll.scrollY = 0

scroll = ScrollComponent.wrap sketch.scroll
scroll.scrollHorizontal = false
scroll.contentInset =
    bottom: 70
scroll.on Events.Scroll, ->
    if scroll.scrollY <=0 then scroll.scrollY = 0

# Home Click Event
sketch.Home.on Events.Click, ->
    if stage == "home"
        scroll.draggable.enabled = false
        scroll.animate
            properties:
                scrollY: 0
            time: .5
            curve: "spring(200,35,0)"
        scroll.on Events.AnimationEnd, ->
            scroll.draggable.enabled = true
    else if stage == "app"
    	pager.snapToPage sketch.Screen, true
    	stage = "home"

# Back Click Event
sketch.Arrow.on Events.Click, ->
	pager.snapToNextPage("left", true)
	current = pager.currentPage
	i = pager.horizontalPageIndex(current)
	if i == 0
    	stage = "home"

# Dynamically creating apps
apps = []
for i in [0 .. 11]
    apps.push new Layer
        superLayer: scroll.content
        midX: 140+(i%3)*235
        midY: 279+Math.floor(i/3)*276
        height: 221
        width: 221
        name: "App"+(i+1)
        backgroundColor: appObjs["App"+(i+1)].color
        style: {"overflow":"visible"}
    apps[i].placeBehind sketch.Icons
    textbox = new Layer
        superLayer: apps[i]
        width: 221
        height: 40
        y: 230
        backgroundColor: null;
        style: {
            "font-size": "15pt"
        }
        html: appObjs[apps[i].name].name

for app in apps
    app.on Events.Click, (event, layer)->
        if not scroll.isMoving and stage == "home"
            print stage
            currentIcon = appObjs[layer.name].icon.copy()
            currentIcon.frame = appObjs[layer.name].icon.screenFrame
            currentApp = layer.copy()
            currentApp.bringToFront()
            currentIcon.placeBefore currentApp
            currentApp.frame = layer.screenFrame

            currentApp.animate
                properties:
                    scale: 20
                time: 1.2
                curve: "ease-out"
            currentIcon.animate
                properties:
                    scale: 1.6
                time: .4
                curve: "ease-out"

            Utils.delay .2, () ->
                currentIcon.animate
                    properties:
                        opacity: 0
                    time: .6

            Utils.delay .9, () ->
                # appContents.visible = true
                appObjs[layer.name].content.x = 0
                appObjs[layer.name].content.y = 31
                # appObjs[layer.name].content.superLayer = appContents
                appObjs[layer.name].content.placeBefore sketch.Screen
                copy = appObjs[layer.name].content.copy()
                copy.frame = appObjs[layer.name].content.screenFrame
                
                pager.addPage copy
                pager.snapToPage copy, false

                currentApp.animate
                    properties:
                        opacity: 0
                    time: .5
                currentApp.on Events.AnimationEnd, ->
                    currentApp.destroy()
                    currentIcon.destroy()
                    stage = "app"







