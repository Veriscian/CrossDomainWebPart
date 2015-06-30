var AuthChecker = function(callback,iframe) {
	this.onloadflag = this.onloadflag || false;
	this.onauthflag = this.onauthflag || false;
	this.mCallback = this.mCallback || callback;
	this.mIframeId = this.mIframeId || "authchecker-iframe";
	this.onLoad = function() {
		this.onloadflag=true;		
		this.onFinal();
	};
	this.onAuth = function() {
		this.onauthflag=true;
		this.onLoad();	
	};
	this.onFinal = function() {
		if(this.onloadflag && this.onauthflag) {
			this.mCallback(true);
		}else{
			this.mCallback(false);
		}
		this.detach();
	};
	this.init = function() {
		var ctx = this;
		window.addEventListener('message', function(e){
			if(e.data == "authorized") {
				ctx.onAuth();
			}
		}, false);
		this.attach();
	};
	this.attach = function() {
		var iframe = $("<iframe>");
		iframe.attr("id",this.mIframeId);
		iframe.attr("name","testauthiframe");
		iframe.attr("style","display:none;");
		var ctx = this;
		iframe.load(function(){
			ctx.onLoad();
		});
		iframe.attr("src","https://veriscian.sharepoint.com/construction-site/SitePages/CheckAuth.aspx?IsDlg=1");
		$('body').append(iframe);
	};
	this.detach = function() {
		var iframe = $("#" + this.mIframeId);
		iframe.detach();
	};
	
	
	
	this.init();
};
var userauth = new AuthChecker(function(isauth){
	if(isauth) {
		console.log("user is auth");
	}else{
		console.log("user is not auth");
	}
});



var CBManager = function(callback) {
	this.onloadflag = this.onloadflag || false;
	this.onauthflag = this.onauthflag || false;
	this.mCallback = this.mCallback || callback;
	this.onLoad = function() {
		this.onloadflag=true;		
		this.onFinal();
	};
	this.onAuth = function() {
		this.onauthflag=true;
		this.onLoad();	
	};
	this.onFinal = function() {
		if(this.onloadflag && this.onauthflag) {
			this.mCallback(true);
		}else{
			this.mCallback(false);
		}
	};
};







CrossDomainWebPartLoader = function() {
	this.mWebPartClassName = "crossdomain-webpart";
	this.mLoginPageUrl = "http://www.veriscian.com/portal/login";	
	this.mCallback = this.mCallback || callback;
	this.mIframeId = this.mIframeId || "authchecker-iframe";
	
	this.mCallbacks = this.mCallbacks || {};
 	this.addCallback = function(url,callback){
 		this.mCallbacks[url]=callback;
 	};
	this.triggerCallback = function(url){ 	
		var callback = this.mCallbacks[url];
		if(callback!=null)	{
			callback();
			delete this.mCallbacks[url];
		}
 	};
 	this.initPostMessageCallback = function() {
		var ctx = this;
		window.addEventListener('message', function(e){
			if(typeof e.data == "object" && e.data["result"]=="success") {
				var url = e.data["url"];
				ctx.triggerCallback(url);
			}
		}, false);
		this.attach();
	};this.initPostMessageCallback();

	
	this.initWebPart = function(webpart){
		var url = webpart.attr("data-url");	
		var webpartid = webpart.attr("id");	
		var iframeid = webpartid + "-iframe";	
		var loginpageurl = this.mLoginPageUrl;
		var iframe = $("<iframe>");
		iframe.attr("id",iframeid);
		iframe.attr("name","testauthiframe");
		iframe.attr("style","display:none;");
		
		var CBManager = function(callback) {
			this.onloadflag = this.onloadflag || false;
			this.onauthflag = this.onauthflag || false;
			this.mCallback = this.mCallback || callback;
			this.onLoad = function() {
				this.onloadflag=true;		
				this.onFinal();
			};
			this.onAuth = function() {
				this.onauthflag=true;
				this.onLoad();	
			};
			this.onFinal = function() {
				if(this.onloadflag && this.onauthflag) {
					this.mCallback(true);
				}else{
					this.mCallback(false);
				}
			};
		};
		var mgr = new CBManager(function(isok){
			var f = $("#"+iframeid);
			if(isok) {
				f.attr("style","display:block;");
			}else{
				f.detach();
				window.document.location.replace(loginpageurl);
			};
		});	
		this.addCallback(url,function(){
			mgr.onAuth();
		});	
		iframe.load(function(){
			mgr.onLoad();
		});
		iframe.attr("src",url);		
		webpart.append(iframe);
	};
	
	this.initAllWebParts = function() {
		var ctx = this;
		$('."+this.mWebPartClassName).each(function(){
			var webpart = $(this);
			ctx.initWebPart(webpart);
		});
	};
};
