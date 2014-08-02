var Kde=Require('ksana-document').kde;  // Ksana Database Engine
var Kse=Require('ksana-document').kse; // Ksana Search Engine
var bootstrap=Require("bootstrap");  
var fileinstaller=Require("fileinstaller");  // install files to browser sandboxed file system
 var require_kdb=[{  //list of ydb for running this application
  filename:"yijing.kdb"  , url:"yijing/yijing.kdb" , desc:"yijing"
}];
var main = React.createClass({
  getInitialState: function() {
    return {res:null,db:null };
  },
  onReady:function(usage,quota) {  //handler when kdb is ready
    this.setState({quota:quota,usage:usage});
    if (!this.state.db) Kde.openLocal("yijing.kdb",function(db){
        this.setState({db:db});  
        this.dosearch();
    },this);      
    this.setState({dialog:false});
  },
  autosearch:function() {
    clearTimeout(this.timer);
    this.timer=setTimeout(this.dosearch.bind(this),500);
  },
  dosearch:function() {  // 
    var tofind=this.refs.tofind.getDOMNode().value; // fetch user input
    Kse.search(this.state.db,tofind,{range:{maxhit:100}},function(data){ //call search engine
      this.setState({res:data});
    });
  },
  openFileinstaller:function(autoclose) {
    return <fileinstaller quota="512M" autoclose={autoclose} needed={require_kdb} 
                     onReady={this.onReady}/>
  },   
  renderinputs:function() {  // input interface for search
    if (this.state.db) {
      return ( 
        <div><input className="tofind" ref="tofind"  onInput={this.autosearch} defaultValue="龍"></input>
        </div>
        )      
    } else {
      return <span>loading database....</span>
    }
  },
  fidialog:function() {
      this.setState({dialog:true});
  },
  render: function() {  //main render routine
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
      return (
        <div>{this.state.dialog?this.openFileinstaller():null}
        <button onClick={this.fidialog}>file installer</button>
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