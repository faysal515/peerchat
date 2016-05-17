import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


  Template.hello.onRendered(function () {
    var self = this;
    // Create a Peer instance
    window.peer = new Peer({
      key: 'g4ghylj0x9z1if6r',  // get a free key at http://peerjs.com/peerserver
      debug: 3,
      config: {'iceServers': [
        { url: 'stun:stun.l.google.com:19302' },
        { url: 'stun:stun1.l.google.com:19302' },
      ]}
    });

    this.connection = new ReactiveVar();

    // Handle event: upon opening our connection to the PeerJS server
    peer.on('open', function () {
      $('#myPeerId').text(peer.id);
    });

    this.autorun(function () {
      peer.on('connection', function(conn) {
        console.log('peer info: ', conn);
        self.connection = conn;
        self.connection.on('data', function(data){
          // Will print 'hi!'
          sAlert.success(data);
        });
      });
    });
  });

Template.hello.events({
  'click #makeConnection': function (event, template) {
    event.preventDefault();
    console.log('clicked');
    //let conn = template.connection;
    template.connection = peer.connect($('#remotePeerId').val());
    template.connection.on('open', function(){
      sAlert.success('connection established');
    });

  },
  'submit #chatBox': function(event, template) {

    var text = $('#sendText').val();
    console.log(template.connection);
    console.log('pressed: ', text);
    event.preventDefault();

    template.connection.send(text);


  }
});
