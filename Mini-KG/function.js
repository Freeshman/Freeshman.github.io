"use strict";

document.addEventListener("DOMContentLoaded", function() {
  var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: Datas1,
    style: [
      {
        selector: 'node',
        style: {
          'content': 'data(id)',
          'width': "280px",
          'height': '280px',
          'background-color': '#363',
          'font-size': '26px',
          'text-halign': 'center',
          'text-valign': 'center',
          'color': 'white',
//           'background-opacity': 0,
//           // 'background-image': 'data(image)',
          // 'background-fit': 'contain',
//           'background-clip': 'none'
        }
      }, 
        {
        selector: 'edge',
        style: {
          // 'label':'data(name)',
          // 'text-halign': 'center',
          // 'text-valign': 'center',
          'curve-style': 'bezier',
          'text-background-color': 'gray',
          'text-background-opacity': 0.4,
          // 'width': '6px',
          // 'font-size': '26px',
          'target-arrow-shape': 'triangle',
          'target-arrow-color': 'red',
          'arrow-scale': 2,
          'control-point-step-size': '140px'
        }
      }      ,
    ],
  layout:{
      // name: 'breadthfirst',
      name: 'circle',
      // name: 'concentric',

      fit: true, // it's okay if some of the graph is hidden off-screen because viewport scrolls
      padding: 10,
      // circle: true,
      grid:true,
      avoidOverlap: true,
      avoidOverlapPadding: 30

    }    
  });
  function fuzzyQuery(list, keyWord) {
    // var ptt =  new RegExp(keyWord,'i');
    var ptt =  new RegExp(keyWord);
    // var ptt=/keyWord/i;
    var arr = [];
   // if(word!="" && data[i].match(word+".*") != null){
    for (var i = 0; i < list.length; i++) {
      if (ptt.test(list[i])) {
        arr.push(list[i]);
      }
    }
    return arr;
  }
var advanceButton = document.getElementById('Search');
  
  advanceButton.addEventListener('click', function() {
    var id=$("#Keyword").val();
    var SearchResult=cy.filter('[id = "'+id+'"]');
    var sugg=document.getElementById('Suggestion');
    sugg.innerHTML='';
    // console.log(SearchResult.data());

    if(SearchResult.data()!=undefined){
      var fuzzyresult=fuzzyQuery(entities,id);
      fuzzyresult.sort(randomSort);
      if(fuzzyresult.length>5)for(var i=0;i<5;i++)sugg.innerHTML+=fuzzyresult[i]+',&nbsp';
      else for(var i=0;i<fuzzyresult.length;i++)sugg.innerHTML+=fuzzyresult[i]+',&nbsp';
      panIn(SearchResult);
      showNode(SearchResult.data());
    }else{
      var sugg=document.getElementById('Suggestion');
      var fuzzyresult=fuzzyQuery(entities,id);
      fuzzyresult.sort(randomSort);
      if(fuzzyresult.length==0)sugg.innerHTML='没有相关的结果';
      else{
        if(fuzzyresult.length>5)for(var i=0;i<5;i++)sugg.innerHTML+=fuzzyresult[i]+',&nbsp';
        else for(var i=0;i<fuzzyresult.length;i++)sugg.innerHTML+=fuzzyresult[i]+',&nbsp';
      }
    }
    // fuzzyQuery()
    // ChangeDatas(cy,Datas1);
  });

cy.on('mouseover','node',function(event) {
    var target = event.target;
    var json=target.data();
    showNode(json);
  });
cy.on('mouseover','edge',function(event) {
  var target = event.target;
  // target.select();
  var info=document.getElementById('information');
  info.style.cssText='border-color:red;background-color:white';
  info.innerHTML='';
  var json=target.data();
  var s=json['source'];
  var p=json['name'];
  var o=json['target'];
  var div=document.createElement("div");
  div.style.cssText="margin:0.5em;font-size:14px;font-weight:bold";
  div.innerHTML=s+'---'+p+'--->'+o;
  info.appendChild(div);
  var div=document.createElement("div");
  div.style.cssText="margin:0.5em;font-size:14px;font-weight:bold";
  div.innerHTML='指纹： '+json['指纹'];
  info.appendChild(div);
  // info.textContent=(key+'\r\n');
//     window.open(target.data('url'));
});

cy.on('mouseout',function(event) {
  var target = event.target;
  var info=document.getElementById('information');
  info.style.cssText='border-color:gray';
  //     window.open(target.data('url'));
});
	cy.on('tap', 'node', function(event) {
    var target = event.target;
    cy.nodes().unselect();
    target.select();

//	var nextSelect = findSuccessor(target);
    panIn(target);
    var json=target.data();
    showNode(json);
    //window.open(target.data('url'));
  });
  var tappedBefore;
  var tappedTimeout;
  // cy.on('cxttapstart', 'edge', function(event) {
    
  // });
	cy.on('tap', 'edge', function(event) {
    var tappedNow = event.target;
    if (tappedTimeout && tappedBefore) {
      clearTimeout(tappedTimeout);
    }
    if(tappedBefore === tappedNow) {
      tappedNow.trigger('doubleTap');
      tappedBefore = null;
    } else {
      tappedTimeout = setTimeout(function(){ tappedBefore = null; panIn(tappedNow.target()); }, 200);
      tappedBefore = tappedNow;
      
    }

    // console.log(tappedBefore);
    // var target = event.target;
    // panIn(target.target());
      //window.open(target.data('url'));
  }); 
  cy.on('doubleTap', 'edge', function(event) { 
    var target = event.target;
    panIn(target.source());
  });
  function showNode(json){
    var info=document.getElementById('information');
    info.innerHTML='';
    info.style.cssText='border-color:red;background-color:white';
    var id=json['id'];
    var div=document.createElement("div");
    div.style.cssText="margin:0.5em;font-weight:bold;font-size:14px";
    div.innerHTML=id;
    info.appendChild(div);
    var domain=json['所属领域'];
    if(domain!=undefined){
      var div=document.createElement("div");
      div.style.cssText="margin:0.5em;font-weight:bold;font-size:14px";
      div.innerHTML='所属领域: '+domain;
      info.appendChild(div);  
    }
    
    for(var key in json){
      if(key=='id')continue;
      if(key=='所属领域')continue;
      if(key==0)return;
      var div=document.createElement("div");
      div.style.cssText="margin:0.5em;font-size:13px;font-weight:bold";
      div.innerHTML=key+":";
      info.appendChild(div);
      if(json[key].indexOf("\n")>0){
        var lists=json[key].split("\n");
        if(lists.length>2){
            for(var i=0;i<2;i++){
              var div=document.createElement("div");
              div.style.cssText="margin:0.5em;font-size:13px";
              div.innerHTML='- '+lists[i];
              info.appendChild(div);


            }
              var div=document.createElement("div");
              div.style.cssText="margin:0.5em;font-size:13px";
              div.innerHTML="......";
              info.appendChild(div);

        }else{
          for(var item in lists){
              var div=document.createElement("div");
              div.style.cssText="margin:0.5em;font-size:13px";
              div.innerHTML='- '+lists[item];
              info.appendChild(div);
        }
      }
  }else{
      var div=document.createElement("div");
      div.style.cssText="margin:0.5em;font-size:13px";
      div.innerHTML='- '+json[key];
      info.appendChild(div);
  }
}
 // while (str1.indexOf("\\n") >= 0) { var str2 = str1.replace("\\n", " \n "); } 
//     window.open(target.data('url'));
  };
    var entities=[];
  cy.nodes().forEach(function( ele ){
    entities.push( ele.id() );
  });
  var index = Math.floor((Math.random()*entities.length));
  var inputtext=document.getElementById('Keyword');
  inputtext.value=entities[index];

  function randomSort(a, b) { return Math.random() > 0.5 ? -1 : 1; }

	 function panIn(target) {
    target.select()
    cy.animate({
      fit: {
        eles: target,
        padding: 150
      },
      duration: 700,
      easing: 'ease',
      queue: true
    });
  }
});

