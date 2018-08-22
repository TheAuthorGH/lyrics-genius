# Lyrics Genius

*Lyrics Genius* is an entertainment app that takes the lyrics of your favorite songs to show you interesting facts about their lyrics. Simply look for a song name, an artist, or even specific lyrics and the app will try to find a matching track. Then, you may click on it to view a complete analysis of its lyrics.

## See it in Action

You can find a live demo for this app [here](https://theauthorgh.github.io/lyrics-genius/).

Lyrics Genius is optimized for both desktop and mobile, is fully useable with keyboard controls, and has been made with disabilities such as visual impairment and color blindness in mind.

## Usage Notes
* This app relies heavily on JavaScript and on some ECMAScript 6 features, so unforntunately, support for Internet Explorer is not guaranteed, even if using the latest version.
* Despite being a one-page web application, this app is designed to work only with a stable internet connection and therefore needs one at all times while in use. So if, for example, you download the app's source into your PC, expect it to malfunction if at any time access to the internet is compromised.
* Please be aware that this app mixes various services to retrieve song information and lyrics data. Since these services are not necessarily meant to work well with one another, finding metadata for a track does not automatically guarantee you will find the appropiate lyrics for it as well, if any lyrics at all. In particular, please try to avoid tracks that contain ambiguous artists, such as those beginning with 'Made famous by', 'Cover by' or 'Ft. (artist)', because the lyrics engine is not always equipped to discern the right artist in such situations.
* Because of the issue highlighted in the previous note, a feature to upload your own lyrics was in order. However, the point of the app is to showcase AJAX functionality, so this feature remains scrapped for now. It may be added in the future.
* In previous revisions, there used to be a "Comparison" feature, which was scrapped for the sake of simplicity and resource minimalism.

## For Developers
Developed using plain HTML, CSS and JavaScript. This app uses one or more APIs from the following services:

* Musixmatch: for track lookup and metadata.
* Lyrics.ovh: for lyrics.
* YouTube: for other track data and convenient video suggestions.

It is designed to be a prime example of proper third-party API usage. Lyrics Genius is free software, and you are encouraged to use it and its source code for your own purposes. See the license file for more information.

## About

Last version released 8/21/2018.

Developed by Luis Lau.
Email: theauthorgm@gmail.com

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, you can find it [here](https://www.gnu.org/licenses/>).
