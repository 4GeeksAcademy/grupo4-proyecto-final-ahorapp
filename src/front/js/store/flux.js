const getState = ({ getStore, getActions, setStore }) => {
	const apiUrl = process.env.BACKEND_URL;

	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],


			
			logged_user: [],
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			login: async (email, password) => {
				const URLlogin = `${apiUrl}/api/login`;
				const store = getStore();

				try {
					if (!email || !password) {
						console.log("Missing email or password")
						return false
					}
					let response = await fetch(URLlogin, {
						method: "POST",
						body: JSON.stringify({'email': email, 'password': password}),
						headers: {
							"Content-type": "application/json; charset=UTF-8"
						} 
					})
					if (!response.ok) {
						console.error("Error trying to login, pelase try again.");
						throw new Error(response.statusText);
					}

					const data = await response.json();

					if (!data.access_token) {
						console.error(data, "No valid token received!")
						throw new Error("No token received");
					}

					localStorage.setItem("token", data.access_token)
					console.log("Successfully logged in!")
					setStore({...store, logged_user: data })
					return true

				} catch (error) {
					console.error(error);
					return false
				}
			},
		}
	};
};

export default getState;
