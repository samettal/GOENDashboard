import sqlite3


class DatabaseManager:
    CREATE_TABLE_ENERGY_STATUS = '''CREATE TABLE IF NOT EXISTS EnergyStatus
                            (ID INTEGER PRIMARY KEY AUTOINCREMENT,
                            Date TEXT,
                            Time TEXT,
                            Production INTEGER,
                            Consumption INTEGER,
                            Balance INTEGER)'''

    INSERT_INTO_ENERGY_STATUS = '''INSERT INTO EnergyStatus(Date, Time, Production, Consumption, Balance)
                            VALUES(?, ?, ?, ?, ?)'''

    def __init__(self):
        self.db_path = "EnergyDatabase.db"

        with sqlite3.connect(self.db_path) as con:
            con.execute(self.CREATE_TABLE_ENERGY_STATUS)
            con.commit()

    def insert_energy_values(self, date, time, production_value, consumption_value, balance):
        with sqlite3.connect(self.db_path) as con:
            con.execute(self.INSERT_INTO_ENERGY_STATUS, (date, time, production_value, consumption_value, balance))
            con.commit()

