function signIn(){
  var Email = document.getElementById("email").value;
  var Password = document.getElementById("password").value;
  // var TeamName = document.getElementById("tname").value;

  // if(TeamName == null){
  //       window.location.replace("error.html");
  // }else 
  if(Email == null){
        window.location.replace("error.html");
  }else if(Password  == null){
        window.location.replace("error.html");
  }else{
      var ref = firebase.database().ref("users");
      ref.orderByChild("email").equalTo(Email).on("value", function(snapshot) {
        
        if(snapshot.exists()){
          
          snapshot.forEach(function(childSnapshot) {
            const temp = childSnapshot.val();
             if(temp.password == Password){
                    //Store in LocalStorage
                    storeCredsInLocalStorage(childSnapshot.key);


                    window.location.replace("game_intro.html");
                  }
          });
        }
        else {
         window.location.replace("error.html"); 
        }
      });
    }
  }

  //Stores User Credentials
  function storeCredsInLocalStorage(key){
    let id;
    localStorage.setItem('id', JSON.stringify(key));
  }





/*
      ref.orderByChild('email').equalTo(teamEmail).on("value", function(snapshot) {
      if (snapshot.exists()){
        const userData = snapshot.val();
        console.log("exists!",userData);
        //const parentKey = snapshot.key;
        //console.log(parentKey);
        snapshot.forEach(function(childSnapshot){
          const value = childSnapshot.val(); // gives email, password, teamname
          console.log("Password is: ", value.password);

              }
          }
      });
  }
}

*/