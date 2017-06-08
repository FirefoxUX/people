# This imports all the layers for "Alopex Mockup" into alopexMockupLayers5
sketch = Framer.Importer.load "imported/Alopex Mockup"

scroll = ScrollComponent.wrap sketch.scroll
scroll.scrollHorizontal = false
scroll.contentInset = 
	bottom: 150