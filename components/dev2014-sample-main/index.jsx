var kde=Require('ksana-document').kde;  // Ksana Database Engine
var kse=Require('ksana-document').kse; // Ksana Search Engine
var bootstrap=Require("bootstrap");  
var fileinstaller=Require("fileinstaller");  // install files to browser sandboxed file system
 var require_kdb=[{  //list of ydb for running this application
  filename:"yijing.kdb"  , url:"yijing/yijing.kdb" , desc:"周易(開明書店斷句本)"
}];    
var main = React.createClass({
  getInitialState: function() {
    return {res:null,db:null };
  },
  onReady:function(usage,quota) {  //handler when kdb is ready
    this.setState({quota:quota,usage:usage});
    if (!this.state.db) kde.open("yijing",function(db){
        this.setState({db:db});  
        this.dosearch();
    },this);      
    this.setState({dialog:false});
  },
  autosearch:function() {
    clearTimeout(this.timer);
    this.timer=setTimeout(this.dosearch.bind(this),500);
  },
  dosearch:function() {   
    var tofind=this.refs.tofind.getDOMNode().value; // fetch user input
    //add fulltext:true to display all text
    kse.search(this.state.db,tofind,{range:{maxhit:100}},function(data){ //call search engine
      this.setState({res:data});  //react will update UI
    });
  }, 
  openFileinstaller:function(autoclose) { // open file dialog, autoclose==true for initalizing application
    return <fileinstaller quota="128M" autoclose={autoclose} needed={require_kdb} 
                     onReady={this.onReady}/>
  },   
  renderinputs:function() {  // input interface for search
    if (this.state.db) {
      return ( 
        <div><input size="10" className="tofind" ref="tofind"  onInput={this.autosearch} defaultValue="龍"></input>
        <span className="pull-right"><button onClick={this.fileinstallerDialog}>File installer</button></span>
        </div>
        )      
    } else {
      return <span>loading database....</span>
    }
  },
  fileinstallerDialog:function() { //open the file installer dialog
      this.setState({dialog:true});
  },
  render: function() {  //main render routine
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
      return (
        <div>{this.state.dialog?this.openFileinstaller():null}
          {this.renderinputs()}
          <resultlist res={this.state.res}/>
        </div>
      );
    }
  },
  focus:function() {
      if (this.refs.tofind) this.refs.tofind.getDOMNode().focus();
  },
  componentDidMount:function() {
      this.focus();
  },
  componentDidUpdate:function() {
      this.focus();
  } 
});
var resultlist=React.createClass({  //should search result
  show:function() {
    return this.props.res.excerpt.map(function(r,i){ // excerpt is an array 
      return <div>
      <div className="pagename">{r.pagename}</div>
        <div className="resultitem" dangerouslySetInnerHTML={{__html:r.text}}></div>
      </div>
    }); 
  }, 
  render:function() {
    if (this.props.res) {
      if (this.props.res.excerpt&&this.props.res.excerpt.length) {
          return <div>{this.show()}</div>
      } else {
        return <div>Not found</div>
      }
    }
    else {
      return <div>type keyword to search</div>
    } 
  }
});

module.exports=main;