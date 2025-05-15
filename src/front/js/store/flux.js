import { jwtDecode } from "jwt-decode";

const getState = ({ getStore, getActions, setStore }) => {

	const apiUrl = process.env.BACKEND_URL;

	return {
		store: {
			message: null,
			currentUser: {},
			categories: {
				Restaurante: [
					"restaurante", "parrillada", "pizzeria", "cafeteria", "bar", "chiviteria",
					"sushi", "bistro", "comida rapida", "hamburgueseria", "brunch", "almuerzo",
					"cena", "brindis", "cerveceria", "gastrobar", "birra"
				],
				Supermercado: [
					"supermercado", "almacen", "minimercado", "autoservicio", "mercado",
					"hipermercado", "despensa", "kiosco", "feria", "verduleria", "fruteria",
					"carniceria", "pescaderia", "panaderia", "granja"
				],
				Transporte: [
					"uber", "taxi", "omnibus", "bus", "colectivo", "peaje", "nafta", "combustible",
					"estacionamiento", "subte", "tren", "bicicleta", "bici", "pasaje", "aeropuerto",
					"vuelo", "remise", "moto"
				],
				Vivienda: [
					"alquiler", "renta", "hipoteca", "gastos comunes", "contribucion", "impuesto",
					"UTE", "OSE", "ANTEL", "electricidad", "agua", "telefono", "internet", "gas",
					"seguro hogar", "mantencion"
				],
				Entretenimiento: [
					"cine", "teatro", "concierto", "evento", "recital", "festival", "espectaculo",
					"museo", "exposicion", "karaoke", "parque de diversiones", "juegos", "videojuegos",
					"netflix", "spotify", "plataforma", "streaming"
				],
				Salud: [
					"farmacia", "medicamentos", "mutualista", "consultas", "analisis", "dentista",
					"oftalmologo", "psicologo", "fisioterapia", "examen medico", "salud"
				],
				Educacion: [
					"colegiatura", "cuota", "universidad", "curso", "taller", "clases", "academia",
					"seminario", "libros", "materiales", "examen", "educacion"
				],
				Compras: [
					"ropa", "calzado", "indumentaria", "zapatos", "accesorios", "perfumeria",
					"cosmeticos", "tecnologia", "electronica", "celular", "computadora", "notebook",
					"auriculares", "gaming", "decoracion", "muebles", "repuesto"
				],
				Deporte: [
					"gimnasio", "fitness", "deporte", "entrenamiento", "yoga", "pilates", "pesas",
					"cancha", "futbol", "basquet", "padel", "correr", "maraton"
				],
				Finanzas: [
					"banco", "transferencia", "tarjeta", "pago", "prestamo", "intereses",
					"credito", "debito", "inversion", "comision", "gastos bancarios"
				],
				Mascotas: [
					"veterinaria", "alimento", "mascota", "perro", "gato", "vacuna", "bano",
					"accesorios mascotas", "paseador"
				],
				Viajes: [
					"hotel", "hostel", "alojamiento", "pasaje", "vuelo", "excursion",
					"tour", "viaje", "transporte turistico", "souvenir", "paquete turistico"
				],
				Otros: [
					"regalo", "donacion", "caridad", "cobro", "perdida", "error bancario",
					"servicio tecnico", "reparacion", "multas", "papeleria", "tramite",
					"gastos varios", "sin categoria"
				]
			},
			currencies: [
				{
					id: 1,
					name: "Dolares",
					symbol: "USD"
				},
				{
					id: 2,
					name: "Bolivares",
					symbol: "Br"
				}
			],
			theme: localStorage.getItem("theme") || "light",
			//Info de Usuario actualmente logeado
			logged_user: [],
			//Listado de todos los usuarios de la plataforma
			users: [],

			//Categorias desde la DB
			categories_db: [],

			//Registros de gastos/ingresos
			records: [],

			// Registros de Metas (Goals)
			goals: [],

			// Progreso actual de la meta seleccionada. Es null si no hay una meta seleccionada.
			goalProgress: [],

			wallets_from_user: [],

			currentWallet: {},


			// Para saber solo el conteo de Usuarios 
			totalUsersCount: null, 
		
		
		
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
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
			initTheme: () => {

				const store = getStore();

				const storedTheme = localStorage.getItem("theme") || "light";
				setStore({ ...store, theme: storedTheme });
				document.body.setAttribute("data-bs-theme", storedTheme);
			},

			setTheme: (newTheme) => {
				const store = getStore();

				setStore({ ...store, theme: newTheme });
				localStorage.setItem("theme", newTheme);
				document.body.setAttribute('data-bs-theme', newTheme);
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
						body: JSON.stringify({ 'email': email, 'password': password }),
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
					setStore({ ...store, logged_user: data.logged_user_wallets })
					localStorage.setItem("selected_wallet", data.logged_user_wallets[0])
					return true

				} catch (error) {
					console.error(error);
					return false
				}
			},

			// Action Registro de Usuario

			signup: async (name, email, password, role) => {
				const URLregister = `${apiUrl}/api/signup`;
				const store = getStore();

				try {
					if (!email || !password || !name) {
						console.log("Falta correo electrónico, contraseña o contraseña de confirmación");
						return false;
					}

					const userData = {
						name: name,
						email: email,
						password: password,
						role: role
					};

					let response = await fetch(URLregister, {
						method: "POST",
						body: JSON.stringify(userData),
						headers: {
							"Content-type": "application/json; charset=UTF-8"
						}
					});

					if (!response.ok) {
						console.error("Error al intentar registrar el usuario, por favor inténtelo nuevamente.");
						throw new Error(response.statusText);
					}

					const data = await response.json();
					console.log("¡Registrado exitosamente!", data);
					return true;

				} catch (error) {
					console.error("Hubo un error durante el registro:", error);
					return false;
				}
			},

			// Acción para obtener registros filtrados por usuario y categoría en un período de tiempo (get-records)
			get_records: async (category_id, start_date, wallet_id) => {
				const baseURL = `${apiUrl}/api/records/list`;
				const queryParams = [];
				const store = getStore();


				if (category_id) queryParams.push(`category_id=${category_id}`);
				if (start_date) queryParams.push(`start_date=${new Date(start_date).toISOString()}`);
				if (wallet_id) queryParams.push(`wallet_id=${wallet_id}`);


				const URLlistRecords = queryParams.length > 0 ? `${baseURL}?${queryParams.join('&')}` : baseURL;


				try {
					const response = await fetch(URLlistRecords, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(`Error en la petición: ${response.status} - ${errorData?.message || response.statusText}`);
					}

					const data = await response.json();
					setStore({ ...store, records: data.records });
					return true;

				} catch (error) {
					console.error("Error al obtener los registros:", error);
					setStore({ recordsError: error.message || "Ocurrió un error al cargar los registros." });
					return false
				}
			},



			// Action para agregar un nuevo registro (Record)
			addRecord: async (description, amount, type, category_name, wallet_id) => {
				const URLaddRecord = `${apiUrl}/api/records/add`;
				const store = getStore();

				try {
					if (!description || !amount || !type || !wallet_id) {
						console.error("Faltan campos requeridos para agregar el registro.");
						return false;
					}

					const recordData = {
						description: description,
						amount: parseFloat(amount),
						type: type,
						category_name: category_name,
						wallet_id: parseInt(wallet_id),
					};

					const response = await fetch(URLaddRecord, {
						method: "POST",
						body: JSON.stringify(recordData),
						headers: {
							"Content-type": "application/json; charset=UTF-8",

							"Authorization": `Bearer ${localStorage.getItem('token')}`
						}
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error al agregar el registro:", errorData?.msg || response.statusText);
						return false;
					}

					const data = await response.json();
					console.log("Registro agregado exitosamente:", data);

					// Refresca wallets
					const wallets = await getActions().getAllUserWallets();
					if (!wallets) {
						console.error("No se pudieron actualizar las wallets del usuario")
					}

					setStore({ ...store, records: [...store.records, data] });
					return true;

				} catch (error) {
					console.error("Hubo un error al agregar el registro:", error);
					return false;
				}
			},

			// Edita un registro
			editRecord: async (editId, description, amount, cat_id) => {
				const URLeditRecord = `${apiUrl}/api/records/edit/${editId}`;
				const store = getStore();

				try {
					if (!description && !amount && !cat_id) {
						console.log("No hay nada para editar");
						return false;
					}

					const editData = {};
					if (description !== undefined) editData.description = description;
					if (amount !== undefined) editData.amount = amount;
					if (cat_id !== undefined) editData.category_id = cat_id;

					const response = await fetch(URLeditRecord, {
						method: "PUT",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify(editData)
					});

					if (!response.ok) {
						console.log("La respuesta no fue 200, ", response.status)
						return false;
					}
					const data = await response.json()

					setStore({
						...store, records: store.records.map(record =>
							record.id === editId ? data : record
						)
					})
					return true

				} catch (error) {
					console.log("Error en flux function")
					return false
				}

			},

			//Elimina un registro
			deleteRecord: async (recordId) => {
				const urlDeleteRecord = `${apiUrl}/api/records/delete/${recordId}`;
				const store = getStore();

				try {
					if (!recordId) {
						console.error("Falta el ID para eliminar.");
						return false;
					}

					const response = await fetch(urlDeleteRecord, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error al eliminar la Meta:", errorData?.msg || response.statusText);
						return false;
					}

					setStore({
						...store,
						records: store.records.filter(record => record.id !== recordId)
					});

					return true;

				} catch (error) {
					console.error("Hubo un error al eliminar el registro :", error);
					return false;
				}
			},


			// Action Get Mostrar Usuario Por ID 
			getUser: async () => {
				try {
					const response = await fetch(`${apiUrl}/api/user/get`, {
						method: "GET",
						headers: {
							"Content-type": "application/json; charset=UTF-8",
							"Authorization": `Bearer ${localStorage.getItem('token')}`
						}
					});
					if (!response.ok) {
						throw new Error("Hubo un error al obtener el usuario");
					}

					const data = await response.json();
					setStore({ ...getStore(), currentUser: data });
					return true;
				} catch (error) {
					console.error("Error al obtener el usuario:", error);
					return false;
				}
			},

			// Action para Editar Usuario por ID

			updateUser: async (name, email, password, phone, address) => {
				const URLupdateUser = `${apiUrl}/api/user/edit`;
				const store = getStore();

				let userData = {};
				if (name !== undefined) userData.name = name;
				if (email !== undefined) userData.email = email;
				if (typeof password === "string" && password.trim() !== "") {
					userData.password = password;
				}
				if (phone !== undefined) userData.phone = phone;
				if (address !== undefined) userData.address = address;

				const response = await fetch(URLupdateUser, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify(userData)
				});

				if (!response.ok) {
					console.error("Error al actualizar el usuario");
					return false;
				}

				const updatedUser = await response.json();
				console.log("Usuario actualizado:", updatedUser);

				// Actualiza el estado del store con el usuario actualizado
				setStore({ ...store, currentUser: updatedUser });

				return true;
			},


			// Action  para crear nueva meta (goal)

			setGoal: async (name_goal, goal_value) => {
				const urlSetGoal = `${apiUrl}/api/goal/add`;
				const store = getStore();

				try {

					if (!name_goal || !goal_value) {
						console.error("Completa todos los campos requeridos .");
						return false;
					}


					const response = await fetch(urlSetGoal, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",

							Authorization: `Bearer ${localStorage.getItem('token')}`
						},
						body: JSON.stringify({
							name: name_goal,
							goal_value: goal_value
						})
					});

					if (response.status == "403") {
						return "403";
					}

					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error al crear la meta:", errorData.msg);
						return false;
					}

					const data = await response.json();



					setStore({
						...store,
						goals: [...store.goals, data]
					});

					return true;
				} catch (error) {
					console.error("Ocurrió un error al realizar la operación:", error);
					return false;
				}
			},

			// Action  para Modificar meta  ( Goal )

			editGoal: async (goal_id, name_goal, goal_value) => {
				const urlEditGoal = `${apiUrl}/api/goal/edit/${goal_id}`;
				const store = getStore();

				try {
					if (!goal_id || (!name_goal && !goal_value)) {
						console.error("Faltan campos requeridos para modificar la Meta.");
						return false;
					}

					const goalData = {};
					if (name_goal) goalData.name = name_goal;
					if (goal_value) goalData.goal_value = goal_value;

					const response = await fetch(urlEditGoal, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem('token')}`
						},
						body: JSON.stringify(goalData)
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error al modificar la Meta:", errorData?.msg || response.statusText);
						return false;
					}

					const data = await response.json();
					console.log("modificado exitosamente:", data);


					setStore({
						...store,
						goals: store.goals.map(goal =>
							goal.id === goal_id ? data : goal
						)
					});
					return true;

				} catch (error) {
					console.error("Hubo un error al modificar la Meta:", error);
					return false;
				}
			},

			// Action para eliminar una meta (Goal)

			deleteGoal: async (goal_id) => {
				const urlDeleteGoal = `${apiUrl}/api/goal/delete/${goal_id}`;
				const store = getStore();

				try {
					if (!goal_id) {
						console.error("Falta el ID  para eliminar.");
						return false;
					}

					const response = await fetch(urlDeleteGoal, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error al eliminar la Meta:", errorData?.msg || response.statusText);
						return false;
					}

					setStore({
						...store,
						goals: store.goals.filter(goal => goal.id !== goal_id)
					});

					return true;

				} catch (error) {
					console.error("Hubo un error al eliminar la meta :", error);
					return false;
				}
			},

			// Action para obtener todas las metas (Goals ) del usuario 

			getAllGoals: async () => {
				const urlGetAllGoals = `${apiUrl}/api/goal/get-all`;
				const store = getStore();

				try {
					const response = await fetch(urlGetAllGoals, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json"
						}
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error al obtener los datos:", errorData?.msg || response.statusText);
						return false;
					}

					const data = await response.json();



					setStore({
						...store,
						goals: [...data]
					});
					console.log(store.goals)
					return true;

				} catch (error) {
					console.error("Hubo un error al obtener los datos :", error);
					return false;
				}
			},

			// Action para obtener una meta (Goal ) por su ID 

			getGoalById: async (goal_id) => {
				const urlGetGoalById = `${apiUrl}/api/goal/get/${goal_id}`;
				const store = getStore();

				try {
					if (!goal_id) {
						console.error("Falta el ID  para buscar.");
						return false;
					}

					const response = await fetch(urlGetGoalById, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json"
						}
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error al obtener la Meta:", errorData?.msg || response.statusText);
						return false;
					}

					const data = await response.json();



					setStore({
						...store,
						goals: store.goals.map(goal =>
							goal.id === goal_id ? data : goal
						)
					});

					return data;
				} catch (error) {
					console.error("Hubo un error al obtener  la Meta:", error);
					return false;
				}
			},

			// Action Progreso de la meta (Goal)

			getGoalProgress: async () => {
				const urlGetGoalProgress = `${apiUrl}/api/goal/get-progress`;
				const store = getStore();

				try {
					const response = await fetch(urlGetGoalProgress, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json"
						}
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error al obtener el progreso:", errorData?.msg || response.statusText);
						return false;
					}

					const data = await response.json();
					console.log(data)


					setStore({
						...store,
						goalProgress: [...data]

					});

					return data;

				} catch (error) {
					console.error("Hubo un error al obtener el progreso :", error);
					return false;
				}
			},


			//Captura el rol desencriptando el token
			getUserRoleFromToken: () => {
				const token = localStorage.getItem("token");

				if (!token) return null;

				try {

					const decoded = jwtDecode(token);
					return decoded.role || null;

				} catch (err) {

					console.error("Error al decodificar token:", err);
					return null;
				}
			},

			//PayPal functions
			//Crear order -> ver PayPalBtn.jsx
			createOrderPayPal: async (amount) => {
				try {
					const response = await fetch(`${apiUrl}/api/paypal/create-order`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ amount: amount }),
					});

					const data = await response.json();
					const approvalUrl = data.links.find((link) => link.rel === "approve")?.href;

					if (approvalUrl) {
						return approvalUrl
					} else {
						console.error("No hay approvalLink:", data);
						return false;
					}
				} catch (error) {
					console.error("Error en la solicitud PayPal:", error);
					alert("Hubo un problema al iniciar el pago.");
				}
			},

			//Capturar orden -> ver useEffect en PayPalSuccess.jsx
			captureOrderPayPal: async (token) => {

				const response = await fetch(`${apiUrl}/api/paypal/capture-order`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`
					},
					body: JSON.stringify({ order_id: token }),

				});

				const data = await response.json();

				if (data.status === "COMPLETED") {
					return data;

				} else {
					alert("El pago no se completó.");
				}
			},

			// action para añadir una nueva wallet
			addUserWallet: async (name_wallet, initial_value, currency_id) => {

				try {
					const result = await fetch(`${apiUrl}/api/wallet/add`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							name: name_wallet,
							total_value: initial_value,
							currency_id: currency_id
						})
					});

					if (result.status == "403") {
						return "403";

					}
					if (!result.ok) {
						throw new Error("Ha ocurrido el siguiente error: ", result.status)
					}

					const data = await result.json();

					setStore({ ...getStore(), wallets_from_user: [...getStore().wallets_from_user, data] })
					return true

				} catch (error) {
					console.error("Se presento el siguiente error: ", error)
					return false
				}
			},

			/// Action para obtener todos los wallets de un usuario
			getAllUserWallets: async () => {
				try {

					const result = await fetch(`${apiUrl}/api/wallet/get`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						}
					})

					if (!result.ok) {
						throw new Error("Ha ocurrido el siguiente error: ", result.statusText)
					}

					const data = await result.json()
					setStore({ ...getStore(), wallets_from_user: data });

					return true;

				} catch (error) {
					console.error("Se presento el siguiente error: ", error)
					return false
				}
			},

			// action para actualizar la info de un wallet
			editUserWallet: async (name_wallet, initial_value, currency_id, wallet_id) => {

				try {

					const result = await fetch(`${apiUrl}/api/wallet/edit/${wallet_id}`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							name: name_wallet,
							total_value: initial_value,
							currency_id: currency_id
						})
					});

					if (!result.ok) {
						throw new Error("Se presento el siguiente error: ", error)
					}
					const data = await result.json();
					listaModificada = getStore().wallets_from_user.map(wallet => {
						return wallet.id === wallet_id ? { ...wallet, ...data } : wallet
					})

					setStore({ ...getStore(), wallets_from_user: listaModificada })


					return true

				}
				catch (error) {
					console.error("Se presento el siguiente error: ", error)
					return false
				}
			},

			// action para borrar un wallet
			deleteUserWallet: async (wallet_id) => {

				try {

					const result = await fetch(`${apiUrl}/api/wallet/delete/${wallet_id}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						}
					})

					if (!result.ok) {
						throw new Error("Se presento el siguiente error: ", error)
					}

					setStore({ ...getStore(), wallets_from_user: getStore().wallets_from_user.filter(wallet => wallet.id !== wallet_id) })
					console.log(`El wallet ${wallet_id} fue eliminado con exito`)

					return true

				} catch (error) {
					console.error("Se presento el siguiente error: ", error)
					return false
				}
			},

			// Action para obtener un solo wallet
			getSingleUserWallet: async (wallet_id) => {

				try {
					const result = await fetch(`${apiUrl}/api/wallet/get/${wallet_id}`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						}
					})


					if (!result.ok) {
						throw new Error("Se presento el siguiente error: ", error)
					}

					const data = result.json()

					setStore({ ...getStore(), currentWallet: data })
					return true

				} catch (error) {
					console.error("Se presento el siguiente error: ", error)
					return false
				}

			},
			//Action para obtener todos los usuarios y actualizarlo en el store
			getUsers: async () => {
				try {
					const result = await fetch(`${apiUrl}/api/admin/get-users`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						}
					})

					if (!result.ok) {
						throw new Error("Se presento el siguiente error: ", error)
					}

					const data = await result.json()

					setStore({ ...getStore(), users: data })
					console.log(getStore().users)
					return true


				} catch (error) {
					console.error("Se presento el siguiente error: ", error)
					return false
				}
			},
			// Action para eliminar un usuario y actualizarlo en el store
			deleteUser: async (user_id) => {
				try {

					const result = await fetch(`${apiUrl}/api/admin/user/delete/${user_id}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						}
					})

					if (result.status == "403") {
						return "403"
					}

					if (!result.ok) {
						throw new Error("Se presento el siguiente error: ", error)
					}

					const data = await result.json()
					setStore({ ...getStore(), users: getStore().users.filter(user => user.id !== user_id) })
					return true
				} catch (error) {
					console.error("Se presento el siguiente error: ", error)
					return false
				}
			},
			// Action para añadir categorias al API y guardar en el store
			addCategory: async (name, description) => {
				try {

					const result = await fetch(`${apiUrl}/api/categories/add`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							name: name,
							description: description
						})
					})

					if (!result.ok) {
						throw new Error("Se presento el siguiente error: ", error)
					}

					const data = await result.json()

					setStore({ ...getStore(), categories_db: [...getStore().categories_db, data] })

					return true
				} catch (error) {
					console.error("Se presento el siguiente error: ", error)
					return false
				}
			},
			// Action para obtener todas las categorias y guardarlas en el store
			getCategories: async () => {
				try {

					const result = await fetch(`${apiUrl}/api/categories`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						}
					})

					if (!result.ok) {
						throw new Error("Se presento el siguiente error: ", error)
					}

					const data = await result.json()

					setStore({ ...getStore(), categories_db: data.categories })

					return true
				} catch (error) {
					console.error("Se presento el siguiente error: ", error)
					return false
				}

			},
			// Action para editar la categoria, enviarla al API y actualizar en el store
			editCategory: async (id, name, description) => {

				try {

					const result = await fetch(`${apiUrl}/api/categories/edit/${id}`, {
						method: "PUT",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							name: name,
							description: description
						})
					})

					if (!result.ok) {
						throw new Error("Se presento el siguiente error: ", error)
					}

					const data = await result.json()

					setStore({
						...getStore(),
						categories_db: getStore().categories_db.map(category =>
							category.id === id ? data : category
						)
					});
					return true

				} catch (error) {
					console.error("Se presento el siguiente error: ", error)
					return false

				}

			},
			// Action para eliminar la categoria y actualizarlo en el store
			deleteCategory: async (id) => {
				try {

					const result = await fetch(`${apiUrl}/api/categories/delete/${id}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json",
						}
					})

					if (!result.ok) {
						throw new Error("Se presento el siguiente error: ", error)
					}

					setStore({ ...getStore(), categories_db: getStore().categories_db.filter(category => category.id !== id) })
					return true


				} catch (error) {
					console.error("Se presento el siguiente error: ", error)
					return false

				}
			},

			//Actions Juan

			// Action Calcular Ahorro (Calculadora)

			calcularAhorro: async (datos) => {
    try {
        const response = await fetch(`${apiUrl}/api/calculate-savings`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.message || "Error en el cálculo de ahorro");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error al calcular ahorro:", error);
        throw error;
    }
},


			
  // Action  para obtener solo el conteo de usuarios
    getUsersCount: async () => {
        try {
            const result = await fetch(`${apiUrl}/api/admin/users/count`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            });

            if (!result.ok) {
                const errorData = await result.json();
                throw new Error(`Se presentó el siguiente error al obtener el conteo: ${errorData.msg || result.statusText}`);
            }

            const data = await result.json();

            setStore({
                ...getStore(),
                totalUsersCount: data.total_users_count // Guarda el conteo en la nueva propiedad
            });

            console.log("Conteo total de usuarios obtenido:", getStore().totalUsersCount);
            return true;

        } catch (error) {
            console.error("Se presentó el siguiente error al obtener el conteo de usuarios: ", error);
            setStore({...getStore(), totalUsersCount: null}); // Opcional: Limpiar si hay un error
            return false;
        }
    },


			//Actions Rafa

			//Actions Jose

			//Actions Fede
		}
	};
};

export default getState;
