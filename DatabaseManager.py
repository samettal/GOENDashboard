import sqlite3


class DatabaseManager:
    CREATE_TABLE_ENERGY_STATUS = '''CREATE TABLE IF NOT EXISTS EnergyStatus
                            (ID INTEGER PRIMARY KEY AUTOINCREMENT,
                            Timestamp INTEGER,
                            Production INTEGER,
                            Consumption INTEGER,
                            Balance INTEGER)'''

    INSERT_INTO_ENERGY_STATUS = '''INSERT INTO EnergyStatus(TimeStamp, Production, Consumption, Balance)
                            VALUES(?, ?, ?, ?)'''

    DAILY_BALANCE_VALUE = '''SELECT SUM(Production) - SUM(Consumption) 
                        FROM EnergyStatus 
                        WHERE Timestamp > strftime('%s', 'now', '-1 day');'''

    # This select query selects last 10 values by date and time (select the newest values).
    SELECT_LAST_10_DATA = '''SELECT strftime('%H:%M:%S', Timestamp, 'unixepoch', 'localtime'), Production, Consumption 
                        FROM EnergyStatus 
                        ORDER BY Timestamp DESC 
                        LIMIT 10;'''

    def __init__(self):
        self.db_path = "EnergyDatabase.db"

        with sqlite3.connect(self.db_path) as con:
            con.execute(self.CREATE_TABLE_ENERGY_STATUS)
            con.commit()

    def insert_energy_values(self, timestamp, production_value, consumption_value, balance):
        with sqlite3.connect(self.db_path) as con:
            con.execute(self.INSERT_INTO_ENERGY_STATUS, (timestamp, production_value, consumption_value, balance))
            con.commit()

    def select_last_10_data(self):
        with sqlite3.connect(self.db_path) as con:
            cur = con.cursor()
            cur.execute(self.SELECT_LAST_10_DATA)

            select_results = cur.fetchall()
            select_results.reverse()  # Reverse to get oldest first

            last_10_timestamps = [row[0] for row in select_results]
            last_10_production_values = [row[1] for row in select_results]
            last_10_consumption_values = [row[2] for row in select_results]

        return last_10_timestamps, last_10_production_values, last_10_consumption_values

    def get_daily_balance(self):
        with sqlite3.connect(self.db_path) as con:
            cur = con.cursor()
            cur.execute(self.DAILY_BALANCE_VALUE)

        return cur.fetchall()[0][0]
