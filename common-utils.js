window["CommonUtils"] = {};
window.CommonUtils["URLParser"] = function(url) {
    this.parse = function(url) {
        var parser = document.createElement('a');
        var searchObject = {};
        var split;
        parser.href = url;
        var pathname = parser.pathname;
        if (pathname.charAt(0) != "/") {
            pathname = "/" + pathname;
        }
        var queries = parser.search.replace(/^\?/, '').split('&');
        for (var index in queries) {
            if (queries.hasOwnProperty(index)) {
                var string = queries[parseInt(index)];
                if (string != null && string != "") {
                    split = queries[parseInt(index)].split('=');
                    searchObject[split[0]] = split[1];
                }
            }
        }
        var hashstring = parser.hash;
        if (hashstring.length > 0 && hashstring.charAt(0) == "#") {
            hashstring = hashstring.substring(1);
        }
        var hashObject = this.parseHashString(hashstring);
        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: pathname,
            search: parser.search,
            query: searchObject,
            hash: hashObject,
            hashstring: hashstring
        };
    }
    this.parseHashString = function(hashstring) {
        var hashObject = {};
        if(hashstring=="") {return hashObject;}
        if (hashstring.charAt(0) == "#") {
            hashstring = hashstring.substring(1);
        }
        var hashes = hashstring.split(/#|&/g);
        for (var index in hashes) {
            if (hashes.hasOwnProperty(index)) {
                var string = hashes[parseInt(index)];
                if (string != null) {
                    split = hashes[parseInt(index)].split('=');
                    hashObject[split[0]] = split.slice(1, split.length).join("=");
                }
            }
        }
        return hashObject;
    }
    this.updateHash = function(hashstring) {
        if (hashstring.length > 0 && hashstring.charAt(0) == "#") {
            hashstring = hashstring.substring(1);
        }
        this.URL.hashstring = hashstring;
        this.URL.hash = this.parseHashString(hashstring);
    }
    this.URL = this.URL || this.parse(url);
    this.toString = function() {
        var url = [];
        url.push(this.URL.protocol);
        url.push("//");
        url.push(this.URL.hostname);
        if (this.URL.port != '' && this.URL.port != '0') {
            url.push(":");
            url.push(this.URL.port);
        }
        url.push(this.URL.pathname);
        var q = [];
        for (var name in this.URL.query) {
            if (this.URL.query.hasOwnProperty(name)) {
                q.push(name + "=" + this.URL.query[name]);
            }
        }
        if (q.length > 0) {
            url.push("?");
        }
        url.push(q.join('&'));
        var h = [];
        for (var name in this.URL.hash) {
            if (this.URL.hash.hasOwnProperty(name)) {
                h.push(name + "=" + this.URL.hash[name]);
            }
        }
        if (h.length > 0) {
            url.push("#");
        }
        url.push(h.join('#'));
        return url.join('');
    }
    this.addQuery = function(name, value) {
        this.URL.query[name] = value;
    }
    this.removeQuery = function(name) {
        delete this.URL.query[name];
    }
    this.updateHashString = function() {
    	var h = [];
        for (var name in this.URL.hash) {
            if (this.URL.hash.hasOwnProperty(name)) {
                h.push(name + "=" + encodeURIComponent(this.URL.hash[name]));
            }
        }
        if(h.length>0) {
        	this.URL.hashstring = h.join('#');
        }else{
        	this.URL.hashstring="";
        }
    }
    this.addHash = function(name, value) {
        this.URL.hash[name] = value;
        this.updateHashString();
    }
    this.removeHash = function(name) {
        delete this.URL.hash[name];
        this.updateHashString();
    }
}
window.CommonUtils["CrossBrowser"]={};
window.CommonUtils.CrossBrowser["setOnLoad"] = function(iframe,onload) {
		var interval = 2000;
		var ref = Math.round(Math.random()*999);
		if(window.CommonUtils.CrossBrowser.isSafari())	{
			var getReadyState = function() {
		    	doc = iframe[0].contentDocument || iframe[0].contentWindow;
		    	if(doc==null) {return "loading";}
		    	if (doc.document) doc = doc.document;
		    	return doc.readyState;
		    }
		    var _timer = setInterval(function() {
		        if (getReadyState() == 'complete') {
		            clearInterval(_timer);
		            console.log("iframe interval timer function called (REF:"+ref+")");
		            onload();
		        }
		    },interval);
	    }else{
		    iframe.load(function(){
				clearInterval(_timer);
				console.log("iframe onload function called (REF:"+ref+")");
				onload();
			});
		}
}
window.CommonUtils.CrossBrowser["isSafari"] = function(browser) {
	var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
	var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
	var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
	var is_safari = navigator.userAgent.indexOf("Safari") > -1;
	var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
	if ((is_chrome)&&(is_safari)) {is_safari=false;}
	if ((is_chrome)&&(is_opera)) {is_chrome=false;}
	return is_safari;
}
window.CommonUtils["IsUserAuth"] = function(callback) {
	var authtestUrl = "https://veriscian.sharepoint.com/_catalogs/masterpage/virtualasset/scripts/auth-test.js";
	var success = false;
	window["AuthTestCallback"] = function() {
		success = true;
		delete window["AuthTestCallback"];
	}	
	$.getScript(authtestUrl)
		.done(function( script, textStatus ) {
			callback(success);
		})
		.fail(function( jqxhr, settings, exception ) {
			callback(success);
		});
}
window.CommonUtils["GetModelId"] = function(defaultId) {
	try{
		var url = new window.CommonUtils.URLParser(window.location.href);
		var hash = url.URL.hash["modelview"];	
		return decodeURIComponent(decodeURIComponent(hash).split("=")[1]).split("-")[1].split("=")[1];
	}catch(e){
		return defaultId;
	}
}
