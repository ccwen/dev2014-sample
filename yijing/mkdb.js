var outback = function (s) {
    while (s.length < 70) s += ' ';
    var l = s.length; 
    for (var i = 0; i < l; i++) s += String.fromCharCode(8);
    process.stdout.write(s);
}
var beforebydstart=function(s,status) {
	//console.log("start",s.length);
}
var afterbodyend=function(s,status) {
	//console.log("end",s.length);
}

var onFile=function(fn) {
	outback("indexing"+fn);
}
var finalized=function(session,status) {
	console.log("VPOS",session.vpos);
	console.log("PageCount",status.pageCount);
	console.log("FINISHED")
}
var config={
	name:"yijing"
	,config:"simple1"
	,glob:"*.xml"
	,pageSeparator:"_.id"
	,reset:true
	,finalized:finalized
	,callbacks: {
		//beforebodystart:beforebydstart
		//,afterbodyend:afterbodyend
		onFile:onFile
	}
}
setTimeout(function(){ //this might load by gulpfile-app.js
	if (!config.gulp) require("ksana-document").build();
},100)
module.exports=config;