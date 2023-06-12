# Id Strava Heatmap Extension

This browser extension seamlessly integrates the Strava Activity Global Heatmap into the OpenStreetMap [iD editor][https://www.openstreetmap.org/edit?editor=id] as overlays. 


Previously it was only possible to 


JOSM Strava Heatmap Extension

Accessing this imagery externally requires a set of key parameters that you obtain by signing into the Strava website, copying the values from several cookies, and then assembling into a query string at the end of the url. The keys expire after a week or so at which point you must repeat the process. This extension builds the url for you which makes this weekly process a bit less annoying.

OSM Wiki: [Using the Strava Heatmap][https://wiki.openstreetmap.org/wiki/Strava

## Installation

Available as a [Chrome extension][]. The Chrome extension
should also work in Microsoft Edge and other Chromium based browsers.

## Instructions

1. Install the extension in your browser.
2. Visit [strava.com/heatmap][https://www.strava.com/heatmap] and log in (sign up for a free account if you don't have one)
3. Open your [iD editor][https://www.openstreetmap.org/edit?editor=id]
4. Open `Background Settings` (shortcut: `B`), and expand Overlays section.
5. Select `Strava Heatmap (All)` or any specific public activity (Ride, Run, Water & Winter)

![Strava Heatmap Overlays](screenshot2.png)