export let socket = new WebSocket('ws://localhost:8080/ws');

      console.log("Attempting to connect to WebSocket");

      socket.onopen = () => {
          console.log("Successfully connected to WebSocket");
            // Create a new player object
            let newPlayer = {
              name: "John Doe",
              rank: 3,
              score: 232,
              time: "13:01"
          };

      };
    //   socket.onmessage = (event) => {
    //       // Assuming the server sends JSON data as a string
    //       let jsonData = event.data;

    //       try {
    //           // Parse the JSON string into a JavaScript object
    //           let receivedObject = JSON.parse(jsonData);
    //           console.log('Received JSON:', receivedObject);

    //           document.querySelector(".leaderboard").innerHTML = `${receivedObject.map(r => `<p>Hello</p>`).join('')}`;
    //       } catch (error) {
    //           console.error('Error parsing JSON:', error);
    //       }
    //   };

      socket.onclose = (event) => {
          // console.log("WebSocket closed:", event);
      };

      socket.onerror = (error) => {
          // console.log("WebSocket error:", error);
      };