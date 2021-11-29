# RemoveScriptsChromeExt
<img src="images/logo.jpg" width="300" align="right">


A Chrome Extension to remove annoyances on a web page. Extremely easy way to stop all of the iframe and auto-play videos that are so common these days on websites.  I find it very useful when reading pages linked from news.google.com.

### To Install:

**Easiest way** Download the [latest release here][Latest]

**...Or** Download all of the [source files here][Master]

**...Or** use git to make a local clone:
```sh
git clone https://github.com/sflanders95/RemoveScriptsChromeExt
```

---

### Now Add It To Chrome:

Open Chrome and navigate to: [chrome://extensions](chrome://extensions)

Turn Developer mode on: &nbsp; <img src="images/chromeDevModeOn.png" width="100" valign="middle">

<img src="images/loadbtn.png" width="100" valign="middle"> ⟵
Click the "Load Unpacked" button and select the directory where the manifest.json file is that you just downloaded.  *(if you downloaded the zip file, unzip it so chrome can get to the `manifest.json` file.)* The directory you select should look similar to this:

<img src="images/dir.png" width="450"> 

After installing the plugin, a new icon <img src="images/Actions-process-stop-icon16.png" valign="middle"> should have been created at the top right of the chrome window.  The Hover text over the icon will say "Remove Tags From Html".  Click it to open the main window.  Check the boxes for the tags you wish to remove from the current page.  Clicking the "Remove" button will attempt to remove all tags with that name.

### Version History:

- Sep 10, 2018 - Epoch, added to github.

---

[MIT Software License](https://raw.githubusercontent.com/sflanders95/EmpireMillenniumChromeExt/master/LICENSE) <br>


[Latest]: https://github.com/sflanders95/RemoveScriptsChromeExt/releases/latest
[Master]: https://github.com/sflanders95/RemoveScriptsChromeExt/archive/master.zip
