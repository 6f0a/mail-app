document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mails-view').style.display = 'none';
  document.querySelector('#reply-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').onsubmit = () => {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(() => {
      load_mailbox('sent');
    });
    return false;
  };
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mails-view').style.display = 'none';
  document.querySelector('#reply-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    
  fetch(`/emails/${mailbox}`)
   .then(response => response.json())
    .then(emails => {
    // Print emails
    console.log(emails);
    // ... do something else with emails ...
    var emails1 = document.querySelector("#emails-view");
    for(var i = 0; i < emails.length; i++) {
        mail = document.createElement("div");
        mail.className = ("Mail");
        mail.addEventListener('click',function() {
          load_mail(id)
        })
        let id = emails[i].id;
        emails1.append(mail)
        var h5 = document.createElement("h5");
        h5.className = ("subject");
        h5.innerHTML = emails[i].subject;
        mail.append(h5);
        var t = document.createElement("p");
        t.className = ("timestamp");
        t.innerHTML = emails[i].timestamp;
        mail.append(t)
        var u = document.createElement("p");
        u.className = ("sender");
        u.innerHTML = emails[i].sender;
        mail.append(u)      
        if (emails[i].read == true) {
          mail.style.background = "lightgray";
        }
    }
  });
}

function load_mail(id){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mails-view').style.display = 'block';
  document.querySelector('#reply-view').style.display = 'none';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    console.log(username)
    if (username === email["sender"]){
    document.querySelector('#mails-view').innerHTML = /*html*/`
    <span style="font-weight: bold">From: </span>${email["sender"]}<br>
    <span style="font-weight: bold">To: </span>${email["recipients"]}<br>
    <span style="font-weight: bold">Subject: </span>${email["subject"]}<br>
    <span style="font-weight: bold">Timestamp: </span>${email["timestamp"]}<br>
    <hr>
    ${email["body"]}
  `;
    } else {
      document.querySelector('#mails-view').innerHTML = /*html*/`
      <span style="font-weight: bold">From: </span>${email["sender"]}<br>
      <span style="font-weight: bold">To: </span>${email["recipients"]}<br>
      <span style="font-weight: bold">Subject: </span>${email["subject"]}<br>
      <span style="font-weight: bold">Date: </span>${email["timestamp"]}<br>
      <div class="email-buttons row">
        <button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>
        <button class="btn btn-sm btn-outline-primary" id="archive">${email["archived"] ? "Unarchive" : "Archive"}</button>
      </div>
      <hr>
      ${email["body"]}
    `;
    }
    //Reply
    document.getElementById('reply').onclick = () =>{
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#mails-view').style.display = 'none';
      document.querySelector('#reply-view').style.display = 'block';
    
      document.querySelector('#compose-recipients1').value = email['sender'];
      document.querySelector('#compose-subject1').value = 'Re:' +   email['subject'];
      document.querySelector('#compose-body1').value = 'On' + ' ' + email['timestamp'] + ' ' + email['sender'] + ' ' +'wrote:' + '  ' + email['body'];
      console.log(email['sender'])

      document.querySelector('#compose-form1').onsubmit = () => {
        fetch('/emails', {
          method: 'POST',
          body: JSON.stringify({
              recipients: document.querySelector('#compose-recipients1').value,
              subject: document.querySelector('#compose-subject1').value,
              body: document.querySelector('#compose-body1').value
          })
        })
        .then(response => response.json())
        .then(() => {
          load_mailbox('sent');
        });
        return false;
      };
    }
    // Archive
    document.getElementById('archive').onclick = () =>{
      if (email['archived'] == true) {
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: false
          })
        })
      } else {
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: true
          })
        })
      }
      load_mailbox('inbox')
    }
    //  Read
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  });
}

