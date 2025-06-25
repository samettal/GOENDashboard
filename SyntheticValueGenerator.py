import random
import threading
import datetime


class SyntheticValueGenerator:
    def __init__(self, db_manager):
        self._timer = None
        self.db_manager = db_manager
        # 10 sayısını bir değişkene atayabilirsin
        self.last_10_values_production : list = []
        self.last_10_values_consumption : list = []
        self._run_periodic()


    def _generate_random_value(self):
        return random.randint(0, 2000)

    # TODO: This _run_periodic() method can be divided into target-focused methods.
    def _run_periodic(self):
        current_date_time = datetime.datetime.now()
        date_converted = current_date_time.strftime("%d/%m/%Y")
        time_converted = current_date_time.strftime("%H:%M:%S")
        self.production_value = self._generate_random_value()
        self.consumption_value = self._generate_random_value()
        balance = self.production_value - self.consumption_value
        print(f"Production: {self.production_value}")
        print(f"Consumption: {self.consumption_value}")
        print(f"Balance: {balance}")
        print(f"Date: {date_converted}")
        print(f"Time: {time_converted}\n")

        self.db_manager.insert_energy_values(date_converted, time_converted, self.production_value, self.consumption_value, balance)
        if len(self.last_10_values_production) == 10:
            self.last_10_values_production.pop(0)
        if len(self.last_10_values_consumption) == 10:
            self.last_10_values_consumption.pop(0)

        self.last_10_values_production.append(self.production_value)
        self.last_10_values_consumption.append(self.consumption_value)

        self._timer = threading.Timer(10.0, self._run_periodic)
        self._timer.start()

