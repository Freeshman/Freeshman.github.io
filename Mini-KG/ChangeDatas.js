function ChangeDatas(cy,datas){
    cy.elements().remove();
    cy.add(datas);
  // cy.remove(Datas2);
  // cy.mount(Datas1);
  // cy.style().clear();
  cy.elements().qtip({
  content: function(){ 
    if(this.isNode()){
      return ' '+this.data('id');
    }
    if(this.isEdge){
      return this.data('source')+'--'+this.data('name')+'-->'+this.data('target');
    }
    return '没有详细信息';
   },
  position: {
    my: 'top center',
    at: 'bottom center'
  },
  style: {
    classes: 'qtip-bootstrap',
    tip: {
      width: 16,
      height: 8
    }
  }
});

// call on core
cy.qtip({
  content: {
    title:'航空器适航审定知识图谱',
    text:'TomHu'
  },
  position: {
    my: 'top center',
    at: 'bottom center'
  },
  show: {
    cyBgOnly: true
  },
  style: {
    classes: 'qtip-bootstrap',
    tip: {
      width: 16,
      height: 8
    }
  }
});
    var layout=cy.layout({
      // name: 'breadthfirst',
      // name: 'circle',
      name: 'concentric',

      fit: true, // it's okay if some of the graph is hidden off-screen because viewport scrolls
      padding: 10,
      
      avoidOverlap: true,
      avoidOverlapPadding: 30

    });
  layout.run();
};