This is the page that lets the user customize their newtab page

* Sizing
	* apps can have 4 sizes but the total of all of the sizes of the apps on a given panel MUST be no greater than 6!
		* **2**: 1/3 (2/6) of the panel
		* **3**: 1/2 (3/6) of the panel
		* **4**: 2/3 (4/6) of the panel
		* **6**: 1/1 (6/6) of the panel
* Code layout
	* there are two basic class
		* Customizer
			* this is the class that is the overlying structure of the customizer application
			* it has many panels
		* Panel
			* panels have many applications
			* each application isn't a class but rather a normal javascript object
* method for expanding the size of an app
	1. increase the size of app
	2. remove all apps from their panels
	3. reinsert each app in the same order
* app creation process
	* a new "app banner" is created in the available apps section
	* a new App object is created an added to the customizer's list of apps
	* the app banner div referenced by the new app object so that it can later hidden or shown when the app is either on a panel or not