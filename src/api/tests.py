from dotenv import load_dotenv
import openai
import os

load_dotenv()

# OpenAi

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def categorize_with_ai(description):
    try:
        categorias_validas = [
            "Restaurante", "Supermercado", "Transporte", "Vivienda", "Entretenimiento",
            "Salud", "Educacion", "Compras", "Deporte", "Finanzas", "Mascotas", "Viajes", "Otros"
        ]
        
        categories_str = ", ".join(categorias_validas)

        prompt = (
            f"Por favor, clasifica este gasto en una sola palabra como categoría. "
            f"Posibles categorías son: '{categories_str}'\n\n"
            f"Descripción: '{description}'"
        )

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=5,
            temperature=0.2,
        )

        categoria = response.choices[0].message.content.strip().capitalize()

        if categoria in categorias_validas:
            return categoria
        else:
            return "General"
    except Exception as e:
        print(f"Error al categorizar con IA:\n\n{e}")
        return "General"

descripciones_test = [
    "Consulta con el psicólogo"
    "Pago del alquiler",
    "Cerveza artesanal en bar de Ciudad Vieja",
    "Transferencia al BROU",
    "Multa por mal estacionamiento",
    "Donación a una ONG",
    "compre comida para el perro",
    "Birras con amigos"
]


print("Resultados de categorización con IA:\n")
for descripcion in descripciones_test:
    categoria = categorize_with_ai(descripcion)
    print(f"'{descripcion}' → {categoria}")
