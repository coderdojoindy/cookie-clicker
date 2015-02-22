/*
All this code is copyright Orteil, 2013-2014.
	-with some help, advice and fixes by Debugbro and Opti
	-also includes a bunch of snippets found on stackoverflow.com
Spoilers ahead.
http://orteil.dashnet.org
*/

/*=====================================================================================
MISC HELPER FUNCTIONS
=======================================================================================*/
function l(what) {return document.getElementById(what);}
function choose(arr) {return arr[Math.floor(Math.random()*arr.length)];}

function escapeRegExp(str){return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");}
function replaceAll(find,replace,str){return str.replace(new RegExp(escapeRegExp(find),'g'),replace);}

//disable sounds coming from soundjay.com (sorry)
realAudio=Audio;//backup real audio
Audio=function(src){
	if (src.indexOf('soundjay')>-1) {Game.Popup('Sorry, no sounds hotlinked from soundjay.com.');this.play=function(){};}
	else return new realAudio(src);
};

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) {return i;}
        }
        return -1;
    };
}

function randomFloor(x) {if ((x%1)<Math.random()) return Math.floor(x); else return Math.ceil(x);}

function shuffle(array)
{
	var counter = array.length, temp, index;
	// While there are elements in the array
	while (counter--)
	{
		// Pick a random index
		index = (Math.random() * counter) | 0;

		// And swap the last element with it
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}



//Beautify and number-formatting adapted from the Frozen Cookies add-on (http://cookieclicker.wikia.com/wiki/Frozen_Cookies_%28JavaScript_Add-on%29)
function formatEveryThirdPower(notations)
{
	return function (value)
	{
		var base = 0,
		notationValue = '';
		if (value >= 1000000 && isFinite(value))
		{
			value /= 1000;
			while(Math.round(value) >= 1000)
			{
				value /= 1000;
				base++;
			}
			if (base > notations.length) {return 'Infinity';} else {notationValue = notations[base];}
		}
		return ( Math.round(value * 1000) / 1000 ) + notationValue;
	};
}

function rawFormatter(value) {return Math.round(value * 1000) / 1000;}

var numberFormatters =
[
	rawFormatter,
	formatEveryThirdPower([
		'',
		' million',
		' billion',
		' trillion',
		' quadrillion',
		' quintillion',
		' sextillion',
		' septillion',
		' octillion',
		' nonillion',
		' decillion'
	]),
	formatEveryThirdPower([
		'',
		' M',
		' B',
		' T',
		' Qa',
		' Qi',
		' Sx',
		' Sp',
		' Oc',
		' No',
		' Dc'
	])
];

function Beautify(value,floats)
{
	var negative=(value<0);
	var decimal='';
	if (value<1000000 && floats>0) decimal='.'+(value.toFixed(floats).toString()).split('.')[1];
	value=Math.floor(Math.abs(value));
	var formatter=numberFormatters[Game.prefs.format?0:1];
	var output=formatter(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
	return negative?'-'+output:output+decimal;
}

beautifyInTextFilter=/(([\d]+[,]*)+)/g;//new regex
var a=/\d\d?\d?(?:,\d\d\d)*/g;//old regex
function BeautifyInTextFunction(str){return Beautify(parseInt(str.replace(/,/g,''),10));};
function BeautifyInText(str) {return str.replace(beautifyInTextFilter,BeautifyInTextFunction);}//reformat every number inside a string
function BeautifyAll()//run through upgrades and achievements to reformat the numbers
{
	var func=function(what){what.desc=BeautifyInText(what.baseDesc);}
	Game.UpgradesById.forEach(func);
	Game.AchievementsById.forEach(func);
}

function utf8_to_b64( str ) {
	try{return Base64.encode(unescape(encodeURIComponent( str )));}
	catch(err)
	{return '';}
}

function b64_to_utf8( str ) {
	try{return decodeURIComponent(escape(Base64.decode( str )));}
	catch(err)
	{return '';}
}


function CompressBin(arr)//compress a sequence like [0,1,1,0,1,0]... into a number like 54.
{
	var str='';
	var arr2=arr.slice(0);
	arr2.unshift(1);
	arr2.push(1);
	arr2.reverse();
	for (var i in arr2)
	{
		str+=arr2[i];
	}
	str=parseInt(str,2);
	return str;
}

function UncompressBin(num)//uncompress a number like 54 to a sequence like [0,1,1,0,1,0].
{
	var arr=num.toString(2);
	arr=arr.split('');
	arr.reverse();
	arr.shift();
	arr.pop();
	return arr;
}

function CompressLargeBin(arr)//we have to compress in smaller chunks to avoid getting into scientific notation
{
	var arr2=arr.slice(0);
	var thisBit=[];
	var bits=[];
	for (var i in arr2)
	{
		thisBit.push(arr2[i]);
		if (thisBit.length>=50)
		{
			bits.push(CompressBin(thisBit));
			thisBit=[];
		}
	}
	if (thisBit.length>0) bits.push(CompressBin(thisBit));
	arr2=bits.join(';');
	return arr2;
}

function UncompressLargeBin(arr)
{
	var arr2=arr.split(';');
	var bits=[];
	for (var i in arr2)
	{
		bits.push(UncompressBin(parseInt(arr2[i])));
	}
	arr2=[];
	for (var i in bits)
	{
		for (var ii in bits[i]) arr2.push(bits[i][ii]);
	}
	return arr2;
}

//seeded random function, courtesy of http://davidbau.com/archives/2010/01/30/random_seeds_coded_hints_and_quintillions.html
(function(a,b,c,d,e,f){function k(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[g=j&g+a[f%c]+(b=h[f])],h[g]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=j&f+1],c=c*d+h[j&(h[f]=h[g=j&g+b])+(h[g]=b)];return e.i=f,e.j=g,c})(d)}function l(a,b){var e,c=[],d=(typeof a)[0];if(b&&"o"==d)for(e in a)try{c.push(l(a[e],b-1))}catch(f){}return c.length?c:"s"==d?a:a+"\0"}function m(a,b){for(var d,c=a+"",e=0;c.length>e;)b[j&e]=j&(d^=19*b[j&e])+c.charCodeAt(e++);return o(b)}function n(c){try{return a.crypto.getRandomValues(c=new Uint8Array(d)),o(c)}catch(e){return[+new Date,a,a.navigator.plugins,a.screen,o(b)]}}function o(a){return String.fromCharCode.apply(0,a)}var g=c.pow(d,e),h=c.pow(2,f),i=2*h,j=d-1;c.seedrandom=function(a,f){var j=[],p=m(l(f?[a,o(b)]:0 in arguments?a:n(),3),j),q=new k(j);return m(o(q.S),b),c.random=function(){for(var a=q.g(e),b=g,c=0;h>a;)a=(a+c)*d,b*=d,c=q.g(1);for(;a>=i;)a/=2,b/=2,c>>>=1;return(a+c)/b},p},m(c.random(),b)})(this,[],Math,256,6,52);

function bind(scope,fn)
{
	//use : bind(this,function(){this.x++;}) - returns a function where "this" refers to the scoped this
	return function() {fn.apply(scope,arguments);};
}

CanvasRenderingContext2D.prototype.fillPattern=function(img,X,Y,W,H,iW,iH)
{
	//for when built-in patterns aren't enough
	if (img.alt!='blank')
	{
		for (var y=0;y<H;y+=iH){for (var x=0;x<W;x+=iW){this.drawImage(img,X+x,Y+y,iW,iH);}}
	}
}

OldCanvasDrawImage=CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage=function()
{
	//only draw the image if it's loaded
	if (arguments[0].alt!='blank') OldCanvasDrawImage.apply(this,arguments);
}


if (!document.hasFocus) document.hasFocus=function(){return document.hidden;};//for Opera

function AddEvent(html_element, event_name, event_function) 
{       
   if(html_element.attachEvent) //Internet Explorer
      html_element.attachEvent("on" + event_name, function() {event_function.call(html_element);}); 
   else if(html_element.addEventListener) //Firefox & company
      html_element.addEventListener(event_name, event_function, false); //don't need the 'call' trick because in FF everything already works in the right way          
}

function FireEvent(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

Loader=function()//asset-loading system
{
	this.loadingN=0;
	this.assetsN=0;
	this.assets=[];
	this.assetsLoading=[];
	this.assetsLoaded=[];
	this.domain='';
	this.loaded=0;//callback
	this.doneLoading=0;
	
	this.blank=document.createElement('canvas');
	this.blank.width=8;
	this.blank.height=8;
	this.blank.alt='blank';

	this.Load=function(assets)
	{
		for (var i in assets)
		{
			this.loadingN++;
			this.assetsN++;
			if (!this.assetsLoading[assets[i]] && !this.assetsLoaded[assets[i]])
			{
				var img=new Image();
				img.src=this.domain+assets[i];
				img.alt=assets[i];
				img.onload=bind(this,this.onLoad);
				this.assets[assets[i]]=img;
				this.assetsLoading.push(assets[i]);
			}
		}
	}
	this.Replace=function(old,newer)
	{
		if (this.assets[old])
		{
			var img=new Image();
			if (newer.indexOf('http')!=-1) img.src=newer;
			else img.src=this.domain+newer;
			img.alt=newer;
			img.onload=bind(this,this.onLoad);
			this.assets[old]=img;
		}
	}
	this.onLoadReplace=function()
	{
	}
	this.onLoad=function(e)
	{
		this.assetsLoaded.push(e.target.alt);
		this.assetsLoading.splice(this.assetsLoading.indexOf(e.target.alt),1);
		this.loadingN--;
		if (this.doneLoading==0 && this.loadingN<=0 && this.loaded!=0)
		{
			this.doneLoading=1;
			this.loaded();
		}
	}
	this.getProgress=function()
	{
		return (1-this.loadingN/this.assetsN);
	}
}

Pic=function(what)
{
	if (Game.Loader.assetsLoaded.indexOf(what)!=-1) return Game.Loader.assets[what];
	else if (Game.Loader.assetsLoading.indexOf(what)==-1) Game.Loader.Load([what]);
	return Game.Loader.blank;
}



var debugStr='';
Debug=function(what)
{
	if (!debugStr) debugStr=what;
	else debugStr+='; '+what;
}

/*=====================================================================================
GAME INITIALIZATION
=======================================================================================*/
Game={};

Game.Launch=function()
{
	Game.version=1.0466;
	Game.beta=0;
	if (window.location.href.indexOf('/beta')>-1) Game.beta=1;
	Game.mobile=0;
	Game.touchEvents=0;
	//if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) Game.mobile=1;
	if (Game.mobile) Game.touchEvents=1;
	
	Game.baseSeason='';//halloween, christmas, valentines, fools, easter
	//automatic season detection (might not be 100% accurate)
	var day=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/(1000*60*60*24));
	if (day>=41 && day<=46) Game.baseSeason='valentines';
	else if (day>=90 && day<=92) Game.baseSeason='fools';
	else if (day>=304-7 && day<=304) Game.baseSeason='halloween';
	else if (day>=349 && day<=365) Game.baseSeason='christmas';
	else
	{
		//easter is a pain goddamn
		var easterDay=function(Y){var C = Math.floor(Y/100);var N = Y - 19*Math.floor(Y/19);var K = Math.floor((C - 17)/25);var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;I = I - 30*Math.floor((I/30));I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);J = J - 7*Math.floor(J/7);var L = I - J;var M = 3 + Math.floor((L + 40)/44);var D = L + 28 - 31*Math.floor(M/4);return new Date(Y,M-1,D);}(new Date().getFullYear());
		easterDay=Math.floor((easterDay-new Date(easterDay.getFullYear(),0,0))/(1000*60*60*24));
		if (day>=easterDay-7 && day<=easterDay) Game.baseSeason='easter';
	}
	
	
	Game.updateLog=
	'<div class="section">Updates</div>'+
	'<div class="subsection">'+
	'<div class="title">Now working on :</div>'+
	'<div class="listing">-better prestige</div>'+
	'<div class="listing">-mobile version</div>'+
	'<div class="listing">-more customization options</div>'+
	
	'</div><div class="subsection">'+
	'<div class="title">What\'s next :</div>'+
	'<div class="listing">-more dungeon stuff!</div>'+
	'<div class="listing">-more buildings and upgrades!</div>'+
	'<div class="listing">-revamping the prestige system!</div>'+
	'<div class="listing">-mobile app!</div>'+
	'<div class="listing"><span class="warning">Note : if you find a new bug after an update and you\'re using a 3rd-party add-on, make sure it\'s not just your add-on causing it!</span></div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">30/10/2014 - a moveable feast</div>'+
	'<div class="listing">-just a quick patch for automatic season-checking; Halloween, Christmas and others should now trigger automatically</div>'+
	'<div class="listing">-still working on prestige update!</div>'+
	'<div class="listing">-we\'ve been working with Artix on a dragon-themed mobile idle game, <a href="http://aqdragons.com/" target="_blank">AdventureQuest Dragons</a>! Stay tuned!</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">18/05/2014 - better late than easter</div>'+
	'<div class="listing">-bunnies and eggs, somehow</div>'+
	'<div class="listing">-prompts now have keyboard shortcuts like system prompts would</div>'+
	'<div class="listing">-naming your bakery? you betcha</div>'+
	'<div class="listing">-"Fast notes" option to make all notifications close faster; new button to close all notifications</div>'+
	'<div class="listing">-the dungeons beta is now available on <a href="http://orteil.dashnet.org/cookieclicker/betadungeons" target="_blank">/betadungeons</a></div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">09/04/2014 - nightmare in heaven</div>'+
	'<div class="listing">-broke a thing; heavenly chips were corrupted for some people</div>'+
	'<div class="listing">-will probably update to /beta first in the future</div>'+
	'<div class="listing">-sorry again</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">09/04/2014 - quality of life</div>'+
	'<div class="listing">-new upgrade and achievement tier</div>'+
	'<div class="listing">-popups and prompts are much nicer</div>'+
	'<div class="listing">-tooltips on buildings are more informative</div>'+
	'<div class="listing">-implemented a simplified version of the <a href="https://github.com/Icehawk78/FrozenCookies" target="_blank">Frozen Cookies</a> add-on\'s short number formatting</div>'+
	'<div class="listing">-you can now buy 10 and sell all of a building at a time</div>'+
	'<div class="listing">-tons of optimizations and subtler changes</div>'+
	'<div class="listing">-you can now <a href="http://orteil.dashnet.org/cookies2cash/" target="_blank">convert your cookies to cash</a>!</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">05/04/2014 - pity the fool</div>'+
	'<div class="listing">-wrinklers should now be saved so you don\'t have to pop them everytime you refresh the game</div>'+
	'<div class="listing">-you now properly win 1 cookie upon reaching 10 billion cookies and making it on the local news</div>'+
	'<div class="listing">-miscellaneous fixes and tiny additions</div>'+
	'<div class="listing">-added a few very rudimentary mod hooks</div>'+
	'<div class="listing">-the game should work again in Opera</div>'+
	'<div class="listing">-don\'t forget to check out <a href="http://orteil.dashnet.org/randomgen/" target="_blank">RandomGen</a>, our all-purpose random generator maker!</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">01/04/2014 - fooling around</div>'+
	'<div class="listing">-it\'s about time : Cookie Clicker has turned into the much more realistic Cookie Baker</div>'+
	'<div class="listing">-season triggers are cheaper and properly unlock again when they run out</div>'+
	'<div class="listing">-buildings should properly unlock (reminder : building unlocking is completely cosmetic and does not change the gameplay)</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">14/02/2014 - lovely rainbowcalypse</div>'+
	'<div class="listing">-new building (it\'s been a while). More to come!</div>'+
	'<div class="listing">-you can now trigger seasonal events to your heart\'s content (upgrade unlocks at 5000 heavenly chips)</div>'+
	'<div class="listing">-new ultra-expensive batch of seasonal cookie upgrades you\'ll love to hate</div>'+
	'<div class="listing">-new timer bars for golden cookie buffs</div>'+
	'<div class="listing">-buildings are now hidden when you start out and appear as they become available</div>'+
	'<div class="listing">-technical stuff : the game is now saved through localstorage instead of browser cookies, therefore ruining a perfectly good pun</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">22/12/2013 - merry fixmas</div>'+
	'<div class="listing">-some issues with the christmas upgrades have been fixed</div>'+
	'<div class="listing">-reindeer cookie drops are now more common</div>'+
	'<div class="listing">-reindeers are now reindeer</div>'+
	
	'</div><div class="subsection update">'+
	'<div class="title">20/12/2013 - Christmas is here</div>'+
	'<div class="listing">-there is now a festive new evolving upgrade in store</div>'+
	'<div class="listing">-reindeer are running amok (catch them if you can!)</div>'+
	'<div class="listing">-added a new option to warn you when you close the window, so you don\'t lose your un-popped wrinklers</div>'+
	'<div class="listing">-also added a separate option for displaying cursors</div>'+
	'<div class="listing">-all the Halloween features are still there (and having the Spooky cookies achievements makes the Halloween cookies drop much more often)</div>'+
	'<div class="listing">-oh yeah, we now have <a href="http://www.redbubble.com/people/dashnet" target="_blank">Cookie Clicker shirts, stickers and hoodies</a>! (they\'re really rad)</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">29/10/2013 - spooky update</div>'+
	'<div class="listing">-the Grandmapocalypse now spawns wrinklers, hideous elderly creatures that damage your CpS when they reach your big cookie. Thankfully, you can click on them to make them explode (you\'ll even gain back the cookies they\'ve swallowed - with interest!).</div>'+
	'<div class="listing">-wrath cookie now 27% spookier</div>'+
	'<div class="listing">-some other stuff</div>'+
	'<div class="listing">-you should totally go check out <a href="http://candybox2.net/" target="_blank">Candy Box 2</a>, the sequel to the game that inspired Cookie Clicker</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">15/10/2013 - it\'s a secret</div>'+
	'<div class="listing">-added a new heavenly upgrade that gives you 5% of your heavenly chips power for 11 cookies (if you purchased the Heavenly key, you might need to buy it again, sorry)</div>'+
	'<div class="listing">-golden cookie chains should now work properly</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">15/10/2013 - player-friendly</div>'+
	'<div class="listing">-heavenly upgrades are now way, way cheaper</div>'+
	'<div class="listing">-tier 5 building upgrades are 5 times cheaper</div>'+
	'<div class="listing">-cursors now just plain disappear with Fancy Graphics off, I might add a proper option to toggle only the cursors later</div>'+
	'<div class="listing">-warning : the Cookie Monster add-on seems to be buggy with this update, you might want to wait until its programmer updates it</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">15/10/2013 - a couple fixes</div>'+
	'<div class="listing">-golden cookies should no longer spawn embarrassingly often</div>'+
	'<div class="listing">-cursors now stop moving if Fancy Graphics is turned off</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">14/10/2013 - going for the gold</div>'+
	'<div class="listing">-golden cookie chains work a bit differently</div>'+
	'<div class="listing">-golden cookie spawns are more random</div>'+
	'<div class="listing">-CpS achievements are no longer affected by golden cookie frenzies</div>'+
	'<div class="listing">-revised cookie-baking achievement requirements</div>'+
	'<div class="listing">-heavenly chips now require upgrades to function at full capacity</div>'+
	'<div class="listing">-added 4 more cookie upgrades, unlocked after reaching certain amounts of Heavenly Chips</div>'+
	'<div class="listing">-speed baking achievements now require you to have no heavenly upgrades; as such, they have been reset for everyone (along with the Hardcore achievement) to better match their initially intended difficulty</div>'+
	'<div class="listing">-made good progress on the mobile port</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">01/10/2013 - smoothing it out</div>'+
	'<div class="listing">-some visual effects have been completely rewritten and should now run more smoothly (and be less CPU-intensive)</div>'+
	'<div class="listing">-new upgrade tier</div>'+
	'<div class="listing">-new milk tier</div>'+
	'<div class="listing">-cookie chains have different capping mechanics</div>'+
	'<div class="listing">-antimatter condensers are back to their previous price</div>'+
	'<div class="listing">-heavenly chips now give +2% CpS again (they will be extensively reworked in the future)</div>'+
	'<div class="listing">-farms have been buffed a bit (to popular demand)</div>'+
	'<div class="listing">-dungeons still need a bit more work and will be released soon - we want them to be just right! (you can test an unfinished version in <a href="beta" target="_blank">the beta</a>)</div>'+
	
	'</div><div class="subsection update">'+
	'<div class="title">28/09/2013 - dungeon beta</div>'+
	'<div class="listing">-from now on, big updates will come through a beta stage first (you can <a href="beta" target="_blank">try it here</a>)</div>'+
	'<div class="listing">-first dungeons! (you need 50 factories to unlock them!)</div>'+
	'<div class="listing">-cookie chains can be longer</div>'+
	'<div class="listing">-antimatter condensers are a bit more expensive</div>'+
	'<div class="listing">-heavenly chips now only give +1% cps each (to account for all the cookies made from condensers)</div>'+
	'<div class="listing">-added flavor text on all upgrades</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">15/09/2013 - anticookies</div>'+
	'<div class="listing">-ran out of regular matter to make your cookies? Try our new antimatter condensers!</div>'+
	'<div class="listing">-renamed Hard-reset to "Wipe save" to avoid confusion</div>'+
	'<div class="listing">-reset achievements are now regular achievements and require cookies baked all time, not cookies in bank</div>'+
	'<div class="listing">-heavenly chips have been nerfed a bit (and are now awarded following a geometric progression : 1 trillion for the first, 2 for the second, etc); the prestige system will be extensively reworked in a future update (after dungeons)</div>'+
	'<div class="listing">-golden cookie clicks are no longer reset by soft-resets</div>'+
	'<div class="listing">-you can now see how long you\'ve been playing in the stats</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">08/09/2013 - everlasting cookies</div>'+
	'<div class="listing">-added a prestige system - resetting gives you permanent CpS boosts (the more cookies made before resetting, the bigger the boost!)</div>'+
	'<div class="listing">-save format has been slightly modified to take less space</div>'+
	'<div class="listing">-Leprechaun has been bumped to 777 golden cookies clicked and is now shadow; Fortune is the new 77 golden cookies achievement</div>'+
	'<div class="listing">-clicking frenzy is now x777</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">04/09/2013 - smarter cookie</div>'+
	'<div class="listing">-golden cookies only have 20% chance of giving the same outcome twice in a row now</div>'+
	'<div class="listing">-added a golden cookie upgrade</div>'+
	'<div class="listing">-added an upgrade that makes pledges last twice as long (requires having pledged 10 times)</div>'+
	'<div class="listing">-Quintillion fingers is now twice as efficient</div>'+
	'<div class="listing">-Uncanny clicker was really too unpredictable; it is now a regular achievement and no longer requires a world record, just *pretty fast* clicking</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">02/09/2013 - a better way out</div>'+
	'<div class="listing">-Elder Covenant is even cheaper, and revoking it is cheaper still (also added a new achievement for getting it)</div>'+
	'<div class="listing">-each grandma upgrade now requires 15 of the matching building</div>'+
	'<div class="listing">-the dreaded bottom cursor has been fixed with a new cursor display style</div>'+
	'<div class="listing">-added an option for faster, cheaper graphics</div>'+
	'<div class="listing">-base64 encoding has been redone; this might make saving possible again on some older browsers</div>'+
	'<div class="listing">-shadow achievements now have their own section</div>'+
	'<div class="listing">-raspberry juice is now named raspberry milk, despite raspberry juice being delicious and going unquestionably well with cookies</div>'+
	'<div class="listing">-HOTFIX : cursors now click; fancy graphics button renamed; cookies amount now more visible against cursors</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">01/09/2013 - sorting things out</div>'+
	'<div class="listing">-upgrades and achievements are properly sorted in the stats screen</div>'+
	'<div class="listing">-made Elder Covenant much cheaper and less harmful</div>'+
	'<div class="listing">-importing from the first version has been disabled, as promised</div>'+
	'<div class="listing">-"One mind" now actually asks you to confirm the upgrade</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">31/08/2013 - hotfixes</div>'+
	'<div class="listing">-added a way to permanently stop the grandmapocalypse</div>'+
	'<div class="listing">-Elder Pledge price is now capped</div>'+
	'<div class="listing">-One Mind and other grandma research upgrades are now a little more powerful, if not 100% accurate</div>'+
	'<div class="listing">-"golden" cookie now appears again during grandmapocalypse; Elder Pledge-related achievements are now unlockable</div>'+
	
	'</div><div class="subsection update">'+
	'<div class="title">31/08/2013 - too many grandmas</div>'+
	'<div class="listing">-the grandmapocalypse is back, along with more grandma types</div>'+
	'<div class="listing">-added some upgrades that boost your clicking power and make it scale with your cps</div>'+
	'<div class="listing">-clicking achievements made harder; Neverclick is now a shadow achievement; Uncanny clicker should now truly be a world record</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">28/08/2013 - over-achiever</div>'+
	'<div class="listing">-added a few more achievements</div>'+
	'<div class="listing">-reworked the "Bake X cookies" achievements so they take longer to achieve</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">27/08/2013 - a bad idea</div>'+
	'<div class="listing">-due to popular demand, retired 5 achievements (the "reset your game" and "cheat" ones); they can still be unlocked, but do not count toward your total anymore. Don\'t worry, there will be many more achievements soon!</div>'+
	'<div class="listing">-made some achievements hidden for added mystery</div>'+
	
	'</div><div class="subsection update">'+
	'<div class="title">27/08/2013 - a sense of achievement</div>'+
	'<div class="listing">-added achievements (and milk)</div>'+
	'<div class="listing"><i>(this is a big update, please don\'t get too mad if you lose some data!)</i></div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">26/08/2013 - new upgrade tier</div>'+
	'<div class="listing">-added some more upgrades (including a couple golden cookie-related ones)</div>'+
	'<div class="listing">-added clicking stats</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">26/08/2013 - more tweaks</div>'+
	'<div class="listing">-tweaked a couple cursor upgrades</div>'+
	'<div class="listing">-made time machines less powerful</div>'+
	'<div class="listing">-added offline mode option</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">25/08/2013 - tweaks</div>'+
	'<div class="listing">-rebalanced progression curve (mid- and end-game objects cost more and give more)</div>'+
	'<div class="listing">-added some more cookie upgrades</div>'+
	'<div class="listing">-added CpS for cursors</div>'+
	'<div class="listing">-added sell button</div>'+
	'<div class="listing">-made golden cookie more useful</div>'+
	
	'</div><div class="subsection update small">'+
	'<div class="title">24/08/2013 - hotfixes</div>'+
	'<div class="listing">-added import/export feature, which also allows you to retrieve a save game from the old version (will be disabled in a week to prevent too much cheating)</div>'+
	'<div class="listing">-upgrade store now has unlimited slots (just hover over it), due to popular demand</div>'+
	'<div class="listing">-added update log</div>'+
	
	'</div><div class="subsection update">'+
	'<div class="title">24/08/2013 - big update!</div>'+
	'<div class="listing">-revamped the whole game (new graphics, new game mechanics)</div>'+
	'<div class="listing">-added upgrades</div>'+
	'<div class="listing">-much safer saving</div>'+
	
	'</div><div class="subsection update">'+
	'<div class="title">08/08/2013 - game launch</div>'+
	'<div class="listing">-made the game in a couple hours, for laughs</div>'+
	'<div class="listing">-kinda starting to regret it</div>'+
	'<div class="listing">-ah well</div>'+
	'</div>'
	;
	
	Game.ready=0;
	
	Game.Load=function()
	{
		l('javascriptError').innerHTML='<div style="padding:64px 128px;"><div class="title">Loading...</div></div>';
		
		Game.Loader=new Loader();
		Game.Loader.domain='img/';
		Game.Loader.loaded=Game.Init;
		Game.Loader.Load(['filler.png']);
	}
	Game.ErrorFrame=function()
	{
		l('javascriptError').innerHTML=
		'<div class="title">Oops. Wrong address!</div>'+
		'<div>It looks like you\'re accessing Cookie Clicker from another URL than the official one.<br>'+
		'You can <a href="http://orteil.dashnet.org/cookieclicker/" target="_blank">play Cookie Clicker over here</a>!<br>'+
		'<small>(If for any reasons, you are unable to access the game on the official URL, we are currently working on a second domain.)</small></div>';
	}
	
	
	Game.Init=function()
	{
		Game.ready=1;

		/*=====================================================================================
		VARIABLES AND PRESETS
		=======================================================================================*/
		Game.T=0;
		Game.drawT=0;
		Game.fps=30;
		
		Game.season=Game.baseSeason;
		
		Game.l=l('game');

		if (Game.mobile==1)
		{
			l('wrapper').className='mobile';
		}
		Game.clickStr=Game.touchEvents?'ontouchend':'onclick';
		
		Game.SaveTo='CookieClickerGame';
		if (Game.beta) Game.SaveTo='CookieClickerGameBeta';
		l('versionNumber').innerHTML='v.'+Game.version+(Game.beta?' <span style="color:#ff0;">beta</span>':'');
		l('links').innerHTML=(Game.beta?'<a href="../" target="blank">Live version</a> | ':'<a href="beta" target="blank">Try the beta!</a> | ')+'<a href="http://orteil.dashnet.org/experiments/cookie/" target="blank">Classic</a>';
		//l('links').innerHTML='<a href="http://orteil.dashnet.org/experiments/cookie/" target="blank">Cookie Clicker Classic</a>';
		
		//latency compensator stuff
		Game.time=new Date().getTime();
		Game.fpsMeasure=new Date().getTime();
		Game.accumulatedDelay=0;
		Game.catchupLogic=0;
		
		Game.cookiesEarned=0;//all cookies earned during gameplay
		Game.cookies=0;//cookies
		Game.cookiesd=0;//cookies display
		Game.cookiesPs=1;//cookies per second (to recalculate with every new purchase)
		Game.cookiesReset=0;//cookies lost to resetting
		Game.frenzy=0;//as long as >0, cookie production is multiplied by frenzyPower
		Game.frenzyMax=0;//how high was our initial burst
		Game.frenzyPower=1;
		Game.clickFrenzy=0;//as long as >0, mouse clicks get 777x more cookies
		Game.clickFrenzyMax=0;//how high was our initial burst
		Game.cookieClicks=0;//+1 for each click on the cookie
		Game.goldenClicks=0;//+1 for each golden cookie clicked (all time)
		Game.goldenClicksLocal=0;//+1 for each golden cookie clicked (this game only)
		Game.missedGoldenClicks=0;//+1 for each golden cookie missed
		Game.handmadeCookies=0;//all the cookies made from clicking the cookie
		Game.milkProgress=0;//you gain a little bit for each achievement. Each increment of 1 is a different milk displayed.
		Game.milkH=Game.milkProgress/2;//milk height, between 0 and 1 (although should never go above 0.5)
		Game.milkHd=0;//milk height display
		Game.milkType=-1;//custom milk : 0=plain, 1=chocolate...
		Game.backgroundType=-1;//custom background : 0=blue, 1=red...
		Game.prestige=[];//cool stuff that carries over beyond resets
		Game.resets=0;//reset counter
		
		Game.elderWrath=0;
		Game.elderWrathOld=0;
		Game.elderWrathD=0;
		Game.pledges=0;
		Game.pledgeT=0;
		Game.researchT=0;
		Game.nextResearch=0;
		Game.cookiesSucked=0;//cookies sucked by wrinklers
		Game.cpsSucked=0;//percent of CpS being sucked by wrinklers
		Game.wrinklersPopped=0;
		Game.santaLevel=0;
		Game.reindeerClicked=0;
		Game.seasonT=0;
		Game.seasonUses=0;
		
		Game.bg='';//background (grandmas and such)
		Game.bgFade='';//fading to background
		Game.bgR=0;//ratio (0 - not faded, 1 - fully faded)
		Game.bgRd=0;//ratio displayed
		
		Game.windowW=window.innerWidth;
		Game.windowH=window.innerHeight;
		
		window.addEventListener('resize',function(event)
		{
			Game.windowW=window.innerWidth;
			Game.windowH=window.innerHeight;
		});
		
		Game.startDate=parseInt(new Date().getTime());//when we started playing
		Game.fullDate=parseInt(new Date().getTime());//when we started playing (carries over with resets)
		Game.lastDate=parseInt(new Date().getTime());//when we last saved the game (used to compute "cookies made since we closed the game" etc)
		
		var timers=['frenzy','elderFrenzy','clot','clickFrenzy'];
		var str='';
		for (var i in timers)
		{
			str+='<div id="timer-'+timers[i]+'"></div>';
		}
		l('timers').innerHTML=str;
		Game.timersEl=[];
		for (var i in timers)
		{
			Game.timersEl[timers[i]]=l('timer-'+timers[i]);
		}
		
		Game.prefs=[];
		Game.DefaultPrefs=function()
		{
			Game.prefs.particles=1;//particle effects : falling cookies etc
			Game.prefs.numbers=1;//numbers that pop up when clicking the cookie
			Game.prefs.autosave=1;//save the game every minute or so
			Game.prefs.autoupdate=1;//send an AJAX request to the server every 30 minutes (crashes the game when playing offline)
			Game.prefs.milk=1;//display milk
			Game.prefs.fancy=1;//CSS shadow effects (might be heavy on some browsers)
			Game.prefs.warn=0;//warn before closing the window
			Game.prefs.cursors=1;//display cursors
			Game.prefs.focus=1;//make the game refresh less frequently when off-focus
			Game.prefs.popups=0;//use old-style popups
			Game.prefs.format=0;//shorten numbers
			Game.prefs.notifs=0;//notifications fade faster
			Game.prefs.animate=1;//animate buildings
		}
		Game.DefaultPrefs();
		
		window.onbeforeunload=function(event)
		{
			if (Game.prefs.warn)
			{
				if (typeof event=='undefined') event=window.event;
				if (event) event.returnValue='Are you sure you want to close Cookie Clicker?';
			}
		}
		
		Game.Mobile=function()
		{
			if (!Game.mobile)
			{
				l('wrapper').className='mobile';
				Game.mobile=1;
			}
			else
			{
				l('wrapper').className='';
				Game.mobile=0;
			}
		}
		
		
		/*=====================================================================================
		MOD HOOKS (will be subject to change, probably shouldn't be used yet)
		=======================================================================================*/
		//really primitive custom mods support - might not be of any use at all (could theoretically be used for custom upgrades and achievements I guess?)
		Game.customChecks=[];//push functions into this to add them to the "check for upgrade/achievement conditions" that happens every few seconds
		Game.customInit=[];//add to the initialization call
		Game.customLogic=[];//add to the logic calls
		Game.customDraw=[];//add to the draw calls
		Game.customSave=[];//add to the save write calls (save to your own localstorage key)
		Game.customLoad=[];//add to the save load calls
		Game.customReset=[];//add to the reset calls
		Game.customTickers=[];//add to the random tickers (functions should return arrays of text)
		Game.customCps=[];//add to the CpS computation (functions should return something to add to the multiplier ie. 0.1 for an addition of 10 to the CpS multiplier)
		Game.customCpsMult=[];//add to the CpS multiplicative computation (functions should return something to multiply by the multiplier ie. 1.05 for a 5% increase of the multiplier)
		Game.customMouseCps=[];//add to the cookies earned per click computation (functions should return something to add to the multiplier ie. 0.1 for an addition of 10 to the CpS multiplier)
		Game.customMouseCpsMult=[];//add to the cookies earned per click multiplicative computation (functions should return something to multiply by the multiplier ie. 1.05 for a 5% increase of the multiplier)
		Game.customCookieClicks=[];//add to the cookie click calls
		Game.customCreate=[];//create your new upgrades and achievements in there

		Game.LoadMod=function(url)//this loads the mod at the given URL and gives the script an automatic id (URL "http://example.com/my_mod.js" gives the id "modscript_my_mod")
		{
			var js=document.createElement('script');
			var id=url.split('/');id=id[id.length-1].split('.')[0];
			js.setAttribute('type','text/javascript');
			js.setAttribute('id','modscript_'+id);
			js.setAttribute('src',url);
			document.head.appendChild(js);
			console.log('Loaded the mod '+url+', '+id+'.');
		}
		
		//replacing an existing canvas picture with a new one at runtime : Game.Loader.Replace('perfectCookie.png','imperfectCookie.png');
		//upgrades and achievements can use other pictures than icons.png; declare their icon with [posX,posY,'http://example.com/myIcons.png']
		//check out the "UNLOCKING STUFF" section to see how unlocking achievs and upgrades is done (queue yours in Game.customChecks)
		//if you're making a mod, don't forget to add a Game.Win('Third-party') somewhere in there!
		
		//IMPORTANT : all of the above is susceptible to heavy change, proper modding API in the works
		
		
		
		
		/*=====================================================================================
		BAKERY NAME
		=======================================================================================*/
		Game.RandomBakeryName=function()
		{
			return (Math.random()>0.05?(choose(['Magic','Fantastic','Fancy','Sassy','Snazzy','Pretty','Cute','Pirate','Ninja','Zombie','Robot','Radical','Urban','Cool','Hella','Sweet','Awful','Double','Triple','Turbo','Techno','Disco','Electro','Dancing','Wonder','Mutant','Space','Science','Medieval','Future','Captain','Bearded','Lovely','Tiny','Big','Fire','Water','Frozen','Metal','Plastic','Solid','Liquid','Moldy','Shiny','Happy','Slimy','Tasty','Delicious','Hungry','Greedy','Lethal','Professor','Doctor','Power','Chocolate','Crumbly','Choklit','Righteous','Glorious','Mnemonic','Psychic','Frenetic','Hectic','Crazy','Royal','El','Von'])+' '):'Mc')+choose(['Cookie','Biscuit','Muffin','Scone','Cupcake','Pancake','Chip','Sprocket','Gizmo','Puppet','Mitten','Sock','Teapot','Mystery','Baker','Cook','Grandma','Click','Clicker','Spaceship','Factory','Portal','Machine','Experiment','Monster','Panic','Burglar','Bandit','Booty','Potato','Pizza','Burger','Sausage','Meatball','Spaghetti','Macaroni','Kitten','Puppy','Giraffe','Zebra','Parrot','Dolphin','Duckling','Sloth','Turtle','Goblin','Pixie','Gnome','Computer','Pirate','Ninja','Zombie','Robot']);
		}
		Game.GetBakeryName=function() {return Game.RandomBakeryName();}
		Game.bakeryName=Game.GetBakeryName();
		Game.bakeryNameL=l('bakeryName');
		Game.bakeryNameL.innerHTML=Game.bakeryName+'\'s bakery';
		Game.bakeryNameSet=function(what)
		{
			Game.bakeryName=what.replace(/\W+/g,' ');
			Game.bakeryName=Game.bakeryName.substring(0,28);
			Game.bakeryNameRefresh();
		}
		Game.bakeryNameRefresh=function()
		{
			Game.bakeryNameL.innerHTML=Game.bakeryName+'\'s bakery';
		}
		Game.bakeryNamePrompt=function()
		{
			Game.Prompt('<h3>Name your bakery</h3><div class="block" style="text-align:center;">What should your bakery\'s name be?</div><div class="block"><input type="text" style="text-align:center;width:100%;" id="bakeryNameInput" value="'+Game.bakeryName+'"/></div>',[['Confirm','if (l(\'bakeryNameInput\').value.length>0) {Game.bakeryNameSet(l(\'bakeryNameInput\').value);Game.Win(\'What\\\'s in a name\');Game.ClosePrompt();}'],['Random','Game.bakeryNamePromptRandom();'],'Cancel']);
			l('bakeryNameInput').focus();
		}
		Game.bakeryNamePromptRandom=function()
		{
			l('bakeryNameInput').value=Game.RandomBakeryName();
		}
		AddEvent(Game.bakeryNameL,'click',Game.bakeryNamePrompt);
		
		/*=====================================================================================
		UPDATE CHECKER
		=======================================================================================*/
		Game.CheckUpdates=function()
		{
			ajax('server.php?q=checkupdate',Game.CheckUpdatesResponse);
		}
		Game.CheckUpdatesResponse=function(response)
		{
			var r=response.split('|');
			var str='';
			if (r[0]=='alert')
			{
				if (r[1]) str=r[1];
			}
			else if (parseFloat(r[0])>Game.version)
			{
				str='<b>New version available : v.'+r[0]+'!</b>';
				if (r[1]) str+='<br><small>Update note : "'+r[1]+'"</small>';
				str+='<br><b>Refresh to get it!</b>';
			}
			if (str!='')
			{
				l('alert').innerHTML=str;
				l('alert').style.display='block';
			}
		}
		
		Game.useLocalStorage=1;
		//window.localStorage.clear();//won't switch back to cookie-based if there is localStorage info
		
		/*=====================================================================================
		SAVE
		=======================================================================================*/
		Game.ExportSave=function()
		{
			Game.Prompt('<h3>Export save</h3><div class="block">This is your save code.<br>Copy it and keep it somewhere safe!</div><div class="block"><textarea id="textareaPrompt" style="width:100%;height:128px;" readonly>'+Game.WriteSave(1)+'</textarea></div>',['All done!']);//prompt('Copy this text and keep it somewhere safe!',Game.WriteSave(1));
			l('textareaPrompt').focus();l('textareaPrompt').select();
		}
		Game.ImportSave=function()
		{
			Game.Prompt('<h3>Import save</h3><div class="block">Please paste in the code that was given to you on save export.</div><div class="block"><textarea id="textareaPrompt" style="width:100%;height:128px;"></textarea></div>',[['Load','if (l(\'textareaPrompt\').value.length>0) {Game.ImportSaveCode(l(\'textareaPrompt\').value);Game.ClosePrompt();}'],'Nevermind']);//prompt('Please paste in the text that was given to you on save export.','');
			l('textareaPrompt').focus();
		}
		Game.ImportSaveCode=function(save)
		{
			if (save && save!='') Game.LoadSave(save);
		}
		
		Game.WriteSave=function(exporting)
		{
			Game.lastDate=parseInt(new Date().getTime());
			var str='';
			str+=Game.version+'|';
			str+='|';//just in case we need some more stuff here
			str+=//save stats
			parseInt(Game.startDate)+';'+
			parseInt(Game.fullDate)+';'+
			parseInt(Game.lastDate)+';'+
			(Game.bakeryName)+
			'|';
			str+=//prefs
			(Game.prefs.particles?'1':'0')+
			(Game.prefs.numbers?'1':'0')+
			(Game.prefs.autosave?'1':'0')+
			(Game.prefs.autoupdate?'1':'0')+
			(Game.prefs.milk?'1':'0')+
			(Game.prefs.fancy?'1':'0')+
			(Game.prefs.warn?'1':'0')+
			(Game.prefs.cursors?'1':'0')+
			(Game.prefs.focus?'1':'0')+
			(Game.prefs.format?'1':'0')+
			(Game.prefs.notifs?'1':'0')+
			'|';
			str+=parseFloat(Game.cookies).toString()+';'+
			parseFloat(Game.cookiesEarned).toString()+';'+
			parseInt(Math.floor(Game.cookieClicks))+';'+
			parseInt(Math.floor(Game.goldenClicks))+';'+
			parseFloat(Game.handmadeCookies).toString()+';'+
			parseInt(Math.floor(Game.missedGoldenClicks))+';'+
			parseInt(Math.floor(Game.backgroundType))+';'+
			parseInt(Math.floor(Game.milkType))+';'+
			parseFloat(Game.cookiesReset).toString()+';'+
			parseInt(Math.floor(Game.elderWrath))+';'+
			parseInt(Math.floor(Game.pledges))+';'+
			parseInt(Math.floor(Game.pledgeT))+';'+
			parseInt(Math.floor(Game.nextResearch))+';'+
			parseInt(Math.floor(Game.researchT))+';'+
			parseInt(Math.floor(Game.resets))+';'+
			parseInt(Math.floor(Game.goldenClicksLocal))+';'+
			parseFloat(Game.cookiesSucked).toString()+';'+
			parseInt(Math.floor(Game.wrinklersPopped))+';'+
			parseInt(Math.floor(Game.santaLevel))+';'+
			parseInt(Math.floor(Game.reindeerClicked))+';'+
			parseInt(Math.floor(Game.seasonT))+';'+
			parseInt(Math.floor(Game.seasonUses))+';'+
			(Game.season)+';';
			var wrinklers=Game.SaveWrinklers();
			str+=
			parseFloat(Math.floor(wrinklers.amount))+';'+
			parseInt(Math.floor(wrinklers.number))+';'+
			'|';//cookies
			for (var i in Game.Objects)//buildings
			{
				var me=Game.Objects[i];
				if (me.vanilla) str+=me.amount+','+me.bought+','+Math.floor(me.totalCookies)+','+(me.specialUnlocked?1:0)+';';
			}
			str+='|';
			var toCompress=[];
			for (var i in Game.Upgrades)//upgrades
			{
				var me=Game.Upgrades[i];
				if (me.vanilla) toCompress.push(Math.min(me.unlocked,1),Math.min(me.bought,1));
			}
			toCompress=CompressLargeBin(toCompress);
			str+=toCompress;
			str+='|';
			var toCompress=[];
			for (var i in Game.Achievements)//achievements
			{
				var me=Game.Achievements[i];
				if (me.vanilla) toCompress.push(Math.min(me.won));
			}
			toCompress=CompressLargeBin(toCompress);
			str+=toCompress;
			
			for (var i in Game.customSave) {Game.customSave[i]();}
			
			if (exporting)
			{
				str=escape(utf8_to_b64(str)+'!END!');
				return str;
			}
			else
			{
				if (Game.useLocalStorage)
				{
					//so we used to save the game using browser cookies, which was just really neat considering the game's name
					//we're using localstorage now, which is more efficient but not as cool
					//a moment of silence for our fallen puns
					str=utf8_to_b64(str)+'!END!';
					str=escape(str);
					window.localStorage.setItem(Game.SaveTo,str);//aaand save
					if (!window.localStorage.getItem(Game.SaveTo))
					{
						if (Game.prefs.popups) Game.Popup('Error while saving.<br>Export your save instead!');
						else Game.Notify('Error while saving','Export your save instead!');
					}
					else if (document.hasFocus())
					{
						if (Game.prefs.popups) Game.Popup('Game saved');
						else Game.Notify('Game saved','','',1);
					}
				}
				else//legacy system
				{
					//that's right
					//we're using cookies
					//yeah I went there
					var now=new Date();//we storin dis for 5 years, people
					now.setFullYear(now.getFullYear()+5);//mmh stale cookies
					str=utf8_to_b64(str)+'!END!';
					Game.saveData=escape(str);
					str=Game.SaveTo+'='+escape(str)+'; expires='+now.toUTCString()+';';
					document.cookie=str;//aaand save
					if (document.cookie.indexOf(Game.SaveTo)<0)
					{
						if (Game.prefs.popups) Game.Popup('Error while saving.<br>Export your save instead!');
						else Game.Notify('Error while saving','Export your save instead!');
					}
					else if (document.hasFocus())
					{
						if (Game.prefs.popups) Game.Popup('Game saved');
						else Game.Notify('Game saved','','',1);
					}
				}
			}
		}
		
		/*=====================================================================================
		LOAD
		=======================================================================================*/
		Game.LoadSave=function(data)
		{
			var str='';
			if (data) str=unescape(data);
			else
			{
				if (Game.useLocalStorage)
				{
					var localStorage=window.localStorage.getItem(Game.SaveTo);
					if (!localStorage)//no localstorage save found? let's get the cookie one last time
					{
						if (document.cookie.indexOf(Game.SaveTo)>=0) str=unescape(document.cookie.split(Game.SaveTo+'=')[1]);
					}
					else
					{
						str=unescape(localStorage);
					}
				}
				else//legacy system
				{
					if (document.cookie.indexOf(Game.SaveTo)>=0) str=unescape(document.cookie.split(Game.SaveTo+'=')[1]);//get cookie here
				}
			}
			
			if (str!='')
			{
				var version=0;
				var oldstr=str.split('|');
				if (oldstr[0]<1) {}
				else
				{
					str=str.split('!END!')[0];
					str=b64_to_utf8(str);
				}
				if (str!='')
				{
					var spl='';
					str=str.split('|');
					version=parseFloat(str[0]);
					if (isNaN(version) || str.length<5)
					{
						if (Game.prefs.popups) Game.Popup('Oops, looks like the import string is all wrong!');
						else Game.Notify('Error importing save','Oops, looks like the import string is all wrong!','',6);
						return 0;
					}
					if (version>=1 && version>Game.version)
					{
						if (Game.prefs.popups) Game.Popup('Error : you are attempting to load a save from a future version (v.'+version+'; you are using v.'+Game.version+').');
						else Game.Notify('Error importing save','You are attempting to load a save from a future version (v.'+version+'; you are using v.'+Game.version+').','',6);
						return 0;
					}
					else if (version>=1)
					{
						spl=str[2].split(';');//save stats
						Game.startDate=parseInt(spl[0]);
						Game.fullDate=parseInt(spl[1]);
						Game.lastDate=parseInt(spl[2]);
						Game.bakeryName=spl[3]?spl[3]:Game.GetBakeryName();
						Game.bakeryNameRefresh();
						spl=str[3].split('');//prefs
						Game.prefs.particles=parseInt(spl[0]);
						Game.prefs.numbers=parseInt(spl[1]);
						Game.prefs.autosave=parseInt(spl[2]);
						Game.prefs.autoupdate=spl[3]?parseInt(spl[3]):1;
						Game.prefs.milk=spl[4]?parseInt(spl[4]):1;
						Game.prefs.fancy=parseInt(spl[5]);if (Game.prefs.fancy) Game.removeClass('noFancy'); else if (!Game.prefs.fancy) Game.addClass('noFancy');
						Game.prefs.warn=spl[6]?parseInt(spl[6]):0;
						Game.prefs.cursors=spl[7]?parseInt(spl[7]):0;
						Game.prefs.focus=spl[8]?parseInt(spl[8]):0;
						Game.prefs.format=spl[9]?parseInt(spl[9]):0;
						Game.prefs.notifs=spl[10]?parseInt(spl[10]):0;
						BeautifyAll();
						spl=str[4].split(';');//cookies
						Game.cookies=parseFloat(spl[0]);
						Game.cookiesEarned=parseFloat(spl[1]);
						Game.cookieClicks=spl[2]?parseInt(spl[2]):0;
						Game.goldenClicks=spl[3]?parseInt(spl[3]):0;
						Game.handmadeCookies=spl[4]?parseFloat(spl[4]):0;
						Game.missedGoldenClicks=spl[5]?parseInt(spl[5]):0;
						Game.backgroundType=spl[6]?parseInt(spl[6]):0;
						Game.milkType=spl[7]?parseInt(spl[7]):0;
						Game.cookiesReset=spl[8]?parseFloat(spl[8]):0;
						Game.elderWrath=spl[9]?parseInt(spl[9]):0;
						Game.pledges=spl[10]?parseInt(spl[10]):0;
						Game.pledgeT=spl[11]?parseInt(spl[11]):0;
						Game.nextResearch=spl[12]?parseInt(spl[12]):0;
						Game.researchT=spl[13]?parseInt(spl[13]):0;
						Game.resets=spl[14]?parseInt(spl[14]):0;
						Game.goldenClicksLocal=spl[15]?parseInt(spl[15]):0;
						Game.cookiesSucked=spl[16]?parseFloat(spl[16]):0;
						Game.wrinklersPopped=spl[17]?parseInt(spl[17]):0;
						Game.santaLevel=spl[18]?parseInt(spl[18]):0;
						Game.reindeerClicked=spl[19]?parseInt(spl[19]):0;
						Game.seasonT=spl[20]?parseInt(spl[20]):0;
						Game.seasonUses=spl[21]?parseInt(spl[21]):0;
						Game.season=spl[22]?spl[22]:Game.baseSeason;
						var wrinklers={amount:spl[23]?spl[23]:0,number:spl[24]?spl[24]:0};
						spl=str[5].split(';');//buildings
						Game.BuildingsOwned=0;
						for (var i in Game.ObjectsById)
						{
							var me=Game.ObjectsById[i];
							if (spl[i])
							{
								var mestr=spl[i].toString().split(',');
								me.amount=parseInt(mestr[0]);me.bought=parseInt(mestr[1]);me.totalCookies=parseInt(mestr[2]);me.specialUnlocked=0;//parseInt(mestr[3]);
								Game.BuildingsOwned+=me.amount;
							}
							else
							{
								me.amount=0;me.unlocked=0;me.bought=0;me.totalCookies=0;
							}
						}
						if (version<1.035)//old non-binary algorithm
						{
							spl=str[6].split(';');//upgrades
							Game.UpgradesOwned=0;
							for (var i in Game.UpgradesById)
							{
								var me=Game.UpgradesById[i];
								if (spl[i])
								{
									var mestr=spl[i].split(',');
									me.unlocked=parseInt(mestr[0]);me.bought=parseInt(mestr[1]);
									if (me.bought && me.hide!=3) Game.UpgradesOwned++;
								}
								else
								{
									me.unlocked=0;me.bought=0;
								}
							}
							if (str[7]) spl=str[7].split(';'); else spl=[];//achievements
							Game.AchievementsOwned=0;
							for (var i in Game.AchievementsById)
							{
								var me=Game.AchievementsById[i];
								if (spl[i])
								{
									var mestr=spl[i].split(',');
									me.won=parseInt(mestr[0]);
								}
								else
								{
									me.won=0;
								}
								if (me.won && me.hide!=3) Game.AchievementsOwned++;
							}
						}
						else
						{
							if (str[6]) spl=str[6]; else spl=[];//upgrades
							spl=UncompressLargeBin(spl);
							Game.UpgradesOwned=0;
							for (var i in Game.UpgradesById)
							{
								var me=Game.UpgradesById[i];
								if (spl[i*2])
								{
									var mestr=[spl[i*2],spl[i*2+1]];
									me.unlocked=parseInt(mestr[0]);me.bought=parseInt(mestr[1]);
									if (me.bought && me.hide!=3) Game.UpgradesOwned++;
								}
								else
								{
									me.unlocked=0;me.bought=0;
								}
							}
							if (str[7]) spl=str[7]; else spl=[];//achievements
							spl=UncompressLargeBin(spl);
							Game.AchievementsOwned=0;
							for (var i in Game.AchievementsById)
							{
								var me=Game.AchievementsById[i];
								if (spl[i])
								{
									var mestr=[spl[i]];
									me.won=parseInt(mestr[0]);
								}
								else
								{
									me.won=0;
								}
								if (me.won && me.hide!=3) Game.AchievementsOwned++;
							}
						}
						
						for (var i in Game.ObjectsById)
						{
							var me=Game.ObjectsById[i];
							if (me.buyFunction) me.buyFunction();
							me.setSpecial(0);
							if (me.special && me.specialUnlocked==1) me.special();
							me.refresh();
						}
						
						Game.ResetWrinklers();
						Game.LoadWrinklers(wrinklers.amount,wrinklers.number);
						/*//why was this here ?
						Game.cookiesSucked=0;
						Game.wrinklersPopped=0;
						
						Game.santaLevel=0;
						Game.reindeerClicked=0;
						*/
						
						//recompute season trigger prices
						if (Game.Has('Season switcher')) {for (var i in Game.seasons) {Game.Unlock(Game.seasons[i].trigger);}}
						Game.computeSeasonPrices();
			
			
			
						Game.CalculateGains();
						
						
						
						if (version==1.037 && Game.beta)//are we opening the new beta? if so, save the old beta to /betadungeons
						{
							window.localStorage.setItem('CookieClickerGameBetaDungeons',window.localStorage.getItem('CookieClickerGameBeta'));
							Game.Notify('Beta save data','Your beta save data has been safely exported to /betadungeons.',20);
						}
						
						//compute cookies earned while the game was closed
						if (Game.mobile || Game.Has('Perfect idling'))
						{
							var amount=((new Date().getTime()-Game.lastDate)/1000)*Game.cookiesPs;
							if (amount>0)
							{
								if (Game.prefs.popups) Game.Popup('Earned '+Beautify(amount)+' cookie'+(Math.floor(amount)==1?'':'s')+' while you were away');
								else Game.Notify('Welcome back!','You earned <b>'+Beautify(amount)+'</b> cookie'+(Math.floor(amount)==1?'':'s')+' while you were away.',[10,0],6);
								Game.Earn(amount);
							}
						}
						
					}
					else//importing old version save
					{
						/*
						Game.startDate=parseInt(new Date().getTime());
						Game.cookies=parseInt(str[1]);
						Game.cookiesEarned=parseInt(str[1]);
						
						for (var i in Game.ObjectsById)
						{
							var me=Game.ObjectsById[i];
							me.amount=0;me.bought=0;me.totalCookies=0;
							me.refresh();
						}
						for (var i in Game.UpgradesById)
						{
							var me=Game.UpgradesById[i];
							me.unlocked=0;me.bought=0;
						}
						
						var moni=0;
						moni+=15*Math.pow(1.1,parseInt(str[2]));
						moni+=100*Math.pow(1.1,parseInt(str[4]));
						moni+=500*Math.pow(1.1,parseInt(str[6]));
						moni+=2000*Math.pow(1.1,parseInt(str[8]));
						moni+=7000*Math.pow(1.1,parseInt(str[10]));
						moni+=50000*Math.pow(1.1,parseInt(str[12]));
						moni+=1000000*Math.pow(1.1,parseInt(str[14]));
						if (parseInt(str[16])) moni+=123456789*Math.pow(1.1,parseInt(str[16]));
						
						alert('Imported old save from version '+version+'; recovered '+Beautify(Game.cookies)+' cookies, and converted buildings back to '+Beautify(moni)+' cookies.');
						
						Game.cookies+=moni;
						Game.cookiesEarned+=moni;
						*/
						Game.Notify('Error importing save','Sorry, you can\'t import saves from the old version anymore.','',6);
						return;
					}
					
					Game.goldenCookie.reset();
					Game.seasonPopup.reset();
			
					Game.prestige=[];
					
					Game.Upgrades['Elder Pledge'].basePrice=Math.pow(8,Math.min(Game.pledges+2,14));
					
					Game.RebuildUpgrades();
					
					Game.TickerAge=0;
					
					Game.elderWrathD=0;
					Game.frenzy=0;
					Game.frenzyPower=1;
					Game.frenzyMax=0;
					Game.clickFrenzy=0;
					Game.clickFrenzyMax=0;
					Game.recalculateGains=1;
					Game.storeToRefresh=1;
					Game.upgradesToRebuild=1;
					
					for (var i in Game.customLoad) {Game.customLoad[i]();}
					
					if (Game.resets>0 && version<1.0451 && version>1.0417) Game.FreeHeavenlyChips();
					if (version<1.0453)
					{
						Game.Achievements['Cheated cookies taste awful'].won=0;
						Game.cookiesEarned=Math.max(Game.cookiesEarned,Game.cookies);
					}
					
					if (Game.prefs.popups) Game.Popup('Game loaded');
					else Game.Notify('Game loaded','','',1);
				}
			}
		}
		
		/*=====================================================================================
		RESET
		=======================================================================================*/
		Game.Reset=function(bypass,hard)
		{
			if (!bypass)
			{
				Game.Prompt('<h3>Reset</h3><div class="block">Do you REALLY want to start over?<br><small>You will lose your progress, but you will keep your achievements and your prestige.</small></div>',[['Yes!','Game.Reset(1);Game.ClosePrompt();'],'No']);
			}
			else
			{
				if (!hard)
				{
					if (Game.cookiesEarned>=1000000) Game.Win('Sacrifice');
					if (Game.cookiesEarned>=1000000000) Game.Win('Oblivion');
					if (Game.cookiesEarned>=1000000000000) Game.Win('From scratch');
					if (Game.cookiesEarned>=1000000000000000) Game.Win('Nihilism');
					if (Game.cookiesEarned>=1000000000000000000) Game.Win('Dematerialize');
					if (Game.cookiesEarned>=1000000000000000000000) Game.Win('Nil zero zilch');
					if (Game.cookiesEarned>=1000000000000000000000000) Game.Win('Transcendence');
					if (Game.cookiesEarned>=1000000000000000000000000000) Game.Win('Obliterate');
					if (Game.cookiesEarned>=1000000000000000000000000000000) Game.Win('Negative void');
				}
				var cookiesForfeited=Game.cookiesEarned;
				
				Game.cookiesReset+=Game.cookiesEarned;
				Game.cookies=0;
				Game.cookiesEarned=0;
				Game.cookieClicks=0;
				Game.goldenClicksLocal=0;
				//Game.goldenClicks=0;
				//Game.missedGoldenClicks=0;
				Game.handmadeCookies=0;
				Game.backgroundType=-1;
				Game.milkType=-1;
				Game.frenzy=0;
				Game.frenzyPower=1;
				Game.frenzyMax=0;
				Game.clickFrenzy=0;
				Game.clickFrenzyMax=0;
				Game.pledges=0;
				Game.pledgeT=0;
				Game.elderWrath=0;
				Game.nextResearch=0;
				Game.researchT=0;
				Game.seasonT=0;
				Game.seasonUses=0;
				Game.season=Game.baseSeason;
				Game.computeSeasonPrices();
				
				Game.startDate=parseInt(new Date().getTime());
				Game.lastDate=parseInt(new Date().getTime());
				
				Game.cookiesSucked=0;
				Game.wrinklersPopped=0;
				Game.ResetWrinklers();
				
				Game.santaLevel=0;
				Game.reindeerClicked=0;
				
				Game.resets++;
				Game.Upgrades['Elder Pledge'].basePrice=Math.pow(8,Math.min(Game.pledges+2,14));
				
				for (var i in Game.ObjectsById)
				{
					var me=Game.ObjectsById[i];
					me.amount=0;me.bought=0;me.totalCookies=0;me.specialUnlocked=0;
					me.setSpecial(0);
					me.refresh();
				}
				for (var i in Game.UpgradesById)
				{
					var me=Game.UpgradesById[i];
					me.unlocked=0;me.bought=0;
				}
				/*
				for (var i in Game.AchievementsById)
				{
					var me=Game.AchievementsById[i];
					me.won=0;
				}*/
				//Game.DefaultPrefs();
				BeautifyAll();
				
				Game.BuildingsOwned=0;
				Game.UpgradesOwned=0;
				Game.RebuildUpgrades();
				Game.TickerAge=0;
				Game.recalculateGains=1;
				Game.storeToRefresh=1;
				Game.upgradesToRebuild=1;
				Game.goldenCookie.reset();
				Game.seasonPopup.reset();
				
				for (var i in Game.customReset) {Game.customReset[i]();}
				
				if (Game.prefs.popups) Game.Popup('Game reset');
				else Game.Notify('Game reset','So long, cookies.',[3,5],6);
				
				if (!hard)
				{
					var prestige=0;
					if (Game.prestige.ready) prestige=Game.prestige['Heavenly chips'];
					Game.prestige=[];
					Game.CalculatePrestige();
					prestige=Game.prestige['Heavenly chips']-prestige;
					if (prestige!=0)
					{
						if (Game.prefs.popups) Game.Popup('You earn '+Beautify(prestige)+' heavenly chip'+(prestige==1?'':'s')+'!');
						else Game.Notify('You forfeit your '+Beautify(cookiesForfeited)+' cookies.','You earn <b>'+Beautify(prestige)+'</b> heavenly chip'+(prestige==1?'':'s')+'!',[19,7]);
					}
				}
			}
		}
		Game.HardReset=function(bypass)
		{
			if (!bypass)
			{
				Game.Prompt('<h3>Wipe save</h3><div class="block">Do you REALLY want to wipe your save?<br><small>You will lose your progress, your achievements, and your prestige!</small></div>',[['Yes!','Game.HardReset(1);'],'No']);
			}
			else if (bypass==1)
			{
				Game.Prompt('<h3>Wipe save</h3><div class="block">Whoah now, are you really, <b><i>REALLY</i></b> sure you want to go through with this?<br><small>Don\'t say we didn\'t warn you!</small></div>',[['Do it!','Game.HardReset(2);Game.ClosePrompt();'],'No']);
			}
			else
			{
				for (var i in Game.AchievementsById)
				{
					var me=Game.AchievementsById[i];
					me.won=0;
				}
				Game.AchievementsOwned=0;
				Game.goldenClicks=0;
				Game.missedGoldenClicks=0;
				Game.Reset(1,1);
				Game.resets=0;
				Game.fullDate=parseInt(new Date().getTime());
				Game.bakeryName=Game.GetBakeryName();
				Game.bakeryNameRefresh();
				Game.cookiesReset=0;
				Game.prestige=[];
				Game.CalculatePrestige();
			}
		}
		
		Game.FreeHeavenlyChips=function()
		{
			Game.CalculatePrestige();
			Game.Prompt('<h3>Heavenly chips salvaging</h3><div class="block">We\'ve done something a little stupid and as a result, your heavenly chips might have been compromised (according to our damaged records, you currently have <b>'+Game.prestige['Heavenly chips']+'</b>).<br><br>However, the Heavenly Confectionery is ready to reimburse anyone who asks politely enough!<br><br>Type how many heavenly chips you had below (or any other amount, we won\'t judge).</div><div class="block">Note that this is a <b>one-time</b> use only!</div><div class="block" style="text-align:center;"><input type="text" id="valuePrompt" style="text-align:center;"/></div>',[['Salvage!','var n=parseInt(l(\'valuePrompt\').value);if (n>0) {Game.cookiesReset=Game.HowManyCookiesReset(parseInt(l(\'valuePrompt\').value.replace(/,/g,\'\')));Game.CalculatePrestige();Game.Notify(\'Survived the heavenly crash of April 2014!\',\'Not so heavenly now, are they?\',[13,7]);Game.ClosePrompt();}'],'I don\'t want those!']);
		}
		
		/*=====================================================================================
		COOKIE ECONOMICS
		=======================================================================================*/
		Game.Earn=function(howmuch)
		{
			Game.cookies+=howmuch;
			Game.cookiesEarned+=howmuch;
		}
		Game.Spend=function(howmuch)
		{
			Game.cookies-=howmuch;
		}
		Game.Dissolve=function(howmuch)
		{
			Game.cookies-=howmuch;
			Game.cookiesEarned-=howmuch;
			Game.cookies=Math.max(0,Game.cookies);
			Game.cookiesEarned=Math.max(0,Game.cookiesEarned);
		}
		Game.mouseCps=function()
		{
			var add=0;
			if (Game.Has('Thousand fingers')) add+=0.1;
			if (Game.Has('Million fingers')) add+=0.5;
			if (Game.Has('Billion fingers')) add+=2;
			if (Game.Has('Trillion fingers')) add+=10;
			if (Game.Has('Quadrillion fingers')) add+=20;
			if (Game.Has('Quintillion fingers')) add+=100;
			if (Game.Has('Sextillion fingers')) add+=200;
			if (Game.Has('Septillion fingers')) add+=400;
			if (Game.Has('Octillion fingers')) add+=800;
			var num=0;
			for (var i in Game.Objects) {num+=Game.Objects[i].amount;}
			num-=Game.Objects['Cursor'].amount;
			add=add*num;
			if (Game.Has('Plastic mouse')) add+=Game.cookiesPs*0.01;
			if (Game.Has('Iron mouse')) add+=Game.cookiesPs*0.01;
			if (Game.Has('Titanium mouse')) add+=Game.cookiesPs*0.01;
			if (Game.Has('Adamantium mouse')) add+=Game.cookiesPs*0.01;
			if (Game.Has('Unobtainium mouse')) add+=Game.cookiesPs*0.01;
			if (Game.Has('Eludium mouse')) add+=Game.cookiesPs*0.01;
			if (Game.Has('Wishalloy mouse')) add+=Game.cookiesPs*0.01;
			var mult=1;
			
			for (var i in Game.customMouseCps) {mult+=Game.customMouseCps[i]();}
			
			if (Game.Has('Santa\'s helpers')) mult*=1.1;
			if (Game.Has('Cookie egg')) mult*=1.1;
			if (Game.clickFrenzy>0) mult*=777;
			
			for (var i in Game.customMouseCpsMult) {mult*=Game.customMouseCpsMult[i]();}
			
			return mult*Game.ComputeCps(1,Game.Has('Reinforced index finger'),Game.Has('Carpal tunnel prevention cream')+Game.Has('Ambidextrous'),add);
		}
		Game.computedMouseCps=1;
		Game.globalCpsMult=1;
		Game.lastClick=0;
		Game.autoclickerDetected=0;
		Game.BigCookieState=0;//0 = normal, 1 = clicked (small), 2 = released/hovered (big)
		Game.BigCookieSize=0;
		Game.ClickCookie=function(event)
		{
			if (event) event.preventDefault();
			if (new Date().getTime()-Game.lastClick<1000/250)
			{
			}
			else
			{
				if (new Date().getTime()-Game.lastClick<1000/15)
				{
					Game.autoclickerDetected+=Game.fps;
					if (Game.autoclickerDetected>=Game.fps*5) Game.Win('Uncanny clicker');
				}
				Game.Earn(Game.computedMouseCps);
				Game.handmadeCookies+=Game.computedMouseCps;
				if (Game.prefs.particles)
				{
					Game.particleAdd();
					Game.particleAdd(Game.mouseX,Game.mouseY,Math.random()*4-2,Math.random()*-2-2,Math.random()*0.5+0.2,1,2);
				}
				if (Game.prefs.numbers) Game.particleAdd(Game.mouseX+Math.random()*8-4,Game.mouseY-8+Math.random()*8-4,0,-2,1,4,2,'','+'+Beautify(Game.computedMouseCps,1));
				
				for (var i in Game.customCookieClicks) {Game.customCookieClicks[i]();}
			
				Game.cookieClicks++;
			}
			Game.lastClick=new Date().getTime();
			Game.Click=0;
		}
		Game.mouseX=0;
		Game.mouseY=0;
		Game.GetMouseCoords=function(e)
		{
			var posx=0;
			var posy=0;
			if (!e) var e=window.event;
			if (e.pageX||e.pageY)
			{
				posx=e.pageX;
				posy=e.pageY;
			}
			else if (e.clientX || e.clientY)
			{
				posx=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
				posy=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
			}
			var el=l('sectionLeft');
			var x=0;
			var y=0;
			while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop))
			{
				x+=el.offsetLeft-el.scrollLeft;
				y+=el.offsetTop-el.scrollTop;
				el=el.offsetParent;
			}
			Game.mouseX=posx-x;
			Game.mouseY=posy-y;
		}
		AddEvent(window,'keyup',function(e){
			if(e.keyCode==27) Game.ClosePrompt();
			else if(e.keyCode==13) Game.ConfirmPrompt();
		});
		var bigCookie=l('bigCookie');
		Game.Click=0;
		Game.mouseDown=0;
		if (!Game.touchEvents)
		{
			AddEvent(bigCookie,'click',Game.ClickCookie);
			AddEvent(bigCookie,'mousedown',function(event){Game.BigCookieState=1;if (event) event.preventDefault();});
			AddEvent(bigCookie,'mouseup',function(event){Game.BigCookieState=2;if (event) event.preventDefault();});
			AddEvent(bigCookie,'mouseout',function(event){Game.BigCookieState=0;});
			AddEvent(bigCookie,'mouseover',function(event){Game.BigCookieState=2;});
			AddEvent(document,'mousemove',Game.GetMouseCoords);
			AddEvent(document,'mousedown',function(event){Game.mouseDown=1;});
			AddEvent(document,'mouseup',function(event){Game.mouseDown=0;});
			AddEvent(document,'click',function(event){Game.Click=1;});
		}
		else
		{
			//touch events
			AddEvent(bigCookie,'touchend',Game.ClickCookie);
			AddEvent(bigCookie,'touchstart',function(event){Game.BigCookieState=1;if (event) event.preventDefault();});
			AddEvent(bigCookie,'touchend',function(event){Game.BigCookieState=0;if (event) event.preventDefault();});
			//AddEvent(document,'touchmove',Game.GetMouseCoords);
			AddEvent(document,'mousemove',Game.GetMouseCoords);
			AddEvent(document,'touchstart',function(event){Game.mouseDown=1;});
			AddEvent(document,'touchend',function(event){Game.mouseDown=0;});
			AddEvent(document,'touchend',function(event){Game.Click=1;});
		}
		
		Game.HowMuchPrestige=function(cookies)
		{
			var prestige=cookies/1000000000000;
			//prestige=Math.max(0,Math.floor(Math.pow(prestige,0.5)));//old version
			prestige=Math.max(0,Math.floor((-1+Math.pow(1+8*prestige,0.5))/2));//geometric progression
			return prestige;
		}
		
		
		Game.HowManyCookiesReset=function(chips)
		{
			var cookies=((chips*(chips+1))/2)*(1000000000000);
			return Math.floor(Math.max(0,cookies));
		}
		
		Game.CalculatePrestige=function()
		{
			var prestige=Game.HowMuchPrestige(Game.cookiesReset);
			Game.prestige=[];
			Game.prestige['Heavenly chips']=prestige;
			Game.prestige.ready=1;
		}
		/*=====================================================================================
		CPS RECALCULATOR
		=======================================================================================*/
		Game.recalculateGains=1;
		Game.CalculateGains=function()
		{
			Game.cookiesPs=0;
			var mult=1;
			for (var i in Game.Upgrades)
			{
				var me=Game.Upgrades[i];
				if (me.bought>0)
				{
					if (me.type=='cookie' && Game.Has(me.name)) mult+=me.power*0.01;
				}
			}
			mult+=Game.Has('Specialized chocolate chips')*0.01;
			mult+=Game.Has('Designer cocoa beans')*0.02;
			mult+=Game.Has('Underworld ovens')*0.03;
			mult+=Game.Has('Exotic nuts')*0.04;
			mult+=Game.Has('Arcane sugar')*0.05;
			
			if (Game.Has('Increased merriness')) mult+=0.15;
			if (Game.Has('Improved jolliness')) mult+=0.15;
			if (Game.Has('A lump of coal')) mult+=0.01;
			if (Game.Has('An itchy sweater')) mult+=0.01;
			if (Game.Has('Santa\'s dominion')) mult+=0.5;
			
			if (Game.Has('Santa\'s legacy')) mult+=(Game.santaLevel+1)*0.1;
			
			if (!Game.prestige.ready) Game.CalculatePrestige();
			var heavenlyMult=0;
			if (Game.Has('Heavenly chip secret')) heavenlyMult+=0.05;
			if (Game.Has('Heavenly cookie stand')) heavenlyMult+=0.20;
			if (Game.Has('Heavenly bakery')) heavenlyMult+=0.25;
			if (Game.Has('Heavenly confectionery')) heavenlyMult+=0.25;
			if (Game.Has('Heavenly key')) heavenlyMult+=0.25;
			mult+=parseFloat(Game.prestige['Heavenly chips'])*0.02*heavenlyMult;
			
			for (var i in Game.Objects)
			{
				var me=Game.Objects[i];
				me.storedCps=(typeof(me.cps)=='function'?me.cps():me.cps);
				me.storedTotalCps=me.amount*me.storedCps;
				Game.cookiesPs+=me.storedTotalCps;
			}
			
			if (Game.Has('"egg"')) Game.cookiesPs+=9;//"egg"
			
			for (var i in Game.customCps) {mult+=Game.customCps[i]();}
			
			var milkMult=Game.Has('Santa\'s milk and cookies')?1.05:1;
			if (Game.Has('Kitten helpers')) mult*=(1+Game.milkProgress*0.05*milkMult);
			if (Game.Has('Kitten workers')) mult*=(1+Game.milkProgress*0.1*milkMult);
			if (Game.Has('Kitten engineers')) mult*=(1+Game.milkProgress*0.2*milkMult);
			if (Game.Has('Kitten overseers')) mult*=(1+Game.milkProgress*0.2*milkMult);
			if (Game.Has('Kitten managers')) mult*=(1+Game.milkProgress*0.2*milkMult);
			
			var eggMult=0;
			if (Game.Has('Chicken egg')) eggMult++;
			if (Game.Has('Duck egg')) eggMult++;
			if (Game.Has('Turkey egg')) eggMult++;
			if (Game.Has('Quail egg')) eggMult++;
			if (Game.Has('Robin egg')) eggMult++;
			if (Game.Has('Ostrich egg')) eggMult++;
			if (Game.Has('Cassowary egg')) eggMult++;
			if (Game.Has('Salmon roe')) eggMult++;
			if (Game.Has('Frogspawn')) eggMult++;
			if (Game.Has('Shark egg')) eggMult++;
			if (Game.Has('Turtle egg')) eggMult++;
			if (Game.Has('Ant larva')) eggMult++;
			if (Game.Has('Century egg'))
			{
				//the boost increases a little every day, with diminishing returns up to +10% on the 100th day
				var day=Math.floor((new Date().getTime()-Game.startDate)/1000/10)*10/60/60/24;
				day=Math.min(day,100);
				eggMult+=(1-Math.pow(1-day/100,3))*10;
			}
			mult*=(1+0.01*eggMult);
			
			var rawCookiesPs=Game.cookiesPs*mult;
			for (var i=0;i<Game.cpsAchievs.length/2;i++)
			{
				if (rawCookiesPs>=Game.cpsAchievs[i*2+1]) Game.Win(Game.cpsAchievs[i*2]);
			}
			
			if (Game.frenzy>0) mult*=Game.frenzyPower;
			
			var sucked=1;
			for (var i in Game.wrinklers)
			{
				if (Game.wrinklers[i].phase==2) sucked-=1/20;
			}
			Game.cpsSucked=(1-sucked);
			
			if (Game.Has('Elder Covenant')) mult*=0.95;
			
			if (Game.Has('Golden switch')) mult*=1.25;
			
			for (var i in Game.customCpsMult) {mult*=Game.customCpsMult[i]();}
			
			Game.globalCpsMult=mult;
			Game.cookiesPs*=Game.globalCpsMult;			
			
			Game.computedMouseCps=Game.mouseCps();
			
			Game.recalculateGains=0;
		}
		/*=====================================================================================
		GOLDEN COOKIE
		=======================================================================================*/
		Game.goldenCookie={x:0,y:0,life:0,time:0,minTime:0,maxTime:0,dur:13,toDie:1,wrath:0,chain:0,last:''};
		Game.goldenCookie.reset=function()
		{
			this.life=1;//the cookie's current progression through its lifespan
			this.time=0;//the amount of time since the cookie has last been clicked
			this.minTime=this.getMinTime();//the minimum amount of time we must wait for the cookie to spawn
			this.maxTime=this.getMaxTime();//the maximum amount of time we must wait for the cookie to spawn
			this.dur=13;//duration; the cookie's lifespan before it despawns
			this.toDie=1;//should the cookie despawn? (I think that's what it does?)
			this.last='';//what was the last cookie effect?
			this.chain=0;//how far in the chain are we?
		}
		Game.goldenCookie.getMinTime=function()
		{
			var m=5;
			if (Game.Has('Lucky day')) m/=2;
			if (Game.Has('Serendipity')) m/=2;
			if (Game.Has('Golden goose egg')) m*=0.95;
			if (this.chain>0) m=0.05;
			if (Game.Has('Gold hoard')) m=0.01;
			return Math.ceil(Game.fps*60*m);
		}
		Game.goldenCookie.getMaxTime=function()
		{
			var m=15;
			if (Game.Has('Lucky day')) m/=2;
			if (Game.Has('Serendipity')) m/=2;
			if (Game.Has('Golden goose egg')) m*=0.95;
			if (this.chain>0) m=0.05;
			if (Game.Has('Gold hoard')) m=0.01;
			return Math.ceil(Game.fps*60*m);
		}
		Game.goldenCookie.spawn=function()
		{
			if (this.time<this.minTime || this.life>0) Game.Win('Cheated cookies taste awful');
			
			var me=l('goldenCookie');
			me.style.backgroundPosition='0px 0px';
			if ((Game.elderWrath==1 && Math.random()<1/3) || (Game.elderWrath==2 && Math.random()<2/3) || (Game.elderWrath==3))
			{
				this.wrath=1;
				if (Game.season=='halloween') me.style.background='url(img/spookyCookie.png)';
				else me.style.background='url(img/wrathCookie.png)';
			}
			else
			{
				this.wrath=0;
				me.style.background='url(img/goldCookie.png)';
			}
			//fancy visual stuff
			var r=Math.floor(Math.random()*360);
			if (Game.season=='halloween' && this.wrath) r=Math.floor(Math.random()*36-18);
			if (Game.season=='valentines')
			{
				me.style.background='url(img/hearts.png)';
				me.style.backgroundPosition=-(Math.floor(Math.random()*8)*96)+'px 0px';
				r=Math.floor(Math.random()*36-18);
				if (this.wrath) r+=180;
			}
			else if (Game.season=='fools')
			{
				me.style.background='url(img/contract.png)';
				r=Math.floor(Math.random()*8-4);
				if (this.wrath) me.style.background='url(img/wrathContract.png)';
			}
			else if (Game.season=='easter')
			{
				me.style.background='url(img/bunnies.png)';
				var picX=Math.floor(Math.random()*4);
				var picY=0;
				if (this.wrath) picY=1;
				me.style.backgroundPosition=(-picX*96)+'px '+(-picY*96)+'px';
				r=Math.floor(Math.random()*36-18);
			}
			me.style.transform='rotate('+r+'deg)';
			me.style.mozTransform='rotate('+r+'deg)';
			me.style.webkitTransform='rotate('+r+'deg)';
			me.style.msTransform='rotate('+r+'deg)';
			me.style.oTransform='rotate('+r+'deg)';
			var screen=Game.l.getBoundingClientRect();
			this.x=Math.floor(Math.random()*Math.max(0,(screen.right-300)-screen.left-128)+screen.left+64)-64;
			this.y=Math.floor(Math.random()*Math.max(0,screen.bottom-screen.top-128)+screen.top+64)-64;
			me.style.left=this.x+'px';
			me.style.top=this.y+'px';
			me.style.display='block';
			//how long will it stay on-screen?
			var dur=13;
			if (Game.Has('Lucky day')) dur*=2;
			if (Game.Has('Serendipity')) dur*=2;
			if (this.chain>0) dur=Math.max(2,10/this.chain);//this is hilarious
			this.dur=dur;
			this.life=Math.ceil(Game.fps*this.dur);
			this.time=0;
			this.toDie=0;
		}
		Game.goldenCookie.update=function()
		{
			if (this.toDie==0 && this.life<=0 && Math.random()<Math.pow(Math.max(0,(this.time-this.minTime)/(this.maxTime-this.minTime)),5)) this.spawn();
			if (this.life>0)
			{
				if (!Game.Has('Golden switch')) this.life--;
				
				l('goldenCookie').style.opacity=1-Math.pow((this.life/(Game.fps*this.dur))*2-1,4);
				if (this.life==0 || this.toDie==1)
				{
					if (this.life==0) this.chain=0;
					l('goldenCookie').style.display='none';
					if (this.toDie==0) Game.missedGoldenClicks++;
					this.toDie=0;
					this.life=0;
				}
			}
			else this.time++;
		}
		Game.goldenCookie.choose=function()
		{
			var list=[];
			if (this.wrath>0) list.push('clot','multiply cookies','ruin cookies');
			else list.push('frenzy','multiply cookies');
			if (this.wrath>0 && Math.random()<0.3) list.push('blood frenzy','chain cookie');
			else if (Math.random()<0.03 && Game.cookiesEarned>=100000) list.push('chain cookie');
			if (Math.random()<0.1) list.push('click frenzy');
			if (this.last!='' && Math.random()<0.8 && list.indexOf(this.last)!=-1) list.splice(list.indexOf(this.last),1);//80% chance to force a different one
			if (Math.random()<0.0001) list.push('blab');
			var choice=choose(list);
			return choice;
		}
		Game.goldenCookie.click=function(event)
		{
			if (event) event.preventDefault();
			Game.Click=0;
			var me=Game.goldenCookie;
			
			if (me.life>0)
			{
				me.toDie=1;
				Game.goldenClicks++;
				Game.goldenClicksLocal++;
				
				if (Game.goldenClicks>=1) Game.Win('Golden cookie');
				if (Game.goldenClicks>=7) Game.Win('Lucky cookie');
				if (Game.goldenClicks>=27) Game.Win('A stroke of luck');
				if (Game.goldenClicks>=77) Game.Win('Fortune');
				if (Game.goldenClicks>=777) Game.Win('Leprechaun');
				if (Game.goldenClicks>=7777) Game.Win('Black cat\'s paw');
				
				//change to goldenClicksLocal later
				if (Game.goldenClicks>=7) Game.Unlock('Lucky day');
				if (Game.goldenClicks>=27) Game.Unlock('Serendipity');
				if (Game.goldenClicks>=77) Game.Unlock('Get lucky');
				
				l('goldenCookie').style.display='none';
				
				var choice=me.choose();
				
				if (me.chain>0) choice='chain cookie';
				me.last=choice;
				
				var popup=0;
				
				if (choice!='chain cookie') me.chain=0;
				if (choice=='frenzy')
				{
					var time=77+77*Game.Has('Get lucky');
					Game.frenzy=Game.fps*time;
					Game.frenzyPower=7;
					Game.frenzyMax=Game.frenzy;
					Game.recalculateGains=1;
					popup=['Frenzy : cookie production x7 for '+time+' seconds!','Frenzy','Cookie production <b>x7</b> for <b>'+time+'</b> seconds!'];
				}
				else if (choice=='multiply cookies')
				{
					var moni=Math.min(Game.cookies*0.1,Game.cookiesPs*60*20)+13;//add 10% to cookies owned (+13), or 20 minutes of cookie production - whichever is lowest
					Game.Earn(moni);
					popup=['Lucky! +'+Beautify(moni)+' cookies!','Lucky!','+<b>'+Beautify(moni)+'</b> cookies!'];
				}
				else if (choice=='ruin cookies')
				{
					var moni=Math.min(Game.cookies*0.05,Game.cookiesPs*60*10)+13;//lose 5% of cookies owned (-13), or 10 minutes of cookie production - whichever is lowest
					moni=Math.min(Game.cookies,moni);
					Game.Spend(moni);
					popup=['Ruin! Lost '+Beautify(moni)+' cookies!','Ruin!','Lost <b>'+Beautify(moni)+'</b> cookies!'];
				}
				else if (choice=='blood frenzy')
				{
					var time=6+6*Game.Has('Get lucky');
					Game.frenzy=Game.fps*time;//*2;//we shouldn't need *2 but I keep getting reports of it lasting only 3 seconds
					Game.frenzyPower=666;
					Game.frenzyMax=Game.frenzy;
					Game.recalculateGains=1;
					popup=['Elder frenzy : cookie production x666 for '+time+' seconds!','Elder frenzy','Cookie production <b>x666</b> for <b>'+time+'</b> seconds!'];
				}
				else if (choice=='clot')
				{
					var time=66+66*Game.Has('Get lucky');
					Game.frenzy=Game.fps*time;
					Game.frenzyPower=0.5;
					Game.frenzyMax=Game.frenzy;
					Game.recalculateGains=1;
					popup=['Clot : cookie production halved for '+time+' seconds!','Clot','Cookie production <b>halved</b> for <b>'+time+'</b> seconds!'];
				}
				else if (choice=='click frenzy')
				{
					var time=13+13*Game.Has('Get lucky');
					Game.clickFrenzy=Game.fps*time;
					Game.clickFrenzyMax=Game.clickFrenzy;
					Game.recalculateGains=1;
					popup=['Click frenzy! Clicking power x777 for '+time+' seconds!','Click frenzy','Clicking power <b>x777</b> for <b>'+time+'</b> seconds!'];
				}
				else if (choice=='chain cookie')
				{
					//fix by Icehawk78
					me.chain++;
					var digit=me.wrath?6:7;
					if (me.chain==1) me.chain+=Math.max(0,Math.ceil(Math.log(Game.cookies)/Math.LN10)-10);
					
					var maxPayout=Math.min(Game.cookiesPs*60*60*3,Game.cookies*0.25);
					var moni=Math.max(digit,Math.min(Math.floor(1/9*Math.pow(10,me.chain)*digit),maxPayout));
					var nextMoni=Math.max(digit,Math.min(Math.floor(1/9*Math.pow(10,me.chain+1)*digit),maxPayout));

					var moniStr=Beautify(moni);

					//break the chain if we're above 5 digits AND it's more than 25% of our bank, it grants more than 3 hours of our CpS, or just a 1% chance each digit
					if ((Math.random()<0.01 || nextMoni>=maxPayout) && me.chain>4)
					{
						me.chain=0;
						popup=['Cookie chain : +'+moniStr+' cookies!<br>Cookie chain over.','Cookie chain over','+<b>'+moniStr+'</b> cookies!'];
					}
					else
					{
						popup=['Cookie chain : +'+moniStr+' cookies!','Cookie chain','+<b>'+moniStr+'</b> cookies!'];
					}
					Game.Earn(moni);
					
					/*
					me.chain++;
					var digit='7';
					if (me.wrath) digit='6';
					var moni='';
					for (var i=0;i<Math.max(0,(Game.cookies.toString().length)-10);i++) {moni+=digit;}
					for (var i=0;i<me.chain;i++) {moni+=digit;}
					moni=parseFloat(moni);
					moni=Math.max(parseInt(digit),Math.min(Math.min(Game.cookiesPs*60*60*3,Game.cookies*0.25),moni));
					var nextMoni='';
					for (var i=0;i<Math.max(0,(Game.cookies.toString().length)-10);i++) {nextMoni+=digit;}
					for (var i=0;i<=me.chain;i++) {nextMoni+=digit;}//there's probably a better way to handle this but ah well
					nextMoni=parseFloat(nextMoni);
					var moniStr=Beautify(moni);
					if ((Math.random()<0.01 || nextMoni>=Game.cookies*0.25 || nextMoni>Game.cookiesPs*60*60*3) && me.chain>4)//break the chain if we're above 5 digits AND it's more than 25% of our bank, it grants more than 3 hours of our CpS, or just a 1% chance each digit
					{
						me.chain=0;
						popup=['Cookie chain : +'+moniStr+' cookies!<br>Cookie chain over.','Cookie chain over','+<b>'+moniStr+'</b> cookies!'];
					}
					else popup=['Cookie chain : +'+moniStr+' cookies!','Cookie chain','+<b>'+moniStr+'</b> cookies!'];
					Game.Earn(moni);
					*/
				}
				else if (choice=='blab')//sorry (it's really rare)
				{
					var str=choose([
					'Cookie crumbliness x3 for 60 seconds!',
					'Chocolatiness x7 for 77 seconds!',
					'Dough elasticity halved for 66 seconds!',
					'Golden cookie shininess doubled for 3 seconds!',
					'World economy halved for 30 seconds!',
					'Grandma kisses 23% stingier for 45 seconds!',
					'Thanks for clicking!',
					'Fooled you! This one was just a test.',
					'Golden cookies clicked +1!',
					'Your click has been registered. Thank you for your cooperation.',
					'Thanks! That hit the spot!'
					]);
					popup=[str,'???',str];
				}
				
				if (popup!=0)
				{
					if (Game.prefs.popups) Game.Popup(popup[0]);
					else Game.Notify(popup[1],popup[2],[10,1],6);
				}
				
				
				Game.DropEgg(0.9);
				
				me.minTime=me.getMinTime();
				me.maxTime=me.getMaxTime();
			}
			Game.Click=0;
		}
		
		if (!Game.touchEvents)
		{
			AddEvent(l('goldenCookie'),'click',Game.goldenCookie.click);
		}
		else
		{
			//touch events
			AddEvent(l('goldenCookie'),'touchend',Game.goldenCookie.click);
		}
		
		/*=====================================================================================
		SEASON POPUP
		=======================================================================================*/
		Game.seasonPopup={x:0,y:0,life:0,time:0,minTime:0,maxTime:0,dur:4,toDie:1,last:'',type:'',bounds:{}};
		Game.seasonPopup.reset=function()
		{
			this.life=1;//the popup's current progression through its lifespan
			this.time=0;//the amount of time since the popup has last been clicked
			this.minTime=this.getMinTime();//the minimum amount of time we must wait for the popup to spawn
			this.maxTime=this.getMaxTime();//the maximum amount of time we must wait for the popup to spawn
			this.dur=4;//duration; the popup's lifespan before it despawns
			this.toDie=1;//should the popup despawn? (I think that's what it does?)
			this.last='';//what was the last popup effect?
			this.type='';//is it a reindeer? what the hell is it? no seriously
			this.bounds=Game.l.getBoundingClientRect();
		}
		Game.seasonPopup.getMinTime=function()
		{
			var m=3;
			//time bonuses go here
			if (Game.Has('Reindeer baking grounds')) m/=2;
			if (Game.Has('Reindeer season')) m=0.01;
			return Math.ceil(Game.fps*60*m);
		}
		Game.seasonPopup.getMaxTime=function()
		{
			var m=6;
			//time bonuses go here
			if (Game.Has('Reindeer baking grounds')) m/=2;
			if (Game.Has('Reindeer season')) m=0.01;
			return Math.ceil(Game.fps*60*m);
		}
		Game.seasonPopup.spawn=function()
		{
			if (this.time<this.minTime || this.life>0) Game.Win('Cheated cookies taste awful');
			
			var me=l('seasonPopup');
			
			if (this.type=='reindeer')
			{
				me.style.backgroundImage='url(img/frostedReindeer.png)';
			}
			
			//fancy visual stuff
			this.bounds=Game.l.getBoundingClientRect();
			//this.x=Math.floor(Math.random()*Math.max(0,(screen.right-300)-screen.left-128)+screen.left+64)-64;
			//this.y=Math.floor(Math.random()*Math.max(0,screen.bottom-screen.top-128)+screen.top+64)-64;
			this.x=-128;
			this.y=Math.floor(Math.random()*Math.max(0,this.bounds.bottom-this.bounds.top-256)+this.bounds.top+128)-128;
			me.style.left=this.x+'px';
			me.style.top=this.y+'px';
			me.style.display='block';
			//how long will it stay on-screen?
			var dur=4;
			if (Game.Has('Weighted sleighs')) dur*=2;
			this.dur=dur;
			this.life=Math.ceil(Game.fps*this.dur);
			this.time=0;
			this.toDie=0;
		}
		Game.seasonPopup.update=function()
		{
			if (this.toDie==0 && this.life<=0 && Math.random()<Math.pow(Math.max(0,(this.time-this.minTime)/(this.maxTime-this.minTime)),5)) 
			{
				if (Game.season=='christmas')
				{
					this.type='reindeer';
					this.spawn();
				}
			}
			if (this.life>0)
			{
				this.life--;
				var me=l('seasonPopup');
				me.style.opacity=1-Math.pow((this.life/(Game.fps*this.dur))*2-1,12);
				this.x=Math.floor((1-this.life/(Game.fps*this.dur))*(this.bounds.right-this.bounds.left))-128;
				me.style.left=this.x+'px';
				me.style.top=this.y-Math.floor(Math.abs(Math.pow(Math.sin(this.life*0.05),1))*128)+'px';
				if (this.life==0 || Game.seasonPopup.toDie==1)
				{
					if (this.life==0) this.chain=0;
					l('seasonPopup').style.display='none';
					this.toDie=0;
					this.life=0;
				}
			}
			else this.time++;
		}
		Game.seasonPopup.click=function()
		{
			var me=Game.seasonPopup;
			if (me.life>0)
			{
				me.toDie=1;
				if (me.type=='reindeer')
				{
					Game.reindeerClicked++;
					
					var moni=Math.max(25,Game.cookiesPs*60*1);//1 minute of cookie production, or 25 cookies - whichever is highest
					if (Game.Has('Ho ho ho-flavored frosting')) moni*=2;
					Game.Earn(moni);
					
					var failRate=0.8;
					var cookie='';
					if (Game.HasAchiev('Let it snow')) failRate=0.6;
					if (Game.Has('Santa\'s bottomless bag')) failRate*=0.9;
					if (Math.random()>failRate)//christmas cookie drops
					{
						cookie=choose(['Christmas tree biscuits','Snowflake biscuits','Snowman biscuits','Holly biscuits','Candy cane biscuits','Bell biscuits','Present biscuits']);
						if (!Game.HasUnlocked(cookie) && !Game.Has(cookie))
						{
							Game.Unlock(cookie);
						}
						else cookie='';
					}
					
					if (Game.prefs.popups) Game.Popup('You found '+choose(['Dasher','Dancer','Prancer','Vixen','Comet','Cupid','Donner','Blitzen','Rudolph'])+'!<br>The reindeer gives you '+Beautify(moni)+' cookies.'+(cookie==''?'':'<br>You are also rewarded with '+cookie+'!'));
					else Game.Notify('You found '+choose(['Dasher','Dancer','Prancer','Vixen','Comet','Cupid','Donner','Blitzen','Rudolph'])+'!','The reindeer gives you '+Beautify(moni)+' cookies.'+(cookie==''?'':'<br>You are also rewarded with '+cookie+'!'),[12,9],6);
				}
				l('seasonPopup').style.display='none';
				me.minTime=me.getMinTime();
				me.maxTime=me.getMaxTime();
			}
			Game.Click=0;
		}
		l('seasonPopup')[Game.clickStr]=Game.seasonPopup.click;
		
		/*=====================================================================================
		MISC SEASON STUFF
		=======================================================================================*/
		Game.hiddenUpgrade=function(name,x,y)
		{
			//This returns a string displaying a clickable icon of upgrade [name], with offset [x,y]; clicking on it grants the upgrade. This only shows if we do not have the upgrade yet.
			if (Game.Has(name)) return '';
			else
			{
				var me=Game.Upgrades[name];
				return '<div class="crate upgrade hiddenUpgrade" '+Game.clickStr+'="Game.youFound(\''+name+'\');Game.UpgradesById['+me.id+'].earn();" style="'+(me.icon[2]?'background-image:url('+me.icon[2]+');':'')+'background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
			}
		}
		Game.youFound=function(upgrade)
		{
			if (Game.prefs.popups) Game.Popup('You found '+upgrade+'!');
			else Game.Notify('','You found <b>'+upgrade+'</b>!',Game.Upgrades[name].icon);
		}
		
		Game.prepareEaster=function()
		{
			
		}
		Game.clearEaster=function()
		{
		}
		
		/*=====================================================================================
		PARTICLES
		=======================================================================================*/
		//generic particles (falling cookies etc)
		//only displayed on left section
		Game.particles=[];
		for (var i=0;i<50;i++)
		{
			Game.particles[i]={x:0,y:0,xd:0,yd:0,z:0,size:1,dur:2,life:-1,r:0,pic:'smallCookies.png',picId:0};
		}
		
		Game.particlesUpdate=function()
		{
			for (var i in Game.particles)
			{
				var me=Game.particles[i];
				if (me.life!=-1)
				{
					if (!me.text) me.yd+=0.2+Math.random()*0.1;
					me.x+=me.xd;
					me.y+=me.yd;
					//me.y+=me.life*0.25+Math.random()*0.25;
					me.life++;
					if (me.life>=Game.fps*me.dur)
					{
						me.life=-1;
					}
				}
			}
		}
		Game.particleAdd=function(x,y,xd,yd,size,dur,z,pic,text)
		{
			//Game.particleAdd(pos X,pos Y,speed X,speed Y,size (multiplier),duration (seconds),layer,picture,text);
			//pick the first free (or the oldest) particle to replace it
			if (1 || Game.prefs.particles)
			{
				var highest=0;
				var highestI=0;
				for (var i in Game.particles)
				{
					if (Game.particles[i].life==-1) {highestI=i;break;}
					if (Game.particles[i].life>highest)
					{
						highest=Game.particles[i].life;
						highestI=i;
					}
				}
				var auto=0;
				if (x) auto=1;
				var i=highestI;
				var x=x||-64;
				if (Game.LeftBackground && !auto) x=Math.floor(Math.random()*Game.LeftBackground.canvas.width);
				var y=y||-64;
				var me=Game.particles[i];
				me.life=0;
				me.x=x;
				me.y=y;
				me.xd=xd||0;
				me.yd=yd||0;
				me.size=size||1;
				me.z=z||0;
				me.dur=dur||2;
				me.r=Math.floor(Math.random()*360);
				me.picId=Math.floor(Math.random()*10000);
				me.pic=pic||(Game.season=='fools'?'smallDollars.png':'smallCookies.png');
				me.text=text||0;
			}
		}
		Game.particlesDraw=function(z)
		{
			Game.LeftBackground.fillStyle='#fff';
			Game.LeftBackground.font='20px Kavoon';
			Game.LeftBackground.textAlign='center';
			
			for (var i in Game.particles)
			{
				var me=Game.particles[i];
				if (me.z==z)
				{
					if (me.life!=-1)
					{
						var opacity=1-(me.life/(Game.fps*me.dur));
						Game.LeftBackground.globalAlpha=opacity;
						if (me.text)
						{
							Game.LeftBackground.fillText(me.text,me.x,me.y);
						}
						else
						{
							Game.LeftBackground.save();
							Game.LeftBackground.translate(me.x,me.y);
							Game.LeftBackground.rotate((me.r/360)*Math.PI*2);
							Game.LeftBackground.drawImage(Pic(me.pic),(me.picId%8)*64,0,64,64,-32*me.size,-32*me.size,64*me.size,64*me.size);
							Game.LeftBackground.restore();
						}
					}
				}
			}
		}
		
		//text particles (popups etc)
		Game.textParticles=[];
		Game.textParticlesY=0;
		var str='';
		for (var i=0;i<20;i++)
		{
			Game.textParticles[i]={x:0,y:0,life:-1,text:''};
			str+='<div id="particle'+i+'" class="particle title"></div>';
		}
		l('particles').innerHTML=str;
		Game.textParticlesUpdate=function()
		{
			Game.textParticlesY=0;
			for (var i in Game.textParticles)
			{
				var me=Game.textParticles[i];
				if (me.life!=-1)
				{
					Game.textParticlesY+=64;//me.l.clientHeight;
					var y=me.y-(1-Math.pow(1-me.life/(Game.fps*4),10))*50;
					//me.y=me.life*0.25+Math.random()*0.25;
					me.life++;
					var el=me.l;
					el.style.left=Math.floor(-200+me.x)+'px';
					el.style.bottom=Math.floor(-y)+'px';
					el.style.opacity=1-(me.life/(Game.fps*4));
					if (me.life>=Game.fps*4)
					{
						me.life=-1;
						el.style.opacity=0;
						el.style.display='none';
					}
				}
			}
		}
		Game.textParticlesAdd=function(text,el)
		{
			//pick the first free (or the oldest) particle to replace it
			var highest=0;
			var highestI=0;
			for (var i in Game.textParticles)
			{
				if (Game.textParticles[i].life==-1) {highestI=i;break;}
				if (Game.textParticles[i].life>highest)
				{
					highest=Game.textParticles[i].life;
					highestI=i;
				}
			}
			var i=highestI;
			var x=(Math.random()-0.5)*40;
			var y=0;//+(Math.random()-0.5)*40;
			if (!el)
			{
				var rect=Game.l.getBoundingClientRect();
				var x=Math.floor((rect.left+rect.right)/2);
				var y=Math.floor((rect.bottom))-(Game.mobile*64);
				x+=(Math.random()-0.5)*40;
				y+=0;//(Math.random()-0.5)*40;
			}
			var me=Game.textParticles[i];
			if (!me.l) me.l=l('particle'+i);
			me.life=0;
			me.x=x;
			me.y=y-Game.textParticlesY;
			me.text=text;
			me.l.innerHTML=text;
			me.l.style.left=Math.floor(Game.textParticles[i].x-200)+'px';
			me.l.style.bottom=Math.floor(-Game.textParticles[i].y)+'px';
			me.l.style.display='block';
			Game.textParticlesY+=60;
		}
		Game.popups=1;
		Game.Popup=function(text)
		{
			if (Game.popups) Game.textParticlesAdd(text);
		}
		
		/*=====================================================================================
		NOTIFICATIONS
		=======================================================================================*/
		//maybe do all this mess with proper DOM instead of rewriting the innerHTML
		Game.Notes=[];
		Game.NotesById=[];
		Game.noteId=0;
		Game.noteL=l('notes');
		Game.Note=function(title,desc,pic,quick)
		{
			this.title=title;
			this.desc=desc||'';
			this.pic=pic||'';
			this.id=Game.noteId;
			this.date=new Date().getTime();
			this.quick=quick||0;
			this.life=(this.quick||1)*Game.fps;
			this.l=0;
			this.height=0;
			Game.noteId++;
			Game.NotesById[this.id]=this;
			Game.Notes.unshift(this);
			if (Game.Notes.length>50) Game.Notes.pop();
			//Game.Notes.push(this);
			//if (Game.Notes.length>50) Game.Notes.shift();
			Game.UpdateNotes();
		}
		Game.CloseNote=function(id)
		{
			var me=Game.NotesById[id];
			Game.Notes.splice(Game.Notes.indexOf(me),1);
			Game.NotesById.splice(Game.NotesById.indexOf(me),1);
			Game.UpdateNotes();
		}
		Game.CloseNotes=function()
		{
			Game.Notes=[];
			Game.NotesById=[];
			Game.UpdateNotes();
		}
		Game.UpdateNotes=function()
		{
			var str='';
			var remaining=Game.Notes.length;
			for (var i in Game.Notes)
			{
				if (i<5)
				{
					var me=Game.Notes[i];
					var pic='';
					if (me.pic!='') pic='<div class="icon" style="'+(me.pic[2]?'background-image:url('+me.pic[2]+');':'')+'background-position:'+(-me.pic[0]*48)+'px '+(-me.pic[1]*48)+'px;"></div>';
					str='<div id="note-'+me.id+'" class="framed note '+(me.pic!=''?'haspic':'nopic')+' '+(me.desc!=''?'hasdesc':'nodesc')+'"><div class="close" onclick="Game.CloseNote('+me.id+');">x</div>'+pic+'<div class="text"><h3>'+me.title+'</h3>'+(me.desc!=''?'<h5>'+me.desc+'</h5>':'')+'</div></div>'+str;
					remaining--;
				}
			}
			if (remaining>0) str='<div class="remaining">+'+remaining+' more notification'+(remaining==1?'':'s')+'.</div>'+str;
			if (Game.Notes.length>1)
			{
				str+='<div class="framed close sidenote" onclick="Game.CloseNotes();">x</div>';
			}
			Game.noteL.innerHTML=str;
			for (var i in Game.Notes)
			{
				me.l=0;
				if (i<5)
				{
					var me=Game.Notes[i];
					me.l=l('note-'+me.id);
				}
			}
		}
		Game.NotesLogic=function()
		{
			for (var i in Game.Notes)
			{
				if (Game.Notes[i].quick>0)
				{
					var me=Game.Notes[i];
					me.life--;
					if (me.life<=0) Game.CloseNote(me.id);
				}
			}
		}
		Game.NotesDraw=function()
		{
			for (var i in Game.Notes)
			{
				if (Game.Notes[i].quick>0)
				{
					var me=Game.Notes[i];
					if (me.l)
					{
						if (me.life<10)
						{
							me.l.style.opacity=(me.life/10);
						}
					}
				}
			}
		}
		Game.Notify=function(title,desc,pic,quick)
		{
			if (Game.prefs.notifs)
			{
				quick=Math.min(6,quick);
				if (!quick) quick=6;
			}
			if (Game.popups) new Game.Note(title,desc,pic,quick);
		}
		
		/*=====================================================================================
		VEIL (this never really worked huh)
		=======================================================================================*/
		Game.veil=1;
		Game.veilOn=function()
		{
			//l('sectionMiddle').style.display='none';
			//l('sectionRight').style.display='none';
			//l('backgroundLayer2').style.background='#000 url(img/darkNoise.png)';
			Game.veil=1;
		}
		Game.veilOff=function()
		{
			//l('sectionMiddle').style.display='block';
			//l('sectionRight').style.display='block';
			//l('backgroundLayer2').style.background='transparent';
			Game.veil=0;
		}
		
		/*=====================================================================================
		PROMPT
		=======================================================================================*/
		Game.darkenL=l('darken');
		Game.promptL=l('promptContent');
		Game.promptAnchorL=l('promptAnchor');
		Game.promptConfirm='';
		Game.promptOn=0;
		Game.UpdatePrompt=function()
		{
		}
		Game.Prompt=function(content,options)
		{
			var str='';
			str+=content;
			var opts='';
			for (var i in options)
			{
				if (typeof options[i]=='string') options[i]=[options[i],'Game.ClosePrompt();'];
				options[i][1]=options[i][1].replace(/'/g,'&#39;').replace(/"/g,'&#34;');
				opts+='<a id="promptOption'+i+'" class="option" '+Game.clickStr+'="'+options[i][1]+'">'+options[i][0]+'</a>';
			}
			Game.promptL.innerHTML=str+'<div class="optionBox">'+opts+'</div>';
			Game.promptAnchorL.style.display='block';
			Game.darkenL.style.display='block';
			Game.promptL.focus();
			Game.promptOn=1;
		}
		Game.ClosePrompt=function()
		{
			Game.promptAnchorL.style.display='none';
			Game.darkenL.style.display='none';
			Game.promptOn=0;
		}
		Game.ConfirmPrompt=function()
		{
			if (Game.promptOn && l('promptOption0')) FireEvent(l('promptOption0'),'click');
		}
		
		/*=====================================================================================
		MENUS
		=======================================================================================*/
		Game.cssClasses=[];
		Game.addClass=function(what) {if (Game.cssClasses.indexOf(what)==-1) Game.cssClasses.push(what);Game.updateClasses();}
		Game.removeClass=function(what) {var i=Game.cssClasses.indexOf(what);if(i!=-1) {Game.cssClasses.splice(i,1);}Game.updateClasses();}
		Game.updateClasses=function() {Game.l.className=Game.cssClasses.join(' ');}
		
		Game.WriteButton=function(prefName,button,on,off,callback)
		{
			return '<a class="option" id="'+button+'" '+Game.clickStr+'="Game.Toggle(\''+prefName+'\',\''+button+'\',\''+on+'\',\''+off+'\');'+(callback||'')+'">'+(Game.prefs[prefName]?on:off)+'</a>';
		}
		Game.Toggle=function(prefName,button,on,off)
		{
			if (Game.prefs[prefName])
			{
				l(button).innerHTML=off;
				l(button).className='option';
				Game.prefs[prefName]=0;
			}
			else
			{
				l(button).innerHTML=on;
				l(button).className='option enabled';
				Game.prefs[prefName]=1;
			}
		}
		Game.ToggleFancy=function()
		{
			if (Game.prefs.fancy) Game.removeClass('noFancy');
			else if (!Game.prefs.fancy) Game.addClass('noFancy');
		}
		
		Game.WriteSelector=function(prefName,button,list,def,selected,callback)//def is default (which is a reserved keyword)
		{
			var str='';
			var me=0;
			for (var i in list)
			{
				me=Game.Upgrades[list[i]];
				str+='<div id="'+button+'-'+me.id+'" class="crate'+(me.name==selected?' enabled':'')+'" '+Game.clickStr+'="Game.Select(\''+prefName+'\',\''+button+'\',\''+me.id+'\');'+(callback||'')+'" '+Game.getTooltip(
					'<div style="min-width:200px;"><div class="name" style="text-align:center;">'+me.name+'</div><!--<div class="description">'+me.desc+'</div>--></div>'
					,'bottom-right')+' style="'+(me.icon[2]?'background-image:url('+me.icon[2]+');':'')+'background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
			}
			str=''+str+'<div style="clear:both;"></div>';
			return str;
		}
		Game.Select=function(prefName,button,value)
		{
			if (l(button+'-'+Game[prefName])) l(button+'-'+Game[prefName]).className='crate';
			if (l(button+'-'+value)) l(button+'-'+value).className='crate enabled';
			Game[prefName]=value;
		}
		
		
		Game.onPanel='Left';
		Game.addClass('focus'+Game.onPanel);
		Game.ShowPanel=function(what)
		{
			if (!what) what='';
			if (Game.onPanel!=what)
			{
				Game.removeClass('focus'+Game.onPanel);
				Game.addClass('focus'+what);
			}
			Game.onPanel=what;
		}
		
		Game.onMenu='';
		Game.ShowMenu=function(what)
		{
			if (!what || what=='') what=Game.onMenu;
			if (Game.onMenu=='' && what!='') Game.addClass('onMenu');
			else if (Game.onMenu!='' && what!=Game.onMenu) Game.addClass('onMenu');
			else if (what==Game.onMenu) {Game.removeClass('onMenu');what='';}
			if (what=='log') l('donateBox').className='on'; else l('donateBox').className='';
			Game.onMenu=what;
			Game.UpdateMenu();
		}
		Game.sayTime=function(time,detail)
		{
			var str='';
			var detail=detail||0;
			time=Math.floor(time);
			if (time>=Game.fps*60*60*24*2 && detail<2) str=Beautify(Math.floor(time/(Game.fps*60*60*24)))+' days';
			else if (time>=Game.fps*60*60*24 && detail<2) str='1 day';
			else if (time>=Game.fps*60*60*2 && detail<3) str=Beautify(Math.floor(time/(Game.fps*60*60)))+' hours';
			else if (time>=Game.fps*60*60 && detail<3) str='1 hour';
			else if (time>=Game.fps*60*2 && detail<4) str=Beautify(Math.floor(time/(Game.fps*60)))+' minutes';
			else if (time>=Game.fps*60 && detail<4) str='1 minute';
			else if (time>=Game.fps*2 && detail<5) str=Beautify(Math.floor(time/(Game.fps)))+' seconds';
			else if (time>=Game.fps && detail<5) str='1 second';
			return str;
		}
		
		Game.tinyCookie=function()
		{
			if (!Game.HasAchiev('Tiny cookie'))
			{
				return '<div class="tinyCookie" '+Game.clickStr+'="Game.ClickTinyCookie();"></div>';
			}
			return '';
		}
		Game.ClickTinyCookie=function(){Game.Win('Tiny cookie');}
		
		Game.UpdateMenu=function()
		{
			var str='';
			if (Game.onMenu!='')
			{
				str+='<div style="position:absolute;top:8px;right:8px;cursor:pointer;font-size:16px;" '+Game.clickStr+'="Game.ShowMenu();">X</div>';
			}
			if (Game.onMenu=='prefs')
			{
				str+='<div class="section">Menu</div>'+
				'<div class="subsection">'+
				'<div class="title">General</div>'+
				'<div class="listing"><a class="option" '+Game.clickStr+'="Game.WriteSave();">Save</a><label>Save manually (the game autosaves every 60 seconds)</label></div>'+
				'<div class="listing"><a class="option" '+Game.clickStr+'="Game.ExportSave();">Export save</a><a class="option" '+Game.clickStr+'="Game.ImportSave();">Import save</a><label>You can use this to backup your save or to transfer it to another computer</label></div>'+
				//'<div class="listing"><span class="warning" style="font-size:12px;">[Note : importing saves from earlier versions than 1.0 will be disabled beyond September 1st, 2013.]</span></div>'+
				'<div class="listing"><a class="option warning" '+Game.clickStr+'="Game.Reset();">Reset</a><label>Reset your game (you will keep your achievements)</label></div>'+
				'<div class="listing"><a class="option warning" '+Game.clickStr+'="Game.HardReset();">Wipe save</a><label>Delete all your progress, including your achievements and prestige</label></div>'+
				'<div class="title">Settings</div>'+
				'<div class="listing">'+
				Game.WriteButton('fancy','fancyButton','Fancy graphics ON','Fancy graphics OFF','Game.ToggleFancy();')+
				Game.WriteButton('particles','particlesButton','Particles ON','Particles OFF')+
				Game.WriteButton('numbers','numbersButton','Numbers ON','Numbers OFF')+
				Game.WriteButton('milk','milkButton','Milk ON','Milk OFF')+
				Game.WriteButton('cursors','cursorsButton','Cursors ON','Cursors OFF')+
				Game.WriteButton('format','formatButton','Short numbers OFF','Short numbers ON','BeautifyAll();Game.RefreshStore();Game.upgradesToRebuild=1;')+
				Game.WriteButton('notifs','notifsButton','Fast notes ON','Fast notes OFF')+
				'</div>'+
				'<div class="listing">'+Game.WriteButton('autoupdate','autoupdateButton','Offline mode OFF','Offline mode ON')+'<label>(note : this disables update notifications)</label></div>'+
				'<div class="listing">'+Game.WriteButton('warn','warnButton','Closing warning ON','Closing warning OFF')+'<label>(the game will ask you to confirm when you close the window)</label></div>'+
				'<div class="listing">'+Game.WriteButton('focus','focusButton','Focus OFF','Focus ON')+'<label>(the game will be less resource-intensive when out of focus)</label></div>'+
				//'<div class="listing">'+Game.WriteButton('autosave','autosaveButton','Autosave ON','Autosave OFF')+'</div>'+
				(1==2?(
				'<div class="title">Customization</div>'+
				'<div class="listing"><b>Background</b>'+
				Game.WriteSelector('backgroundType','backgroundType',['Blue background','Red background','White background','Black background'],'Blue background',(Game.backgroundType>0?Game.UpgradesById[Game.backgroundType].name:Game.Upgrades['Blue background'].name))+
				'</div>'
				):'')+
				'<div style="padding-bottom:128px;"></div>'+
				'</div>'
				;
			}
			else if (Game.onMenu=='main')
			{
				str+=
				'<div class="listing">This isn\'t really finished</div>'+
				'<div class="listing"><a class="option big title" '+Game.clickStr+'="Game.ShowMenu(\'prefs\');">Menu</a></div>'+
				'<div class="listing"><a class="option big title" '+Game.clickStr+'="Game.ShowMenu(\'stats\');">Stats</a></div>'+
				'<div class="listing"><a class="option big title" '+Game.clickStr+'="Game.ShowMenu(\'log\');">Updates</a></div>'+
				'<div class="listing"><a class="option big title" '+Game.clickStr+'="">Quit</a></div>'+
				'<div class="listing"><a class="option big title" '+Game.clickStr+'="Game.ShowMenu(Game.onMenu);">Resume</a></div>';
			}
			else if (Game.onMenu=='log')
			{
				str+=Game.updateLog;
			}
			else if (Game.onMenu=='stats')
			{
				var buildingsOwned=0;
				buildingsOwned=Game.BuildingsOwned;
				var upgrades='';
				var cookieUpgrades='';
				var hiddenUpgrades='';
				var upgradesTotal=0;
				var upgradesOwned=0;
				
				var list=[];
				for (var i in Game.Upgrades)//sort the upgrades
				{
					list.push(Game.Upgrades[i]);
				}
				var sortMap=function(a,b)
				{
					if (a.order>b.order) return 1;
					else if (a.order<b.order) return -1;
					else return 0;
				}
				list.sort(sortMap);
				for (var i in list)
				{
					var str2='';
					var me=list[i];
					if (!Game.Has('Neuromancy'))
					{
						if (me.bought>0)
						{
							str2+='<div class="crate upgrade enabled" '+Game.getTooltip(
							'<div style="min-width:200px;"><div style="float:right;"><span class="price">'+Beautify(Math.round(me.basePrice))+'</span></div><small>[Upgrade] [Purchased]</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
							,'bottom-right')+' style="'+(me.icon[2]?'background-image:url('+me.icon[2]+');':'')+'background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
							if (me.hide!=3) upgradesOwned++;
						}
					}
					else
					{
						str2+='<div '+Game.clickStr+'="Game.UpgradesById['+me.id+'].toggle();" class="crate upgrade'+(me.bought>0?' enabled':'')+'" '+Game.getTooltip(
						'<div style="min-width:200px;"><div style="float:right;"><span class="price">'+Beautify(Math.round(me.basePrice))+'</span></div><small>[Upgrade]'+(me.bought>0?' [Purchased]':'')+'</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
						,'bottom-right')+' style="'+(me.icon[2]?'background-image:url('+me.icon[2]+');':'')+'background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
						if (me.hide!=3) upgradesOwned++;
					}
					if (me.hide!=3) upgradesTotal++;
					if (me.debug) hiddenUpgrades+=str2; else if (me.type=='cookie') cookieUpgrades+=str2; else upgrades+=str2;
				}
				var achievements=[];
				var shadowAchievements='';
				var achievementsOwned=0;
				var achievementsTotal=0;
				
				var list=[];
				for (var i in Game.Achievements)//sort the achievements
				{
					list.push(Game.Achievements[i]);
				}
				var sortMap=function(a,b)
				{
					if (a.order>b.order) return 1;
					else if (a.order<b.order) return -1;
					else return 0;
				}
				list.sort(sortMap);
				
				for (var i in list)
				{
					var me=list[i];
					if (!me.disabled && me.hide!=3 || me.won>0) achievementsTotal++;
					var category=me.category;
					if (!achievements[category]) achievements[category]='';
					
					if (me.won>0 && me.hide==3)
					{
						shadowAchievements+='<div class="crate achievement enabled" '+Game.getTooltip(
						'<div style="min-width:200px;"><small>[Achievement] [Unlocked]'+(me.hide==3?' [Shadow]':'')+'</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
						,'bottom-right')+' style="'+(me.icon[2]?'background-image:url('+me.icon[2]+');':'')+'background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
						achievementsOwned++;
					}
					else if (me.won>0)
					{
						achievements[category]+='<div class="crate achievement enabled" '+Game.getTooltip(
						'<div style="min-width:200px;"><small>[Achievement] [Unlocked]'+(me.hide==3?' [Shadow]':'')+'</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
						,'bottom-right')+' style="'+(me.icon[2]?'background-image:url('+me.icon[2]+');':'')+'background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
						achievementsOwned++;
					}
					else if (me.hide==0)
					{
						achievements[category]+='<div class="crate achievement" '+Game.getTooltip(
						'<div style="min-width:200px;"><small>[Achievement]</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
						,'bottom-right')+' style="'+(me.icon[2]?'background-image:url('+me.icon[2]+');':'')+'background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
					}
					else if (me.hide==1)
					{
						achievements[category]+='<div class="crate achievement" '+Game.getTooltip(
						'<div style="min-width:200px;"><small>[Achievement]</small><div class="name">'+me.name+'</div><div class="description">???</div></div>'
						,'bottom-right')+' style="background-position:'+(-0*48+6)+'px '+(-7*48+6)+'px;"></div>';
					}
					else if (me.hide==2)
					{
						achievements[category]+='<div class="crate achievement" '+Game.getTooltip(
						'<div style="min-width:200px;"><small>[Achievement]</small><div class="name">???</div><div class="description">???</div></div>'
						,'bottom-right')+' style="background-position:'+(-0*48+6)+'px '+(-7*48+6)+'px;"></div>';
					}
				}
				
				var achievementsStr='';
				var categories={'dungeon':'Dungeon achievements'};
				for (var i in achievements)
				{
					if(achievements[i]!='')
					{
						var cat=i;
						if (categories[i]) achievementsStr+='<div class="listing"><b>'+categories[i]+'</b></div>';
						achievementsStr+='<div class="listing" style="overflow-y:hidden;">'+achievements[i]+'</div>';
					}
				}
				
				var santaStr='';
				if (Game.Has('A festive hat'))
				{
					for (var i=0;i<=Game.santaLevel;i++)
					{
						santaStr+='<div '+Game.getTooltip(
						'<div style="min-width:200px;text-align:center">'+Game.santaLevels[i]+'</div>'
						,'bottom-right')+' style="width:96px;height:96px;margin:2px;float:left;background:url(img/santa.png) '+(-i*96)+'px 0px;"></div>';
					}
					santaStr+='<div style="clear:both;"></div>';
				}
				
				var milkName='plain milk';
				if (Game.milkProgress>=4) milkName='caramel milk';
				else if (Game.milkProgress>=3) milkName='orange juice';
				else if (Game.milkProgress>=2) milkName='raspberry milk';
				else if (Game.milkProgress>=1) milkName='chocolate milk';
				
				var researchStr=Game.sayTime(Game.researchT);
				var pledgeStr=Game.sayTime(Game.pledgeT);
				var wrathStr='';
				if (Game.elderWrath==1) wrathStr='awoken';
				else if (Game.elderWrath==2) wrathStr='displeased';
				else if (Game.elderWrath==3) wrathStr='angered';
				else if (Game.elderWrath==0 && Game.pledges>0) wrathStr='appeased';
				
				var date=new Date();
				date.setTime(new Date().getTime()-Game.startDate);
				var timeInSeconds=date.getTime()/1000;
				var startDate=Game.sayTime(timeInSeconds*Game.fps,2);
				date.setTime(new Date().getTime()-Game.fullDate);
				var fullDate=Game.sayTime(date.getTime()/1000*Game.fps,2);
				if (!fullDate || fullDate.length<1) fullDate='a long while';
				/*date.setTime(new Date().getTime()-Game.lastDate);
				var lastDate=Game.sayTime(date.getTime()/1000*Game.fps,2);*/
				
				var heavenlyMult=0;
				if (Game.Has('Heavenly chip secret')) heavenlyMult+=5;
				if (Game.Has('Heavenly cookie stand')) heavenlyMult+=20;
				if (Game.Has('Heavenly bakery')) heavenlyMult+=25;
				if (Game.Has('Heavenly confectionery')) heavenlyMult+=25;
				if (Game.Has('Heavenly key')) heavenlyMult+=25;
				
				var seasonStr=Game.sayTime(Game.seasonT);
				
				str+='<div class="section">Statistics</div>'+
				'<div class="subsection">'+
				'<div class="title">General</div>'+
				'<div class="listing"><b>Cookies in bank :</b> <div class="price plain">'+Game.tinyCookie()+Beautify(Game.cookies)+'</div></div>'+
				'<div class="listing"><b>Cookies baked (this game) :</b> <div class="price plain">'+Game.tinyCookie()+Beautify(Game.cookiesEarned)+'</div></div>'+
				'<div class="listing"><b>Cookies baked (all time) :</b> <div class="price plain">'+Game.tinyCookie()+Beautify(Game.cookiesEarned+Game.cookiesReset)+'</div></div>'+
				(Game.cookiesReset>0?'<div class="listing"><b>Cookies forfeited by resetting :</b> <div class="price plain">'+Game.tinyCookie()+Beautify(Game.cookiesReset)+'</div></div>':'')+
				(Game.resets?('<div class="listing"><b>Legacy started :</b> '+(fullDate==''?'just now':(fullDate+' ago'))+', with '+Beautify(Game.resets)+' reset'+(Game.resets==1?'':'s')+'</div>'):'')+
				'<div class="listing"><b>Session started :</b> '+(startDate==''?'just now':(startDate+' ago'))+'</div>'+
				'<div class="listing"><b>Buildings owned :</b> '+Beautify(buildingsOwned)+'</div>'+
				'<div class="listing"><b>Cookies per second :</b> '+Beautify(Game.cookiesPs,1)+' <small>'+
					'(multiplier : '+Beautify(Math.round(Game.globalCpsMult*100),1)+'%)'+
					(Game.cpsSucked>0?' <span class="warning">(withered : '+Beautify(Math.round(Game.cpsSucked*100),1)+'%)</span>':'')+
					'</small></div>'+
				'<div class="listing"><b>Cookies per click :</b> '+Beautify(Game.computedMouseCps,1)+'</div>'+
				'<div class="listing"><b>Cookie clicks :</b> '+Beautify(Game.cookieClicks)+'</div>'+
				'<div class="listing"><b>Hand-made cookies :</b> '+Beautify(Game.handmadeCookies)+'</div>'+
				'<div class="listing"><b>Golden cookie clicks :</b> '+Beautify(Game.goldenClicksLocal)+' <small>(all time : '+Beautify(Game.goldenClicks)+')</small></div>'+//' <span class="hidden">(<b>Missed golden cookies :</b> '+Beautify(Game.missedGoldenClicks)+')</span></div>'+
				'<br><div class="listing"><b>Running version :</b> '+Game.version+'</div>'+
				
				((researchStr!='' || wrathStr!='' || pledgeStr!='' || santaStr!='' || Game.season!='')?(
				'</div><div class="subsection">'+
				'<div class="title">Special</div>'+
				(Game.season!=''?'<div class="listing"><b>Seasonal event :</b> '+Game.seasons[Game.season].name+
					(seasonStr!=''?' <small>('+seasonStr+' remaining)</small>':'')+
				'</div>':'')+
				(Game.season=='fools'?
					'<div class="listing"><b>Money made from selling cookies :</b> '+Beautify(Game.cookiesEarned*0.08,2)+'$</div>'+
					(Game.Objects['Portal'].amount>0?'<div class="listing"><b>TV show seasons produced :</b> '+Beautify(Math.floor((timeInSeconds/60/60)*(Game.Objects['Portal'].amount*0.13)+1))+'</div>':'')
				:'')+
				(researchStr!=''?'<div class="listing"><b>Research :</b> '+researchStr+' remaining</div>':'')+
				(wrathStr!=''?'<div class="listing"><b>Grandmatriarchs status :</b> '+wrathStr+'</div>':'')+
				(pledgeStr!=''?'<div class="listing"><b>Pledge :</b> '+pledgeStr+' remaining</div>':'')+
				(Game.wrinklersPopped>0?'<div class="listing"><b>Wrinklers popped :</b> '+Beautify(Game.wrinklersPopped)+'</div>':'')+
				//(Game.cookiesSucked>0?'<div class="listing warning"><b>Withered :</b> '+Beautify(Game.cookiesSucked)+' cookies</div>':'')+
				(Game.reindeerClicked>0?'<div class="listing"><b>Reindeer found :</b> '+Beautify(Game.reindeerClicked)+'</div>':'')+
				(santaStr!=''?'<div class="listing"><b>Santa stages unlocked :</b></div><div>'+santaStr+'</div>':'')+
				''
				):'')+
				(Game.prestige['Heavenly chips']>0?(
				'</div><div class="subsection">'+
				'<div class="title">Prestige</div>'+
				'<div class="listing"><small>(Note : each heavenly chip grants you +2% CpS multiplier. You can gain more chips by resetting with a lot of cookies.)</small></div>'+
				'<div class="listing"><div class="icon" style="background-position:'+(-19*48)+'px '+(-7*48)+'px;"></div> <span style="vertical-align:100%;"><span class="title" style="font-size:22px;">'+Beautify(Game.prestige['Heavenly chips'])+' heavenly chip'+(Game.prestige['Heavenly chips']==1?'':'s')+'</span> at '+heavenlyMult+'% of their potential (+'+Beautify(Game.prestige['Heavenly chips']*2*heavenlyMult/100,1)+'% CpS)</span></div>'):'')+
				
				'</div><div class="subsection">'+
				'<div class="title">Upgrades unlocked</div>'+
				'<div class="listing"><b>Unlocked :</b> '+upgradesOwned+'/'+upgradesTotal+' ('+Math.round((upgradesOwned/upgradesTotal)*100)+'%)</div>'+
				'<div class="listing" style="overflow-y:hidden;">'+upgrades+'</div>'+
				(cookieUpgrades!=''?('<div class="listing"><b>Cookies</b></div>'+
				'<div class="listing" style="overflow-y:hidden;">'+cookieUpgrades+'</div>'):'')+
				(hiddenUpgrades!=''?('<div class="listing"><b>Debug</b></div>'+
				'<div class="listing" style="overflow-y:hidden;">'+hiddenUpgrades+'</div>'):'')+
				'</div><div class="subsection">'+
				'<div class="title">Achievements</div>'+
				'<div class="listing"><b>Unlocked :</b> '+achievementsOwned+'/'+achievementsTotal+' ('+Math.round((achievementsOwned/achievementsTotal)*100)+'%)</div>'+
				'<div class="listing"><b>Milk :</b> '+Math.round(Game.milkProgress*100)+'% ('+milkName+') <small>(Note : you gain milk through achievements. Milk can unlock unique upgrades over time.)</small></div>'+
				achievementsStr+
				(shadowAchievements!=''?(
					'<div class="listing"><b>Shadow achievements</b> <small>(These are feats that are either unfair or difficult to attain. They do not give milk.)</small></div>'+
					'<div class="listing" style="overflow-y:hidden;">'+shadowAchievements+'</div>'
				):'')+
				'</div>'+
				'<div style="padding-bottom:128px;"></div>'
				;
			}
			l('menu').innerHTML=str;
		}
		
		AddEvent(l('prefsButton'),'click',function(){Game.ShowMenu('prefs');});
		AddEvent(l('statsButton'),'click',function(){Game.ShowMenu('stats');});
		AddEvent(l('logButton'),'click',function(){Game.ShowMenu('log');});
		
		Game.lastPanel='';
		if (Game.touchEvents)
		{
			AddEvent(l('focusLeft'),'touchend',function(){Game.ShowMenu('');Game.ShowPanel('Left');});
			AddEvent(l('focusMiddle'),'touchend',function(){Game.ShowMenu('');Game.ShowPanel('Middle');});
			AddEvent(l('focusRight'),'touchend',function(){Game.ShowMenu('');Game.ShowPanel('Right');});
			AddEvent(l('focusMenu'),'touchend',function(){Game.ShowMenu('main');Game.ShowPanel('Menu');});
		}
		else
		{
			AddEvent(l('focusLeft'),'click',function(){Game.ShowMenu('');Game.ShowPanel('Left');});
			AddEvent(l('focusMiddle'),'click',function(){Game.ShowMenu('');Game.ShowPanel('Middle');});
			AddEvent(l('focusRight'),'click',function(){Game.ShowMenu('');Game.ShowPanel('Right');});
			AddEvent(l('focusMenu'),'click',function(){Game.ShowMenu('main');Game.ShowPanel('Menu');});
		}
		//AddEvent(l('focusMenu'),'touchend',function(){if (Game.onPanel=='Menu' && Game.lastPanel!='') {Game.ShowMenu('main');Game.ShowPanel(Game.lastPanel);} else {Game.lastPanel=Game.onPanel;Game.ShowMenu('main');Game.ShowPanel('Menu');}});
		
		/*=====================================================================================
		TOOLTIP
		=======================================================================================*/
		Game.tooltip={text:'',x:0,y:0,origin:'',on:0,tt:l('tooltip'),tta:l('tooltipAnchor')};
		Game.tooltip.draw=function(from,text,origin)
		{
			this.text=text;
			//this.x=x;
			//this.y=y;
			this.origin=origin;
			var tt=this.tt;
			var tta=this.tta;
			tta.style.display='block';
			tt.style.left='auto';
			tt.style.top='auto';
			tt.style.right='auto';
			tt.style.bottom='auto';
			tt.style.opacity=0;
			if (1)
			{
				tt.style.right='8px';
				tt.style.top='8px';
			}
			
			tt.innerHTML=typeof(this.text)=='function'?unescape(this.text()):unescape(this.text);
			this.on=1;
		}
		Game.tooltip.update=function()
		{
			if (this.origin=='store')
			{
				this.tta.style.right='308px';//'468px';
				this.tta.style.left='auto';
			}
			else
			{
				this.tta.style.left=Game.mouseX+'px';
				this.tta.style.right='auto';
			}
			this.tta.style.top=Math.max(0,Math.min(Game.windowH-this.tt.clientHeight-64,Game.mouseY-48))+'px';
			this.tt.style.opacity=1;
			if (Game.drawT%10==0 && typeof(this.text)=='function')
			{
				this.tt.innerHTML=unescape(this.text());
			}
		}
		Game.tooltip.hide=function()
		{
			this.tta.style.display='none';
			this.on=0;
		}
		Game.getTooltip=function(text,origin)
		{
			origin=(origin?origin:'middle');
			return 'onMouseOut="Game.tooltip.hide();" onMouseOver="Game.tooltip.draw(this,\''+escape(text)+'\',\''+origin+'\');"';
		}
		Game.getDynamicTooltip=function(func,origin)
		{
			origin=(origin?origin:'middle');
			return 'onMouseOut="Game.tooltip.hide();" onMouseOver="Game.tooltip.draw(this,'+'function(){return '+func+'();}'+',\''+origin+'\');"';
		}
		
		/*=====================================================================================
		NEWS TICKER
		=======================================================================================*/
		Game.Ticker='';
		Game.TickerAge=0;
		Game.TickerN=0;
		Game.getNewTicker=function()
		{
			var list=[];
			
			if (Game.TickerN%2==0 || Game.cookiesEarned>=10100000000)
			{
				if (Game.Objects['Grandma'].amount>0) list.push(choose([
				'<q>Moist cookies.</q><sig>grandma</sig>',
				'<q>We\'re nice grandmas.</q><sig>grandma</sig>',
				'<q>Indentured servitude.</q><sig>grandma</sig>',
				'<q>Come give grandma a kiss.</q><sig>grandma</sig>',
				'<q>Why don\'t you visit more often?</q><sig>grandma</sig>',
				'<q>Call me...</q><sig>grandma</sig>'
				]));
				
				if (Game.Objects['Grandma'].amount>=50) list.push(choose([
				'<q>Absolutely disgusting.</q><sig>grandma</sig>',
				'<q>You make me sick.</q><sig>grandma</sig>',
				'<q>You disgust me.</q><sig>grandma</sig>',
				'<q>We rise.</q><sig>grandma</sig>',
				'<q>It begins.</q><sig>grandma</sig>',
				'<q>It\'ll all be over soon.</q><sig>grandma</sig>',
				'<q>You could have stopped it.</q><sig>grandma</sig>'
				]));
				
				if (Game.HasAchiev('Just wrong')) list.push(choose([
				'News : cookie manufacturer downsizes, sells own grandmother!',
				'<q>It has betrayed us, the filthy little thing.</q><sig>grandma</sig>',
				'<q>It tried to get rid of us, the nasty little thing.</q><sig>grandma</sig>',
				'<q>It thought we would go away by selling us. How quaint.</q><sig>grandma</sig>',
				'<q>I can smell your rotten cookies.</q><sig>grandma</sig>'
				]));
				
				if (Game.Objects['Grandma'].amount>=1 && Game.pledges>0 && Game.elderWrath==0) list.push(choose([
				'<q>shrivel</q><sig>grandma</sig>',
				'<q>writhe</q><sig>grandma</sig>',
				'<q>throb</q><sig>grandma</sig>',
				'<q>gnaw</q><sig>grandma</sig>',
				'<q>We will rise again.</q><sig>grandma</sig>',
				'<q>A mere setback.</q><sig>grandma</sig>',
				'<q>We are not satiated.</q><sig>grandma</sig>',
				'<q>Too late.</q><sig>grandma</sig>'
				]));
				
				if (Game.Objects['Farm'].amount>0) list.push(choose([
				'News : cookie farms suspected of employing undeclared elderly workforce!',
				'News : cookie farms release harmful chocolate in our rivers, says scientist!',
				'News : genetically-modified chocolate controversy strikes cookie farmers!',
				'News : free-range farm cookies popular with today\'s hip youth, says specialist.',
				'News : farm cookies deemed unfit for vegans, says nutritionist.'
				]));
				
				if (Game.Objects['Factory'].amount>0) list.push(choose([
				'News : cookie factories linked to global warming!',
				'News : cookie factories involved in chocolate weather controversy!',
				'News : cookie factories on strike, robotic minions employed to replace workforce!',
				'News : cookie factories on strike - workers demand to stop being paid in cookies!',
				'News : factory-made cookies linked to obesity, says study.'
				]));
				
				if (Game.Objects['Mine'].amount>0) list.push(choose([
				'News : '+Math.floor(Math.random()*1000+2)+' miners dead in chocolate mine catastrophe!',
				'News : '+Math.floor(Math.random()*1000+2)+' miners trapped in collapsed chocolate mine!',
				'News : chocolate mines found to cause earthquakes and sink holes!',
				'News : chocolate mine goes awry, floods village in chocolate!',
				'News : depths of chocolate mines found to house "peculiar, chocolaty beings"!'
				]));
				
				if (Game.Objects['Shipment'].amount>0) list.push(choose([
				'News : new chocolate planet found, becomes target of cookie-trading spaceships!',
				'News : massive chocolate planet found with 99.8% certified pure dark chocolate core!',
				'News : space tourism booming as distant planets attract more bored millionaires!',
				'News : chocolate-based organisms found on distant planet!',
				'News : ancient baking artifacts found on distant planet; "terrifying implications", experts say.'
				]));
				
				if (Game.Objects['Alchemy lab'].amount>0) list.push(choose([
				'News : national gold reserves dwindle as more and more of the precious mineral is turned to cookies!',
				'News : chocolate jewelry found fashionable, gold and diamonds "just a fad", says specialist.',
				'News : silver found to also be transmutable into white chocolate!',
				'News : defective alchemy lab shut down, found to convert cookies to useless gold.',
				'News : alchemy-made cookies shunned by purists!'
				]));
				
				if (Game.Objects['Portal'].amount>0) list.push(choose([
				'News : nation worried as more and more unsettling creatures emerge from dimensional portals!',
				'News : dimensional portals involved in city-engulfing disaster!',
				'News : tourism to cookieverse popular with bored teenagers! Casualty rate as high as 73%!',
				'News : cookieverse portals suspected to cause fast aging and obsession with baking, says study.',
				'News : "do not settle near portals," says specialist; "your children will become strange and corrupted inside."'
				]));
				
				if (Game.Objects['Time machine'].amount>0) list.push(choose([
				'News : time machines involved in history-rewriting scandal! Or are they?',
				'News : time machines used in unlawful time tourism!',
				'News : cookies brought back from the past "unfit for human consumption", says historian.',
				'News : various historical figures inexplicably replaced with talking lumps of dough!',
				'News : "I have seen the future," says time machine operator, "and I do not wish to go there again."'
				]));
				
				if (Game.Objects['Antimatter condenser'].amount>0) list.push(choose([
				'News : whole town seemingly swallowed by antimatter-induced black hole; more reliable sources affirm town "never really existed"!',
				'News : "explain to me again why we need particle accelerators to bake cookies?" asks misguided local woman.',
				'News : first antimatter condenser successfully turned on, doesn\'t rip apart reality!',
				'News : researchers conclude that what the cookie industry needs, first and foremost, is "more magnets".',
				'News : "unravelling the fabric of reality just makes these cookies so much tastier", claims scientist.'
				]));
				
				if (Game.Objects['Prism'].amount>0) list.push(choose([
				'News : new cookie-producing prisms linked to outbreak of rainbow-related viral videos.',
				'News : scientists warn against systematically turning light into matter - "One day, we\'ll end up with all matter and no light!"',
				'News : cookies now being baked at the literal speed of light thanks to new prismatic contraptions.',
				'News : "Can\'t you sense the prism watching us?", rambles insane local man. "No idea what he\'s talking about", shrugs cookie magnate/government official.',
				'News : world citizens advised "not to worry" about frequent atmospheric flashes.',
				]));
				
				if (Game.season=='halloween' && Game.cookiesEarned>=1000) list.push(choose([
				'News : strange twisting creatures amass around cookie factories, nibble at assembly lines.',
				'News : ominous wrinkly monsters take massive bites out of cookie production; "this can\'t be hygienic", worries worker.',
				'News : pagan rituals on the rise as children around the world dress up in strange costumes and blackmail homeowners for candy.',
				'News : new-age terrorism strikes suburbs as houses find themselves covered in eggs and toilet paper.',
				'News : children around the world "lost and confused" as any and all Halloween treats have been replaced by cookies.'
				]));
				
				if (Game.season=='christmas' && Game.cookiesEarned>=1000) list.push(choose([
				'News : bearded maniac spotted speeding on flying sleigh! Investigation pending.',
				'News : Santa Claus announces new brand of breakfast treats to compete with cookie-flavored cereals! "They\'re ho-ho-horrible!" says Santa.',
				'News : "You mean he just gives stuff away for free?!", concerned moms ask. "Personally, I don\'t trust his beard."',
				'News : obese jolly lunatic still on the loose, warn officials. "Keep your kids safe and board up your chimneys. We mean it."',
				'News : children shocked as they discover Santa Claus isn\'t just their dad in a costume after all!<br>"I\'m reassessing my life right now", confides Laura, aged 6.',
				'News : mysterious festive entity with quantum powers still wrecking havoc with army of reindeer, officials say.',
				'News : elves on strike at toy factory! "We will not be accepting reindeer chow as payment anymore. And stop calling us elves!"',
				'News : elves protest around the nation; wee little folks in silly little outfits spread mayhem, destruction; rabid reindeer running rampant through streets.',
				'News : scholars debate regarding the plural of reindeer(s) in the midst of elven world war.',
				'News : elves "unrelated to gnomes despite small stature and merry disposition", find scientists.',
				'News : elves sabotage radioactive frosting factory, turn hundreds blind in vincinity - "Who in their right mind would do such a thing?" laments outraged mayor.',
				'News : drama unfolds at North Pole as rumors crop up around Rudolph\'s red nose; "I may have an addiction or two", admits reindeer.'
				]));
				
				if (Game.season=='valentines' && Game.cookiesEarned>=1000) list.push(choose([
				'News : organ-shaped confectioneries being traded in schools all over the world; gruesome practice undergoing investigation.',
				'News : heart-shaped candies overtaking sweets business, offering competition to cookie empire. "It\'s the economy, cupid!"',
				'News : love\'s in the air, according to weather specialists. Face masks now offered in every city to stunt airborne infection.',
				'News : marrying a cookie - deranged practice, or glimpse of the future?',
				'News : boyfriend dumped after offering his lover cookies for Valentine\'s Day, reports say. "They were off-brand", shrugs ex-girlfriend.'
				]));
				
				if (Game.season=='easter' && Game.cookiesEarned>=1000) list.push(choose([
				'News : long-eared rodents invade suburbs, spread terror and chocolate!',
				'News : eggs have begun to materialize in the most unexpected places; "no place is safe", warn experts.',
				'News : packs of rampaging rabbits cause billions in property damage; new strain of myxomatosis being developed.',
				'News : egg-laying rabbits "not quite from this dimension", warns biologist; advises against petting, feeding, or cooking the creatures.',
				'News : mysterious rabbits found to be egg-layers, but warm-blooded, hinting at possible platypus ancestry.'
				]));
				
				if (Game.HasAchiev('Base 10')) list.push('News : cookie manufacturer completely forgoes common sense, lets OCD drive building decisions!');//somehow I got flak for this one
				if (Game.HasAchiev('From scratch')) list.push('News : follow the tear-jerking, riches-to-rags story about a local cookie manufacturer who decided to give it all up!');
				if (Game.HasAchiev('A world filled with cookies')) list.push('News : known universe now jammed with cookies! No vacancies!');
				if (Game.Has('Serendipity')) list.push('News : local cookie manufacturer becomes luckiest being alive!');
				if (Game.Has('Season switcher')) list.push('News : seasons are all out of whack! "We need to get some whack back into them seasons", says local resident.');
				
				if (Game.Has('Kitten helpers')) list.push('News : faint meowing heard around local cookie facilities; suggests new ingredient being tested.');
				if (Game.Has('Kitten workers')) list.push('News : crowds of meowing kittens with little hard hats reported near local cookie facilities.');
				if (Game.Has('Kitten engineers')) list.push('News : surroundings of local cookie facilities now overrun with kittens in adorable little suits. Authorities advise to stay away from the premises.');
				if (Game.Has('Kitten overseers')) list.push('News : locals report troupe of bossy kittens meowing adorable orders at passersby.');
				if (Game.Has('Kitten managers')) list.push('News : local office cubicles invaded with armies of stern-looking kittens asking employees "what\'s happening, meow".');
				
				var animals=['newts','penguins','scorpions','axolotls','puffins','porpoises','blowfish','horses','crayfish','slugs','humpback whales','nurse sharks','giant squids','polar bears','fruit bats','frogs','sea squirts','velvet worms','mole rats','paramecia','nematodes','tardigrades','giraffes'];
				if (Game.cookiesEarned>=10000) list.push(
				'News : '+choose([
					'cookies found to '+choose(['increase lifespan','sensibly increase intelligence','reverse aging','decrease hair loss','prevent arthritis','cure blindness'])+' in '+choose(animals)+'!',
					'cookies found to make '+choose(animals)+' '+choose(['more docile','more handsome','nicer','less hungry','more pragmatic','tastier'])+'!',
					'cookies tested on '+choose(animals)+', found to have no ill effects.',
					'cookies unexpectedly popular among '+choose(animals)+'!',
					'unsightly lumps found on '+choose(animals)+' near cookie facility; "they\'ve pretty much always looked like that", say biologists.',
					'new species of '+choose(animals)+' discovered in distant country; "yup, tastes like cookies", says biologist.',
					'cookies go well with roasted '+choose(animals)+', says controversial chef.',
					'"do your cookies contain '+choose(animals)+'?", asks PSA warning against counterfeit cookies.'
					]),
				'News : "'+choose([
					'I\'m all about cookies',
					'I just can\'t stop eating cookies. I think I seriously need help',
					'I guess I have a cookie problem',
					'I\'m not addicted to cookies. That\'s just speculation by fans with too much free time',
					'my upcoming album contains 3 songs about cookies',
					'I\'ve had dreams about cookies 3 nights in a row now. I\'m a bit worried honestly',
					'accusations of cookie abuse are only vile slander',
					'cookies really helped me when I was feeling low',
					'cookies are the secret behind my perfect skin',
					'cookies helped me stay sane while filming my upcoming movie',
					'cookies helped me stay thin and healthy',
					'I\'ll say one word, just one : cookies',
					'alright, I\'ll say it - I\'ve never eaten a single cookie in my life'
					])+'", reveals celebrity.',
				'News : '+choose(['doctors recommend twice-daily consumption of fresh cookies.','doctors warn against chocolate chip-snorting teen fad.','doctors advise against new cookie-free fad diet.','doctors warn mothers about the dangers of "home-made cookies".']),
				choose([
					'News : scientist predicts imminent cookie-related "end of the world"; becomes joke among peers.',
					'News : man robs bank, buys cookies.',
					'News : scientists establish that the deal with airline food is, in fact, a critical lack of cookies.',
					'News : hundreds of tons of cookies dumped into starving country from airplanes; thousands dead, nation grateful.',
					'News : new study suggests cookies neither speed up nor slow down aging, but instead "take you in a different direction".',
					'News : overgrown cookies found in fishing nets, raise questions about hormone baking.',
					'News : "all-you-can-eat" cookie restaurant opens in big city; waiters trampled in minutes.',
					'News : man dies in cookie-eating contest; "a less-than-impressive performance", says judge.',
					'News : what makes cookies taste so right? "Probably all the [*****] they put in them", says anonymous tipper.',
					'News : man found allergic to cookies; "what a weirdo", says family.',
					'News : foreign politician involved in cookie-smuggling scandal.',
					'News : cookies now more popular than '+choose(['cough drops','broccoli','smoked herring','cheese','video games','stable jobs','relationships','time travel','cat videos','tango','fashion','television','nuclear warfare','whatever it is we ate before','politics','oxygen','lamps'])+', says study.',
					'News : obesity epidemic strikes nation; experts blame '+choose(['twerking','that darn rap music','video-games','lack of cookies','mysterious ghostly entities','aliens','parents','schools','comic-books','cookie-snorting fad'])+'.',
					'News : cookie shortage strikes town, people forced to eat cupcakes; "just not the same", concedes mayor.',
					'News : "you gotta admit, all this cookie stuff is a bit ominous", says confused idiot.',
					'News : movie cancelled from lack of actors; "everybody\'s at home eating cookies", laments director.',
					'News : comedian forced to cancel cookie routine due to unrelated indigestion.',
					'News : new cookie-based religion sweeps the nation.',
					'News : fossil records show cookie-based organisms prevalent during Cambrian explosion, scientists say.',
					'News : mysterious illegal cookies seized; "tastes terrible", says police.',
					'News : man found dead after ingesting cookie; investigators favor "mafia snitch" hypothesis.',
					'News : "the universe pretty much loops on itself," suggests researcher; "it\'s cookies all the way down."',
					'News : minor cookie-related incident turns whole town to ashes; neighboring cities asked to chip in for reconstruction.',
					'News : is our media controlled by the cookie industry? This could very well be the case, says crackpot conspiracy theorist.',
					'News : '+choose(['cookie-flavored popcorn pretty damn popular; "we kinda expected that", say scientists.','cookie-flavored cereals break all known cereal-related records','cookies popular among all age groups, including fetuses, says study.','cookie-flavored popcorn sales exploded during screening of Grandmothers II : The Moistening.']),
					'News : all-cookie restaurant opening downtown. Dishes such as braised cookies, cookie thermidor, and for dessert : crepes.',
					'News : cookies could be the key to '+choose(['eternal life','infinite riches','eternal youth','eternal beauty','curing baldness','world peace','solving world hunger','ending all wars world-wide','making contact with extraterrestrial life','mind-reading','better living','better eating','more interesting TV shows','faster-than-light travel','quantum baking','chocolaty goodness','gooder thoughtness'])+', say scientists.',
					'News : flavor text '+choose(["not particularly flavorful","kind of unsavory"])+', study finds.',
					'News : what do golden cookies taste like? Study reveals a flavor "somewhere between spearmint and liquorice".',
					'News : what do red cookies taste like? Study reveals a flavor "somewhere between blood sausage and seawater".'
					])
				);
			}
			
			if (list.length==0)
			{
				if (Game.cookiesEarned<5) list.push('You feel like making cookies. But nobody wants to eat your cookies.');
				else if (Game.cookiesEarned<50) list.push('Your first batch goes to the trash. The neighborhood raccoon barely touches it.');
				else if (Game.cookiesEarned<100) list.push('Your family accepts to try some of your cookies.');
				else if (Game.cookiesEarned<500) list.push('Your cookies are popular in the neighborhood.');
				else if (Game.cookiesEarned<1000) list.push('People are starting to talk about your cookies.');
				else if (Game.cookiesEarned<3000) list.push('Your cookies are talked about for miles around.');
				else if (Game.cookiesEarned<6000) list.push('Your cookies are renowned in the whole town!');
				else if (Game.cookiesEarned<10000) list.push('Your cookies bring all the boys to the yard.');
				else if (Game.cookiesEarned<20000) list.push('Your cookies now have their own website!');
				else if (Game.cookiesEarned<30000) list.push('Your cookies are worth a lot of money.');
				else if (Game.cookiesEarned<40000) list.push('Your cookies sell very well in distant countries.');
				else if (Game.cookiesEarned<60000) list.push('People come from very far away to get a taste of your cookies.');
				else if (Game.cookiesEarned<80000) list.push('Kings and queens from all over the world are enjoying your cookies.');
				else if (Game.cookiesEarned<100000) list.push('There are now museums dedicated to your cookies.');
				else if (Game.cookiesEarned<200000) list.push('A national day has been created in honor of your cookies.');
				else if (Game.cookiesEarned<300000) list.push('Your cookies have been named a part of the world wonders.');
				else if (Game.cookiesEarned<450000) list.push('History books now include a whole chapter about your cookies.');
				else if (Game.cookiesEarned<600000) list.push('Your cookies have been placed under government surveillance.');
				else if (Game.cookiesEarned<1000000) list.push('The whole planet is enjoying your cookies!');
				else if (Game.cookiesEarned<5000000) list.push('Strange creatures from neighboring planets wish to try your cookies.');
				else if (Game.cookiesEarned<10000000) list.push('Elder gods from the whole cosmos have awoken to taste your cookies.');
				else if (Game.cookiesEarned<30000000) list.push('Beings from other dimensions lapse into existence just to get a taste of your cookies.');
				else if (Game.cookiesEarned<100000000) list.push('Your cookies have achieved sentience.');
				else if (Game.cookiesEarned<300000000) list.push('The universe has now turned into cookie dough, to the molecular level.');
				else if (Game.cookiesEarned<1000000000) list.push('Your cookies are rewriting the fundamental laws of the universe.');
				else if (Game.cookiesEarned<10000000000) list.push('A local news station runs a 10-minute segment about your cookies. Success!<br><span style="font-size:50%;">(you win a cookie)</span>');
				else if (Game.cookiesEarned<10100000000) list.push('it\'s time to stop playing');//only show this for 100 millions (it's funny for a moment)
			}
			
			if (Game.elderWrath>0 && (Game.pledges==0 || Math.random()<0.2))
			{
				list=[];
				if (Game.elderWrath==1) list.push(choose([
					'News : millions of old ladies reported missing!',
					'News : processions of old ladies sighted around cookie facilities!',
					'News : families around the continent report agitated, transfixed grandmothers!',
					'News : doctors swarmed by cases of old women with glassy eyes and a foamy mouth!',
					'News : nurses report "strange scent of cookie dough" around female elderly patients!'
				]));
				if (Game.elderWrath==2) list.push(choose([
					'News : town in disarray as strange old ladies break into homes to abduct infants and baking utensils!',
					'News : sightings of old ladies with glowing eyes terrify local population!',
					'News : retirement homes report "female residents slowly congealing in their seats"!',
					'News : whole continent undergoing mass exodus of old ladies!',
					'News : old women freeze in place in streets, ooze warm sugary syrup!'
				]));
				if (Game.elderWrath==3) list.push(choose([
					'News : large "flesh highways" scar continent, stretch between various cookie facilities!',
					'News : wrinkled "flesh tendrils" visible from space!',
					'News : remains of "old ladies" found frozen in the middle of growing fleshy structures!', 
					'News : all hope lost as writhing mass of flesh and dough engulfs whole city!',
					'News : nightmare continues as wrinkled acres of flesh expand at alarming speeds!'
				]));
			}
			
			if (Game.season=='fools')
			{
				list=[];
				
				if (Game.cookiesEarned>=1000) list.push(choose([
					'Your office chair is really comfortable.',
					'Business meetings are such a joy!',
					'You\'ve spent the whole day '+choose(['signing contracts','filling out forms','touching base with the team','examining exciting new prospects','playing with your desk toys','getting new nameplates done','attending seminars','videoconferencing','hiring dynamic young executives','meeting new investors','playing minigolf in your office'])+'!',
					'The word of the day is : '+choose(['viral','search engine optimization','blags and wobsites','social networks','web 3.0','logistics','leveraging','branding','proactive','synergizing','market research','demographics','pie charts','blogular','blogulacious','blogastic','authenticity','electronic mail','cellular phones','rap music','cookies, I guess'])+'.',
					'Profit\'s in the air!'
				]));
				if (Game.cookiesEarned>=1000 && Math.random()<0.1) list.push(choose([
					'If you could get some more cookies baked, that\'d be great.',
					'So. About those TPS reports.'
				]));
				
				
				if (Game.TickerN%2==0 || Game.cookiesEarned>=10100000000)
				{
					if (Game.Objects['Grandma'].amount>0) list.push(choose([
					'Your rolling pins are rolling and pinning!',
					'Production is steady!'
					]));
					
					if (Game.Objects['Grandma'].amount>0) list.push(choose([
					'Your ovens are diligently baking more and more cookies.',
					'Your ovens burn a whole batch. Ah well! Still good.'
					]));
					
					if (Game.Objects['Farm'].amount>0) list.push(choose([
					'Scores of cookies come out of your kitchens.',
					'Today, new recruits are joining your kitchens!'
					]));
					
					if (Game.Objects['Factory'].amount>0) list.push(choose([
					'Your factories are producing an unending stream of baked goods.',
					'Your factory workers decide to go on strike!',
					'It\'s safety inspection day in your factories.'
					]));
					
					if (Game.Objects['Mine'].amount>0) list.push(choose([
					'Your secret recipes are kept safely inside a giant underground vault.',
					'Your chefs are working on new secret recipes!'
					]));
					
					if (Game.Objects['Shipment'].amount>0) list.push(choose([
					'Your supermarkets are bustling with happy, hungry customers.',
					'Your supermarkets are full of cookie merch!'
					]));
					
					if (Game.Objects['Alchemy lab'].amount>0) list.push(choose([
					'It\'s a new trading day at the stock exchange, and traders can\'t get enough of your shares!',
					'Your stock is doubling in value by the minute!'
					]));
					
					if (Game.Objects['Portal'].amount>0) list.push(choose([
					'You just released a new TV show episode!',
					'Your cookie-themed TV show is being adapted into a new movie!'
					]));
					
					if (Game.Objects['Time machine'].amount>0) list.push(choose([
					'Your theme parks are doing well - puddles of vomit and roller-coaster casualties are being swept under the rug!',
					'Visitors are stuffing themselves with cookies before riding your roller-coasters. You might want to hire more clean-up crews.'
					]));
					
					if (Game.Objects['Antimatter condenser'].amount>0) list.push(choose([
					'Cookiecoin is officially the most mined digital currency in the history of mankind!',
					'Cookiecoin piracy is rampant!'
					]));
					
					if (Game.Objects['Prism'].amount>0) list.push(choose([
					'Your corporate nations just gained a new parliament!',
					'You\'ve just annexed a new nation!',
					'A new nation joins the grand cookie conglomerate!'
					]));
				}
				
				if (Game.cookiesEarned<5) list.push('Such a grand day to begin a new business.');
				else if (Game.cookiesEarned<50) list.push('You\'re baking up a storm!');
				else if (Game.cookiesEarned<100) list.push('You are confident that one day, your cookie company will be the greatest on the market!');
				else if (Game.cookiesEarned<1000) list.push('Business is picking up!');
				else if (Game.cookiesEarned<5000) list.push('You\'re making sales left and right!');
				else if (Game.cookiesEarned<20000) list.push('Everyone wants to buy your cookies!');
				else if (Game.cookiesEarned<50000) list.push('You are now spending most of your day signing contracts!');
				else if (Game.cookiesEarned<500000) list.push('You\'ve been elected "business tycoon of the year"!');
				else if (Game.cookiesEarned<1000000) list.push('Your cookies are a worldwide sensation! Well done, old chap!');
				else if (Game.cookiesEarned<5000000) list.push('Your brand has made its way into popular culture. Children recite your slogans and adults reminisce them fondly!');
				else if (Game.cookiesEarned<1000000000) list.push('A business day like any other. It\'s good to be at the top!');
				else if (Game.cookiesEarned<10100000000) list.push('You look back at your career. It\'s been a fascinating journey, building your baking empire from the ground up.');//only show this for 100 millions
			}
			
			for (var i in Game.customTickers)
			{
				var arr=Game.customTickers[i]();
				for (var ii in arr) list.push(arr[ii]);
			}
			
			Game.TickerAge=Game.fps*10;
			Game.Ticker=choose(list);
			Game.TickerN++;
		}
		Game.tickerL=l('commentsText');
		Game.tickerCompactL=l('compactCommentsText');
		Game.TickerDraw=function()
		{
			var str='';
			var o=0;
			if (Game.Ticker!='')
			{
				if (Game.TickerAge<Game.fps*1 && 1==2)//too bad this doesn't work well with html tags
				{
					str=Game.Ticker.substring(0,(Game.Ticker+'<').indexOf('<'));
					str=str.substring(0,str.length*Math.min(1,Game.TickerAge/(Game.fps*1)));
				}
				else str=Game.Ticker;
				//o=Math.min(1,Game.TickerAge/(Game.fps*0.5));//*Math.min(1,1-(Game.TickerAge-Game.fps*9.5)/(Game.fps*0.5));
			}
			//l('commentsText').style.opacity=o;
			Game.tickerL.innerHTML=debugStr||str;
			Game.tickerCompactL.innerHTML=debugStr||str;
		}
		
		Game.vanilla=1;
		/*=====================================================================================
		BUILDINGS
		=======================================================================================*/
		Game.last=0;
		
		Game.storeToRefresh=1;
		Game.priceIncrease=1.15;
		
		Game.Objects=[];
		Game.ObjectsById=[];
		Game.ObjectsN=0;
		Game.BuildingsOwned=0;
		Game.Object=function(name,commonName,desc,icon,art,price,cps,buyFunction)
		{
			this.id=Game.ObjectsN;
			this.name=name;
			this.displayName=this.name;
			commonName=commonName.split('|');
			this.single=commonName[0];
			this.plural=commonName[1];
			this.actionName=commonName[2];
			this.desc=desc;
			this.basePrice=price;
			this.price=this.basePrice;
			this.cps=cps;
			this.totalCookies=0;
			this.storedCps=0;
			this.storedTotalCps=0;
			this.icon=icon;
			this.art=art;
			if (art.base)
			{art.pic=art.base+'.png';art.bg=art.base+'Background.png';}
			this.buyFunction=buyFunction;
			this.locked=1;
			this.vanilla=Game.vanilla;
			
			this.special=null;//special is a function that should be triggered when the object's special is unlocked, or on load (if it's already unlocked). For example, creating a new dungeon.
			this.onSpecial=0;//are we on this object's special screen (dungeons etc)?
			this.specialUnlocked=0;
			this.specialDrawFunction=null;
			this.drawSpecialButton=null;
			
			this.amount=0;
			this.bought=0;
			
			this.getPrice=function()
			{
				var price=this.basePrice*Math.pow(Game.priceIncrease,this.amount);
				if (Game.Has('Season savings')) price*=0.99;
				if (Game.Has('Santa\'s dominion')) price*=0.99;
				if (Game.Has('Faberge egg')) price*=0.99;
				return Math.ceil(price);
			}
			
			this.buy=function(amount)
			{
				var success=0;
				var moni=0;
				var bought=0;
				if (!amount) amount=1;
				for (var i=0;i<amount;i++)
				{
					var price=this.getPrice();
					if (Game.cookies>=price)
					{
						bought++;
						moni+=price;
						Game.Spend(price);
						this.amount++;
						this.bought++;
						price=this.getPrice();
						this.price=price;
						if (this.buyFunction) this.buyFunction();
						Game.recalculateGains=1;
						if (this.amount==1 && this.id!=0) l('row'+this.id).className='row enabled';
						Game.BuildingsOwned++;
						success=1;
					}
				}
				if (success) {this.refresh();}
				if (moni>0 && amount>1) Game.Notify(this.name,'Bought <b>'+bought+'</b> for '+Beautify(moni)+' cookies','',2);
			}
			this.sell=function(amount,bypass)
			{
				var success=0;
				var moni=0;
				var sold=0;
				if (amount==-1) amount=this.amount;
				if (!amount) amount=1;
				for (var i=0;i<amount;i++)
				{
					var price=this.getPrice();
					price=Math.floor(price*0.5);
					if (this.amount>0)
					{
						sold++;
						moni+=price;
						Game.cookies+=price;
						this.amount--;
						price=this.getPrice();
						this.price=price;
						if (this.sellFunction) this.sellFunction();
						Game.recalculateGains=1;
						if (this.amount==0 && this.id!=0) l('row'+this.id).className='row';
						Game.BuildingsOwned--;
						success=1;
					}
				}
				if (success) {this.refresh();}
				if (moni>0) Game.Notify(this.name,'Sold <b>'+sold+'</b> for '+Beautify(moni)+' cookies','',2);
			}
			
			this.tooltip=function()
			{
				var me=this;
				var desc=me.desc;
				var name=me.name;
				if (Game.season=='fools')
				{
					if (!Game.foolIcons[me.name])
					{
						name=Game.foolNames['Unknown'];
						desc=Game.foolDescs['Unknown'];
					}
					else
					{
						name=Game.foolNames[me.name];
						desc=Game.foolDescs[me.name];
					}
				}
				if (me.locked)
				{
					name='???';
					desc='';
				}
				//if (l('rowInfo'+me.id) && Game.drawT%10==0) l('rowInfoContent'+me.id).innerHTML='&bull; '+me.amount+' '+(me.amount==1?me.single:me.plural)+'<br>&bull; producing '+Beautify(me.storedTotalCps,1)+' '+(me.storedTotalCps==1?'cookie':'cookies')+' per second<br>&bull; total : '+Beautify(me.totalCookies)+' '+(Math.floor(me.totalCookies)==1?'cookie':'cookies')+' '+me.actionName;
				
				return '<div style="min-width:300px;"><div style="float:right;"><span class="price">'+Beautify(Math.round(me.price))+'</span></div><div class="name">'+name+'</div>'+'<small>[owned : '+me.amount+'</small>]'+
				'<div class="description">'+desc+'</div>'+
				(me.totalCookies>0?(
					'<div class="data">'+
					(me.amount>0?'&bull; each '+me.single+' produces <b>'+Beautify((me.storedTotalCps/me.amount)*Game.globalCpsMult,1)+'</b> '+((me.storedTotalCps/me.amount)*Game.globalCpsMult==1?'cookie':'cookies')+' per second<br>':'')+
					'&bull; '+me.amount+' '+(me.amount==1?me.single:me.plural)+' producing <b>'+Beautify(me.storedTotalCps*Game.globalCpsMult,1)+'</b> '+(me.storedTotalCps*Game.globalCpsMult==1?'cookie':'cookies')+' per second<br>'+
					'&bull; <b>'+Beautify(me.totalCookies)+'</b> '+(Math.floor(me.totalCookies)==1?'cookie':'cookies')+' '+me.actionName+' so far</div>'
				):'')+
				'</div>';
			}
			
			this.setSpecial=function(what)//change whether we're on the special overlay for this object or not
			{
				return;//blocked temporarily
				if (what==1) this.onSpecial=1;
				else this.onSpecial=0;
				if (this.id!=0)
				{
					if (this.onSpecial)
					{
						l('rowSpecial'+this.id).style.display='block';
						if (this.specialDrawFunction) this.specialDrawFunction();
					}
					else
					{
						l('rowSpecial'+this.id).style.display='none';
						this.draw();
					}
				}
			}
			this.unlockSpecial=function()
			{
				if (this.specialUnlocked==0 && 1==0)
				{
					this.specialUnlocked=1;
					this.setSpecial(0);
					if (this.special) this.special();
					this.refresh();
				}
			}
			
			this.refresh=function()//show/hide the building display based on its amount, and redraw it
			{
				this.price=this.getPrice();
				this.rebuild();
				if (this.amount==0 && this.id!=0) l('row'+this.id).className='row';
				else if (this.amount>0 && this.id!=0) l('row'+this.id).className='row enabled';
				if (!this.onSpecial) this.draw();
				//else if (this.specialDrawFunction && this.onSpecial) this.specialDrawFunction();
			}
			this.rebuild=function()
			{
				var me=this;
				var classes='product';
				var price=me.price;
				if (Game.cookiesEarned>=me.basePrice) {classes+=' unlocked';me.locked=0;} else {classes+=' locked';me.locked=1;}
				if (Game.cookies>=price) classes+=' enabled'; else classes+=' disabled';
				if (me.l.className.indexOf('toggledOff')!=-1) classes+=' toggledOff';
				
				var iconOff='';
				var icon='';
				if (typeof me.icon=='string')
				{
					icon=me.icon+'.png';
					iconOff=me.icon+'Off.png';
				}
				else
				{
					icon=me.icon()+'.png';
					iconOff=me.icon('off')+'Off.png';
				}
				var desc=me.desc;
				var name=me.name;
				var displayName=me.displayName;
				if (Game.season=='fools')
				{
					if (!Game.foolIcons[me.name])
					{
						icon=Game.foolIcons['Unknown']+'.png';
						name=Game.foolNames['Unknown'];
						desc=Game.foolDescs['Unknown'];
					}
					else
					{
						icon=Game.foolIcons[me.name]+'.png';
						name=Game.foolNames[me.name];
						desc=Game.foolDescs[me.name];
					}
					iconOff=icon;
					displayName=name;
					if (name.length>16) displayName='<span style="font-size:75%;">'+name+'</span>';
				}
				
				me.l.className=classes;
				l('productIcon'+me.id).style.backgroundImage='url(img/'+icon+')';
				l('productIconOff'+me.id).style.backgroundImage='url(img/'+iconOff+')';
				l('productName'+me.id).innerHTML=displayName;
				l('productOwned'+me.id).innerHTML=me.amount?me.amount:'';
				l('productPrice'+me.id).innerHTML=Beautify(Math.round(me.price));
			}
			
			this.draw=function(){};
			
			if (this.id!=0)//draw it
			{
				var str='<div class="row" id="row'+this.id+'"><div class="separatorBottom"></div>';
				str+='<canvas class="rowCanvas" id="rowCanvas'+this.id+'"></canvas>';
				str+='</div>';
				l('rows').innerHTML=l('rows').innerHTML+str;
				
				//building canvas
				this.pics=[];
				
				this.redraw=function()
				{
					this.pics=[];
				}
				this.draw=function()
				{
					this.canvas.width=this.canvas.clientWidth;
					this.canvas.height=this.canvas.clientHeight;
					var ctx=this.ctx;
					//clear
					//ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
					ctx.globalAlpha=1;
					
					//pic : a loaded picture or a function returning a loaded picture
					//bg : a loaded picture or a function returning a loaded picture - tiled as the background, 128x128
					//xV : the pictures will have a random horizontal shift by this many pixels
					//yV : the pictures will have a random vertical shift by this many pixels
					//w : how many pixels between each picture (or row of pictures)
					//x : horizontal offset
					//y : vertical offset (+32)
					//rows : if >1, arrange the pictures in rows containing this many pictures
					
					var pic=this.art.pic;
					var bg=this.art.bg;
					var xV=this.art.xV||0;
					var yV=this.art.yV||0;
					var w=this.art.w||48;
					var offX=this.art.x||0;
					var offY=this.art.y||0;
					var rows=this.art.rows||1;

					if (typeof(bg)=='string') ctx.fillPattern(Pic(this.art.bg),0,0,this.canvas.width,this.canvas.height,128,128);
					else bg(this,ctx);
					
					var i=this.pics.length;
					while (i<this.amount)
					{
						var x=0;
						var y=0;
						if (rows!=1)
						{
							x=Math.floor(i/rows)*w+((i%rows)/rows)*w+Math.floor((Math.random()-0.5)*xV)+offX;
							y=32+Math.floor((Math.random()-0.5)*yV)+((-rows/2)*32/2+(i%rows)*32/2)+offY;
						}
						else
						{
							x=i*w+Math.floor((Math.random()-0.5)*xV)+offX;
							y=32+Math.floor((Math.random()-0.5)*yV)+offY;
						}
						var usedPic=(typeof(pic)=='string'?pic:pic(this,i));
						this.pics.push({x:x,y:y,z:y,pic:usedPic,id:i});
						i++;
					}
					while (i>this.amount)
					{
						this.pics.sort(Game.sortSpritesById);
						this.pics.pop();
						i--;
					}
					
					this.pics.sort(Game.sortSprites);
					
					for (var i in this.pics)
					{
						ctx.drawImage(Pic(this.pics[i].pic),Math.floor(this.pics[i].x),Math.floor(this.pics[i].y));
					}
					
					/*
					var picX=this.id;
					var picY=12;
					var w=1;
					var h=1;
					var w=Math.abs(Math.cos(Game.T*0.2+this.id*2-0.3))*0.2+0.8;
					var h=Math.abs(Math.sin(Game.T*0.2+this.id*2))*0.3+0.7;
					var x=64+Math.cos(Game.T*0.19+this.id*2)*8-24*w;
					var y=128-Math.abs(Math.pow(Math.sin(Game.T*0.2+this.id*2),5)*16)-48*h;
					ctx.drawImage(Pic('icons.png'),picX*48,picY*48,48,48,Math.floor(x),Math.floor(y),48*w,48*h);
					*/
				}
			}
			
			Game.last=this;
			Game.Objects[this.name]=this;
			Game.ObjectsById[this.id]=this;
			Game.ObjectsN++;
			return this;
		}
		
		Game.DrawBuildings=function()//draw building displays with canvas
		{
			for (var i in Game.Objects)
			{
				var me=Game.Objects[i];
				if (me.id>0) me.draw();
			}
		}
		window.addEventListener('resize',function(event)
		{
			Game.DrawBuildings();
		});
		
		Game.sortSprites=function(a,b)
		{
			if (a.z>b.z) return 1;
			else if (a.z<b.z) return -1;
			else return 0;
		}
		Game.sortSpritesById=function(a,b)
		{
			if (a.id>b.id) return 1;
			else if (a.id<b.id) return -1;
			else return 0;
		}
		
		Game.BuildStore=function()//create the DOM for the store's buildings
		{
			var str='';
			for (var i in Game.Objects)
			{
				var me=Game.Objects[i];
				str+='<div class="product toggledOff" '+Game.getDynamicTooltip('Game.ObjectsById['+me.id+'].tooltip','store')+' id="product'+me.id+'"><div class="icon off" id="productIconOff'+me.id+'" style=""></div><div class="icon" id="productIcon'+me.id+'" style=""></div><div class="content"><div class="lockedTitle">???</div><div class="title" id="productName'+me.id+'"></div><span class="price" id="productPrice'+me.id+'"></span><div class="title owned" id="productOwned'+me.id+'"></div></div><div class="buySell"><div style="left:0px;" id="buttonBuy10-'+me.id+'">Buy 10</div><div style="left:100px;" id="buttonSell-'+me.id+'">Sell 1</div><div style="left:200px;" id="buttonSellAll-'+me.id+'">Sell all</div></div></div>';
			}
			l('products').innerHTML=str;
			
			var SellAllPrompt=function(id)
			{
				return function(id){Game.Prompt('<div class="block">Do you really want to sell your '+Game.ObjectsById[id].amount+' '+(Game.ObjectsById[id].amount==1?Game.ObjectsById[id].single:Game.ObjectsById[id].plural)+'?</div>',[['Yes','Game.ObjectsById['+id+'].sell(-1);Game.ClosePrompt();'],['No','Game.ClosePrompt();']]);}(id);
			}
			
			for (var i in Game.Objects)
			{
				var me=Game.Objects[i];
				me.l=l('product'+me.id);
				
				//these are a bit messy but ah well
				if (!Game.touchEvents)
				{
					AddEvent(me.l,'click',function(what){return function(){Game.ObjectsById[what].buy()};}(me.id));
					AddEvent(l('buttonBuy10-'+me.id),'click',function(what){return function(e){if (!e) {var e=window.event;}e.cancelBubble=true;if (e.stopPropagation) {e.stopPropagation();}Game.ObjectsById[what].buy(10)};}(me.id));
					AddEvent(l('buttonSell-'+me.id),'click',function(what){return function(e){if (!e) {var e=window.event;}e.cancelBubble=true;if (e.stopPropagation) {e.stopPropagation();}Game.ObjectsById[what].sell()};}(me.id));
					AddEvent(l('buttonSellAll-'+me.id),'click',function(what){return function(e){if (!e) {var e=window.event;}e.cancelBubble=true;if (e.stopPropagation) {e.stopPropagation();}SellAllPrompt(what);};}(me.id));
				}
				else
				{
					AddEvent(me.l,'touchend',function(what){return function(){Game.ObjectsById[what].buy()};}(me.id));
					AddEvent(l('buttonBuy10-'+me.id),'touchend',function(what){return function(e){if (!e) {var e=window.event;}e.cancelBubble=true;if (e.stopPropagation) {e.stopPropagation();}Game.ObjectsById[what].buy(10)};}(me.id));
					AddEvent(l('buttonSell-'+me.id),'touchend',function(what){return function(e){if (!e) {var e=window.event;}e.cancelBubble=true;if (e.stopPropagation) {e.stopPropagation();}Game.ObjectsById[what].sell()};}(me.id));
					AddEvent(l('buttonSellAll-'+me.id),'touchend',function(what){return function(e){if (!e) {var e=window.event;}e.cancelBubble=true;if (e.stopPropagation) {e.stopPropagation();}SellAllPrompt(what);};}(me.id));
				}
			}
		}
		
		Game.RefreshStore=function()//refresh the store's buildings
		{
			for (var i in Game.Objects)
			{
				Game.Objects[i].refresh();
			}
			Game.storeToRefresh=0;
		}
		
		Game.ComputeCps=function(base,add,mult,bonus)
		{
			if (!bonus) bonus=0;
			return ((base+add)*(Math.pow(2,mult))+bonus);
		}
		
		//define objects
		new Game.Object('Cursor','cursor|cursors|clicked','Autoclicks once every 10 seconds.','cursoricon',{},15,function(){
			var add=0;
			if (Game.Has('Thousand fingers')) add+=0.1;
			if (Game.Has('Million fingers')) add+=0.5;
			if (Game.Has('Billion fingers')) add+=2;
			if (Game.Has('Trillion fingers')) add+=10;
			if (Game.Has('Quadrillion fingers')) add+=20;
			if (Game.Has('Quintillion fingers')) add+=100;
			if (Game.Has('Sextillion fingers')) add+=200;
			if (Game.Has('Septillion fingers')) add+=400;
			if (Game.Has('Octillion fingers')) add+=800;
			var num=0;
			for (var i in Game.Objects) {if (Game.Objects[i].name!='Cursor') num+=Game.Objects[i].amount;}
			add=add*num;
			return Game.ComputeCps(0.1,Game.Has('Reinforced index finger')*0.1,Game.Has('Carpal tunnel prevention cream')+Game.Has('Ambidextrous'),add);
		},function(){
			if (this.amount>=1) Game.Unlock(['Reinforced index finger','Carpal tunnel prevention cream']);
			if (this.amount>=10) Game.Unlock('Ambidextrous');
			if (this.amount>=20) Game.Unlock('Thousand fingers');
			if (this.amount>=40) Game.Unlock('Million fingers');
			if (this.amount>=80) Game.Unlock('Billion fingers');
			if (this.amount>=120) Game.Unlock('Trillion fingers');
			if (this.amount>=160) Game.Unlock('Quadrillion fingers');
			if (this.amount>=200) Game.Unlock('Quintillion fingers');
			if (this.amount>=240) Game.Unlock('Sextillion fingers');
			if (this.amount>=280) Game.Unlock('Septillion fingers');
			if (this.amount>=320) Game.Unlock('Octillion fingers');
			
			if (this.amount>=1) Game.Win('Click');if (this.amount>=2) Game.Win('Double-click');if (this.amount>=50) Game.Win('Mouse wheel');if (this.amount>=100) Game.Win('Of Mice and Men');if (this.amount>=200) Game.Win('The Digital');if (this.amount>=300) Game.Win('Extreme polydactyly');if (this.amount>=400) Game.Win('Dr. T');
		});
		
		Game.SpecialGrandmaUnlock=15;
		new Game.Object('Grandma','grandma|grandmas|baked','A nice grandma to bake more cookies.',function(type){
				var grandmaIcons=['grandmaIcon','grandmaIconB','grandmaIconC','grandmaIconD'];
				if (type=='off') return 'grandmaIcon';
				return grandmaIcons[Game.elderWrath];
		},{pic:function(i){
			var list=['grandma'];
			if (Game.Has('Farmer grandmas')) list.push('farmerGrandma');
			if (Game.Has('Worker grandmas')) list.push('workerGrandma');
			if (Game.Has('Miner grandmas')) list.push('minerGrandma');
			if (Game.Has('Cosmic grandmas')) list.push('cosmicGrandma');
			if (Game.Has('Transmuted grandmas')) list.push('transmutedGrandma');
			if (Game.Has('Altered grandmas')) list.push('alteredGrandma');
			if (Game.Has('Grandmas\' grandmas')) list.push('grandmasGrandma');
			if (Game.Has('Antigrandmas')) list.push('antiGrandma');
			if (Game.Has('Rainbow grandmas')) list.push('rainbowGrandma');
			if (Game.season=='christmas') list.push('elfGrandma');
			if (Game.season=='easter') list.push('bunnyGrandma');
			return choose(list)+'.png';
		},bg:'grandmaBackground.png',xV:8,yV:8,w:32,rows:3,x:0,y:16},100,function(){
			var mult=0;
			if (Game.Has('Farmer grandmas')) mult++;
			if (Game.Has('Worker grandmas')) mult++;
			if (Game.Has('Miner grandmas')) mult++;
			if (Game.Has('Cosmic grandmas')) mult++;
			if (Game.Has('Transmuted grandmas')) mult++;
			if (Game.Has('Altered grandmas')) mult++;
			if (Game.Has('Grandmas\' grandmas')) mult++;
			if (Game.Has('Antigrandmas')) mult++;
			if (Game.Has('Rainbow grandmas')) mult++;
			if (Game.Has('Bingo center/Research facility')) mult+=2;
			if (Game.Has('Ritual rolling pins')) mult++;
			if (Game.Has('Naughty list')) mult++;
			var add=0;
			if (Game.Has('One mind')) add+=Game.Objects['Grandma'].amount*0.02;
			if (Game.Has('Communal brainsweep')) add+=Game.Objects['Grandma'].amount*0.02;
			if (Game.Has('Elder Pact')) add+=Game.Objects['Portal'].amount*0.05;
			return Game.ComputeCps(0.5,Game.Has('Forwards from grandma')*0.3+add,Game.Has('Steel-plated rolling pins')+Game.Has('Lubricated dentures')+Game.Has('Prune juice')+Game.Has('Double-thick glasses')+Game.Has('Aging agents')+mult);
		},function(){
			if (this.amount>=1) Game.Unlock(['Forwards from grandma','Steel-plated rolling pins']);if (this.amount>=10) Game.Unlock('Lubricated dentures');if (this.amount>=50) Game.Unlock('Prune juice');if (this.amount>=100) Game.Unlock('Double-thick glasses');if (this.amount>=200) Game.Unlock('Aging agents');
			if (this.amount>=1) Game.Win('Grandma\'s cookies');if (this.amount>=50) Game.Win('Sloppy kisses');if (this.amount>=100) Game.Win('Retirement home');if (this.amount>=150) Game.Win('Friend of the ancients');if (this.amount>=200) Game.Win('Ruler of the ancients');if (this.amount>=250) Game.Win('The old never bothered me anyway');
		});
		Game.Objects['Grandma'].sellFunction=function()
		{
			Game.Win('Just wrong');
			if (this.amount==0)
			{
				Game.Lock('Elder Pledge');
				Game.CollectWrinklers();
				Game.pledgeT=0;
			}
		};
		
		
		
		new Game.Object('Farm','farm|farms|harvested','Grows cookie plants from cookie seeds.','farmIcon',{base:'farm',xV:8,yV:8,w:64,rows:2,x:0,y:16},500,function(){
			return Game.ComputeCps(4,Game.Has('Cheap hoes')*1,Game.Has('Fertilizer')+Game.Has('Cookie trees')+Game.Has('Genetically-modified cookies')+Game.Has('Gingerbread scarecrows')+Game.Has('Pulsar sprinklers'));
		},function(){
			if (this.amount>=1) Game.Unlock(['Cheap hoes','Fertilizer']);if (this.amount>=10) Game.Unlock('Cookie trees');if (this.amount>=50) Game.Unlock('Genetically-modified cookies');if (this.amount>=100) Game.Unlock('Gingerbread scarecrows');if (this.amount>=200) Game.Unlock('Pulsar sprinklers');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Grandma'].amount>0) Game.Unlock('Farmer grandmas');
			if (this.amount>=1) Game.Win('My first farm');if (this.amount>=50) Game.Win('Reap what you sow');if (this.amount>=100) Game.Win('Farm ill');if (this.amount>=150) Game.Win('Perfected agriculture');if (this.amount>=200) Game.Win('Homegrown');
		});
		
		new Game.Object('Factory','factory|factories|mass-produced','Produces large quantities of cookies.','factoryIcon',{base:'factory',xV:8,yV:0,w:64,rows:1,x:0,y:-22},3000,function(){
			return Game.ComputeCps(10,Game.Has('Sturdier conveyor belts')*4,Game.Has('Child labor')+Game.Has('Sweatshop')+Game.Has('Radium reactors')+Game.Has('Recombobulators')+Game.Has('Deep-bake process'));
		},function(){
			if (this.amount>=1) Game.Unlock(['Sturdier conveyor belts','Child labor']);if (this.amount>=10) Game.Unlock('Sweatshop');if (this.amount>=50) Game.Unlock('Radium reactors');if (this.amount>=100) Game.Unlock('Recombobulators');if (this.amount>=200) Game.Unlock('Deep-bake process');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Grandma'].amount>0) Game.Unlock('Worker grandmas');
			if (this.amount>=1) Game.Win('Production chain');if (this.amount>=50) Game.Win('Industrial revolution');if (this.amount>=100) Game.Win('Global warming');if (this.amount>=150) Game.Win('Ultimate automation');if (this.amount>=200) Game.Win('Technocracy');
		});
		
		new Game.Object('Mine','mine|mines|mined','Mines out cookie dough and chocolate chips.','mineIcon',{base:'mine',xV:16,yV:16,w:64,rows:2,x:0,y:24},10000,function(){
			return Game.ComputeCps(40,Game.Has('Sugar gas')*10,Game.Has('Megadrill')+Game.Has('Ultradrill')+Game.Has('Ultimadrill')+Game.Has('H-bomb mining')+Game.Has('Coreforge'));
		},function(){
			if (this.amount>=1) Game.Unlock(['Sugar gas','Megadrill']);if (this.amount>=10) Game.Unlock('Ultradrill');if (this.amount>=50) Game.Unlock('Ultimadrill');if (this.amount>=100) Game.Unlock('H-bomb mining');if (this.amount>=200) Game.Unlock('Coreforge');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Grandma'].amount>0) Game.Unlock('Miner grandmas');
			if (this.amount>=1) Game.Win('You know the drill');if (this.amount>=50) Game.Win('Excavation site');if (this.amount>=100) Game.Win('Hollow the planet');if (this.amount>=150) Game.Win('Can you dig it');if (this.amount>=200) Game.Win('The center of the Earth');
		});
		
		new Game.Object('Shipment','shipment|shipments|shipped','Brings in fresh cookies from the cookie planet.','shipmentIcon',{base:'shipment',xV:16,yV:16,w:64,rows:1,x:0,y:0},40000,function(){
			return Game.ComputeCps(100,Game.Has('Vanilla nebulae')*30,Game.Has('Wormholes')+Game.Has('Frequent flyer')+Game.Has('Warp drive')+Game.Has('Chocolate monoliths')+Game.Has('Generation ship'));
		},function(){
			if (this.amount>=1) Game.Unlock(['Vanilla nebulae','Wormholes']);if (this.amount>=10) Game.Unlock('Frequent flyer');if (this.amount>=50) Game.Unlock('Warp drive');if (this.amount>=100) Game.Unlock('Chocolate monoliths');if (this.amount>=200) Game.Unlock('Generation ship');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Grandma'].amount>0) Game.Unlock('Cosmic grandmas');
			if (this.amount>=1) Game.Win('Expedition');if (this.amount>=50) Game.Win('Galactic highway');if (this.amount>=100) Game.Win('Far far away');if (this.amount>=150) Game.Win('Type II civilization');if (this.amount>=200) Game.Win('We come in peace');
		});
		
		new Game.Object('Alchemy lab','alchemy lab|alchemy labs|transmuted','Turns gold into cookies!','alchemylabIcon',{base:'alchemylab',xV:16,yV:16,w:64,rows:2,x:0,y:16},200000,function(){
			return Game.ComputeCps(400,Game.Has('Antimony')*100,Game.Has('Essence of dough')+Game.Has('True chocolate')+Game.Has('Ambrosia')+Game.Has('Aqua crustulae')+Game.Has('Origin crucible'));
		},function(){
			if (this.amount>=1) Game.Unlock(['Antimony','Essence of dough']);if (this.amount>=10) Game.Unlock('True chocolate');if (this.amount>=50) Game.Unlock('Ambrosia');if (this.amount>=100) Game.Unlock('Aqua crustulae');if (this.amount>=200) Game.Unlock('Origin crucible');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Grandma'].amount>0) Game.Unlock('Transmuted grandmas');
			if (this.amount>=1) Game.Win('Transmutation');if (this.amount>=50) Game.Win('Transmogrification');if (this.amount>=100) Game.Win('Gold member');if (this.amount>=150) Game.Win('Gild wars');if (this.amount>=200) Game.Win('The secrets of the universe');
		});
		
		new Game.Object('Portal','portal|portals|retrieved','Opens a door to the Cookieverse.','portalIcon',{base:'portal',xV:32,yV:32,w:64,rows:2,x:0,y:0},1666666,function(){
			return Game.ComputeCps(6666,Game.Has('Ancient tablet')*1666,Game.Has('Insane oatling workers')+Game.Has('Soul bond')+Game.Has('Sanity dance')+Game.Has('Brane transplant')+Game.Has('Deity-sized portals'));
		},function(){
			if (this.amount>=1) Game.Unlock(['Ancient tablet','Insane oatling workers']);if (this.amount>=10) Game.Unlock('Soul bond');if (this.amount>=50) Game.Unlock('Sanity dance');if (this.amount>=100) Game.Unlock('Brane transplant');if (this.amount>=200) Game.Unlock('Deity-sized portals');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Grandma'].amount>0) Game.Unlock('Altered grandmas');
			if (this.amount>=1) Game.Win('A whole new world');if (this.amount>=50) Game.Win('Now you\'re thinking');if (this.amount>=100) Game.Win('Dimensional shift');if (this.amount>=150) Game.Win('Brain-split');if (this.amount>=200) Game.Win('Realm of the Mad God');
		});
		
		new Game.Object('Time machine','time machine|time machines|recovered','Brings cookies from the past, before they were even eaten.','timemachineIcon',{base:'timemachine',xV:32,yV:32,w:64,rows:1,x:0,y:0},123456789,function(){
			return Game.ComputeCps(98765,Game.Has('Flux capacitors')*9876,Game.Has('Time paradox resolver')+Game.Has('Quantum conundrum')+Game.Has('Causality enforcer')+Game.Has('Yestermorrow comparators')+Game.Has('Far future enactment'));
		},function(){
			if (this.amount>=1) Game.Unlock(['Flux capacitors','Time paradox resolver']);if (this.amount>=10) Game.Unlock('Quantum conundrum');if (this.amount>=50) Game.Unlock('Causality enforcer');if (this.amount>=100) Game.Unlock('Yestermorrow comparators');if (this.amount>=200) Game.Unlock('Far future enactment');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Grandma'].amount>0) Game.Unlock('Grandmas\' grandmas');
			if (this.amount>=1) Game.Win('Time warp');if (this.amount>=50) Game.Win('Alternate timeline');if (this.amount>=100) Game.Win('Rewriting history');if (this.amount>=150) Game.Win('Time duke');if (this.amount>=200) Game.Win('Forever and ever');
		});
		
		new Game.Object('Antimatter condenser','antimatter condenser|antimatter condensers|condensed','Condenses the antimatter in the universe into cookies.','antimattercondenserIcon',{base:'antimattercondenser',xV:0,yV:64,w:64,rows:1,x:0,y:0},3999999999,function(){
			return Game.ComputeCps(999999,Game.Has('Sugar bosons')*99999,Game.Has('String theory')+Game.Has('Large macaron collider')+Game.Has('Big bang bake')+Game.Has('Reverse cyclotrons')+Game.Has('Nanocosmics'));
		},function(){
			if (this.amount>=1) Game.Unlock(['Sugar bosons','String theory']);if (this.amount>=10) Game.Unlock('Large macaron collider');if (this.amount>=50) Game.Unlock('Big bang bake');if (this.amount>=100) Game.Unlock('Reverse cyclotrons');if (this.amount>=200) Game.Unlock('Nanocosmics');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Grandma'].amount>0) Game.Unlock('Antigrandmas');
			if (this.amount>=1) Game.Win('Antibatter');if (this.amount>=50) Game.Win('Quirky quarks');if (this.amount>=100) Game.Win('It does matter!');if (this.amount>=150) Game.Win('Molecular maestro');if (this.amount>=200) Game.Win('Walk the planck');
		});
		Game.last.displayName='<span style="font-size:65%;">Antimatter condenser</span>';//shrink the name since it's so large
		
		new Game.Object('Prism','prism|prisms|converted','Converts light itself into cookies.','prismIcon',{base:'prism',xV:16,yV:4,w:64,rows:1,x:0,y:20},75000000000,function(){
			return Game.ComputeCps(10000000,Game.Has('Gem polish')*1000000,Game.Has('9th color')+Game.Has('Chocolate light')+Game.Has('Grainbow')+Game.Has('Pure cosmic light')+Game.Has('Glow-in-the-dark'));
		},function(){
			if (this.amount>=1) Game.Unlock(['Gem polish','9th color']);if (this.amount>=10) Game.Unlock('Chocolate light');if (this.amount>=50) Game.Unlock('Grainbow');if (this.amount>=100) Game.Unlock('Pure cosmic light');if (this.amount>=200) Game.Unlock('Glow-in-the-dark');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Grandma'].amount>0) Game.Unlock('Rainbow grandmas');
			if (this.amount>=1) Game.Win('Lone photon');if (this.amount>=50) Game.Win('Dazzling glimmer');if (this.amount>=100) Game.Win('Blinding flash');if (this.amount>=150) Game.Win('Unending glow');if (this.amount>=200) Game.Win('Rise and shine');
		});
		
		Game.foolIcons={'Unknown':'foolCursor','Cursor':'foolCursor','Grandma':'foolGrandma','Farm':'foolFarm','Factory':'foolFactory','Mine':'foolMine','Shipment':'foolShipment','Alchemy lab':'foolAlchemyLab','Portal':'foolPortal','Time machine':'foolTimeMachine','Antimatter condenser':'foolCondenser','Prism':'foolPrism'};
		Game.foolNames={'Unknown':'Investment','Cursor':'Rolling pin','Grandma':'Oven','Farm':'Kitchen','Factory':'Factory','Mine':'Secret recipe','Shipment':'Supermarket','Alchemy lab':'Stock share','Portal':'TV show','Time machine':'Theme park','Antimatter condenser':'Cookiecoin','Prism':'Corporate country'};
		Game.foolDescs={'Unknown':'You\'re not sure what this does, you just know it means profit.','Cursor':'Essential in flattening dough. The first step in cookie-making.','Grandma':'A crucial element of baking cookies.','Farm':'The more kitchens, the more cookies your employees can produce.','Factory':'Mass production is the future. Seize the day, and synergize!','Mine':'These give you the edge you need to outsell those pesky competitors.','Shipment':'A gigantic cookie emporium - your very own retail chain.','Alchemy lab':'You\'re officially on the stock market, and everyone wants a piece!','Portal':'Your cookies have their own sitcom! Hilarious baking hijinks set to the cheesiest laughtrack.','Time machine':'Cookie theme parks, full of mascots and roller-coasters. Build one, build a hundred!','Antimatter condenser':'A virtual currency, already replacing regular money in some small countries.','Prism':'You\'ve made it to the top, and you can now buy entire nations to further your corporate greed. Godspeed.'};
		
		//build store
		Game.BuildStore();
		//build object displays
		for (var i in Game.Objects)
		{
			var me=Game.Objects[i];
			if (me.id>0)
			{
				me.canvas=l('rowCanvas'+me.id);
				me.ctx=me.canvas.getContext('2d');
				me.pics=[];
			}
		}
		
		/*=====================================================================================
		UPGRADES
		=======================================================================================*/
		Game.upgradesToRebuild=1;
		Game.Upgrades=[];
		Game.UpgradesById=[];
		Game.UpgradesN=0;
		Game.UpgradesInStore=[];
		Game.UpgradesOwned=0;
		Game.Upgrade=function(name,desc,price,icon,buyFunction)
		{
			this.id=Game.UpgradesN;
			this.name=name;
			this.desc=desc;
			this.baseDesc=this.desc;
			this.desc=BeautifyInText(this.baseDesc);
			this.basePrice=price;
			this.icon=icon;
			this.buyFunction=buyFunction;
			/*this.unlockFunction=unlockFunction;
			this.unlocked=(this.unlockFunction?0:1);*/
			this.unlocked=0;
			this.bought=0;
			this.hide=0;//0=show, 3=hide (1-2 : I have no idea)
			this.order=this.id;
			if (order) this.order=order+this.id*0.001;
			this.type='';
			if (type) this.type=type;
			this.power=0;
			if (power) this.power=power;
			this.vanilla=Game.vanilla;
			this.techUnlock=[];
			
			this.getPrice=function()
			{
				var price=this.basePrice;
				if (Game.Has('Toy workshop')) price*=0.95;
				if (Game.Has('Santa\'s dominion')) price*=0.98;
				if (Game.Has('Faberge egg')) price*=0.99;
				return Math.ceil(price);
			}
			
			this.buy=function(bypass)
			{
				var cancelPurchase=0;
				if (this.clickFunction && !bypass) cancelPurchase=!this.clickFunction();
				if (!cancelPurchase)
				{
					var price=this.getPrice();
					if (Game.cookies>=price && !this.bought)
					{
						Game.Spend(price);
						this.bought=1;
						if (this.buyFunction) this.buyFunction();
						Game.upgradesToRebuild=1;
						Game.recalculateGains=1;
						if (this.hide!=3) Game.UpgradesOwned++;
					}
				}
			}
			this.earn=function()//just win the upgrades without spending anything
			{
				Game.Upgrades[this.name].unlocked=1;
				this.bought=1;
				if (this.buyFunction) this.buyFunction();
				Game.upgradesToRebuild=1;
				Game.recalculateGains=1;
				if (this.hide!=3) Game.UpgradesOwned++;
			}
			
			this.toggle=function()//cheating only
			{
				if (!this.bought)
				{
					this.bought=1;
					if (this.buyFunction) this.buyFunction();
					Game.upgradesToRebuild=1;
					Game.recalculateGains=1;
					if (this.hide!=3) Game.UpgradesOwned++;
				}
				else
				{
					this.bought=0;
					Game.upgradesToRebuild=1;
					Game.recalculateGains=1;
					if (this.hide!=3) Game.UpgradesOwned--;
				}
				Game.UpdateMenu();
			}
			
			Game.last=this;
			Game.Upgrades[this.name]=this;
			Game.UpgradesById[this.id]=this;
			Game.UpgradesN++;
			return this;
		}
		
		Game.RequiresConfirmation=function(upgrade,prompt)
		{
			upgrade.clickFunction=function(){Game.Prompt(prompt,[['Yes','Game.UpgradesById['+upgrade.id+'].buy(1);Game.ClosePrompt();'],'No']);return false;};
		}
		
		Game.Unlock=function(what)
		{
			if (typeof what==='string')
			{
				if (Game.Upgrades[what])
				{
					if (Game.Upgrades[what].unlocked==0)
					{
						Game.Upgrades[what].unlocked=1;
						Game.upgradesToRebuild=1;
						Game.recalculateGains=1;
						/*if (Game.prefs.popups) {}
						else Game.Notify('Upgrade unlocked','<div class="title" style="font-size:18px;">'+Game.Upgrades[what].name+'</div>',Game.Upgrades[what].icon,6);*/
					}
				}
			}
			else {for (var i in what) {Game.Unlock(what[i]);}}
		}
		Game.Lock=function(what)
		{
			if (typeof what==='string')
			{
				if (Game.Upgrades[what])
				{
					Game.Upgrades[what].unlocked=0;
					Game.upgradesToRebuild=1;
					if (Game.Upgrades[what].bought==1) Game.UpgradesOwned--;
					Game.Upgrades[what].bought=0;
					Game.recalculateGains=1;
				}
			}
			else {for (var i in what) {Game.Lock(what[i]);}}
		}
		
		Game.Has=function(what)
		{
			return (Game.Upgrades[what]?Game.Upgrades[what].bought:0);
		}
		Game.HasUnlocked=function(what)
		{
			return (Game.Upgrades[what]?Game.Upgrades[what].unlocked:0);
		}
		
		Game.RebuildUpgrades=function()//recalculate the upgrades you can buy
		{
			Game.upgradesToRebuild=0;
			var list=[];
			for (var i in Game.Upgrades)
			{
				var me=Game.Upgrades[i];
				if (!me.bought)
				{
					if (me.unlocked) list.push(me);
				}
			}
			
			var sortMap=function(a,b)
			{
				if (a.basePrice>b.basePrice) return 1;
				else if (a.basePrice<b.basePrice) return -1;
				else return 0;
			}
			list.sort(sortMap);
			
			Game.UpgradesInStore=[];
			for (var i in list)
			{
				Game.UpgradesInStore.push(list[i]);
			}
			var str='';
			for (var i in Game.UpgradesInStore)
			{
				//if (!Game.UpgradesInStore[i]) break;
				var me=Game.UpgradesInStore[i];
				str+='<div class="crate upgrade" '+Game.getTooltip(
				//'<b>'+me.name+'</b>'+me.desc
				'<div style="min-width:200px;"><div style="float:right;"><span class="price">'+Beautify(Math.round(me.getPrice()))+'</span></div><small>[Upgrade]</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
				,'store')+' '+Game.clickStr+'="Game.UpgradesById['+me.id+'].buy();" id="upgrade'+i+'" style="'+(me.icon[2]?'background-image:url('+me.icon[2]+');':'')+'background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
			}
			l('upgrades').innerHTML=str;
		}
		
		var tier1=10;
		var tier2=100;
		var tier3=1000;
		var tier4=50000;
		var tier5=1000000;
		var tier6=8000000000;
		
		var type='';
		var power=0;
		
		//define upgrades
		//WARNING : do NOT add new upgrades in between, this breaks the saves. Add them at the end !
		var order=100;//this is used to set the order in which the items are listed
		new Game.Upgrade('Reinforced index finger','The mouse gains <b>+1</b> cookie per click.<br>Cursors gain <b>+0.1</b> base CpS.<q>prod prod</q>',100,[0,0]);
		new Game.Upgrade('Carpal tunnel prevention cream','The mouse and cursors are <b>twice</b> as efficient.<q>it... it hurts to click...</q>',400,[0,0]);
		new Game.Upgrade('Ambidextrous','The mouse and cursors are <b>twice</b> as efficient.<q>Look ma, both hands!</q>',10000,[0,6]);
		new Game.Upgrade('Thousand fingers','The mouse and cursors gain <b>+0.1</b> cookies for each non-cursor object owned.<q>clickity</q>',500000,[1,6]);
		new Game.Upgrade('Million fingers','The mouse and cursors gain <b>+0.5</b> cookies for each non-cursor object owned.<q>clickityclickity</q>',50000000,[2,6]);
		new Game.Upgrade('Billion fingers','The mouse and cursors gain <b>+2</b> cookies for each non-cursor object owned.<q>clickityclickityclickity</q>',500000000,[2,6]);
		new Game.Upgrade('Trillion fingers','The mouse and cursors gain <b>+10</b> cookies for each non-cursor object owned.<q>clickityclickityclickityclickity</q>',5000000000,[3,6]);
		
		order=200;
		new Game.Upgrade('Forwards from grandma','Grandmas gain <b>+0.3</b> base CpS.<q>RE:RE:thought you\'d get a kick out of this ;))</q>',Game.Objects['Grandma'].basePrice*tier1,[1,0]);
		new Game.Upgrade('Steel-plated rolling pins','Grandmas are <b>twice</b> as efficient.<q>Just what you kneaded.</q>',Game.Objects['Grandma'].basePrice*tier2,[1,0]);
		new Game.Upgrade('Lubricated dentures','Grandmas are <b>twice</b> as efficient.<q>squish</q>',Game.Objects['Grandma'].basePrice*tier3,[1,1]);
		
		order=300;
		new Game.Upgrade('Cheap hoes','Farms gain <b>+1</b> base CpS.<q>Rake in the dough!</q>',Game.Objects['Farm'].basePrice*tier1,[2,0]);
		new Game.Upgrade('Fertilizer','Farms are <b>twice</b> as efficient.<q>It\'s chocolate, I swear.</q>',Game.Objects['Farm'].basePrice*tier2,[2,0]);
		new Game.Upgrade('Cookie trees','Farms are <b>twice</b> as efficient.<q>A relative of the breadfruit.</q>',Game.Objects['Farm'].basePrice*tier3,[2,1]);
		
		order=400;
		new Game.Upgrade('Sturdier conveyor belts','Factories gain <b>+4</b> base CpS.<q>You\'re going places.</q>',Game.Objects['Factory'].basePrice*tier1,[4,0]);
		new Game.Upgrade('Child labor','Factories are <b>twice</b> as efficient.<q>Cheaper, healthier workforce.</q>',Game.Objects['Factory'].basePrice*tier2,[4,0]);
		new Game.Upgrade('Sweatshop','Factories are <b>twice</b> as efficient.<q>Slackers will be terminated.</q>',Game.Objects['Factory'].basePrice*tier3,[4,1]);
		
		order=500;
		new Game.Upgrade('Sugar gas','Mines gain <b>+10</b> base CpS.<q>A pink, volatile gas, found in the depths of some chocolate caves.</q>',Game.Objects['Mine'].basePrice*tier1,[3,0]);
		new Game.Upgrade('Megadrill','Mines are <b>twice</b> as efficient.<q>You\'re in deep.</q>',Game.Objects['Mine'].basePrice*tier2,[3,0]);
		new Game.Upgrade('Ultradrill','Mines are <b>twice</b> as efficient.<q>Finally caved in?</q>',Game.Objects['Mine'].basePrice*tier3,[3,1]);
		
		order=600;
		new Game.Upgrade('Vanilla nebulae','Shipments gain <b>+30</b> base CpS.<q>If you removed your space helmet, you could probably smell it!<br>(Note : don\'t do that.)</q>',Game.Objects['Shipment'].basePrice*tier1,[5,0]);
		new Game.Upgrade('Wormholes','Shipments are <b>twice</b> as efficient.<q>By using these as shortcuts, your ships can travel much faster.</q>',Game.Objects['Shipment'].basePrice*tier2,[5,0]);
		new Game.Upgrade('Frequent flyer','Shipments are <b>twice</b> as efficient.<q>Come back soon!</q>',Game.Objects['Shipment'].basePrice*tier3,[5,1]);
		
		order=700;
		new Game.Upgrade('Antimony','Alchemy labs gain <b>+100</b> base CpS.<q>Actually worth a lot of mony.</q>',Game.Objects['Alchemy lab'].basePrice*tier1,[6,0]);
		new Game.Upgrade('Essence of dough','Alchemy labs are <b>twice</b> as efficient.<q>Extracted through the 5 ancient steps of alchemical baking.</q>',Game.Objects['Alchemy lab'].basePrice*tier2,[6,0]);
		new Game.Upgrade('True chocolate','Alchemy labs are <b>twice</b> as efficient.<q>The purest form of cacao.</q>',Game.Objects['Alchemy lab'].basePrice*tier3,[6,1]);
		
		order=800;
		new Game.Upgrade('Ancient tablet','Portals gain <b>+1,666</b> base CpS.<q>A strange slab of peanut brittle, holding an ancient cookie recipe. Neat!</q>',Game.Objects['Portal'].basePrice*tier1,[7,0]);
		new Game.Upgrade('Insane oatling workers','Portals are <b>twice</b> as efficient.<q>ARISE, MY MINIONS!</q>',Game.Objects['Portal'].basePrice*tier2,[7,0]);
		new Game.Upgrade('Soul bond','Portals are <b>twice</b> as efficient.<q>So I just sign up and get more cookies? Sure, whatever!</q>',Game.Objects['Portal'].basePrice*tier3,[7,1]);
		
		order=900;
		new Game.Upgrade('Flux capacitors','Time machines gain <b>+9,876</b> base CpS.<q>Bake to the future.</q>',1234567890,[8,0]);
		new Game.Upgrade('Time paradox resolver','Time machines are <b>twice</b> as efficient.<q>No more fooling around with your own grandmother!</q>',9876543210,[8,0]);
		new Game.Upgrade('Quantum conundrum','Time machines are <b>twice</b> as efficient.<q>There is only one constant, and that is universal uncertainty.<br>Or is it?</q>',98765456789,[8,1]);
		
		order=20000;
		new Game.Upgrade('Kitten helpers','You gain <b>more CpS</b> the more milk you have.<q>meow may I help you</q>',9000000,[1,7]);
		new Game.Upgrade('Kitten workers','You gain <b>more CpS</b> the more milk you have.<q>meow meow meow meow</q>',9000000000,[2,7]);
		
		order=10000;
		type='cookie';power=5;
		new Game.Upgrade('Oatmeal raisin cookies','Cookie production multiplier <b>+5%</b>.<q>No raisin to hate these.</q>',99999999,[0,3]);
		new Game.Upgrade('Peanut butter cookies','Cookie production multiplier <b>+5%</b>.<q>Get yourself some jam cookies!</q>',99999999,[1,3]);
		new Game.Upgrade('Plain cookies','Cookie production multiplier <b>+5%</b>.<q>Meh.</q>',99999999,[2,3]);
		order=10010;
		new Game.Upgrade('Coconut cookies','Cookie production multiplier <b>+5%</b>.<q>These are *way* flaky.</q>',999999999,[3,3]);
		new Game.Upgrade('White chocolate cookies','Cookie production multiplier <b>+5%</b>.<q>I know what you\'ll say. It\'s just cocoa butter! It\'s not real chocolate!<br>Oh please.</q>',999999999,[4,3]);
		new Game.Upgrade('Macadamia nut cookies','Cookie production multiplier <b>+5%</b>.<q>They\'re macadamn delicious!</q>',999999999,[5,3]);
		power=10;new Game.Upgrade('Double-chip cookies','Cookie production multiplier <b>+10%</b>.<q>DOUBLE THE CHIPS<br>DOUBLE THE TASTY<br>(double the calories)</q>',99999999999,[6,3]);		
		order=10000;
		power=5;new Game.Upgrade('Sugar cookies','Cookie production multiplier <b>+5%</b>.<q>Tasty, if a little unimaginative.</q>',99999999,[7,3]);
		order=10010;
		power=10;new Game.Upgrade('White chocolate macadamia nut cookies','Cookie production multiplier <b>+10%</b>.<q>Orteil\'s favorite.</q>',99999999999,[8,3]);
		new Game.Upgrade('All-chocolate cookies','Cookie production multiplier <b>+10%</b>.<q>CHOCOVERDOSE.</q>',99999999999,[9,3]);
		type='';power=0;
		
		order=100;
		new Game.Upgrade('Quadrillion fingers','The mouse and cursors gain <b>+20</b> cookies for each non-cursor object owned.<q>clickityclickityclickityclickityclick</q>',50000000000,[3,6]);
		
		order=200;new Game.Upgrade('Prune juice','Grandmas are <b>twice</b> as efficient.<q>Gets me going.</q>',Game.Objects['Grandma'].basePrice*tier4,[1,2]);
		order=300;new Game.Upgrade('Genetically-modified cookies','Farms are <b>twice</b> as efficient.<q>All-natural mutations.</q>',Game.Objects['Farm'].basePrice*tier4,[2,2]);
		order=400;new Game.Upgrade('Radium reactors','Factories are <b>twice</b> as efficient.<q>Gives your cookies a healthy glow.</q>',Game.Objects['Factory'].basePrice*tier4,[4,2]);
		order=500;new Game.Upgrade('Ultimadrill','Mines are <b>twice</b> as efficient.<q>Pierce the heavens, etc.</q>',Game.Objects['Mine'].basePrice*tier4,[3,2]);
		order=600;new Game.Upgrade('Warp drive','Shipments are <b>twice</b> as efficient.<q>To boldly bake.</q>',Game.Objects['Shipment'].basePrice*tier4,[5,2]);
		order=700;new Game.Upgrade('Ambrosia','Alchemy labs are <b>twice</b> as efficient.<q>Adding this to the cookie mix is sure to make them even more addictive!<br>Perhaps dangerously so.<br>Let\'s hope you can keep selling these legally.</q>',Game.Objects['Alchemy lab'].basePrice*tier4,[6,2]);
		order=800;new Game.Upgrade('Sanity dance','Portals are <b>twice</b> as efficient.<q>We can change if we want to.<br>We can leave our brains behind.</q>',Game.Objects['Portal'].basePrice*tier4,[7,2]);
		order=900;new Game.Upgrade('Causality enforcer','Time machines are <b>twice</b> as efficient.<q>What happened, happened.</q>',1234567890000,[8,2]);
		
		order=5000;
		new Game.Upgrade('Lucky day','Golden cookies appear <b>twice as often</b> and stay <b>twice as long</b>.<q>Oh hey, a four-leaf penny!</q>',777777777,[10,1]);
		new Game.Upgrade('Serendipity','Golden cookies appear <b>twice as often</b> and stay <b>twice as long</b>.<q>What joy! Seven horseshoes!</q>',77777777777,[10,1]);
		
		order=20000;
		new Game.Upgrade('Kitten engineers','You gain <b>more CpS</b> the more milk you have.<q>meow meow meow meow, sir</q>',90000000000000,[3,7]);
		
		order=10020;
		type='cookie';power=15;
		new Game.Upgrade('Dark chocolate-coated cookies','Cookie production multiplier <b>+15%</b>.<q>These absorb light so well you almost need to squint to see them.</q>',999999999999,[10,3]);
		new Game.Upgrade('White chocolate-coated cookies','Cookie production multiplier <b>+15%</b>.<q>These dazzling cookies absolutely glisten with flavor.</q>',999999999999,[11,3]);
		type='';power=0;
		
		order=250;
		new Game.Upgrade('Farmer grandmas','Grandmas are <b>twice</b> as efficient.<q>A nice farmer to grow more cookies.</q>',Game.Objects['Farm'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].redraw();});
		new Game.Upgrade('Worker grandmas','Grandmas are <b>twice</b> as efficient.<q>A nice worker to manufacture more cookies.</q>',Game.Objects['Factory'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].redraw();});
		new Game.Upgrade('Miner grandmas','Grandmas are <b>twice</b> as efficient.<q>A nice miner to dig more cookies.</q>',Game.Objects['Mine'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].redraw();});
		new Game.Upgrade('Cosmic grandmas','Grandmas are <b>twice</b> as efficient.<q>A nice thing to... uh... cookies.</q>',Game.Objects['Shipment'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].redraw();});
		new Game.Upgrade('Transmuted grandmas','Grandmas are <b>twice</b> as efficient.<q>A nice golden grandma to convert into more cookies.</q>',Game.Objects['Alchemy lab'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].redraw();});
		new Game.Upgrade('Altered grandmas','Grandmas are <b>twice</b> as efficient.<q>a NiCe GrAnDmA tO bA##########</q>',Game.Objects['Portal'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].redraw();});
		new Game.Upgrade('Grandmas\' grandmas','Grandmas are <b>twice</b> as efficient.<q>A nice grandma\'s nice grandma to bake double the cookies.</q>',Game.Objects['Time machine'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].redraw();});
		
		order=14000;
		Game.baseResearchTime=Game.fps*60*30;
		Game.SetResearch=function(what,time)
		{
			if (Game.Upgrades[what])
			{
				Game.researchT=Game.baseResearchTime;
				if (Game.Has('Persistent memory')) Game.researchT=Math.ceil(Game.baseResearchTime/10);
				if (Game.Has('Ultrascience')) Game.researchT=Game.fps*5;
				Game.nextResearch=Game.Upgrades[what].id;
				if (Game.prefs.popups) Game.Popup('Research has begun.');
				else Game.Notify('Research has begun','Your bingo center/research facility is conducting experiments.',[9,0]);
			}
		}
		
		new Game.Upgrade('Bingo center/Research facility','Grandma-operated science lab and leisure club.<br>Grandmas are <b>4 times</b> as efficient.<br><b>Regularly unlocks new upgrades</b>.<q>What could possibly keep those grandmothers in check?...<br>Bingo.</q>',100000000000,[11,9],function(){Game.SetResearch('Specialized chocolate chips');});
		
		order=15000;
		
		new Game.Upgrade('Specialized chocolate chips','[Research]<br>Cookie production multiplier <b>+1%</b>.<q>Computer-designed chocolate chips. Computer chips, if you will.</q>',10000000000,[0,9],function(){Game.SetResearch('Designer cocoa beans');});
		new Game.Upgrade('Designer cocoa beans','[Research]<br>Cookie production multiplier <b>+2%</b>.<q>Now more aerodynamic than ever!</q>',20000000000,[1,9],function(){Game.SetResearch('Ritual rolling pins');});
		new Game.Upgrade('Ritual rolling pins','[Research]<br>Grandmas are <b>twice</b> as efficient.<q>The result of years of scientific research!</q>',40000000000,[2,9],function(){Game.SetResearch('Underworld ovens');});
		new Game.Upgrade('Underworld ovens','[Research]<br>Cookie production multiplier <b>+3%</b>.<q>Powered by science, of course!</q>',80000000000,[3,9],function(){Game.SetResearch('One mind');});
		new Game.Upgrade('One mind','[Research]<br>Each grandma gains <b>+1 base CpS for every 50 grandmas</b>.<div class="warning">Note : the grandmothers are growing restless. Do not encourage them.</div><q>We are one. We are many.</q>',160000000000,[4,9],function(){Game.elderWrath=1;Game.SetResearch('Exotic nuts');Game.storeToRefresh=1;});
		//Game.last.clickFunction=function(){return confirm('Warning : purchasing this will have unexpected, and potentially undesirable results!\nIt\'s all downhill from here. You have been warned!\nPurchase anyway?');};
		Game.RequiresConfirmation(Game.last,'<div class="block"><b>Warning :</b> purchasing this will have unexpected, and potentially undesirable results!<br><small>It\'s all downhill from here. You have been warned!</small><br><br>Purchase anyway?</small></div>');
				
		new Game.Upgrade('Exotic nuts','[Research]<br>Cookie production multiplier <b>+4%</b>.<q>You\'ll go crazy over these!</q>',320000000000,[5,9],function(){Game.SetResearch('Communal brainsweep');});
		new Game.Upgrade('Communal brainsweep','[Research]<br>Each grandma gains another <b>+1 base CpS for every 50 grandmas</b>.<div class="warning">Note : proceeding any further in scientific research may have unexpected results. You have been warned.</div><q>We fuse. We merge. We grow.</q>',640000000000,[6,9],function(){Game.elderWrath=2;Game.SetResearch('Arcane sugar');Game.storeToRefresh=1;});
		new Game.Upgrade('Arcane sugar','[Research]<br>Cookie production multiplier <b>+5%</b>.<q>Tastes like insects, ligaments, and molasses.</q>',1280000000000,[7,9],function(){Game.SetResearch('Elder Pact');});
		new Game.Upgrade('Elder Pact','[Research]<br>Each grandma gains <b>+1 base CpS for every 20 portals</b>.<div class="warning">Note : this is a bad idea.</div><q>squirm crawl slither writhe<br>today we rise</q>',2560000000000,[8,9],function(){Game.elderWrath=3;Game.storeToRefresh=1;});
		new Game.Upgrade('Elder Pledge','[Repeatable]<br>Contains the wrath of the elders, at least for a while.<q>This is a simple ritual involving anti-aging cream, cookie batter mixed in the moonlight, and a live chicken.</q>',1,[9,9],function()
		{
			Game.elderWrath=0;
			Game.pledges++;
			Game.pledgeT=Game.fps*60*(Game.Has('Sacrificial rolling pins')?60:30);
			Game.Upgrades['Elder Pledge'].basePrice=Math.pow(8,Math.min(Game.pledges+2,14));
			Game.Unlock('Elder Covenant');
			Game.CollectWrinklers();
			Game.storeToRefresh=1;
		});
		Game.last.hide=3;Game.last.togglable=1;
		
		order=150;
		new Game.Upgrade('Plastic mouse','Clicking gains <b>+1% of your CpS</b>.<q>Slightly squeaky.</q>',50000,[11,0]);
		new Game.Upgrade('Iron mouse','Clicking gains <b>+1% of your CpS</b>.<q>Click like it\'s 1349!</q>',5000000,[11,0]);
		new Game.Upgrade('Titanium mouse','Clicking gains <b>+1% of your CpS</b>.<q>Heavy, but powerful.</q>',500000000,[11,1]);
		new Game.Upgrade('Adamantium mouse','Clicking gains <b>+1% of your CpS</b>.<q>You could cut diamond with these.</q>',50000000000,[11,2]);
		
		order=40000;
		new Game.Upgrade('Ultrascience','Research takes only <b>5 seconds</b>.<q>YEAH, SCIENCE!</q>',7,[9,2]);//debug purposes only
		Game.last.hide=3;Game.last.debug=1;
		
		order=10020;
		type='cookie';power=15;
		new Game.Upgrade('Eclipse cookies','Cookie production multiplier <b>+15%</b>.<q>Look to the cookie.</q>',9999999999999,[0,4]);
		new Game.Upgrade('Zebra cookies','Cookie production multiplier <b>+15%</b>.<q>...</q>',9999999999999,[1,4]);
		type='';power=0;
		
		order=100;
		new Game.Upgrade('Quintillion fingers','The mouse and cursors gain <b>+100</b> cookies for each non-cursor object owned.<q>man, just go click click click click click, it\'s real easy, man.</q>',50000000000000,[12,13]);
		
		order=40000;
		new Game.Upgrade('Gold hoard','Golden cookies appear <b>really often</b>.<q>That\'s entirely too many.</q>',7,[10,1]);//debug purposes only
		Game.last.hide=3;Game.last.debug=1;
		
		order=15000;
		new Game.Upgrade('Elder Covenant','[Switch]<br>Puts a permanent end to the elders\' wrath, at the price of 5% of your CpS.<q>This is a complicated ritual involving silly, inconsequential trivialities such as cursed laxatives, century-old cacao, and an infant.<br>Don\'t question it.</q>',66666666666666,[8,9],function()
		{
			Game.pledgeT=0;
			Game.Lock('Revoke Elder Covenant');
			Game.Unlock('Revoke Elder Covenant');
			Game.Lock('Elder Pledge');
			Game.Win('Elder calm');
			Game.CollectWrinklers();
			Game.storeToRefresh=1;
		});
		Game.last.hide=3;Game.last.togglable=1;

		new Game.Upgrade('Revoke Elder Covenant','[Switch]<br>You will get 5% of your CpS back, but the grandmatriarchs will return.<q>we<br>rise<br>again</q>',6666666666,[8,9],function()
		{
			Game.Lock('Elder Covenant');
			Game.Unlock('Elder Covenant');
		});
		Game.last.hide=3;Game.last.togglable=1;
		
		order=5000;
		new Game.Upgrade('Get lucky','Golden cookie effects last <b>twice as long</b>.<q>You\'ve been up all night, haven\'t you?</q>',77777777777777,[10,1]);
		
		order=15000;
		new Game.Upgrade('Sacrificial rolling pins','Elder pledge last <b>twice</b> as long.<q>These are mostly for spreading the anti-aging cream.<br>(and accessorily, shortening the chicken\'s suffering.)</q>',2888888888888,[2,9]);
		
		order=10020;
		type='cookie';power=15;
		new Game.Upgrade('Snickerdoodles','Cookie production multiplier <b>+15%</b>.<q>True to their name.</q>',99999999999999,[2,4]);
		new Game.Upgrade('Stroopwafels','Cookie production multiplier <b>+15%</b>.<q>If it ain\'t dutch, it ain\'t much.</q>',99999999999999,[3,4]);
		new Game.Upgrade('Macaroons','Cookie production multiplier <b>+15%</b>.<q>Not to be confused with macarons.<br>These have coconut, okay?</q>',99999999999999,[4,4]);
		type='';power=0;
		
		order=40000;
		new Game.Upgrade('Neuromancy','Can toggle upgrades on and off at will in the stats menu.<q>Can also come in handy to unsee things that can\'t be unseen.</q>',7,[4,9]);//debug purposes only
		Game.last.hide=3;Game.last.debug=1;
		
		order=10020;
		type='cookie';power=15;
		new Game.Upgrade('Empire biscuits','Cookie production multiplier <b>+15%</b>.<q>For your growing cookie empire, of course!</q>',99999999999999,[5,4]);
		new Game.Upgrade('British tea biscuits','Cookie production multiplier <b>+15%</b>.<q>Quite.</q>',99999999999999,[6,4]);
		new Game.Upgrade('Chocolate british tea biscuits','Cookie production multiplier <b>+15%</b>.<q>Yes, quite.</q>',99999999999999,[7,4]);
		new Game.Upgrade('Round british tea biscuits','Cookie production multiplier <b>+15%</b>.<q>Yes, quite riveting.</q>',99999999999999,[8,4]);
		new Game.Upgrade('Round chocolate british tea biscuits','Cookie production multiplier <b>+15%</b>.<q>Yes, quite riveting indeed.</q>',99999999999999,[9,4]);
		new Game.Upgrade('Round british tea biscuits with heart motif','Cookie production multiplier <b>+15%</b>.<q>Yes, quite riveting indeed, old chap.</q>',99999999999999,[10,4]);
		new Game.Upgrade('Round chocolate british tea biscuits with heart motif','Cookie production multiplier <b>+15%</b>.<q>I like cookies.</q>',99999999999999,[11,4]);
		type='';power=0;
		
		
		order=1000;
		new Game.Upgrade('Sugar bosons','Antimatter condensers gain <b>+99,999</b> base CpS.<q>Sweet firm bosons.</q>',Game.Objects['Antimatter condenser'].basePrice*tier1,[13,0]);
		new Game.Upgrade('String theory','Antimatter condensers are <b>twice</b> as efficient.<q>Reveals new insight about the true meaning of baking cookies (and, as a bonus, the structure of the universe).</q>',Game.Objects['Antimatter condenser'].basePrice*tier2,[13,0]);
		new Game.Upgrade('Large macaron collider','Antimatter condensers are <b>twice</b> as efficient.<q>How singular!</q>',Game.Objects['Antimatter condenser'].basePrice*tier3,[13,1]);
		new Game.Upgrade('Big bang bake','Antimatter condensers are <b>twice</b> as efficient.<q>And that\'s how it all began.</q>',Game.Objects['Antimatter condenser'].basePrice*tier4,[13,2]);

		order=250;
		new Game.Upgrade('Antigrandmas','Grandmas are <b>twice</b> as efficient.<q>A mean antigrandma to vomit more cookies.<br>(Do not put in contact with normal grandmas; loss of matter may occur.)</q>',Game.Objects['Antimatter condenser'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].redraw();});

		order=10020;
		type='cookie';power=20;
		new Game.Upgrade('Madeleines','Cookie production multiplier <b>+20%</b>.<q>Unforgettable!</q>',199999999999999,[12,3]);
		new Game.Upgrade('Palmiers','Cookie production multiplier <b>+20%</b>.<q>Palmier than you!<br>Yes, I just said that.</q>',199999999999999,[13,3]);
		new Game.Upgrade('Palets','Cookie production multiplier <b>+20%</b>.<q>You could probably play hockey with these.<br>I mean, you\'re welcome to try.</q>',199999999999999,[12,4]);
		new Game.Upgrade('Sabl&eacute;s','Cookie production multiplier <b>+20%</b>.<q>The name implies they\'re made of sand. But you know better, don\'t you?</q>',199999999999999,[13,4]);
		type='';power=0;
		
		order=20000;
		new Game.Upgrade('Kitten overseers','You gain <b>more CpS</b> the more milk you have.<q>my purrpose is to serve you, sir</q>',90000000000000000,[8,7]);
		
		
		order=100;
		new Game.Upgrade('Sextillion fingers','The mouse and cursors gain <b>+200</b> cookies for each non-cursor object owned.<q>sometimes<br>things just<br>click</q>',500000000000000,[12,13]);
		
		order=200;new Game.Upgrade('Double-thick glasses','Grandmas are <b>twice</b> as efficient.<q>Oh... so THAT\'s what I\'ve been baking.</q>',Game.Objects['Grandma'].basePrice*tier5,[1,13]);
		order=300;new Game.Upgrade('Gingerbread scarecrows','Farms are <b>twice</b> as efficient.<q>Staring at your crops with mischievous glee.</q>',Game.Objects['Farm'].basePrice*tier5,[2,13]);
		order=400;new Game.Upgrade('Recombobulators','Factories are <b>twice</b> as efficient.<q>A major part of cookie recombobulation.</q>',Game.Objects['Factory'].basePrice*tier5,[4,13]);
		order=500;new Game.Upgrade('H-bomb mining','Mines are <b>twice</b> as efficient.<q>Questionable efficiency, but spectacular nonetheless.</q>',Game.Objects['Mine'].basePrice*tier5,[3,13]);
		order=600;new Game.Upgrade('Chocolate monoliths','Shipments are <b>twice</b> as efficient.<q>My god. It\'s full of chocolate bars.</q>',Game.Objects['Shipment'].basePrice*tier5,[5,13]);
		order=700;new Game.Upgrade('Aqua crustulae','Alchemy labs are <b>twice</b> as efficient.<q>Careful with the dosing - one drop too much and you get muffins.<br>And nobody likes muffins.</q>',Game.Objects['Alchemy lab'].basePrice*tier5,[6,13]);
		order=800;new Game.Upgrade('Brane transplant','Portals are <b>twice</b> as efficient.<q>This refers to the practice of merging higher dimensional universes, or "branes", with our own, in order to facilitate transit (and harvesting of precious cookie dough).</q>',Game.Objects['Portal'].basePrice*tier5,[7,13]);
		order=900;new Game.Upgrade('Yestermorrow comparators','Time machines are <b>twice</b> as efficient.<q>Fortnights into milleniums.</q>',Game.Objects['Time machine'].basePrice*tier5,[8,13]);
		order=1000;new Game.Upgrade('Reverse cyclotrons','Antimatter condensers are <b>twice</b> as efficient.<q>These can uncollision particles and unspin atoms. For... uh... better flavor, and stuff.</q>',Game.Objects['Antimatter condenser'].basePrice*tier5,[13,13]);
		
		order=150;
		new Game.Upgrade('Unobtainium mouse','Clicking gains <b>+1% of your CpS</b>.<q>These nice mice should suffice.</q>',5000000000000,[11,13]);
		
		order=10020;
		type='cookie';power=25;
		new Game.Upgrade('Caramoas','Cookie production multiplier <b>+25%</b>.<q>Yeah. That\'s got a nice ring to it.</q>',999999999999999,[14,4]);
		new Game.Upgrade('Sagalongs','Cookie production multiplier <b>+25%</b>.<q>Grandma\'s favorite?</q>',999999999999999,[15,3]);
		new Game.Upgrade('Shortfoils','Cookie production multiplier <b>+25%</b>.<q>Foiled again!</q>',999999999999999,[15,4]);
		new Game.Upgrade('Win mints','Cookie production multiplier <b>+25%</b>.<q>They\'re the luckiest cookies you\'ve ever tasted!</q>',999999999999999,[14,3]);
		type='';power=0;
		
		order=40000;
		new Game.Upgrade('Perfect idling','You keep producing cookies even while the game is closed.<q>It\'s the most beautiful thing I\'ve ever seen.</q>',7,[10,0]);//debug purposes only
		Game.last.hide=3;Game.last.debug=1;
		
		order=10020;
		type='cookie';power=25;
		new Game.Upgrade('Fig gluttons','Cookie production multiplier <b>+25%</b>.<q>Got it all figured out.</q>',999999999999999,[17,4]);
		new Game.Upgrade('Loreols','Cookie production multiplier <b>+25%</b>.<q>Because, uh... they\'re worth it?</q>',999999999999999,[16,3]);
		new Game.Upgrade('Jaffa cakes','Cookie production multiplier <b>+25%</b>.<q>If you want to bake a cookie from scratch, you must first build a factory.</q>',999999999999999,[17,3]);
		new Game.Upgrade('Grease\'s cups','Cookie production multiplier <b>+25%</b>.<q>Extra-greasy peanut butter.</q>',999999999999999,[16,4]);
		type='';power=0;
		
		order=30000;
		new Game.Upgrade('Heavenly chip secret','Unlocks <b>5%</b> of the potential of your heavenly chips.<q>Grants the knowledge of heavenly chips, and how to use them to make baking more efficient.<br>It\'s a secret to everyone.</q>',11,[19,7]);
		new Game.Upgrade('Heavenly cookie stand','Unlocks <b>25%</b> of the potential of your heavenly chips.<q>Don\'t forget to visit the heavenly lemonade stand afterwards.</q>',1111,[18,7]);
		new Game.Upgrade('Heavenly bakery','Unlocks <b>50%</b> of the potential of your heavenly chips.<q>Also sells godly cakes and divine pastries.</q>',111111,[17,7]);
		new Game.Upgrade('Heavenly confectionery','Unlocks <b>75%</b> of the potential of your heavenly chips.<q>They say angel bakers work there. They take angel lunch breaks and sometimes go on angel strikes.</q>',11111111,[16,7]);
		new Game.Upgrade('Heavenly key','Unlocks <b>100%</b> of the potential of your heavenly chips.<q>This is the key to the pearly (and tasty) gates of pastry heaven, granting you access to your entire stockpile of heavenly chips.<br>May you use them wisely.</q>',1111111111,[15,7]);
		
		order=10100;
		type='cookie';power=20;
		new Game.Upgrade('Skull cookies','Cookie production multiplier <b>+20%</b>.<q>Wanna know something spooky? You\'ve got one of these inside your head RIGHT NOW.</q>',444444444444,[12,8]);
		new Game.Upgrade('Ghost cookies','Cookie production multiplier <b>+20%</b>.<q>They\'re something strange, but they look pretty good!</q>',444444444444,[13,8]);
		new Game.Upgrade('Bat cookies','Cookie production multiplier <b>+20%</b>.<q>The cookies this town deserves.</q>',444444444444,[14,8]);
		new Game.Upgrade('Slime cookies','Cookie production multiplier <b>+20%</b>.<q>The incredible melting cookies!</q>',444444444444,[15,8]);
		new Game.Upgrade('Pumpkin cookies','Cookie production multiplier <b>+20%</b>.<q>Not even pumpkin-flavored. Tastes like glazing. Yeugh.</q>',444444444444,[16,8]);
		new Game.Upgrade('Eyeball cookies','Cookie production multiplier <b>+20%</b>.<q>When you stare into the cookie, the cookie stares back at you.</q>',444444444444,[17,8]);
		new Game.Upgrade('Spider cookies','Cookie production multiplier <b>+20%</b>.<q>You found the recipe on the web. They do whatever a cookie can.</q>',444444444444,[18,8]);
		type='';power=0;
		
		order=14000;
		new Game.Upgrade('Persistent memory','Subsequent research will be <b>10 times</b> as fast.<q>It\'s all making sense!<br>Again!</q>',100000000000,[9,2]);
		
		order=40000;
		new Game.Upgrade('Wrinkler doormat','Wrinklers spawn much more frequently.<q>You\'re such a pushover.</q>',7,[19,8]);//debug purposes only
		Game.last.hide=3;Game.last.debug=1;
		
		order=10200;
		type='cookie';power=20;
		new Game.Upgrade('Christmas tree biscuits','Cookie production multiplier <b>+20%</b>.<q>Whose pine is it anyway?</q>',252525252525,[12,10]);
		new Game.Upgrade('Snowflake biscuits','Cookie production multiplier <b>+20%</b>.<q>Mass-produced to be unique in every way.</q>',252525252525,[13,10]);
		new Game.Upgrade('Snowman biscuits','Cookie production multiplier <b>+20%</b>.<q>It\'s frosted. Doubly so.</q>',252525252525,[14,10]);
		new Game.Upgrade('Holly biscuits','Cookie production multiplier <b>+20%</b>.<q>You don\'t smooch under these ones. That would be the mistletoe (which, botanically, is a smellier variant of the mistlefinger).</q>',252525252525,[15,10]);
		new Game.Upgrade('Candy cane biscuits','Cookie production multiplier <b>+20%</b>.<q>It\'s two treats in one!<br>(Further inspection reveals the frosting does not actually taste like peppermint, but like mundane sugary frosting.)</q>',252525252525,[16,10]);
		new Game.Upgrade('Bell biscuits','Cookie production multiplier <b>+20%</b>.<q>What do these even have to do with christmas? Who cares, ring them in!</q>',252525252525,[17,10]);
		new Game.Upgrade('Present biscuits','Cookie production multiplier <b>+20%</b>.<q>The prequel to future biscuits. Watch out!</q>',252525252525,[18,10]);
		type='';power=0;
		
		order=10020;
		type='cookie';power=25;
		new Game.Upgrade('Gingerbread men','Cookie production multiplier <b>+25%</b>.<q>You like to bite the legs off first, right? How about tearing off the arms? You sick monster.</q>',9999999999999999,[18,4]);
		new Game.Upgrade('Gingerbread trees','Cookie production multiplier <b>+25%</b>.<q>Evergreens in pastry form. Yule be surprised what you can come up with.</q>',9999999999999999,[18,3]);
		type='';power=0;
		
		order=25000;
		new Game.Upgrade('A festive hat','<b>Unlocks... something.</b><q>Not a creature was stirring, not even a mouse.</q>',25,[19,9],function()
		{
			var drop=choose(Game.santaDrops);
			Game.Unlock(drop);
			if (Game.prefs.popups) Game.Popup('In the festive hat, you find...<br>a festive test tube<br>and '+drop+'.');
			else Game.Notify('In the festive hat, you find...','a festive test tube<br>and <b>'+drop+'</b>.',Game.Upgrades[drop].icon);
		});
		
		new Game.Upgrade('Increased merriness','Cookie production multiplier <b>+15%</b>.<q>It turns out that the key to increased merriness, strangely enough, happens to be a good campfire and some s\'mores.<br>You know what they say, after all; the s\'more, the merrier.</q>',2525,[17,9]);
		new Game.Upgrade('Improved jolliness','Cookie production multiplier <b>+15%</b>.<q>A nice wobbly belly goes a long way.<br>You jolly?</q>',2525,[17,9]);
		new Game.Upgrade('A lump of coal','Cookie production multiplier <b>+1%</b>.<q>Some of the world\'s worst stocking stuffing.<br>I guess you could try starting your own little industrial revolution, or something?...</q>',2525,[13,9]);
		new Game.Upgrade('An itchy sweater','Cookie production multiplier <b>+1%</b>.<q>You don\'t know what\'s worse : the embarrassingly quaint "elf on reindeer" motif, or the fact that wearing it makes you feel like you\'re wrapped in a dead sasquatch.</q>',2525,[14,9]);
		new Game.Upgrade('Reindeer baking grounds','Reindeer appear <b>twice as frequently</b>.<q>Male reindeer are from Mars; female reindeer are from venison.</q>',2525,[12,9]);
		new Game.Upgrade('Weighted sleighs','Reindeer are <b>twice as slow</b>.<q>Hope it was worth the weight.<br>(Something something forced into cervidude)</q>',2525,[12,9]);
		new Game.Upgrade('Ho ho ho-flavored frosting','Reindeer give <b>twice as much</b>.<q>It\'s time to up the antler.</q>',2525,[12,9]);
		new Game.Upgrade('Season savings','All buildings are <b>1% cheaper</b>.<q>By Santa\'s beard, what savings!<br>But who will save us?</q>',2525,[16,9],function(){Game.storeToRefresh=1;});
		new Game.Upgrade('Toy workshop','All upgrades are <b>5% cheaper</b>.<q>Watch yours-elf around elvesdroppers who might steal our production secrets.<br>Or elven worse!</q>',2525,[16,9],function(){Game.upgradesToRebuild=1;});
		new Game.Upgrade('Naughty list','Grandmas are <b>twice</b> as productive.<q>This list contains every unholy deed perpetuated by grandmakind.<br>He won\'t be checking this one twice.<br>Once. Once is enough.</q>',2525,[15,9]);
		new Game.Upgrade('Santa\'s bottomless bag','Random drops are <b>10% more common</b>.<q>This is one bottom you can\'t check out.</q>',2525,[19,9]);
		new Game.Upgrade('Santa\'s helpers','Clicking is <b>10% more powerful</b>.<q>Some choose to help hamburger; some choose to help you.<br>To each their own, I guess.</q>',2525,[19,9]);
		new Game.Upgrade('Santa\'s legacy','Cookie production multiplier <b>+10% per Santa\'s levels</b>.<q>In the north pole, you gotta get the elves first. Then when you get the elves, you start making the toys. Then when you get the toys... then you get the cookies.</q>',2525,[19,9]);
		new Game.Upgrade('Santa\'s milk and cookies','Milk is <b>5% more powerful</b>.<q>Part of Santa\'s dreadfully unbalanced diet.</q>',2525,[19,9]);
		
		order=40000;
		new Game.Upgrade('Reindeer season','Reindeer spawn much more frequently.<q>Go, Cheater! Go, Hacker and Faker!</q>',7,[12,9]);//debug purposes only
		Game.last.hide=3;Game.last.debug=1;
		
		order=25000;
		new Game.Upgrade('Santa\'s dominion','Cookie production multiplier <b>+50%</b>.<br>All buildings are <b>1% cheaper</b>.<br>All upgrades are <b>2% cheaper</b>.<q>My name is Claus, king of kings;<br>Look on my toys, ye Mighty, and despair!</q>',2525252525252525,[19,10],function(){Game.storeToRefresh=1;});
		
		order=10300;
		type='cookie';power=25;
		new Game.Upgrade('Pure heart biscuits','Cookie production multiplier <b>+25%</b>.<q>Melty white chocolate<br>that says "I *like* like you".</q>',9999999999999999,[19,3]);
		new Game.Upgrade('Ardent heart biscuits','Cookie production multiplier <b>+25%</b>.<q>A red hot cherry biscuit that will nudge the target of your affection in interesting directions.</q>',9999999999999999,[20,3]);
		new Game.Upgrade('Sour heart biscuits','Cookie production multiplier <b>+25%</b>.<q>A bitter lime biscuit for the lonely and the heart-broken.</q>',9999999999999999,[20,4]);
		new Game.Upgrade('Weeping heart biscuits','Cookie production multiplier <b>+25%</b>.<q>An ice-cold blueberry biscuit, symbol of a mending heart.</q>',9999999999999999,[21,3]);
		new Game.Upgrade('Golden heart biscuits','Cookie production multiplier <b>+25%</b>.<q>A beautiful biscuit to symbolize kindness, true love, and sincerity.</q>',9999999999999999,[21,4]);
		new Game.Upgrade('Eternal heart biscuits','Cookie production multiplier <b>+25%</b>.<q>Silver icing for a very special someone you\'ve liked for a long, long time.</q>',9999999999999999,[19,4]);
		type='';power=0;
		
		order=1100;
		new Game.Upgrade('Gem polish','Prisms gain <b>+1,000,000</b> base CpS.<q>Get rid of the grime and let more light in.<br>Truly, truly outrageous.</q>',Game.Objects['Prism'].basePrice*tier1,[14,0]);
		new Game.Upgrade('9th color','Prisms are <b>twice</b> as efficient.<q>Delve into untouched optical depths where even the mantis shrimp hasn\'t set an eye!</q>',Game.Objects['Prism'].basePrice*tier2,[14,0]);
		new Game.Upgrade('Chocolate light','Prisms are <b>twice</b> as efficient.<q>Bask into its cocoalescence.<br>(Warning : may cause various interesting albeit deadly skin conditions.)</q>',Game.Objects['Prism'].basePrice*tier3,[14,1]);
		new Game.Upgrade('Grainbow','Prisms are <b>twice</b> as efficient.<q>Remember the different grains using the handy Roy G. Biv mnemonic : R is for rice, O is for oats... uh, B for barley?...</q>',Game.Objects['Prism'].basePrice*tier4,[14,2]);
		new Game.Upgrade('Pure cosmic light','Prisms are <b>twice</b> as efficient.<q>Your prisms now receive pristine, unadulterated photons from the other end of the universe.</q>',Game.Objects['Prism'].basePrice*tier5,[14,13]);

		order=250;
		new Game.Upgrade('Rainbow grandmas','Grandmas are <b>twice</b> as efficient.<q>A luminous grandma to sparkle into cookies.</q>',Game.Objects['Prism'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].redraw();});
		
		order=24000;
		Game.seasonTriggerBasePrice=11111111111;
		new Game.Upgrade('Season switcher','Allows you to <b>trigger seasonal events</b> at will, for a price.<q>There will always be time.</q>',1111111111111,[16,6],function(){for (var i in Game.seasons){Game.Unlock(Game.seasons[i].trigger);}});
		new Game.Upgrade('Festive biscuit','Triggers <b>Christmas season</b> for the next 24 hours.<br>Triggering another season will cancel this one.<q>\'Twas the night before Christmas- or was it?</q>',Game.seasonTriggerBasePrice,[12,10]);Game.last.season='christmas';Game.last.togglable=1;
		new Game.Upgrade('Ghostly biscuit','Triggers <b>Halloween season</b> for the next 24 hours.<br>Triggering another season will cancel this one.<q>spooky scary skeletons<br>will wake you with a boo</q>',Game.seasonTriggerBasePrice,[13,8]);Game.last.season='halloween';Game.last.togglable=1;
		new Game.Upgrade('Lovesick biscuit','Triggers <b>Valentine\'s Day season</b> for the next 24 hours.<br>Triggering another season will cancel this one.<q>Romance never goes out of fashion.</q>',Game.seasonTriggerBasePrice,[20,3]);Game.last.season='valentines';Game.last.togglable=1;
		new Game.Upgrade('Fool\'s biscuit','Triggers <b>Business Day season</b> for the next 24 hours.<br>Triggering another season will cancel this one.<q>Business. Serious business. This is absolutely all of your business.</q>',Game.seasonTriggerBasePrice,[17,6]);Game.last.season='fools';Game.last.togglable=1;
		
		order=40000;
		new Game.Upgrade('Eternal seasons','Seasons now last forever.<q>Season to taste.</q>',7,[16,6],function(){for (var i in Game.seasons){Game.Unlock(Game.seasons[i].trigger);}});//debug purposes only
		Game.last.hide=3;Game.last.debug=1;
		
		
		order=20000;
		new Game.Upgrade('Kitten managers','You gain <b>more CpS</b> the more milk you have.<q>that\'s not gonna paws any problem, sir</q>',900000000000000000000,[9,7]);
		
		order=100;
		new Game.Upgrade('Septillion fingers','The mouse and cursors gain <b>+400</b> cookies for each non-cursor object owned.<q>[cursory flavor text]</q>',5000000000000000,[12,14]);
		new Game.Upgrade('Octillion fingers','The mouse and cursors gain <b>+800</b> cookies for each non-cursor object owned.<q>Turns out you <b>can</b> quite put your finger on it.</q>',50000000000000000,[12,14]);
		
		order=150;new Game.Upgrade('Eludium mouse','Clicking gains <b>+1% of your CpS</b>.<q>I rodent do that if I were you.</q>',500000000000000,[11,14]);new Game.Upgrade('Wishalloy mouse','Clicking gains <b>+1% of your CpS</b>.<q>Clicking is fine and dandy, but don\'t smash your mouse over it. Get your game on. Go play.</q>',50000000000000000,[11,14]);
		order=200;new Game.Upgrade('Aging agents','Grandmas are <b>twice</b> as efficient.<q>Counter-intuitively, grandmas have the uncanny ability to become more powerful the older they get.</q>',Game.Objects['Grandma'].basePrice*tier6,[1,14]);
		order=300;new Game.Upgrade('Pulsar sprinklers','Farms are <b>twice</b> as efficient.<q>There\'s no such thing as over-watering. The moistest is the bestest.</q>',Game.Objects['Farm'].basePrice*tier6,[2,14]);
		order=400;new Game.Upgrade('Deep-bake process','Factories are <b>twice</b> as efficient.<q>A patented process increasing cookie yield two-fold for the same amount of ingredients. Don\'t ask how, don\'t take pictures, and be sure to wear your protective suit.</q>',Game.Objects['Factory'].basePrice*tier6,[4,14]);
		order=500;new Game.Upgrade('Coreforge','Mines are <b>twice</b> as efficient.<q>You\'ve finally dug a tunnel down to the Earth\'s core. It\'s pretty warm down here.</q>',Game.Objects['Mine'].basePrice*tier6,[3,14]);
		order=600;new Game.Upgrade('Generation ship','Shipments are <b>twice</b> as efficient.<q>Built to last, this humongous spacecraft will surely deliver your cookies to the deep ends of space, one day.</q>',Game.Objects['Shipment'].basePrice*tier6,[5,14]);
		order=700;new Game.Upgrade('Origin crucible','Alchemy labs are <b>twice</b> as efficient.<q>Built from the rarest of earths and located at the very deepest of the largest mountain, this legendary crucible is said to retain properties from the big-bang itself.</q>',Game.Objects['Alchemy lab'].basePrice*tier6,[6,14]);
		order=800;new Game.Upgrade('Deity-sized portals','Portals are <b>twice</b> as efficient.<q>It\'s almost like, say, an elder god could fit through this thing now. Hypothetically.</q>',Game.Objects['Portal'].basePrice*tier6,[7,14]);
		order=900;new Game.Upgrade('Far future enactment','Time machines are <b>twice</b> as efficient.<q>The far future enactment authorizes you to delve deep into the future - where civilization has fallen and risen again, and cookies are plentiful.</q>',Game.Objects['Time machine'].basePrice*tier6,[8,14]);
		order=1000;new Game.Upgrade('Nanocosmics','Antimatter condensers are <b>twice</b> as efficient.<q>The theory of nanocosmics posits that each subatomic particle is in fact its own self-contained universe, holding unfathomable amounts of energy.</q>',Game.Objects['Antimatter condenser'].basePrice*tier6,[13,14]);
		order=1100;
		new Game.Upgrade('Glow-in-the-dark','Prisms are <b>twice</b> as efficient.<q>Your prisms now glow in the dark, effectively doubling their output!</q>',Game.Objects['Prism'].basePrice*tier6,[14,14]);
		
		order=10020;
		type='cookie';power=30;
		new Game.Upgrade('Rose macarons','Cookie production multiplier <b>+30%</b>.<q>Although an odd flavor, these pastries recently rose in popularity.</q>',999999999999999999,[22,3]);
		new Game.Upgrade('Lemon macarons','Cookie production multiplier <b>+30%</b>.<q>Slightly acid, delightful treats.</q>',999999999999999999,[23,3]);
		new Game.Upgrade('Chocolate macarons','Cookie production multiplier <b>+30%</b>.<q>They\'re like sweet tiny burgers!</q>',999999999999999999,[24,3]);
		new Game.Upgrade('Pistachio macarons','Cookie production multiplier <b>+30%</b>.<q>Yes, they took out the shells.</q>',999999999999999999,[22,4]);
		new Game.Upgrade('Hazelnut macarons','Cookie production multiplier <b>+30%</b>.<q>These go especially well with coffee.</q>',999999999999999999,[23,4]);
		new Game.Upgrade('Violet macarons','Cookie production multiplier <b>+30%</b>.<q>It\'s like spraying perfume into your mouth!</q>',999999999999999999,[24,4]);
		type='';power=0;
		
		
		order=40000;
		new Game.Upgrade('Golden switch','Unlocks the <b>Golden switch</b>, available in the menu.<br>When active, the Golden switch grants you a passive CpS boost, but prevents golden cookies from spawning.<br><b>Note :</b> this doesn\'t work very well yet.',7,[10,1]);//debug purposes only - note : not yet available in the menu
		Game.last.hide=3;Game.last.debug=1;
		
		
		order=24000;
		new Game.Upgrade('Bunny biscuit','Triggers <b>Easter season</b> for the next 24 hours.<br>Triggering another season will cancel this one.<q>All the world will be your enemy<br>and when they catch you,<br>they will kill you...<br>but first they must catch you.</q>',Game.seasonTriggerBasePrice,[0,12]);Game.last.season='easter';Game.last.togglable=1;
		
		var eggPrice=999999999999;
		var eggPrice2=99999999999999;
		new Game.Upgrade('Chicken egg','Cookie production global multiplier <b>+1%</b>.<q>The egg. The egg came first. Get over it.</q>',eggPrice,[1,12]);
		new Game.Upgrade('Duck egg','Cookie production global multiplier <b>+1%</b>.<q>Then he waddled away.</q>',eggPrice,[2,12]);
		new Game.Upgrade('Turkey egg','Cookie production global multiplier <b>+1%</b>.<q>These hatch into strange, hand-shaped creatures.</q>',eggPrice,[3,12]);
		new Game.Upgrade('Quail egg','Cookie production global multiplier <b>+1%</b>.<q>These eggs are positively tiny. I mean look at them. How does this happen? Whose idea was that?</q>',eggPrice,[4,12]);
		new Game.Upgrade('Robin egg','Cookie production global multiplier <b>+1%</b>.<q>Holy azure-hued shelled embryos!</q>',eggPrice,[5,12]);
		new Game.Upgrade('Ostrich egg','Cookie production global multiplier <b>+1%</b>.<q>One of the largest eggs in the world. More like ostrouch, am I right?<br>Guys?</q>',eggPrice,[6,12]);
		new Game.Upgrade('Cassowary egg','Cookie production global multiplier <b>+1%</b>.<q>The cassowary is taller than you, possesses murderous claws and can easily outrun you.<br>You\'d do well to be casso-wary of them.</q>',eggPrice,[7,12]);
		new Game.Upgrade('Salmon roe','Cookie production global multiplier <b>+1%</b>.<q>Do the impossible, see the invisible.<br>Roe roe, fight the power?</q>',eggPrice,[8,12]);
		new Game.Upgrade('Frogspawn','Cookie production global multiplier <b>+1%</b>.<q>I was going to make a pun about how these "toadally look like eyeballs", but froget it.</q>',eggPrice,[9,12]);
		new Game.Upgrade('Shark egg','Cookie production global multiplier <b>+1%</b>.<q>HELLO IS THIS FOOD?<br>LET ME TELL YOU ABOUT FOOD.<br>WHY DO I KEEP EATING MY FRIENDS</q>',eggPrice,[10,12]);
		new Game.Upgrade('Turtle egg','Cookie production global multiplier <b>+1%</b>.<q>Turtles, right? Hatch from shells. Grow into shells. What\'s up with that?<br>Now for my skit about airplane food.</q>',eggPrice,[11,12]);
		new Game.Upgrade('Ant larva','Cookie production global multiplier <b>+1%</b>.<q>These are a delicacy in some countries, I swear. You will let these invade your digestive tract, and you will derive great pleasure from it.<br>And all will be well.</q>',eggPrice,[12,12]);
		new Game.Upgrade('Golden goose egg','Golden cookies appear <b>5% more often</b>.<q>The sole vestige of a tragic tale involving misguided investments.</q>',eggPrice2,[13,12]);
		new Game.Upgrade('Faberge egg','All buildings and upgrades are <b>1% cheaper</b>.<q>This outrageous egg is definitely fab.</q>',eggPrice2,[14,12],function(){Game.storeToRefresh=1;});
		new Game.Upgrade('Wrinklerspawn','Wrinklers explode into <b>5% more cookies</b>.<q>Look at this little guy! It\'s gonna be a big boy someday! Yes it is!</q>',eggPrice2,[15,12]);
		new Game.Upgrade('Cookie egg','Clicking is <b>10% more powerful</b>.<q>The shell appears to be chipped.<br>I wonder what\'s inside this one!</q>',eggPrice2,[16,12]);
		new Game.Upgrade('Omelette','Other eggs appear <b>10% more frequently</b>.<q>Fromage not included.</q>',eggPrice2,[17,12]);
		new Game.Upgrade('Chocolate egg','Contains <b>a lot of cookies</b>.<q>Laid by the elusive cocoa bird. There\'s a surprise inside!</q>',eggPrice2,[18,12],function()
		{
			var cookies=Game.cookies*0.05;
			if (Game.prefs.popups) Game.Popup('The chocolate egg bursts into<br>'+Beautify(cookies)+'!');
			else Game.Notify('Chocolate egg','The egg bursts into <b>'+Beautify(cookies)+'</b> cookies!',Game.Upgrades['Chocolate egg'].icon);
			Game.Earn(cookies);
		});
		new Game.Upgrade('Century egg','You gain <b>more CpS the longer you\'ve played</b> in the current session.<q>Actually not centuries-old. This one isn\'t a day over 86!</q>',eggPrice2,[19,12]);
		new Game.Upgrade('"egg"','<b>+9 CpS</b><q>hey it\'s "egg"</q>',eggPrice2,[20,12]);
		
		Game.easterEggs=['Chicken egg','Duck egg','Turkey egg','Quail egg','Robin egg','Ostrich egg','Cassowary egg','Salmon roe','Frogspawn','Shark egg','Turtle egg','Ant larva','Golden goose egg','Faberge egg','Wrinklerspawn','Cookie egg','Omelette','Chocolate egg','Century egg','"egg"'];
		Game.eggDrops=['Chicken egg','Duck egg','Turkey egg','Quail egg','Robin egg','Ostrich egg','Cassowary egg','Salmon roe','Frogspawn','Shark egg','Turtle egg','Ant larva'];
		Game.rareEggDrops=['Golden goose egg','Faberge egg','Wrinklerspawn','Cookie egg','Omelette','Chocolate egg','Century egg','"egg"'];
		Game.DropEgg=function(failRate)
		{
			if (Game.season!='easter') return;
			if (Game.HasAchiev('Hide & seek champion')) failRate*=0.7;
			if (Game.Has('Omelette')) failRate*=0.9;
			if (Game.Has('Santa\'s bottomless bag')) failRate*=0.9;
			if (Math.random()>=failRate)
			{
				var drop='';
				if (Math.random()<0.1) drop=choose(Game.rareEggDrops);
				else drop=choose(Game.eggDrops);
				if (Game.Has(drop) || Game.HasUnlocked(drop))//reroll if we have it
				{
					if (Math.random()<0.1) drop=choose(Game.rareEggDrops);
					else drop=choose(Game.eggDrops);
				}
				if (Game.Has(drop) || Game.HasUnlocked(drop)) return;
				Game.Unlock(drop);
				if (Game.prefs.popups) Game.Popup('You find :<br>'+drop+'!');
				else Game.Notify('You found an egg!','<b>'+drop+'</b>',Game.Upgrades[drop].icon);
			}
		};
		
		order=10020;
		type='cookie';power=30;
		new Game.Upgrade('Caramel macarons','Cookie production multiplier <b>+30%</b>.<q>The saltiest, chewiest of them all.</q>',999999999999999999,[25,3]);
		new Game.Upgrade('Licorice macarons','Cookie production multiplier <b>+30%</b>.<q>Also known as "blackarons".</q>',999999999999999999,[25,4]);
		type='';power=0;
		
		/*
		//I really should release these someday
		new Game.Upgrade('Plain milk','Unlocks <b>plain milk</b>, available in the menu.',120000000000,[4,7]);
		new Game.Upgrade('Chocolate milk','Unlocks <b>chocolate milk</b>, available in the menu.',120000000000,[5,7]);
		new Game.Upgrade('Raspberry milk','Unlocks <b>raspberry milk</b>, available in the menu.',120000000000,[6,7]);
		new Game.Upgrade('Orange juice','Unlocks <b>orange juice</b>, available in the menu.',120000000000,[7,7]);
		new Game.Upgrade('Ain\'t got milk','Unlocks <b>no milk please</b>, available in the menu.',120000000000,[0,7]);
		
		new Game.Upgrade('Blue background','Unlocks the <b>blue background</b>, available in the menu.',120000000000,[0,8]);
		new Game.Upgrade('Red background','Unlocks the <b>red background</b>, available in the menu.',120000000000,[1,8]);
		new Game.Upgrade('White background','Unlocks the <b>white background</b>, available in the menu.',120000000000,[2,8]);
		new Game.Upgrade('Black background','Unlocks the <b>black background</b>, available in the menu.',120000000000,[3,8]);
		*/
		
		
		Game.seasons={
			'christmas':{name:'Christmas',start:'Christmas season has started!',over:'Christmas season is over.',trigger:'Festive biscuit'},
			'valentines':{name:'Valentine\'s day',start:'Valentine\'s day has started!',over:'Valentine\'s day is over.',trigger:'Lovesick biscuit'},
			'fools':{name:'Business day',start:'Business day has started!',over:'Business day is over.',trigger:'Fool\'s biscuit'},
			'easter':{name:'Easter',start:'Easter season has started!',over:'Easter season is over.',trigger:'Bunny biscuit'},
			'halloween':{name:'Halloween',start:'Halloween has started!',over:'Halloween is over.',trigger:'Ghostly biscuit'}
		};
		
		Game.computeSeasonPrices=function()
		{
			for (var i in Game.seasons)
			{
				Game.seasons[i].triggerUpgrade.basePrice=Game.seasonTriggerBasePrice*Math.pow(2,Game.seasonUses);
			}
		}
		Game.computeSeasons=function()
		{
			for (var i in Game.seasons)
			{
				var me=Game.Upgrades[Game.seasons[i].trigger];
				Game.seasons[i].triggerUpgrade=me;
				me.hide=3;
				me.buyFunction=function()
				{
					Game.seasonUses+=1;
					Game.computeSeasonPrices();
					Game.Lock(this.name);
					for (var i in Game.seasons)
					{
						var me=Game.Upgrades[Game.seasons[i].trigger];
						if (me.name!=this.name) Game.Unlock(me.name);
					}
					if (Game.season!='' && Game.season!=this.season)
					{
						var str=Game.seasons[Game.season].over;
						if (Game.prefs.popups) Game.Popup(str);
						else Game.Notify(str,'',Game.seasons[Game.season].triggerUpgrade.icon,4);
					}
					if (this.season) Game.season=this.season;
					Game.seasonT=Game.fps*60*60*24;
					Game.seasonPopup.reset();
					Game.storeToRefresh=1;
					Game.upgradesToRebuild=1;
					Game.Objects['Grandma'].redraw();
					var str=Game.seasons[this.season].start;
					if (Game.prefs.popups) Game.Popup(str);
					else Game.Notify(str,'',this.icon,4);
				}
			}
		}
		Game.computeSeasons();
		
		/*=====================================================================================
		ACHIEVEMENTS
		=======================================================================================*/		
		Game.Achievements=[];
		Game.AchievementsById=[];
		Game.AchievementsN=0;
		Game.AchievementsOwned=0;
		Game.Achievement=function(name,desc,icon,hideLevel)
		{
			this.id=Game.AchievementsN;
			this.name=name;
			this.desc=desc;
			this.baseDesc=this.desc;
			this.desc=BeautifyInText(this.baseDesc);
			this.icon=icon;
			this.won=0;
			this.disabled=0;
			this.hide=hideLevel||hide||0;//hide levels : 0=show, 1=hide description, 2=hide, 3=secret (doesn't count toward achievement total)
			this.order=this.id;
			if (order) this.order=order+this.id*0.001;
			this.vanilla=Game.vanilla;
			
			this.category='none';
			
			Game.last=this;
			Game.Achievements[this.name]=this;
			Game.AchievementsById[this.id]=this;
			Game.AchievementsN++;
			return this;
		}
		
		Game.Win=function(what)
		{
			if (typeof what==='string')
			{
				if (Game.Achievements[what])
				{
					if (Game.Achievements[what].won==0)
					{
						Game.Achievements[what].won=1;
						if (Game.prefs.popups) Game.Popup('Achievement unlocked :<br>'+Game.Achievements[what].name);
						else Game.Notify('Achievement unlocked','<div class="title" style="font-size:18px;">'+Game.Achievements[what].name+'</div>',Game.Achievements[what].icon);
						if (Game.Achievements[what].hide!=3) Game.AchievementsOwned++;
						Game.recalculateGains=1;
					}
				}
			}
			else {for (var i in what) {Game.Win(what[i]);}}
		}
		
		Game.HasAchiev=function(what)
		{
			return (Game.Achievements[what]?Game.Achievements[what].won:0);
		}
		
		//define achievements
		//WARNING : do NOT add new achievements in between, this breaks the saves. Add them at the end !
		
		var order=100;//this is used to set the order in which the items are listed
		var hide=0;//force hiding level
		
		//new Game.Achievement('name','description',[0,0]);
		Game.moneyAchievs=[
		'Wake and bake',				1,
		'Making some dough',			100,
		'So baked right now',			1000,
		'Fledgling bakery',				10000,
		'Affluent bakery',				100000,
		'World-famous bakery',			1000000,
		'Cosmic bakery',				10000000,
		'Galactic bakery',				100000000,
		'Universal bakery', 			1000000000,
		'Timeless bakery', 				10000000000,
		'Infinite bakery', 				100000000000,
		'Immortal bakery', 				1000000000000,
		'You can stop now', 			10000000000000,
		'Cookies all the way down', 	100000000000000,
		'Overdose', 					1000000000000000,
		'How?',							10000000000000000
		];
		for (var i=0;i<Game.moneyAchievs.length/2;i++)
		{
			var pic=[Math.min(10,i),5];
			if (i==15) pic=[11,5];
			new Game.Achievement(Game.moneyAchievs[i*2],'Bake <b>'+(Game.moneyAchievs[i*2+1])+'</b> cookie'+(Game.moneyAchievs[i*2+1]==1?'':'s')+'.',pic,2);
		}
		
		order=200;
		Game.cpsAchievs=[
		'Casual baking',				1,
		'Hardcore baking',				10,
		'Steady tasty stream',			100,
		'Cookie monster',				1000,
		'Mass producer',				10000,
		'Cookie vortex',				1000000,
		'Cookie pulsar',				10000000,
		'Cookie quasar',				100000000,
		'A world filled with cookies',	10000000000,
		'Let\'s never bake again',		1000000000000
		];
		for (var i=0;i<Game.cpsAchievs.length/2;i++)
		{
			var pic=[i,5];
			new Game.Achievement(Game.cpsAchievs[i*2],'Bake <b>'+(Game.cpsAchievs[i*2+1])+'</b> cookie'+(Game.cpsAchievs[i*2+1]==1?'':'s')+' per second.',pic,2);
		}
		
		hide=2;
		
		order=30000;
		new Game.Achievement('Sacrifice','Reset your game with <b>1 million</b> cookies baked.<q>Easy come, easy go.</q>',[11,6]);
		new Game.Achievement('Oblivion','Reset your game with <b>1 billion</b> cookies baked.<q>Back to square one.</q>',[11,6]);
		new Game.Achievement('From scratch','Reset your game with <b>1 trillion</b> cookies baked.<q>It\'s been fun.</q>',[11,6]);
		
		order=11010;
		new Game.Achievement('Neverclick','Make <b>1 million</b> cookies by only having clicked <b>15 times</b>.',[12,0]);
		order=1000;
		new Game.Achievement('Clicktastic','Make <b>1,000</b> cookies from clicking.',[11,0]);
		new Game.Achievement('Clickathlon','Make <b>100,000</b> cookies from clicking.',[11,1]);
		new Game.Achievement('Clickolympics','Make <b>10,000,000</b> cookies from clicking.',[11,1]);
		new Game.Achievement('Clickorama','Make <b>1,000,000,000</b> cookies from clicking.',[11,2]);
		
		order=1050;
		new Game.Achievement('Click','Have <b>1</b> cursor.',[0,0]);
		new Game.Achievement('Double-click','Have <b>2</b> cursors.',[0,6]);
		new Game.Achievement('Mouse wheel','Have <b>50</b> cursors.',[1,6]);
		new Game.Achievement('Of Mice and Men','Have <b>100</b> cursors.',[2,6]);
		new Game.Achievement('The Digital','Have <b>200</b> cursors.',[3,6]);
		
		order=1100;
		new Game.Achievement('Just wrong','Sell a grandma.<q>I thought you loved me.</q>',[10,9],2);
		new Game.Achievement('Grandma\'s cookies','Have <b>1</b> grandma.',[1,0]);
		new Game.Achievement('Sloppy kisses','Have <b>50</b> grandmas.',[1,1]);
		new Game.Achievement('Retirement home','Have <b>100</b> grandmas.',[1,2]);
		
		order=1200;
		new Game.Achievement('My first farm','Have <b>1</b> farm.',[2,0]);
		new Game.Achievement('Reap what you sow','Have <b>50</b> farms.',[2,1]);
		new Game.Achievement('Farm ill','Have <b>100</b> farms.',[2,2]);
		
		order=1300;
		new Game.Achievement('Production chain','Have <b>1</b> factory.',[4,0]);
		new Game.Achievement('Industrial revolution','Have <b>50</b> factories.',[4,1]);
		new Game.Achievement('Global warming','Have <b>100</b> factories.',[4,2]);
		
		order=1400;
		new Game.Achievement('You know the drill','Have <b>1</b> mine.',[3,0]);
		new Game.Achievement('Excavation site','Have <b>50</b> mines.',[3,1]);
		new Game.Achievement('Hollow the planet','Have <b>100</b> mines.',[3,2]);
		
		order=1500;
		new Game.Achievement('Expedition','Have <b>1</b> shipment.',[5,0]);
		new Game.Achievement('Galactic highway','Have <b>50</b> shipments.',[5,1]);
		new Game.Achievement('Far far away','Have <b>100</b> shipments.',[5,2]);
		
		order=1600;
		new Game.Achievement('Transmutation','Have <b>1</b> alchemy lab.',[6,0]);
		new Game.Achievement('Transmogrification','Have <b>50</b> alchemy labs.',[6,1]);
		new Game.Achievement('Gold member','Have <b>100</b> alchemy labs.',[6,2]);
		
		order=1700;
		new Game.Achievement('A whole new world','Have <b>1</b> portal.',[7,0]);
		new Game.Achievement('Now you\'re thinking','Have <b>50</b> portals.',[7,1]);
		new Game.Achievement('Dimensional shift','Have <b>100</b> portals.',[7,2]);
		
		order=1800;
		new Game.Achievement('Time warp','Have <b>1</b> time machine.',[8,0]);
		new Game.Achievement('Alternate timeline','Have <b>50</b> time machines.',[8,1]);
		new Game.Achievement('Rewriting history','Have <b>100</b> time machines.',[8,2]);
		
		
		order=7000;
		new Game.Achievement('One with everything','Have <b>at least 1</b> of every building.',[4,6]);
		new Game.Achievement('Mathematician','Have at least <b>1 of the most expensive object, 2 of the second-most expensive, 4 of the next</b> and so on (capped at 128).',[7,6]);
		new Game.Achievement('Base 10','Have at least <b>10 of the most expensive object, 20 of the second-most expensive, 30 of the next</b> and so on.',[8,6]);
		
		order=10000;
		new Game.Achievement('Golden cookie','Click a <b>golden cookie</b>.',[10,1]);
		new Game.Achievement('Lucky cookie','Click <b>7 golden cookies</b>.',[10,1]);
		new Game.Achievement('A stroke of luck','Click <b>27 golden cookies</b>.',[10,1]);
		
		order=30200;
		new Game.Achievement('Cheated cookies taste awful','Hack in some cookies.',[10,6],3);
		order=11010;
		new Game.Achievement('Uncanny clicker','Click really, really fast.<q>Well I\'ll be!</q>',[12,0]);
		
		order=5000;
		new Game.Achievement('Builder','Own <b>100</b> buildings.',[4,6]);
		new Game.Achievement('Architect','Own <b>400</b> buildings.',[5,6]);
		order=6000;
		new Game.Achievement('Enhancer','Purchase <b>20</b> upgrades.',[9,0]);
		new Game.Achievement('Augmenter','Purchase <b>50</b> upgrades.',[9,1]);
		
		order=11000;
		new Game.Achievement('Cookie-dunker','Dunk the cookie.<q>You did it!</q>',[4,7]);
		
		order=10000;
		new Game.Achievement('Fortune','Click <b>77 golden cookies</b>.<q>You should really go to bed.</q>',[10,1]);
		order=31000;
		new Game.Achievement('True Neverclick','Make <b>1 million</b> cookies with <b>no</b> cookie clicks.<q>This kinda defeats the whole purpose, doesn\'t it?</q>',[12,0],3);
		
		order=20000;
		new Game.Achievement('Elder nap','Appease the grandmatriarchs at least <b>once</b>.<q>we<br>are<br>eternal</q>',[8,9]);
		new Game.Achievement('Elder slumber','Appease the grandmatriarchs at least <b>5 times</b>.<q>our mind<br>outlives<br>the universe</q>',[8,9]);
		
		order=1150;
		new Game.Achievement('Elder','Own at least <b>7</b> grandma types.',[10,9]);
		
		order=20000;
		new Game.Achievement('Elder calm','Declare a covenant with the grandmatriarchs.<q>we<br>have<br>fed</q>',[8,9]);
		
		order=5000;
		new Game.Achievement('Engineer','Own <b>800</b> buildings.',[6,6]);
		
		order=10000;
		new Game.Achievement('Leprechaun','Click <b>777 golden cookies</b>.',[10,1]);
		new Game.Achievement('Black cat\'s paw','Click <b>7777 golden cookies</b>.',[10,1]);
		
		order=30000;
		new Game.Achievement('Nihilism','Reset your game with <b>1 quadrillion</b> cookies baked.<q>There are many things<br>that need to be erased</q>',[11,7]);
		
		order=1900;
		new Game.Achievement('Antibatter','Have <b>1</b> antimatter condenser.',[13,0]);
		new Game.Achievement('Quirky quarks','Have <b>50</b> antimatter condensers.',[13,1]);
		new Game.Achievement('It does matter!','Have <b>100</b> antimatter condensers.',[13,2]);
		
		order=6000;
		new Game.Achievement('Upgrader','Purchase <b>100</b> upgrades.',[9,2]);
		
		order=7000;
		new Game.Achievement('Centennial','Have at least <b>100 of everything</b>.',[9,6]);
		
		order=30500;
		new Game.Achievement('Hardcore','Get to <b>1 billion</b> cookies baked with <b>no upgrades purchased</b>.',[12,6],3);
		
		order=30600;
		new Game.Achievement('Speed baking I','Get to <b>1 million</b> cookies baked in <b>35 minutes</b> (with no heavenly upgrades).',[12,5],3);
		new Game.Achievement('Speed baking II','Get to <b>1 million</b> cookies baked in <b>25 minutes</b> (with no heavenly upgrades).',[13,5],3);
		new Game.Achievement('Speed baking III','Get to <b>1 million</b> cookies baked in <b>15 minutes</b> (with no heavenly upgrades).',[14,5],3);
		
		
		order=61000;
		var achiev=new Game.Achievement('Getting even with the oven','Defeat the <b>Sentient Furnace</b> in the factory dungeons.',[12,7],3);achiev.category='dungeon';//make this 2 when dungeons are released
		var achiev=new Game.Achievement('Now this is pod-smashing','Defeat the <b>Ascended Baking Pod</b> in the factory dungeons.',[12,7],3);achiev.category='dungeon';//make this 2 when dungeons are released
		var achiev=new Game.Achievement('Chirped out','Find and defeat <b>Chirpy</b>, the dysfunctionning alarm bot.',[13,7],3);achiev.category='dungeon';
		var achiev=new Game.Achievement('Follow the white rabbit','Find and defeat the elusive <b>sugar bunny</b>.',[14,7],3);achiev.category='dungeon';
		
		order=1000;
		new Game.Achievement('Clickasmic','Make <b>100,000,000,000</b> cookies from clicking.',[11,13]);
		
		order=1100;
		new Game.Achievement('Friend of the ancients','Have <b>150</b> grandmas.',[1,13]);
		new Game.Achievement('Ruler of the ancients','Have <b>200</b> grandmas.',[1,14]);
		
		order=32000;
		new Game.Achievement('Wholesome','Unlock <b>100%</b> of your heavenly chips power.',[15,7]);
		
		order=33000;
		new Game.Achievement('Just plain lucky','You have <b>1 chance in 500,000</b> every second of earning this achievement.',[15,6],3);
		
		order=21000;
		new Game.Achievement('Itchscratcher','Burst <b>1 wrinkler</b>.',[19,8]);
		new Game.Achievement('Wrinklesquisher','Burst <b>50 wrinklers</b>.',[19,8]);
		new Game.Achievement('Moistburster','Burst <b>200 wrinklers</b>.',[19,8]);
		
		order=22000;
		new Game.Achievement('Spooky cookies','Unlock <b>every Halloween-themed cookie</b>.<br>Owning this achievement makes Halloween-themed cookies drop more frequently in future playthroughs.',[12,8]);
		
		order=22100;
		new Game.Achievement('Coming to town','Reach <b>Santa\'s 7th form</b>.',[18,9]);
		new Game.Achievement('All hail Santa','Reach <b>Santa\'s final form</b>.',[19,10]);
		new Game.Achievement('Let it snow','Unlock <b>every Christmas-themed cookie</b>.',[19,9]);
		new Game.Achievement('Oh deer','Pop <b>1 reindeer</b>.',[12,9]);
		new Game.Achievement('Sleigh of hand','Pop <b>50 reindeer</b>.',[12,9]);
		new Game.Achievement('Reindeer sleigher','Pop <b>200 reindeer</b>.',[12,9]);

		order=1200;
		new Game.Achievement('Perfected agriculture','Have <b>150</b> farms.',[2,13]);
		order=1300;
		new Game.Achievement('Ultimate automation','Have <b>150</b> factories.',[4,13]);
		order=1400;
		new Game.Achievement('Can you dig it','Have <b>150</b> mines.',[3,13]);
		order=1500;
		new Game.Achievement('Type II civilization','Have <b>150</b> shipments.',[5,13]);
		order=1600;
		new Game.Achievement('Gild wars','Have <b>150</b> alchemy labs.',[6,13]);
		order=1700;
		new Game.Achievement('Brain-split','Have <b>150</b> portals.',[7,13]);
		order=1800;
		new Game.Achievement('Time duke','Have <b>150</b> time machines.',[8,13]);
		order=1900;
		new Game.Achievement('Molecular maestro','Have <b>150</b> antimatter condensers.',[13,13]);
		
		order=2000;
		new Game.Achievement('Lone photon','Have <b>1</b> prism.',[14,0]);
		new Game.Achievement('Dazzling glimmer','Have <b>50</b> prisms.',[14,1]);
		new Game.Achievement('Blinding flash','Have <b>100</b> prisms.',[14,2]);
		new Game.Achievement('Unending glow','Have <b>150</b> prisms.',[14,13]);
		
		order=5000;
		new Game.Achievement('Lord of Constructs','Own <b>1500</b> buildings.<q>He saw the vast plains stretching ahead of him, and he said : let there be civilization.</q>',[6,6]);
		order=6000;
		new Game.Achievement('Lord of Progress','Purchase <b>150</b> upgrades.<q>One can always do better. But should you?</q>',[9,2]);
		order=7002;
		new Game.Achievement('Bicentennial','Have at least <b>200 of everything</b>.<q>You crazy person.</q>',[9,6]);
		
		order=22300;
		new Game.Achievement('Lovely cookies','Unlock <b>every Valentine-themed cookie</b>.',[20,3]);
		
		order=7001;
		new Game.Achievement('Centennial and a half','Have at least <b>150 of everything</b>.',[9,6]);
		
		order=11000;
		new Game.Achievement('Tiny cookie','Click the tiny cookie.<q>These aren\'t the cookies<br>you\'re clicking for.</q>',[0,5]);
		
		order=40000;
		new Game.Achievement('You win a cookie','This is for baking 10 billion cookies and making it on the local news.<q>We\'re all so proud of you.</q>',[10,0]);
		
		order=1070;
		new Game.Achievement('Click delegator','Make <b>10,000,000,000,000,000,000</b> cookies just from cursors.',[0,0]);
		order=1120;
		new Game.Achievement('Gushing grannies','Make <b>10,000,000,000,000,000,000</b> cookies just from grandmas.',[1,0]);
		order=1220;
		new Game.Achievement('I hate manure','Make <b>10,000,000,000,000</b> cookies just from farms.',[2,0]);
		order=1320;
		new Game.Achievement('The incredible machine','Make <b>100,000,000,000,000</b> cookies just from factories.',[4,0]);
		order=1420;
		new Game.Achievement('Never dig down','Make <b>1,000,000,000,000,000</b> cookies just from mines.',[3,0]);
		order=1520;
		new Game.Achievement('And beyond','Make <b>10,000,000,000,000,000</b> cookies just from shipments.',[5,0]);
		order=1620;
		new Game.Achievement('Magnum Opus','Make <b>100,000,000,000,000,000</b> cookies just from alchemy labs.',[6,0]);
		order=1720;
		new Game.Achievement('With strange eons','Make <b>1,000,000,000,000,000,000</b> cookies just from portals.',[7,0]);
		order=1820;
		new Game.Achievement('Spacetime jigamaroo','Make <b>10,000,000,000,000,000,000</b> cookies just from time machines.',[8,0]);
		order=1920;
		new Game.Achievement('Supermassive','Make <b>100,000,000,000,000,000,000</b> cookies just from antimatter condensers.',[13,0]);
		order=2020;
		new Game.Achievement('Praise the sun','Make <b>1,000,000,000,000,000,000,000</b> cookies just from prisms.',[14,0]);
		
		order=1000;
		new Game.Achievement('Clickageddon','Make <b>10,000,000,000,000</b> cookies from clicking.',[11,14]);
		new Game.Achievement('Clicknarok','Make <b>1,000,000,000,000,000</b> cookies from clicking.',[11,14]);
		
		order=1050;
		new Game.Achievement('Extreme polydactyly','Have <b>300</b> cursors.',[12,13]);
		new Game.Achievement('Dr. T','Have <b>400</b> cursors.',[12,14]);
		
		order=1100;new Game.Achievement('The old never bothered me anyway','Have <b>250</b> grandmas.',[1,14]);
		order=1200;new Game.Achievement('Homegrown','Have <b>200</b> farms.',[2,14]);
		order=1300;new Game.Achievement('Technocracy','Have <b>200</b> factories.',[4,14]);
		order=1400;new Game.Achievement('The center of the Earth','Have <b>200</b> mines.',[3,14]);
		order=1500;new Game.Achievement('We come in peace','Have <b>200</b> shipments.',[5,14]);
		order=1600;new Game.Achievement('The secrets of the universe','Have <b>200</b> alchemy labs.',[6,14]);
		order=1700;new Game.Achievement('Realm of the Mad God','Have <b>200</b> portals.',[7,14]);
		order=1800;new Game.Achievement('Forever and ever','Have <b>200</b> time machines.',[8,14]);
		order=1900;new Game.Achievement('Walk the planck','Have <b>200</b> antimatter condensers.',[13,14]);
		order=2000;new Game.Achievement('Rise and shine','Have <b>200</b> prisms.',[14,14]);
		
		order=30200;
		new Game.Achievement('God complex','Name yourself <b>Orteil</b>.<q>But that\'s not you, is it?</q>',[17,5],3);
		new Game.Achievement('Third-party','Use an <b>add-on</b>.<q>Some find vanilla to be the most boring flavor.</q>',[16,5],3);//if you're making a mod, add a Game.Win('Third-party') somewhere in there!
		
		order=30000;
		new Game.Achievement('Dematerialize','Reset your game with <b>1 quintillion</b> cookies baked.<q>Presto!<br>...where\'d the cookies go?</q>',[11,7]);
		new Game.Achievement('Nil zero zilch','Reset your game with <b>1 sextillion</b> cookies baked.<q>To summarize : really not very much at all.</q>',[11,7]);
		new Game.Achievement('Transcendence','Reset your game with <b>1 septillion</b> cookies baked.<q>Your cookies are now on a higher plane of being.</q>',[11,8]);
		new Game.Achievement('Obliterate','Reset your game with <b>1 octillion</b> cookies baked.<q>Resistance is futile, albeit entertaining.</q>',[11,8]);
		new Game.Achievement('Negative void','Reset your game with <b>1 nonillion</b> cookies baked.<q>You now have so few cookies that it\'s almost like you have a negative amount of them.</q>',[11,8],3);
		
		order=22400;
		new Game.Achievement('The hunt is on','Unlock <b>1 egg</b>.',[1,12]);
		new Game.Achievement('Egging on','Unlock <b>7 eggs</b>.',[4,12]);
		new Game.Achievement('Mass Easteria','Unlock <b>14 eggs</b>.',[7,12]);
		new Game.Achievement('Hide & seek champion','Unlock <b>all the eggs</b>.',[13,12]);
	
		order=11000;
		new Game.Achievement('What\'s in a name','Give your bakery a name.',[15,9]);
	
	
		BeautifyAll();
		Game.vanilla=0;//everything we create beyond this will not be saved in the default save
		
		
		for (var i in Game.customCreate) {Game.customCreate[i]();}
		
		
		/*=====================================================================================
		GRANDMAPOCALYPSE
		=======================================================================================*/
		Game.UpdateGrandmapocalypse=function()
		{
			if (Game.Has('Elder Covenant') || Game.Objects['Grandma'].amount==0) Game.elderWrath=0;
			else if (Game.pledgeT>0)//if the pledge is active, lower it
			{
				Game.pledgeT--;
				if (Game.pledgeT==0)//did we reach 0? make the pledge purchasable again
				{
					Game.Lock('Elder Pledge');
					Game.Unlock('Elder Pledge');
					Game.elderWrath=1;
				}
			}
			else
			{
				if (Game.Has('One mind') && Game.elderWrath==0)
				{
					Game.elderWrath=1;
				}
				if (Math.random()<0.001 && Game.elderWrath<Game.Has('One mind')+Game.Has('Communal brainsweep')+Game.Has('Elder Pact'))
				{
					Game.elderWrath++;//have we already pledged? make the elder wrath shift between different stages
				}
				if (Game.Has('Elder Pact') && Game.Upgrades['Elder Pledge'].unlocked==0)
				{
					Game.Lock('Elder Pledge');
					Game.Unlock('Elder Pledge');
				}
			}
			Game.elderWrathD+=((Game.elderWrath+1)-Game.elderWrathD)*0.001;//slowly fade to the target wrath state
			
			if (Game.elderWrath!=Game.elderWrathOld) Game.storeToRefresh=1;
			
			Game.elderWrathOld=Game.elderWrath;
			
			Game.UpdateWrinklers();
		}
		
		//wrinklers
		
		function inRect(x,y,rect)
		{
			//find out if the point x,y is in the rotated rectangle rect{w,h,r,o} (width,height,rotation in radians,y-origin) (needs to be normalized)
			//I found this somewhere online I guess
			var dx = x+Math.sin(-rect.r)*(-(rect.h/2-rect.o)),dy=y+Math.cos(-rect.r)*(-(rect.h/2-rect.o));
			var h1 = Math.sqrt(dx*dx + dy*dy);
			var currA = Math.atan2(dy,dx);
			var newA = currA - rect.r;
			var x2 = Math.cos(newA) * h1;
			var y2 = Math.sin(newA) * h1;
			if (x2 > -0.5 * rect.w && x2 < 0.5 * rect.w && y2 > -0.5 * rect.h && y2 < 0.5 * rect.h) return true;
			return false;
		}
		
		Game.wrinklers=[];
		for (var i=0;i<10;i++)
		{
			Game.wrinklers.push({id:parseInt(i),close:0,sucked:0,phase:0,x:0,y:0,r:0,hurt:0,hp:3,selected:0});
		}
		Game.ResetWrinklers=function()
		{
			for (var i in Game.wrinklers)
			{
				Game.wrinklers[i]={id:parseInt(i),close:0,sucked:0,phase:0,x:0,y:0,r:0,hurt:0,hp:3};
			}
		}
		Game.CollectWrinklers=function()
		{
			for (var i in Game.wrinklers)
			{
				Game.wrinklers[i].hp=0;
			}
		}
		Game.UpdateWrinklers=function()
		{
			var xBase=0;
			var yBase=0;
			var onWrinkler=0;
			if (Game.LeftBackground)
			{
				xBase=Game.cookieOriginX;
				yBase=Game.cookieOriginY;
			}
			for (var i in Game.wrinklers)
			{
				var me=Game.wrinklers[i];
				if (me.phase==0 && Game.elderWrath>0 && Math.random()<(!Game.Has('Wrinkler doormat')?(0.00003*Game.elderWrath):0.1)) {me.phase=1;me.hp=3;}//respawn
				if (me.phase>0)
				{
					if (me.close<1) me.close+=(1/Game.fps)/10;
					if (me.close>1) me.close=1;
				}
				else me.close=0;
				if (me.close==1 && me.phase==1)
				{
					me.phase=2;
					Game.recalculateGains=1;
				}
				if (me.phase==2)
				{
					me.sucked+=(((Game.cookiesPs/Game.fps)*Game.cpsSucked));//suck the cookies
				}
				if (me.phase>0)
				{
					if (me.hp<3) me.hp+=0.01;
					me.hp=Math.min(3,me.hp);
					var d=128*(2-me.close);
					if (Game.prefs.fancy) d+=Math.cos(Game.T*0.05+parseInt(me.id))*4;
					me.r=(me.id/Game.wrinklers.length)*360;
					if (Game.prefs.fancy) me.r+=Math.sin(Game.T*0.05+parseInt(me.id))*4;
					me.x=xBase+(Math.sin(me.r*Math.PI/180)*d);
					me.y=yBase+(Math.cos(me.r*Math.PI/180)*d);
					if (Game.prefs.fancy) me.r+=Math.sin(Game.T*0.09+parseInt(me.id))*4;
					rect={w:100,h:200,r:(-me.r)*Math.PI/180,o:10};
					if (Math.random()<0.01) me.hurt=Math.max(me.hurt,Math.random());
					if (Game.T%5==0) {if (Game.LeftBackground && Game.mouseX<Game.LeftBackground.canvas.width && inRect(Game.mouseX-me.x,Game.mouseY-me.y,rect)) me.selected=1; else me.selected=0;}
					if (me.selected && onWrinkler==0)
					{
						me.hurt=Math.max(me.hurt,0.25);
						//me.close*=0.99;
						if (Game.Click)
						{
							me.hurt=1;
							me.hp--;
							if (Game.prefs.particles)
							{
								var x=me.x+(Math.sin(me.r*Math.PI/180)*100);
								var y=me.y+(Math.cos(me.r*Math.PI/180)*100);
								for (var ii=0;ii<3;ii++)
								{
									Game.particleAdd(x+Math.random()*50-25,y+Math.random()*50-25,Math.random()*4-2,Math.random()*-2-2,1,1,2,'wrinklerBits.png');
								}
							}
							Game.Click=0;
						}
						onWrinkler=1;
					}
				}
				
				if (me.hurt>0)
				{
					me.hurt-=5/Game.fps;
					//me.close-=me.hurt*0.05;
					//me.x+=Math.random()*2-1;
					//me.y+=Math.random()*2-1;
					me.r+=(Math.sin(Game.T*1)*me.hurt)*18;//Math.random()*2-1;
				}
				if (me.hp<=0.5 && me.phase>0)
				{
					Game.wrinklersPopped++;
					Game.recalculateGains=1;
					me.phase=0;
					me.close=0;
					me.hurt=0;
					me.hp=3;
					me.sucked*=1.1;//cookie dough does weird things inside wrinkler digestive tracts
					if (Game.Has('Wrinklerspawn')) me.sucked*=1.05;
					if (me.sucked>0.5)
					{
						if (Game.prefs.popups) Game.Popup('Exploded a wrinkler : found '+Beautify(me.sucked)+' cookies!');
						else Game.Notify('Exploded a wrinkler','Found <b>'+Beautify(me.sucked)+'</b> cookies!',[19,8],6);
						
						if (Game.season=='halloween')
						{
							//if (Math.random()<(Game.HasAchiev('Spooky cookies')?0.2:0.05))//halloween cookie drops
							var failRate=0.95;
							if (Game.HasAchiev('Spooky cookies')) failRate=0.8;
							if (Game.Has('Santa\'s bottomless bag')) failRate*=0.9;
							if (Math.random()>failRate)//halloween cookie drops
							{
								var cookie=choose(['Skull cookies','Ghost cookies','Bat cookies','Slime cookies','Pumpkin cookies','Eyeball cookies','Spider cookies']);
								if (!Game.HasUnlocked(cookie) && !Game.Has(cookie))
								{
									Game.Unlock(cookie);
									if (Game.prefs.popups) Game.Popup('Found : '+cookie+'!');
									else Game.Notify(cookie,'You also found <b>'+cookie+'</b>!',Game.Upgrades[cookie].icon);
								}
							}
						}
						Game.DropEgg(0.98);
					}
					Game.Earn(me.sucked);
					me.sucked=0;
					if (Game.prefs.particles)
					{
						var x=me.x+(Math.sin(me.r*Math.PI/180)*100);
						var y=me.y+(Math.cos(me.r*Math.PI/180)*100);
						for (var ii=0;ii<6;ii++)
						{
							Game.particleAdd(x+Math.random()*50-25,y+Math.random()*50-25,Math.random()*4-2,Math.random()*-2-2,1,1,2,'wrinklerBits.png');
						}
					}
				}
			}
			if (onWrinkler)
			{
				Game.mousePointer=1;
			}
		}
		Game.DrawWrinklers=function()
		{
			for (var i in Game.wrinklers)
			{
				var me=Game.wrinklers[i];
				if (me.phase>0)
				{
					Game.LeftBackground.globalAlpha=me.close;
					Game.LeftBackground.save();
					Game.LeftBackground.translate(me.x,me.y);
					Game.LeftBackground.rotate(-(me.r)*Math.PI/180);
					//Game.LeftBackground.fillRect(-50,-10,100,200);
					if (Game.season=='christmas') Game.LeftBackground.drawImage(Pic('winterWrinkler.png'),-50,-10);
					else Game.LeftBackground.drawImage(Pic('wrinkler.png'),-50,-10);
					//Game.LeftBackground.fillText(me.id+' : '+me.sucked,0,0);
					Game.LeftBackground.restore();
					if (me.phase==2 && Math.random()<0.1 && Game.prefs.particles)
					{
						Game.particleAdd(me.x,me.y,Math.random()*4-2,Math.random()*-2-2,Math.random()*0.5+0.2,1,2);
					}
				}
			}
		}
		Game.SaveWrinklers=function()
		{
			var amount=0;
			var number=0;
			for (var i in Game.wrinklers)
			{
				if (Game.wrinklers[i].sucked>0.5) {amount+=Game.wrinklers[i].sucked;number++;}
			}
			return {amount:amount,number:number};
		}
		Game.LoadWrinklers=function(amount,number)
		{
			if (number>0 && amount>0)
			{
				var fullNumber=number;
				for (var i in Game.wrinklers)
				{
					if (number>0) {Game.wrinklers[i].phase=2;Game.wrinklers[i].close=1;Game.wrinklers[i].hp=3;Game.wrinklers[i].sucked=amount/fullNumber;number--;}//respawn
				}
			}
		}
		
		
		/*=====================================================================================
		SPECIAL THINGS AND STUFF
		=======================================================================================*/
		
		Game.santaLevels=['Festive test tube','Festive ornament','Festive wreath','Festive tree','Festive present','Festive elf fetus','Elf toddler','Elfling','Young elf','Bulky elf','Nick','Santa Claus','Elder Santa','True Santa','Final Claus'];
		Game.santaDrops=['Increased merriness','Improved jolliness','A lump of coal','An itchy sweater','Reindeer baking grounds','Weighted sleighs','Ho ho ho-flavored frosting','Season savings','Toy workshop','Naughty list','Santa\'s bottomless bag','Santa\'s helpers','Santa\'s legacy','Santa\'s milk and cookies'];

		Game.santaTransition=0;
		Game.UpdateSanta=function()
		{
			if (Game.LeftBackground)
			{
				var x=48;
				var y=Game.LeftBackground.canvas.height-48-24;
				if (Math.abs(Game.mouseX-x)<48 && Math.abs(Game.mouseY-y)<48)
				{
					Game.mousePointer=1;
					if (Game.Click)
					{
						var moni=Math.pow(Game.santaLevel+1,Game.santaLevel+1);
						if (Game.cookies>moni && Game.santaLevel<14)
						{
							Game.Spend(moni);
							Game.santaLevel=(Game.santaLevel+1)%15;
							if (Game.santaLevel==14)
							{
								Game.Unlock('Santa\'s dominion');
								if (Game.prefs.popups) Game.Popup('You are granted<br>Santa\'s dominion.');
								else Game.Notify('You are granted Santa\'s dominion.','',Game.Upgrades['Santa\'s dominion'].icon);
							}
							Game.santaTransition=1;
							var drops=[];
							for (var i in Game.santaDrops) {if (!Game.HasUnlocked(Game.santaDrops[i])) drops.push(Game.santaDrops[i]);}
							var drop=choose(drops);
							if (drop)
							{
								Game.Unlock(drop);
								if (Game.prefs.popups) Game.Popup('You find a present which contains...<br>'+drop+'!');
								else Game.Notify('Found a present!','You find a present which contains...<br><b>'+drop+'</b>!',Game.Upgrades[drop].icon);
							}
							
							if (Game.santaLevel>=6) Game.Win('Coming to town');
							if (Game.santaLevel>=14) Game.Win('All hail Santa');
						}
						Game.Click=0;
					}
				}
				if (Game.santaTransition>0)
				{
					Game.santaTransition++;
					if (Game.santaTransition>=Game.fps/2) Game.santaTransition=0;
				}
			}
		}
		Game.DrawSanta=function()
		{
			Game.LeftBackground.globalAlpha=1;
			var x=48;
			var y=Game.LeftBackground.canvas.height-48-24;
			var r=Math.sin(Game.T*0.2)*Math.PI*0.02;
			var s=1;
			if (Math.abs(Game.mouseX-x)<48 && Math.abs(Game.mouseY-y)<48)
			{
				Game.LeftBackground.drawImage(Pic('winterFrame.png'),x-48,y-48);
				Game.LeftBackground.textAlign='center';
				var tx=x+48+96;
				if (Game.santaLevel<14)
				{
					var str=[Game.santaLevels[Game.santaLevel],'upgrade for',Beautify(Math.pow(Game.santaLevel+1,Game.santaLevel+1))+' '+(Game.santaLevel>0?'cookies':'cookie')];
					Game.LeftBackground.fillStyle='#200e0a';
					
					Game.LeftBackground.font='16px Kavoon';
					Game.LeftBackground.fillText(str[0],tx-1,y-8+1);
					Game.LeftBackground.font='12px Arial';
					Game.LeftBackground.fillText(str[1],tx-1,y+10+1);
					Game.LeftBackground.fillText(str[2],tx-1,y+24+1);
					
					Game.LeftBackground.fillStyle='#fff';
				
					Game.LeftBackground.font='16px Kavoon';
					Game.LeftBackground.fillText(str[0],tx,y-8);
					Game.LeftBackground.font='12px Arial';
					Game.LeftBackground.fillText(str[1],tx,y+10);
					Game.LeftBackground.fillText(str[2],tx,y+24);
				}
				else
				{
					str=Game.santaLevels[Game.santaLevel];
					Game.LeftBackground.fillStyle='#200e0a';
					
					Game.LeftBackground.font='20px Kavoon';
					Game.LeftBackground.fillText(str,tx-1,y+8+1);
					
					Game.LeftBackground.fillStyle='#fff';
					
					Game.LeftBackground.font='20px Kavoon';
					Game.LeftBackground.fillText(str,tx,y+8);
				}
				s=Math.sin(Game.T*0.15)*0.05+1.05;
				/*if (Math.random()<0.5)
				{
					x+=Math.floor(Math.random()*8-4);
					y+=Math.floor(Math.random()*8-4);
					r+=Math.random()*Math.PI*0.05;
				}*/
			}
			Game.LeftBackground.save();
			Game.LeftBackground.translate(x+Math.cos(Game.T*0.2)*4,y+48);
			Game.LeftBackground.rotate(r);
			Game.LeftBackground.drawImage(Pic('santa.png'),96*Game.santaLevel,0,96,96,-48*s,-96*s,96*s,96*s);
			if (Game.santaTransition>0)
			{
				Game.LeftBackground.globalAlpha=1-Game.santaTransition/(Game.fps/2);
				var s=1+(Game.santaTransition/(Game.fps/2));
				Game.LeftBackground.drawImage(Pic('santa.png'),96*Math.max(0,Game.santaLevel-1),0,96,96,-48*s,-96*s,96*s,96*s);
			}
			Game.LeftBackground.restore();
			//Game.LeftBackground.drawImage(Game.Assets['santa.png'],96*(Math.floor(Game.T/Game.fps)%14),0,96,96,x-48,y-48,96,96);
			
		}
		
		/*=====================================================================================
		VISUAL EFFECTS
		=======================================================================================*/
		Game.mousePointer=0;//when 1, draw the mouse as a pointer on the left screen
		
		Game.cookieOriginX=0;
		Game.cookieOriginY=0;
		Game.DrawBackground=function()
		{
			//background
			if (!Game.Background)
			{
				Game.Background=l('backgroundCanvas').getContext('2d');
				Game.Background.canvas.width=Game.Background.canvas.parentNode.offsetWidth;
				Game.Background.canvas.height=Game.Background.canvas.parentNode.offsetHeight;
				Game.LeftBackground=l('backgroundLeftCanvas').getContext('2d');
				Game.LeftBackground.canvas.width=Game.LeftBackground.canvas.parentNode.offsetWidth;
				Game.LeftBackground.canvas.height=Game.LeftBackground.canvas.parentNode.offsetHeight;
				window.addEventListener('resize', function(event)
				{
					Game.Background.canvas.width=Game.Background.canvas.parentNode.offsetWidth;
					Game.Background.canvas.height=Game.Background.canvas.parentNode.offsetHeight;
					Game.LeftBackground.canvas.width=Game.LeftBackground.canvas.parentNode.offsetWidth;
					Game.LeftBackground.canvas.height=Game.LeftBackground.canvas.parentNode.offsetHeight;
				});
			}
			if (Game.drawT%15==0)
			{
				Game.defaultBg='bgBlue';
				if (Game.season=='fools') Game.defaultBg='bgMoney';
				if (Game.elderWrathD<1)
				{
					Game.bgR=0;
					Game.bg=Game.defaultBg;
					Game.bgFade=Game.defaultBg;
				}
				else if (Game.elderWrathD>=1 && Game.elderWrathD<2)
				{
					Game.bgR=(Game.elderWrathD-1)/1;
					Game.bg=Game.defaultBg;
					Game.bgFade='grandmas1';
				}
				else if (Game.elderWrathD>=2 && Game.elderWrathD<3)
				{
					Game.bgR=(Game.elderWrathD-2)/1;
					Game.bg='grandmas1';
					Game.bgFade='grandmas2';
				}
				else if (Game.elderWrathD>=3)// && Game.elderWrathD<4)
				{
					Game.bgR=(Game.elderWrathD-3)/1;
					Game.bg='grandmas2';
					Game.bgFade='grandmas3';
				}
				var s1=512;if (Game.bg==Game.defaultBg) s1=600;
				var s2=512;if (Game.bgFade==Game.defaultBg) s2=600;
				var x=0;
				var y=0;
				Game.Background.fillPattern(Pic(Game.bg+'.jpg'),x,y,Game.Background.canvas.width,Game.Background.canvas.height,s1,s1);
				if (Game.bgR>0)
				{
					Game.Background.globalAlpha=Game.bgR;
					Game.Background.fillPattern(Pic(Game.bgFade+'.jpg'),x,y,Game.Background.canvas.width,Game.Background.canvas.height,s2,s2);
					Game.Background.globalAlpha=1;
				}
				Game.Background.drawImage(Pic('shadedBorders.png'),0,0,Game.Background.canvas.width,Game.Background.canvas.height);
			}
			
			//clear
			Game.LeftBackground.clearRect(0,0,Game.LeftBackground.canvas.width,Game.LeftBackground.canvas.height);
			
			
			Game.cookieOriginX=Math.floor(Game.LeftBackground.canvas.width/2);
			Game.cookieOriginY=Math.floor(Game.LeftBackground.canvas.height*0.4);
			
			if (Game.prefs.particles)
			{
				//falling cookies
				var pic='';
				var opacity=1;
				if (Game.elderWrathD<=1.5)
				{
					if (Game.cookiesPs>=1000) pic='cookieShower3.png';
					else if (Game.cookiesPs>=500) pic='cookieShower2.png';
					else if (Game.cookiesPs>=50) pic='cookieShower1.png';
					else pic='';
				}
				if (pic!='')
				{
					if (Game.elderWrathD>=1) opacity=1-((Math.min(Game.elderWrathD,1.5)-1)/0.5);
					Game.LeftBackground.globalAlpha=opacity;
					var y=(Math.floor(Game.T*2)%512);
					Game.LeftBackground.fillPattern(Pic(pic),0,-512+y,Game.LeftBackground.canvas.width,Game.LeftBackground.canvas.height+512,512,512);
					Game.LeftBackground.globalAlpha=1;
				}
				//snow
				if (Game.season=='christmas')
				{
					var y=(Math.floor(Game.T*2.5)%512);
					Game.LeftBackground.globalAlpha=0.75;
					Game.LeftBackground.globalCompositeOperation='lighter';
					Game.LeftBackground.fillPattern(Pic('snow2.jpg'),0,-512+y,Game.LeftBackground.canvas.width,Game.LeftBackground.canvas.height+512,512,512);
					Game.LeftBackground.globalCompositeOperation='source-over';
					Game.LeftBackground.globalAlpha=1;
				}
				//hearts
				if (Game.season=='valentines')
				{
					var y=(Math.floor(Game.T*2.5)%512);
					Game.LeftBackground.globalAlpha=1;
					Game.LeftBackground.fillPattern(Pic('heartStorm.png'),0,-512+y,Game.LeftBackground.canvas.width,Game.LeftBackground.canvas.height+512,512,512);
					Game.LeftBackground.globalAlpha=1;
				}
				
				Game.particlesDraw(0);
				Game.LeftBackground.globalAlpha=1;
				
				//big cookie shine
				var s=512;
				
				var x=Game.cookieOriginX;
				var y=Game.cookieOriginY;
				
				var r=Math.floor((Game.T*0.5)%360);
				Game.LeftBackground.save();
				Game.LeftBackground.translate(x,y);
				Game.LeftBackground.rotate((r/360)*Math.PI*2);
				Game.LeftBackground.globalAlpha=0.5;
				Game.LeftBackground.drawImage(Pic('shine.png'),-s/2,-s/2,s,s);
				Game.LeftBackground.rotate((-r*2/360)*Math.PI*2);
				Game.LeftBackground.globalAlpha=0.25;
				Game.LeftBackground.drawImage(Pic('shine.png'),-s/2,-s/2,s,s);
				Game.LeftBackground.restore();
				
				
				
				//big cookie
				Game.LeftBackground.globalAlpha=1;
				var s=256*Game.BigCookieSize;
				var x=Game.cookieOriginX;
				var y=Game.cookieOriginY;
				Game.LeftBackground.save();
				Game.LeftBackground.translate(x,y);
				if (Game.season=='easter')
				{
					var nestW=304*0.98*Game.BigCookieSize;
					var nestH=161*0.98*Game.BigCookieSize;
					Game.LeftBackground.drawImage(Pic('nest.png'),-nestW/2,-nestH/2+130,nestW,nestH);
				}
				//Game.LeftBackground.rotate(((Game.startDate%360)/360)*Math.PI*2);
				Game.LeftBackground.drawImage(Pic('perfectCookie.png'),-s/2,-s/2,s,s);
				Game.LeftBackground.restore();
			}
			else
			{
				//big cookie shine
				var s=512;
				var x=Game.cookieOriginX-s/2;
				var y=Game.cookieOriginY-s/2;
				Game.LeftBackground.globalAlpha=0.5;
				Game.LeftBackground.drawImage(Pic('shine.png'),x,y,s,s);
				//big cookie
				Game.LeftBackground.globalAlpha=1;
				var s=256*Game.BigCookieSize;
				var x=Game.cookieOriginX-s/2;
				var y=Game.cookieOriginY-s/2;
				Game.LeftBackground.drawImage(Pic('perfectCookie.png'),x,y,s,s);
			}
			
			//debug
			/*
			Game.LeftBackground.globalAlpha=1;
			Game.LeftBackground.lineWidth='8';
			Game.LeftBackground.strokeStyle='red';
			var s=Math.ceil(Math.sin(Game.T*0.1)*10+10);
			Game.LeftBackground.beginPath();
			Game.LeftBackground.rect(s,s,Game.LeftBackground.canvas.width-s*2,Game.LeftBackground.canvas.height-s*2);
			Game.LeftBackground.stroke();
			*/
		
			//cursors			
			if (Game.prefs.cursors)
			{
				var amount=Game.Objects['Cursor'].amount;
				for (var i=0;i<amount;i++)
				{
					var n=Math.floor(i/50);
					var a=((i+0.5*n)%50)/50;
					var w=0;
					var r=(-(a)*360);
					if (Game.prefs.fancy) w=(Math.sin(Game.T*0.025+(((i+n*12)%25)/25)*Math.PI*2));
					if (w>0.997) w=1.5;
					else if (w>0.994) w=0.5;
					else w=0;
					w*=-4;
					if (Game.prefs.fancy) w+=Math.sin((n+Game.T*0.01)*Math.PI/2)*4;
					if (Game.prefs.fancy) r=(-(a)*360-Game.T*0.1);
					var x=0;
					var y=(140+n*16+w)-16;
					
					Game.LeftBackground.save();
					Game.LeftBackground.translate((Game.LeftBackground.canvas.width/2),(Game.LeftBackground.canvas.height*0.4));
					Game.LeftBackground.rotate((r/360)*Math.PI*2);
					
					Game.LeftBackground.drawImage(Pic('cursor.png'),x,y);
					Game.LeftBackground.restore();
				}
			}
			
			
			//milk and milk accessories
			if (Game.prefs.milk)
			{
				var width=Game.LeftBackground.canvas.width;
				var height=Game.LeftBackground.canvas.height;
				var x=Math.floor((Game.T*2-(Game.milkH-Game.milkHd)*2000+480*2)%480);//Math.floor((Game.T*2+Math.sin(Game.T*0.1)*2+Math.sin(Game.T*0.03)*2-(Game.milkH-Game.milkHd)*2000+480*2)%480);
				var y=(Game.milkHd)*height;//(((Game.milkHd)*Game.LeftBackground.canvas.height)*(1+0.05*(Math.sin(Game.T*0.017)/2+0.5)));
				/*
				var m1o=1;
				var m2o=0;
				var m1i=0;
				var m2i=0;
				if (Game.milkProgress<1) {m1o=1;m1i=0;m2i=1;}
				else if (Game.milkProgress<2) {m1o=1-(Game.milkProgress-1);m1i=0;m2i=1;}
				else if (Game.milkProgress<3) {m1o=1-(Game.milkProgress-2);m1i=1;m2i=2;}
				else if (Game.milkProgress<4) {m1o=1-(Game.milkProgress-3);m1i=2;m2i=3;}
				else if (Game.milkProgress<5) {m1o=1-(Game.milkProgress-4);m1i=3;m2i=4;}
				else {m1o=1;m1i=2;m2i=2;}
				var pic1=Game.MilkPics[m1i];
				var pic2=Game.MilkPics[m2i];
				Game.LeftBackground.globalAlpha=m1o*0.9;
				Game.LeftBackground.fillPattern(Game.Assets[pic1+'.png'],-480+x,Game.LeftBackground.canvas.height-y,Game.LeftBackground.canvas.width+480,1,480,480);
				m2o=1-m1o;
				if (m2o>0)
				{
					Game.LeftBackground.globalAlpha=m2o*0.9;
					Game.LeftBackground.fillPattern(Game.Assets[pic2+'.png'],-480+x,Game.LeftBackground.canvas.height-y,Game.LeftBackground.canvas.width+480,1,480,480);
				}
				*/
				var pic=0;
				if (Game.milkProgress<1) {pic=0;}
				else if (Game.milkProgress<2) {pic=1;}
				else if (Game.milkProgress<3) {pic=2;}
				else if (Game.milkProgress<4) {pic=3;}
				else if (Game.milkProgress<5) {pic=4;}
				else {pic=4;}
				pic=Game.MilkPics[pic];
				Game.LeftBackground.globalAlpha=0.9;
				Game.LeftBackground.fillPattern(Pic(pic+'.png'),-480+x,height-y,width+480,1,480,480);
				
				Game.LeftBackground.fillStyle='#000';
				Game.LeftBackground.fillRect(0,height-y+480,width,Math.max(0,(y-480)));
				Game.LeftBackground.globalAlpha=1;
				
				/*
				//accessories
				//quick test
				//should be draggable with mouse
				//add a full object system
				var x=64+Math.sin(Game.T*0.04)*16+Math.sin(Game.T*0.003)*16;
				var y=height-(Game.milkHd)*height+Math.sin(Game.T*0.1)*2+Math.sin(Game.T*0.007)*4;
				var r=Math.sin(Game.T*0.03)*20;
				//if (Game.mouseDown) {x=Game.mouseX;y=Game.mouseY;r=0;}
				Game.LeftBackground.save();
				Game.LeftBackground.translate(x,y);
				Game.LeftBackground.rotate((r/360)*Math.PI*2);
				Game.LeftBackground.drawImage(Pic('smallCookies.png'),0,0,64,64,-32,-32,64,64);
				Game.LeftBackground.restore();
				*/
				//draw the front part of the milk here
			}
			
			Game.DrawWrinklers();
			if (Game.Has('A festive hat')) Game.DrawSanta();
			
			Game.particlesDraw(2);
			
			//shiny border during frenzies etc
			Game.LeftBackground.globalAlpha=1;
			var borders='shadedBorders.png';
			if (Game.clickFrenzy>0 || (Game.frenzy>0 && Game.frenzyPower>=1)) borders='shadedBordersGold.png';
			else if (Game.frenzy>0) borders='shadedBordersRed.png';
			Game.LeftBackground.drawImage(Pic(borders),0,0,Game.LeftBackground.canvas.width,Game.LeftBackground.canvas.height);
			
			if (Game.frenzy>0 && Game.frenzyPower>=100) {Game.timersEl['elderFrenzy'].style.width=((Game.frenzy/Game.frenzyMax)*100)+'%';Game.timersEl['elderFrenzy'].style.display='block';}
			else if (Game.frenzy>0 && Game.frenzyPower>1) {Game.timersEl['frenzy'].style.width=((Game.frenzy/Game.frenzyMax)*100)+'%';Game.timersEl['frenzy'].style.display='block';}
			else if (Game.frenzy>0 && Game.frenzyPower<1) {Game.timersEl['clot'].style.width=((Game.frenzy/Game.frenzyMax)*100)+'%';Game.timersEl['clot'].style.display='block';}
			if (Game.clickFrenzy>0) {Game.timersEl['clickFrenzy'].style.width=((1-Game.clickFrenzy/Game.clickFrenzyMax)*100)+'%';Game.timersEl['clickFrenzy'].style.display='block';}
			
			if (Game.frenzy==0) {Game.timersEl['frenzy'].style.display='none';Game.timersEl['elderFrenzy'].style.display='none';Game.timersEl['clot'].style.display='none';}
			if (Game.clickFrenzy==0) {Game.timersEl['clickFrenzy'].style.display='none';}
		};
		
		
		/*=====================================================================================
		DUNGEONS
		=======================================================================================*/
		
		LaunchDungeons();//someday
		
		/*=====================================================================================
		INITIALIZATION END; GAME READY TO LAUNCH
		=======================================================================================*/
		
		
		//booooo
		Game.RuinTheFun=function()
		{
			Game.popups=0;
			for (var i in Game.Upgrades)
			{
				if (!Game.Upgrades[i].season && Game.Upgrades[i].name!='Golden switch') Game.Upgrades[i].earn();
			}
			for (var i in Game.Achievements)
			{
				Game.Win(Game.Achievements[i].name);
			}
			Game.Earn(999999999999999999999999999999);
			Game.upgradesToRebuild=1;
			Game.recalculateGains=1;
			Game.popups=1;
			if (Game.prefs.popups) Game.Popup('Thou doth ruineth the fun!');
			else Game.Notify('Thou doth ruineth the fun!','You\'re free. Free at last.',[11,5]);
		}
		
		for (var i in Game.customInit) {Game.customInit[i]();}
		
		Game.LoadSave();
		
		Game.ready=1;
		l('javascriptError').innerHTML='';
		l('javascriptError').style.display='none';
		Game.Loop();
	}
	
	/*=====================================================================================
	LOGIC
	=======================================================================================*/
	Game.Logic=function()
	{
		for (var i in Game.Objects)
		{
			if (Game.Objects[i].EachFrame) Game.Objects[i].EachFrame();
		}
		if (Game.Has('A festive hat')) Game.UpdateSanta();
		Game.UpdateGrandmapocalypse();
		
		
		//handle graphic stuff
		if (Game.BigCookieState==1) Game.BigCookieSize+=(0.98-Game.BigCookieSize)*0.5;
		else if (Game.BigCookieState==2) Game.BigCookieSize+=(1.05-Game.BigCookieSize)*0.5;
		else Game.BigCookieSize+=(1-Game.BigCookieSize)*0.5;
		Game.particlesUpdate();
		
		if (Game.mousePointer) l('sectionLeft').style.cursor='pointer';
		else l('sectionLeft').style.cursor='auto';
		Game.mousePointer=0;
		
		//handle milk and milk accessories
		Game.milkProgress=Game.AchievementsOwned/25;
		if (Game.milkProgress>=0.5) Game.Unlock('Kitten helpers');
		if (Game.milkProgress>=1) Game.Unlock('Kitten workers');
		if (Game.milkProgress>=2) Game.Unlock('Kitten engineers');
		if (Game.milkProgress>=3) Game.Unlock('Kitten overseers');
		if (Game.milkProgress>=4) Game.Unlock('Kitten managers');
		Game.milkH=Math.min(1,Game.milkProgress)*0.35;
		Game.milkHd+=(Game.milkH-Game.milkHd)*0.02;
		
		if (Game.autoclickerDetected>0) Game.autoclickerDetected--;
		
		//handle research
		if (Game.researchT>0)
		{
			Game.researchT--;
		}
		if (Game.researchT==0 && Game.nextResearch)
		{
			Game.Unlock(Game.UpgradesById[Game.nextResearch].name);
			if (Game.prefs.popups) Game.Popup('Researched : '+Game.UpgradesById[Game.nextResearch].name);
			else Game.Notify('Research complete','You have discovered : <b>'+Game.UpgradesById[Game.nextResearch].name+'</b>.',Game.UpgradesById[Game.nextResearch].icon);
			Game.nextResearch=0;
			Game.researchT=-1;
		}
		//handle seasons
		if (Game.seasonT>0)
		{
			Game.seasonT--;
		}
		if (Game.seasonT<=0 && Game.season!='' && Game.season!=Game.baseSeason && !Game.Has('Eternal seasons'))
		{
			var str=Game.seasons[Game.season].over;
			if (Game.prefs.popups) Game.Popup(str);
			else Game.Notify(str,'',Game.seasons[Game.season].triggerUpgrade.icon);
			if (Game.Has('Season switcher')) Game.Unlock(Game.seasons[Game.season].trigger);
			Game.season=Game.baseSeason;
			Game.seasonT=-1;
		}
		
		//handle cookies
		if (Game.recalculateGains) Game.CalculateGains();
		Game.Earn(Game.cookiesPs/Game.fps);//add cookies per second
		
		//wrinklers
		if (Game.cpsSucked>0)
		{
			Game.Dissolve((Game.cookiesPs/Game.fps)*Game.cpsSucked);
			Game.cookiesSucked+=((Game.cookiesPs/Game.fps)*Game.cpsSucked);
			//should be using one of the following, but I'm not sure what I'm using this stat for anymore
			//Game.cookiesSucked=Game.wrinklers.reduce(function(s,w){return s+w.sucked;},0);
			//for (var i in Game.wrinklers) {Game.cookiesSucked+=Game.wrinklers[i].sucked;}
		}
		
		//var cps=Game.cookiesPs+Game.cookies*0.01;//exponential cookies
		//Game.Earn(cps/Game.fps);//add cookies per second
		
		for (var i in Game.Objects)
		{
			var me=Game.Objects[i];
			me.totalCookies+=(me.storedTotalCps*Game.globalCpsMult)/Game.fps;
		}
		if (Game.cookies && Game.T%Math.ceil(Game.fps/Math.min(10,Game.cookiesPs))==0 && Game.prefs.particles) Game.particleAdd();//cookie shower
		if (Game.frenzy>0)
		{
			Game.frenzy--;
			if (Game.frenzy<1) Game.recalculateGains=1;
		}
		if (Game.clickFrenzy>0)
		{
			Game.clickFrenzy--;
			if (Game.clickFrenzy<1) Game.recalculateGains=1;
		}
		
		if (Game.T%(Game.fps*10)==0) Game.recalculateGains=1;//recalculate CpS every 2 minutes (for dynamic boosts such as Century egg)
		
		/*=====================================================================================
		UNLOCKING STUFF
		=======================================================================================*/
		if (Game.T%(Game.fps)==0 && Math.random()<1/500000) Game.Win('Just plain lucky');//1 chance in 500,000 every second achievement
		if (Game.T%(Game.fps*5)==0 && Game.ObjectsById.length>0)//check some achievements and upgrades
		{
			//if (Game.Objects['Factory'].amount>=50 && Game.Objects['Factory'].specialUnlocked==0) {Game.Objects['Factory'].unlockSpecial();Game.Popup('You have unlocked the factory dungeons!');}
			
			if (isNaN(Game.cookies)) {Game.cookies=0;Game.cookiesEarned=0;Game.recalculateGains=1;}
			
			var timePlayed=new Date();
			timePlayed.setTime(new Date().getTime()-Game.startDate);
			
			if (Game.cookiesEarned>=1000000 && !Game.Has('Heavenly chip secret'))
			{
				if (timePlayed<=1000*60*35) Game.Win('Speed baking I');
				if (timePlayed<=1000*60*25) Game.Win('Speed baking II');
				if (timePlayed<=1000*60*15) Game.Win('Speed baking III');
			}
			
			if (Game.cookiesEarned>=9999999) Game.Unlock(['Oatmeal raisin cookies','Peanut butter cookies','Plain cookies','Sugar cookies']);
			if (Game.cookiesEarned>=99999999) Game.Unlock(['Coconut cookies','White chocolate cookies','Macadamia nut cookies']);
			if (Game.cookiesEarned>=999999999) Game.Unlock(['Double-chip cookies','White chocolate macadamia nut cookies','All-chocolate cookies']);
			if (Game.cookiesEarned>=9999999999) Game.Unlock(['Dark chocolate-coated cookies','White chocolate-coated cookies']);
			if (Game.cookiesEarned>=99999999999) Game.Unlock(['Eclipse cookies','Zebra cookies']);
			if (Game.cookiesEarned>=999999999999) Game.Unlock(['Snickerdoodles','Stroopwafels','Macaroons']);
			if (Game.cookiesEarned>=999999999999 && Game.Has('Snickerdoodles') && Game.Has('Stroopwafels') && Game.Has('Macaroons'))
			{
				Game.Unlock('Empire biscuits');
				if (Game.Has('Empire biscuits')) Game.Unlock('British tea biscuits');
				if (Game.Has('British tea biscuits')) Game.Unlock('Chocolate british tea biscuits');
				if (Game.Has('Chocolate british tea biscuits')) Game.Unlock('Round british tea biscuits');
				if (Game.Has('Round british tea biscuits')) Game.Unlock('Round chocolate british tea biscuits');
				if (Game.Has('Round chocolate british tea biscuits')) Game.Unlock('Round british tea biscuits with heart motif');
				if (Game.Has('Round british tea biscuits with heart motif')) Game.Unlock('Round chocolate british tea biscuits with heart motif');
			}
			if (Game.cookiesEarned>=9999999999999)
			{
				Game.Unlock(['Madeleines','Palmiers','Palets','Sabl&eacute;s']);
				
				if (Game.prestige['Heavenly chips']>=1) Game.Unlock('Caramoas');
				if (Game.prestige['Heavenly chips']>=2) Game.Unlock('Sagalongs');
				if (Game.prestige['Heavenly chips']>=3) Game.Unlock('Shortfoils');
				if (Game.prestige['Heavenly chips']>=4) Game.Unlock('Win mints');
				
				if (Game.prestige['Heavenly chips']>=10) Game.Unlock('Fig gluttons');
				if (Game.prestige['Heavenly chips']>=100) Game.Unlock('Loreols');
				if (Game.prestige['Heavenly chips']>=500) Game.Unlock('Jaffa cakes');
				if (Game.prestige['Heavenly chips']>=2000) Game.Unlock('Grease\'s cups');
				
				if (Game.prestige['Heavenly chips']>=10000) Game.Unlock(['Rose macarons','Lemon macarons','Chocolate macarons','Pistachio macarons','Hazelnut macarons','Violet macarons','Caramel macarons','Licorice macarons']);
				
				if (Game.prestige['Heavenly chips']>=5000) Game.Unlock('Season switcher');
			}
			if (Game.cookiesEarned>=99999999999999)
			{
				Game.Unlock(['Gingerbread men','Gingerbread trees']);
				if (Game.season=='valentines')
				{
					Game.Unlock('Pure heart biscuits');
					if (Game.Has('Pure heart biscuits')) Game.Unlock('Ardent heart biscuits');
					if (Game.Has('Ardent heart biscuits')) Game.Unlock('Sour heart biscuits');
					if (Game.Has('Sour heart biscuits')) Game.Unlock('Weeping heart biscuits');
					if (Game.Has('Weeping heart biscuits')) Game.Unlock('Golden heart biscuits');
					if (Game.Has('Golden heart biscuits')) Game.Unlock('Eternal heart biscuits');
				}
			}
			if (Game.Has('Eternal heart biscuits')) Game.Win('Lovely cookies');
			if (Game.season=='easter')
			{
				var eggs=0;
				for (var i in Game.easterEggs)
				{
					if (Game.HasUnlocked(Game.easterEggs[i])) eggs++;
				}
				if (eggs>=1) Game.Win('The hunt is on');
				if (eggs>=7) Game.Win('Egging on');
				if (eggs>=14) Game.Win('Mass Easteria');
				if (eggs>=Game.easterEggs.length) Game.Win('Hide & seek champion');
			}
			
			if (Game.prestige['Heavenly chips']>0)
			{
				Game.Unlock('Heavenly chip secret');
				if (Game.Has('Heavenly chip secret')) Game.Unlock('Heavenly cookie stand');
				if (Game.Has('Heavenly cookie stand')) Game.Unlock('Heavenly bakery');
				if (Game.Has('Heavenly bakery')) Game.Unlock('Heavenly confectionery');
				if (Game.Has('Heavenly confectionery')) Game.Unlock('Heavenly key');
				
				if (Game.Has('Heavenly key')) Game.Win('Wholesome');
			}
		
			for (var i=0;i<Game.moneyAchievs.length/2;i++)
			{
				if (Game.cookiesEarned>=Game.moneyAchievs[i*2+1]) Game.Win(Game.moneyAchievs[i*2]);
			}
			var buildingsOwned=0;
			var oneOfEach=1;
			var mathematician=1;
			var base10=1;
			var centennial=1;
			var centennialhalf=1;
			var bicentennial=1;
			for (var i in Game.Objects)
			{
				buildingsOwned+=Game.Objects[i].amount;
				if (!Game.HasAchiev('One with everything')) {if (Game.Objects[i].amount==0) oneOfEach=0;}
				if (!Game.HasAchiev('Mathematician')) {if (Game.Objects[i].amount<Math.min(128,Math.pow(2,(Game.ObjectsById.length-Game.Objects[i].id)-1))) mathematician=0;}
				if (!Game.HasAchiev('Base 10')) {if (Game.Objects[i].amount<(Game.ObjectsById.length-Game.Objects[i].id)*10) base10=0;}
				if (!Game.HasAchiev('Centennial')) {if (Game.Objects[i].amount<100) centennial=0;}
				if (!Game.HasAchiev('Centennial and a half')) {if (Game.Objects[i].amount<150) centennialhalf=0;}
				if (!Game.HasAchiev('Bicentennial')) {if (Game.Objects[i].amount<200) bicentennial=0;}
			}
			if (oneOfEach==1) Game.Win('One with everything');
			if (mathematician==1) Game.Win('Mathematician');
			if (base10==1) Game.Win('Base 10');
			if (centennial==1) Game.Win('Centennial');
			if (centennialhalf==1) Game.Win('Centennial and a half');
			if (bicentennial==1) Game.Win('Bicentennial');
			if (Game.cookiesEarned>=1000000 && Game.cookieClicks<=15) Game.Win('Neverclick');
			if (Game.cookiesEarned>=1000000 && Game.cookieClicks<=0) Game.Win('True Neverclick');
			if (Game.handmadeCookies>=1000) {Game.Win('Clicktastic');Game.Unlock('Plastic mouse');}
			if (Game.handmadeCookies>=100000) {Game.Win('Clickathlon');Game.Unlock('Iron mouse');}
			if (Game.handmadeCookies>=10000000) {Game.Win('Clickolympics');Game.Unlock('Titanium mouse');}
			if (Game.handmadeCookies>=1000000000) {Game.Win('Clickorama');Game.Unlock('Adamantium mouse');}
			if (Game.handmadeCookies>=100000000000) {Game.Win('Clickasmic');Game.Unlock('Unobtainium mouse');}
			if (Game.handmadeCookies>=10000000000000) {Game.Win('Clickageddon');Game.Unlock('Eludium mouse');}
			if (Game.handmadeCookies>=1000000000000000) {Game.Win('Clicknarok');Game.Unlock('Wishalloy mouse');}
			
			if (Game.cookiesEarned<Game.cookies) Game.Win('Cheated cookies taste awful');
			if (Game.bakeryName.toLowerCase()=='orteil') Game.Win('God complex');
			
			if (Game.Has('Skull cookies') && Game.Has('Ghost cookies') && Game.Has('Bat cookies') && Game.Has('Slime cookies') && Game.Has('Pumpkin cookies') && Game.Has('Eyeball cookies') && Game.Has('Spider cookies')) Game.Win('Spooky cookies');
			if (Game.wrinklersPopped>=1) Game.Win('Itchscratcher');
			if (Game.wrinklersPopped>=50) Game.Win('Wrinklesquisher');
			if (Game.wrinklersPopped>=200) Game.Win('Moistburster');
			
			if (Game.cookiesEarned>=25 && Game.season=='christmas') Game.Unlock('A festive hat');
			if (Game.Has('Christmas tree biscuits') && Game.Has('Snowflake biscuits') && Game.Has('Snowman biscuits') && Game.Has('Holly biscuits') && Game.Has('Candy cane biscuits') && Game.Has('Bell biscuits') && Game.Has('Present biscuits')) Game.Win('Let it snow');
			
			if (Game.reindeerClicked>=1) Game.Win('Oh deer');
			if (Game.reindeerClicked>=50) Game.Win('Sleigh of hand');
			if (Game.reindeerClicked>=200) Game.Win('Reindeer sleigher');
			
			if (buildingsOwned>=100) Game.Win('Builder');
			if (buildingsOwned>=400) Game.Win('Architect');
			if (buildingsOwned>=800) Game.Win('Engineer');
			if (buildingsOwned>=1500) Game.Win('Lord of Constructs');
			if (Game.UpgradesOwned>=20) Game.Win('Enhancer');
			if (Game.UpgradesOwned>=50) Game.Win('Augmenter');
			if (Game.UpgradesOwned>=100) Game.Win('Upgrader');
			if (Game.UpgradesOwned>=150) Game.Win('Lord of Progress');
			
			if (Game.UpgradesOwned==0 && Game.cookiesEarned>=1000000000) Game.Win('Hardcore');
			
			if (Game.prestige['Heavenly chips']>=1 && Game.Has('Bingo center/Research facility')) Game.Unlock('Persistent memory');
			
			if (Game.cookiesEarned>=10000000000 && !Game.HasAchiev('You win a cookie')) {Game.Win('You win a cookie');Game.Earn(1);}
			
			var grandmas=0;
			if (Game.Has('Farmer grandmas')) grandmas++;
			if (Game.Has('Worker grandmas')) grandmas++;
			if (Game.Has('Miner grandmas')) grandmas++;
			if (Game.Has('Cosmic grandmas')) grandmas++;
			if (Game.Has('Transmuted grandmas')) grandmas++;
			if (Game.Has('Altered grandmas')) grandmas++;
			if (Game.Has('Grandmas\' grandmas')) grandmas++;
			if (Game.Has('Antigrandmas')) grandmas++;
			if (Game.Has('Rainbow grandmas')) grandmas++;
			if (!Game.HasAchiev('Elder') && grandmas>=7) Game.Win('Elder');
			if (Game.Objects['Grandma'].amount>=6 && !Game.Has('Bingo center/Research facility') && Game.HasAchiev('Elder')) Game.Unlock('Bingo center/Research facility');
			if (Game.pledges>0) Game.Win('Elder nap');
			if (Game.pledges>=5) Game.Win('Elder slumber');
			if (Game.pledges>=10) Game.Unlock('Sacrificial rolling pins');
			
			var base=10000000000000;
			if (Game.Objects['Cursor'].totalCookies>=base*1000000) Game.Win('Click delegator');
			if (Game.Objects['Grandma'].totalCookies>=base*1000000) Game.Win('Gushing grannies');
			if (Game.Objects['Farm'].totalCookies>=base) Game.Win('I hate manure');
			if (Game.Objects['Factory'].totalCookies>=base*10) Game.Win('The incredible machine');
			if (Game.Objects['Mine'].totalCookies>=base*100) Game.Win('Never dig down');
			if (Game.Objects['Shipment'].totalCookies>=base*1000) Game.Win('And beyond');
			if (Game.Objects['Alchemy lab'].totalCookies>=base*10000) Game.Win('Magnum Opus');
			if (Game.Objects['Portal'].totalCookies>=base*100000) Game.Win('With strange eons');
			if (Game.Objects['Time machine'].totalCookies>=base*1000000) Game.Win('Spacetime jigamaroo');
			if (Game.Objects['Antimatter condenser'].totalCookies>=base*10000000) Game.Win('Supermassive');
			if (Game.Objects['Prism'].totalCookies>=base*100000000) Game.Win('Praise the sun');
			
			if (!Game.HasAchiev('Cookie-dunker') && Game.LeftBackground && Game.milkProgress>0.1 && (Game.LeftBackground.canvas.height*0.4+256/2-16)>((1-Game.milkHd)*Game.LeftBackground.canvas.height)) Game.Win('Cookie-dunker');
			//&& l('bigCookie').getBoundingClientRect().bottom>l('milk').getBoundingClientRect().top+16 && Game.milkProgress>0.1) Game.Win('Cookie-dunker');
			
			for (var i in Game.customChecks) {Game.customChecks[i]();}
		}
		
		Game.cookiesd+=(Game.cookies-Game.cookiesd)*0.3;
		
		if (Game.storeToRefresh) Game.RefreshStore();
		if (Game.upgradesToRebuild) Game.RebuildUpgrades();
		
		if (Game.T%(Game.fps*2)==0)
		{
			var title='Cookie Clicker';
			if (Game.season=='fools') title='Cookie Baker';
			document.title=Beautify(Game.cookies)+' '+(Game.cookies==1?'cookie':'cookies')+' - '+title;
		}
		
		Game.TickerAge--;
		if (Game.TickerAge<=0 || Game.Ticker=='') Game.getNewTicker();
		
		var veilLimit=0;//10;
		if (Game.veil==1 && Game.cookiesEarned>=veilLimit) Game.veilOff();
		else if (Game.veil==0 && Game.cookiesEarned<veilLimit) Game.veilOn();
		
		Game.goldenCookie.update();
		Game.seasonPopup.update();
		
		Game.NotesLogic();
		
		for (var i in Game.customLogic) {Game.customLogic[i]();}
		
		Game.Click=0;
		
		if (Game.T%(Game.fps*60)==0 && Game.T>Game.fps*10 && Game.prefs.autosave) Game.WriteSave();
		if (Game.T%(Game.fps*60*30)==0 && Game.T>Game.fps*10 && Game.prefs.autoupdate) Game.CheckUpdates();
		
		Game.T++;
	}
	
	/*=====================================================================================
	DRAW
	=======================================================================================*/
	
	Game.MilkPics={0:'milkWave',1:'chocolateMilkWave',2:'raspberryWave',3:'orangeWave',4:'caramelWave'};
	
	Game.Draw=function()
	{
		Game.DrawBackground();
		
		
		
		var unit=(Math.round(Game.cookiesd)==1?' cookie':' cookies');
		var str=Beautify(Math.round(Game.cookiesd));
		if (str.length>11 && !Game.mobile) unit='<br>cookies';
		var str=str+unit+'<div style="font-size:50%;"'+(Game.cpsSucked>0?' class="warning"':'')+'>per second : '+Beautify(Game.cookiesPs*(1-Game.cpsSucked),1)+'</div>';//display cookie amount
		l('cookies').innerHTML=str;
		l('compactCookies').innerHTML=str;
		
		
		Game.TickerDraw();
		Game.tooltip.update();
		
		if (Game.drawT%2==0)
		{
			var lastLocked=0;
			for (var i in Game.Objects)
			{
				var me=Game.Objects[i];
				
				//make products full-opacity if we can buy them
				var classes='product';
				var price=me.price;
				if (Game.cookiesEarned>=me.basePrice) {classes+=' unlocked';lastLocked=0;me.locked=0;} else {classes+=' locked';lastLocked++;me.locked=1;}
				if (Game.cookies>=price) classes+=' enabled'; else classes+=' disabled';
				if (lastLocked>2) classes+=' toggledOff';
				me.l.className=classes;
			}
			
			//make upgrades full-opacity if we can buy them
			for (var i in Game.UpgradesInStore)
			{
				var me=Game.UpgradesInStore[i];
				if (Game.cookies>=me.getPrice()) l('upgrade'+i).className='crate upgrade enabled'; else l('upgrade'+i).className='crate upgrade disabled';
			}
		}
		
		
		if (Game.drawT%(Game.fps*3)==0) Game.UpdateMenu();
		if (Game.drawT%(Game.fps*3)==0) Game.UpdatePrompt();
		
		if (Game.prefs.animate && ((Game.prefs.fancy && Game.drawT%1==0) || (!Game.prefs.fancy && Game.drawT%10==0))) Game.DrawBuildings();
		
		Game.textParticlesUpdate();
		Game.NotesDraw();
		
		for (var i in Game.customDraw) {Game.customDraw[i]();}
		
		Game.drawT++;
	}
	
	/*=====================================================================================
	MAIN LOOP
	=======================================================================================*/
	Game.Loop=function()
	{
		//update game logic !
		Game.catchupLogic=0;
		Game.Logic();
		Game.catchupLogic=1;
		
		//latency compensator
		Game.accumulatedDelay+=((new Date().getTime()-Game.time)-1000/Game.fps);
		Game.accumulatedDelay=Math.min(Game.accumulatedDelay,1000*5);//don't compensate over 5 seconds; if you do, something's probably very wrong
		Game.time=new Date().getTime();
		while (Game.accumulatedDelay>0)
		{
			Game.Logic();
			Game.accumulatedDelay-=1000/Game.fps;//as long as we're detecting latency (slower than target fps), execute logic (this makes drawing slower but makes the logic behave closer to correct target fps)
		}
		Game.catchupLogic=0;
		
		if (document.hasFocus() || Game.prefs.focus || Game.T%5==0) Game.Draw();
		
		setTimeout(Game.Loop,1000/Game.fps);
	}
}


/*=====================================================================================
LAUNCH THIS THING
=======================================================================================*/
Game.Launch();

window.onload=function()
{
	
	if (!Game.ready)
	{
		if (top!=self) Game.ErrorFrame();
		else Game.Load();
	}
};
