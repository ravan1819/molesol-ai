from database import engine


try:

    with engine.connect() as connection:

        print("================================")
        print("MySQL connection successful!")
        print("================================")


except Exception as e:

    print("================================")
    print("MySQL connection failed!")
    print("================================")

    print(e)