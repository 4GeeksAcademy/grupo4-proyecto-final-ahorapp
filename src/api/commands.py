
import click
from api.models import db, User, Category, Record, Wallet, Goal, Currency
import random

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.name = "Name " + str(x)
            user.phone = "+598 111111"
            user.address = f"Address {str(x)}"
            user.role = random.choice(["admin", "user"])
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-categories")
    def insert_test_categries():
        print("Creating test categories")
        categories = [
        "Restaurante",
        "Supermercado",
        "Transporte",
        "Vivienda",
        "Entretenimiento",
        "Salud",
        "Educacion",
        "Compras",
        "Deporte",
        "Finanzas",
        "Mascotas",
        "Viajes",
        "Otros"
        ];
        for x in categories:
            category = Category()
            category.name = x
            category.description = "Description test"
            db.session.add(category)
            db.session.commit()
            print(category.serialize())

        print("All test categories created")

    @app.cli.command("insert-test-currencies")
    def insert_test_currencies():
        print("Creating test currencies")
        for x in range(1, 4):
            currency = Currency()
            currency.name = "test_currency" + str(x)
            currency.symbol = random.choice(["USD", "UYU", "ARS"])
            db.session.add(currency)
            db.session.commit()
            print(currency.serialize())

        print("All test currencies created")


    @app.cli.command("insert-test-wallets")
    @click.argument("count") # argument of out command
    def insert_test_wallets(count):
        print("Creating test wallets")
        for x in range(1, int(count) + 1):
            currency_id = random.choice([c.id for c in Currency.query.all()])
            user_id = random.choice([u.id for u in User.query.all()])

            wallet = Wallet()
            wallet.name = "Random name" + str(x)
            wallet.total_value = x ** 4
            wallet.currency_id = currency_id
            wallet.user_id = user_id
            db.session.add(wallet)
            db.session.commit()
            print(wallet.serialize())

        print("All test wallets created")


    @app.cli.command("insert-test-records")
    @click.argument("count") # argument of out command
    def insert_test_records(count):
        print("Creating test recrds")
        for x in range(1, int(count) + 1):
            category_id = random.choice([c.id for c in Category.query.all()])
            wallet_id = random.choice([w.id for w in Wallet.query.all()])
            user_id = random.choice([u.id for u in User.query.all()])

            record = Record()
            record.description = "Descrption very random" + str(x)
            record.amount = x * 2
            record.type = random.choice(["expense", "addition"])
            record.category_id = category_id
            record.wallet_id = wallet_id
            record.user_id = user_id
            db.session.add(record)
            db.session.commit()
            print(record.serialize())

        print("All test records created")